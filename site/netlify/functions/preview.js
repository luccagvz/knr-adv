const { getAuthedAdmin } = require('./_supabaseAuth');
const { toInsightShape } = require('../../lib/fetchPublishedNews');
const insightDetail = require('../../pages/insightDetail');
const { corsHeaders, isValidUuid } = require('./_http');

// Renderiza uma notícia (rascunho ou publicada) usando o MESMO componente
// insightDetail() da página pública — o preview nunca diverge do estilo real.
// Só admins autenticados conseguem chamar isso (checado via RLS, não aqui).
// O token vai no header Authorization (não na query string) pra não sobrar
// em logs de acesso, histórico do navegador, etc.
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };

  const id = (event.queryStringParameters || {}).id;
  if (!id || !isValidUuid(id)) return { statusCode: 400, headers: corsHeaders(), body: 'Parâmetro "id" ausente ou inválido.' };

  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const accessToken = authHeader.replace(/^Bearer\s+/i, '');

  let admin;
  try {
    admin = await getAuthedAdmin(accessToken);
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders(), body: err.message };
  }
  if (!admin) return { statusCode: 401, headers: corsHeaders(), body: 'Não autorizado.' };

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/news?select=*&id=eq.${encodeURIComponent(id)}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${admin.accessToken}` },
  });
  const rows = await res.json();
  if (!rows.length) return { statusCode: 404, headers: corsHeaders(), body: 'Notícia não encontrada.' };

  const insight = toInsightShape(rows[0]);
  let html = insightDetail(insight);

  if (rows[0].status !== 'published') {
    const banner = `<div style="position:sticky;top:0;z-index:999;background:#14203a;color:#fff;text-align:center;padding:10px;font:600 13px system-ui, sans-serif;letter-spacing:.03em">PRÉVIA — esta notícia ainda não está publicada (status: ${rows[0].status})</div>`;
    html = html.replace(/<body([^>]*)>/, `<body$1>${banner}`);
  }

  return {
    statusCode: 200,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'no-store',
    },
    body: html,
  };
};
