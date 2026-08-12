// Helpers compartilhados por todas as Netlify Functions do admin.

// process.env.URL é preenchido automaticamente pela Netlify em runtime com a
// URL principal do site — não precisa configurar nada manualmente. Restringe
// CORS à própria origem do site em vez de aceitar qualquer origem (*).
function corsHeaders() {
  const origin = process.env.URL || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    Vary: 'Origin',
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(value) {
  return typeof value === 'string' && UUID_RE.test(value);
}

module.exports = { corsHeaders, isValidUuid };
