const { getAuthedAdmin } = require('./_supabaseAuth');
const { corsHeaders } = require('./_http');

// Dispara o Deploy Hook do Netlify depois de publicar/despublicar/excluir uma
// notícia. NETLIFY_BUILD_HOOK_URL é um segredo de servidor (env var da função,
// nunca do frontend) — configurado em Site settings → Build & deploy → Build hooks.
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders(), body: 'Method not allowed' };

  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const accessToken = authHeader.replace(/^Bearer\s+/i, '');

  let admin;
  try {
    admin = await getAuthedAdmin(accessToken);
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders(), body: err.message };
  }
  if (!admin) return { statusCode: 401, headers: corsHeaders(), body: 'Não autorizado.' };

  const hookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
  if (!hookUrl) {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: 'NETLIFY_BUILD_HOOK_URL não configurada — configure um Build Hook no Netlify e adicione essa env var à função pra habilitar o rebuild automático.',
    };
  }

  const res = await fetch(hookUrl, { method: 'POST' });
  if (!res.ok) return { statusCode: 502, headers: corsHeaders(), body: `Build hook respondeu ${res.status}` };

  return { statusCode: 202, headers: corsHeaders(), body: 'Rebuild disparado.' };
};
