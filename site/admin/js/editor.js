const params = new URLSearchParams(window.location.search);
const newsId = params.get('id');

const alertBox = document.getElementById('alert-box');
const form = document.getElementById('news-form');
const titleInput = document.getElementById('title');
const slugInput = document.getElementById('slug');
const slugPreview = document.getElementById('slug-preview');
const excerptInput = document.getElementById('excerpt');
const categorySelect = document.getElementById('category');
const categoryNewInput = document.getElementById('category-new');
const publishedAtInput = document.getElementById('published_at');
const statusLabel = document.getElementById('status-label');
const seoTitleInput = document.getElementById('seo_title');
const seoDescriptionInput = document.getElementById('seo_description');
const coverInput = document.getElementById('cover-input');
const coverPreview = document.getElementById('cover-preview');
const coverProgress = document.getElementById('cover-progress');
const deleteBtn = document.getElementById('delete-btn');
const previewBtn = document.getElementById('preview-btn');
const publishBtn = document.getElementById('publish-btn');

let currentStatus = 'draft';
let coverImageUrl = '';
let slugTouchedManually = false;
let quill;

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showAlert(message, type) {
  alertBox.innerHTML = `<div class="form-alert form-alert--${type}">${escapeHtml(message)}</div>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// cover_image vem do banco — em uso normal é sempre uma URL do Storage
// gerada pelo próprio upload, mas RLS só controla QUEM escreve, não O QUE é
// escrito, então uma conta admin comprometida poderia gravar um valor
// arbitrário ali. Construir via DOM (em vez de template string + innerHTML)
// evita qualquer risco de quebra de atributo.
function renderCoverPreview(url) {
  coverPreview.innerHTML = '';
  if (!url) {
    coverPreview.textContent = 'Nenhuma imagem';
    return;
  }
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Capa';
  coverPreview.appendChild(img);
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function initQuill() {
  quill = new Quill('#quill-editor', {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic'],
          ['blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: { image: handleContentImage },
      },
    },
  });
}

async function handleContentImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg,image/png,image/webp';
  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;
    const range = quill.getSelection(true);
    quill.insertText(range.index, 'Enviando imagem…', { italic: true });
    try {
      const url = await uploadNewsImage(file, { folder: 'content', maxWidth: 1000 });
      quill.deleteText(range.index, 'Enviando imagem…'.length);
      quill.insertEmbed(range.index, 'image', url);
      quill.setSelection(range.index + 1);
    } catch (err) {
      quill.deleteText(range.index, 'Enviando imagem…'.length);
      showAlert(err.message, 'error');
    }
  };
  input.click();
}

titleInput.addEventListener('input', () => {
  if (!slugTouchedManually) {
    slugInput.value = slugify(titleInput.value);
    slugPreview.textContent = slugInput.value;
  }
});
slugInput.addEventListener('input', () => {
  slugTouchedManually = true;
  slugInput.value = slugify(slugInput.value);
  slugPreview.textContent = slugInput.value;
});

categorySelect.addEventListener('change', () => {
  categoryNewInput.style.display = categorySelect.value === '__nova__' ? 'block' : 'none';
});

function getCategoryValue() {
  return categorySelect.value === '__nova__' ? categoryNewInput.value.trim() : categorySelect.value;
}

function setCategoryValue(value) {
  const options = Array.from(categorySelect.options).map((o) => o.value);
  if (options.includes(value)) {
    categorySelect.value = value;
  } else if (value) {
    categorySelect.value = '__nova__';
    categoryNewInput.value = value;
    categoryNewInput.style.display = 'block';
  }
}

coverInput.addEventListener('change', async () => {
  const file = coverInput.files[0];
  if (!file) return;
  coverProgress.textContent = 'Otimizando e enviando…';
  try {
    coverImageUrl = await uploadNewsImage(file, { folder: 'covers', maxWidth: 1600 });
    renderCoverPreview(coverImageUrl);
    coverProgress.textContent = 'Imagem enviada.';
  } catch (err) {
    coverProgress.textContent = '';
    showAlert(err.message, 'error');
  }
});

function collectPayload() {
  const title = titleInput.value.trim();
  const slug = slugInput.value.trim();
  const excerpt = excerptInput.value.trim();
  const category = getCategoryValue();

  if (!title) throw new Error('Preencha o título.');
  if (!slug) throw new Error('Preencha o slug.');
  if (!excerpt) throw new Error('Preencha o resumo.');

  return {
    title,
    slug,
    excerpt,
    category: category || null,
    cover_image: coverImageUrl || null,
    content: quill.root.innerHTML,
    seo_title: seoTitleInput.value.trim() || null,
    seo_description: seoDescriptionInput.value.trim() || null,
  };
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
    console.warn('Rebuild não disparado:', err.message);
  }
}

async function save(targetStatus, { redirect = true } = {}) {
  const sb = getSupabase();
  let payload;
  try {
    payload = collectPayload();
  } catch (err) {
    showAlert(err.message, 'error');
    return null;
  }

  payload.status = targetStatus;
  if (targetStatus === 'published') {
    payload.published_at = publishedAtInput.value
      ? new Date(publishedAtInput.value + 'T12:00:00').toISOString()
      : new Date().toISOString();
  } else if (publishedAtInput.value) {
    payload.published_at = new Date(publishedAtInput.value + 'T12:00:00').toISOString();
  }

  let result;
  if (newsId) {
    result = await sb.from('news').update(payload).eq('id', newsId).select().single();
  } else {
    result = await sb.from('news').insert(payload).select().single();
  }

  if (result.error) {
    showAlert(`Erro ao salvar: ${result.error.message}`, 'error');
    return null;
  }

  const wasPublished = currentStatus === 'published';
  currentStatus = result.data.status;
  statusLabel.textContent = currentStatus === 'published' ? 'publicado' : 'rascunho';

  if (currentStatus === 'published' || wasPublished) {
    triggerRebuild();
  }

  if (redirect) {
    window.location.href = '/admin/';
  } else {
    showAlert('Rascunho salvo.', 'success');
  }
  return result.data;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const action = e.submitter?.dataset.action || 'save-draft';
  const submitters = form.querySelectorAll('button');
  submitters.forEach((b) => (b.disabled = true));
  try {
    if (action === 'publish') {
      await save('published');
    } else {
      await save('draft');
    }
  } finally {
    submitters.forEach((b) => (b.disabled = false));
  }
});

previewBtn.addEventListener('click', async () => {
  previewBtn.disabled = true;
  previewBtn.innerHTML = '<span class="spinner"></span> Salvando rascunho…';
  try {
    const saved = await save(currentStatus === 'published' ? 'published' : 'draft', { redirect: false });
    if (!saved) return;
    // Token vai no header Authorization, não na URL — busca o HTML via fetch
    // e abre como blob: em vez de navegar direto pra uma URL com o token.
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    const res = await fetch(`/.netlify/functions/preview?id=${encodeURIComponent(saved.id)}`, {
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
  } finally {
    previewBtn.disabled = false;
    previewBtn.textContent = 'Visualizar';
  }
});

deleteBtn.addEventListener('click', async () => {
  if (!confirm('Excluir definitivamente essa notícia? Essa ação não pode ser desfeita.')) return;
  const sb = getSupabase();
  const wasPublished = currentStatus === 'published';
  const { error } = await sb.from('news').delete().eq('id', newsId);
  if (error) return showAlert(`Erro ao excluir: ${error.message}`, 'error');
  if (wasPublished) await triggerRebuild();
  window.location.href = '/admin/';
});

async function loadExisting() {
  const sb = getSupabase();
  const { data, error } = await sb.from('news').select('*').eq('id', newsId).single();
  if (error) {
    showAlert(`Não foi possível carregar essa notícia: ${error.message}`, 'error');
    return;
  }
  if (!window.DOMPurify) {
    // Sem o sanitizador não dá pra carregar o conteúdo com segurança — melhor
    // travar a edição do que arriscar sobrescrever a notícia com o campo vazio.
    showAlert('Não foi possível carregar o editor de texto com segurança (DOMPurify não carregou — verifique sua conexão e recarregue a página). Edição bloqueada por segurança.', 'error');
    form.querySelectorAll('input, textarea, select, button').forEach((el) => (el.disabled = true));
    return;
  }
  titleInput.value = data.title;
  slugInput.value = data.slug;
  slugPreview.textContent = data.slug;
  slugTouchedManually = true;
  excerptInput.value = data.excerpt || '';
  setCategoryValue(data.category || '');
  if (data.published_at) publishedAtInput.value = data.published_at.slice(0, 10);
  seoTitleInput.value = data.seo_title || '';
  seoDescriptionInput.value = data.seo_description || '';
  coverImageUrl = data.cover_image || '';
  renderCoverPreview(coverImageUrl);
  quill.root.innerHTML = DOMPurify.sanitize(data.content || '');
  currentStatus = data.status;
  statusLabel.textContent = currentStatus === 'published' ? 'publicado' : 'rascunho';
  deleteBtn.style.display = 'inline-flex';
  publishBtn.textContent = currentStatus === 'published' ? 'Salvar alterações' : 'Publicar';

  document.getElementById('page-title').textContent = `Editar — ${data.title} — KNR Admin`;
  document.getElementById('form-title').textContent = 'Editar notícia';
}

(async () => {
  const result = await KNRAuth.requireAdminSession();
  if (!result) return;
  KNRAuth.showUserEmail(document.getElementById('user-email'), result.user.email);
  KNRAuth.wireLogout(document.getElementById('logout-btn'));

  initQuill();

  if (newsId) {
    await loadExisting();
  } else {
    slugPreview.textContent = '';
  }
})();
