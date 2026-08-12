// Helpers de saída segura pra campos de texto livre vindos do Supabase
// (title, excerpt, category, seo_title, seo_description, slug, cover_image).
// Diferente de sanitizeNews.js (que sanitiza HTML rico permitindo tags), estes
// campos são texto puro e vão direto pra atributos/HTML — precisam ser
// escapados, não sanitizados como HTML.

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Slugs só devem conter minúsculas, números e hífen (é o que o admin já gera
// via slugify()). Qualquer coisa fora disso é tratada como inválida — RLS
// controla QUEM escreve na tabela, não O FORMATO do que é escrito, então essa
// validação evita que um valor fora do padrão vire uma rota inesperada.
function safeSlug(value) {
  const slug = String(value || '').trim().toLowerCase();
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ? slug : '';
}

// Só aceita URLs http(s) reais — bloqueia javascript:, data:, e qualquer
// string que não seja uma URL válida (proteção de atributo src/href).
function safeUrl(value) {
  if (!value) return '';
  try {
    const parsed = new URL(String(value));
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : '';
  } catch {
    return '';
  }
}

module.exports = { escapeHtml, safeSlug, safeUrl };
