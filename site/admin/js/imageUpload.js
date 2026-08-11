// Upload de imagens pro Supabase Storage — sempre passando por um redimensionamento
// e recompressão em WebP no navegador antes de subir, pra nunca jogar um arquivo
// de vários MB pro bucket (e, por tabela, pro site público).

const IMAGE_ACCEPT = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB — validado de novo no bucket (RLS/config)

function validateImageFile(file) {
  if (!IMAGE_ACCEPT.includes(file.type)) {
    throw new Error('Formato não suportado. Envie JPG, PNG ou WebP.');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Imagem maior que 10MB. Escolha um arquivo menor.');
  }
}

function loadImageBitmap(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Não foi possível ler essa imagem.'));
    img.src = URL.createObjectURL(file);
  });
}

// Redimensiona (mantendo proporção) e recomprime como WebP.
async function resizeAndCompress(file, { maxWidth = 1600, quality = 0.82 } = {}) {
  const img = await loadImageBitmap(file);
  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(img.src);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  if (!blob) throw new Error('Falha ao processar a imagem no navegador.');
  return { blob, width, height };
}

function slugifyFilename(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40);
}

// maxWidth: 1600 pra capa, 1000 pra imagens dentro do conteúdo.
async function uploadNewsImage(file, { folder = 'content', maxWidth = 1000 } = {}) {
  validateImageFile(file);
  const { blob } = await resizeAndCompress(file, { maxWidth });

  const sb = getSupabase();
  const base = slugifyFilename(file.name.replace(/\.[^.]+$/, '')) || 'imagem';
  const path = `${folder}/${Date.now()}-${base}.webp`;

  const { error } = await sb.storage.from('news-images').upload(path, blob, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw new Error(`Falha no upload: ${error.message}`);

  const { data } = sb.storage.from('news-images').getPublicUrl(path);
  return data.publicUrl;
}
