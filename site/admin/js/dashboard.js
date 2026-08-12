let allNews = [];
let currentFilter = 'todos';
let currentUser = null;

const tbody = document.getElementById('news-tbody');
const alertBox = document.getElementById('alert-box');

function showAlert(message, type) {
  alertBox.innerHTML = `<div class="form-alert form-alert--${type}">${escapeHtml(message)}</div>`;
  setTimeout(() => (alertBox.innerHTML = ''), 5000);
}

function formatDateBR(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function statusLabel(status) {
  return { draft: 'Rascunho', published: 'Publicado', scheduled: 'Agendado', archived: 'Arquivado' }[status] || status;
}

// title/category vêm do banco (texto livre escrito por qualquer conta admin)
// e são inseridos via innerHTML abaixo — precisam ser escapados aqui, senão
// uma notícia com um título malicioso executaria JS na sessão de quem
// estiver olhando o dashboard.
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// O token vai no header Authorization (não numa query string) pra não parar
// em logs de acesso — por isso busca o HTML via fetch e abre como blob:,
// em vez de simplesmente navegar pra uma URL com o token embutido.
async function openPreview(id) {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  const res = await fetch(`/.netlify/functions/preview?id=${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) {
    showAlert(`Não foi possível abrir o preview: ${await res.text()}`, 'error');
    return;
  }
  const html = await res.text();
  const blobUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  window.open(blobUrl, '_blank');
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
}

function render() {
  const rows = allNews.filter((n) => currentFilter === 'todos' || n.status === currentFilter);

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="admin-empty">Nenhuma notícia encontrada.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows
    .map((n) => `
      <tr data-id="${n.id}">
        <td class="admin-table__title">${escapeHtml(n.title)}</td>
        <td>${escapeHtml(n.category) || '—'}</td>
        <td>${formatDateBR(n.published_at || n.created_at)}</td>
        <td>${formatDateBR(n.updated_at)}</td>
        <td><span class="status-badge status-badge--${n.status}">${statusLabel(n.status)}</span></td>
        <td>
          <div class="admin-table__actions">
            <a class="btn-admin btn-admin--sm" href="/admin/editor.html?id=${n.id}">Editar</a>
            <button class="btn-admin btn-admin--sm" data-action="preview" data-id="${n.id}">Visualizar</button>
            ${n.status === 'published'
              ? `<button class="btn-admin btn-admin--sm" data-action="unpublish" data-id="${n.id}">Despublicar</button>`
              : `<button class="btn-admin btn-admin--sm" data-action="publish" data-id="${n.id}">Publicar</button>`}
            <button class="btn-admin btn-admin--sm btn-admin--danger" data-action="delete" data-id="${n.id}">Excluir</button>
          </div>
        </td>
      </tr>
    `)
    .join('');
}

async function loadNews() {
  const sb = getSupabase();
  const { data, error } = await sb.from('news').select('*').order('updated_at', { ascending: false });
  if (error) {
    tbody.innerHTML = `<tr><td colspan="6" class="admin-empty">Erro ao carregar: ${error.message}</td></tr>`;
    return;
  }
  allNews = data;
  render();
}

async function triggerRebuild() {
  try {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    await fetch('/.netlify/functions/rebuild', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
  } catch (err) {
    // Não bloqueia a UX do admin — só o rebuild automático não disparou.
    console.warn('Rebuild não disparado:', err.message);
  }
}

async function handlePublish(id) {
  const sb = getSupabase();
  const { error } = await sb.from('news').update({ status: 'published', published_at: new Date().toISOString() }).eq('id', id);
  if (error) return showAlert(`Erro ao publicar: ${error.message}`, 'error');
  showAlert('Notícia publicada. Disparando atualização do site…', 'success');
  await loadNews();
  triggerRebuild();
}

async function handleUnpublish(id) {
  const sb = getSupabase();
  const { error } = await sb.from('news').update({ status: 'draft' }).eq('id', id);
  if (error) return showAlert(`Erro ao despublicar: ${error.message}`, 'error');
  showAlert('Notícia despublicada. Disparando atualização do site…', 'success');
  await loadNews();
  triggerRebuild();
}

async function handleDelete(id) {
  const item = allNews.find((n) => n.id === id);
  if (!confirm(`Excluir definitivamente "${item?.title}"? Essa ação não pode ser desfeita.`)) return;
  const wasPublished = item?.status === 'published';
  const sb = getSupabase();
  const { error } = await sb.from('news').delete().eq('id', id);
  if (error) return showAlert(`Erro ao excluir: ${error.message}`, 'error');
  showAlert('Notícia excluída.', 'success');
  await loadNews();
  if (wasPublished) triggerRebuild();
}

tbody.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  btn.disabled = true;
  try {
    if (action === 'preview') {
      await openPreview(id);
    } else if (action === 'publish') {
      await handlePublish(id);
    } else if (action === 'unpublish') {
      await handleUnpublish(id);
    } else if (action === 'delete') {
      await handleDelete(id);
    }
  } finally {
    btn.disabled = false;
  }
});

document.getElementById('filters').addEventListener('click', (e) => {
  const btn = e.target.closest('.admin-filter');
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  document.querySelectorAll('.admin-filter').forEach((b) => b.classList.toggle('is-active', b === btn));
  render();
});

(async () => {
  const result = await KNRAuth.requireAdminSession();
  if (!result) return;
  currentUser = result.user;
  KNRAuth.showUserEmail(document.getElementById('user-email'), currentUser.email);
  KNRAuth.wireLogout(document.getElementById('logout-btn'));
  await loadNews();
})();
