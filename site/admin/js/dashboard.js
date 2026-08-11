let allNews = [];
let currentFilter = 'todos';
let currentUser = null;

const tbody = document.getElementById('news-tbody');
const alertBox = document.getElementById('alert-box');

function showAlert(message, type) {
  alertBox.innerHTML = `<div class="form-alert form-alert--${type}">${message}</div>`;
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

function previewUrl(id) {
  const sb = getSupabase();
  return sb.auth.getSession().then(({ data: { session } }) => {
    return `/.netlify/functions/preview?id=${id}&access_token=${encodeURIComponent(session.access_token)}`;
  });
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
        <td class="admin-table__title">${n.title}</td>
        <td>${n.category || '—'}</td>
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
      const url = await previewUrl(id);
      window.open(url, '_blank');
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
