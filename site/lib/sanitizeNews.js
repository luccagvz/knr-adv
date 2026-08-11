const sanitizeHtml = require('sanitize-html');

// Allowlist alinhada com o que o editor rich text (Quill) do /admin produz.
// Roda em build time (Node) — nunca é enviada ao navegador do site público.
const OPTIONS = {
  allowedTags: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
    'h1', 'h2', 'h3',
    'ul', 'ol', 'li',
    'a', 'blockquote', 'img',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
  },
};

function sanitizeNewsContent(html) {
  if (!html) return '';
  return sanitizeHtml(html, OPTIONS);
}

module.exports = { sanitizeNewsContent };
