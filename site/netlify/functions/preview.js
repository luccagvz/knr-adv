const { getAuthedAdmin } = require('./_supabaseAuth');
const { toInsightShape } = require('../../lib/fetchPublishedNews');
const insightDetail = require('../../pages/insightDetail');

// Renderiza uma notícia (rascunho ou publicada) usando o MESMO componente
// insightDetail() da página pública — o preview nunca diverge do estilo real.
// Só admins autenticados conseguem chamar isso (checado via RLS, não aqui).
exports.handler = async (event) => {
  const { id, access_token: accessToken } = event.queryStringParameters || {};
  if (!id) return { statusCode: 400, body: 'Parâmetro "id" ausente.' };

  let admin;
  try {
    admin = await getAuthedAdmin(accessToken);
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
  if (!admin) return { statusCode: 401, body: 'Não autorizado.' };

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/news?select=*&id=eq.${id}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${admin.accessToken}` },
  });
  const rows = await res.json();
  if (!rows.length) return { statusCode: 404, body: 'Notícia não encontrada.' };

  const insight = toInsightShape(rows[0]);
  let html = insightDetail(insight);

  if (rows[0].status !== 'published') {
    const banner = `<div style="position:sticky;top:0;z-index:999;background:#14203a;color:#fff;text-align:center;padding:10px;font:600 13px system-ui, sans-serif;letter-spacing:.03em">PRÉVIA — esta notícia ainda não está publicada (status: ${rows[0].status})</div>`;
    html = html.replace(/<body([^>]*)>/, `<body$1>${banner}`);
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'no-store',
    },
    body: html,
  };
};
