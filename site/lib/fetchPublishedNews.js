const { sanitizeNewsContent } = require('./sanitizeNews');

function toDateOnly(isoTimestamp) {
  if (!isoTimestamp) return null;
  return isoTimestamp.slice(0, 10);
}

// Converte uma linha da tabela `news` (Supabase) pro formato que
// insightsIndex()/insightDetail()/articleCard() já sabem renderizar.
function toInsightShape(row) {
  return {
    slug: row.slug,
    imagem: row.cover_image || '',
    titulo: row.title,
    data: toDateOnly(row.published_at) || toDateOnly(row.created_at),
    categoria: row.category || 'Institucional',
    resumo: row.excerpt || '',
    conteudo: sanitizeNewsContent(row.content),
    seoTitle: row.seo_title || row.title,
    seoDescription: row.seo_description || row.excerpt || '',
  };
}

// Busca só notícias publicadas, com a anon key (RLS garante que não vem rascunho).
// Nunca lança — se o Supabase estiver fora do ar ou não configurado, o build
// segue em frente só com o arquivo histórico (content/insights.js).
async function fetchPublishedNews() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn('[fetchPublishedNews] SUPABASE_URL/SUPABASE_ANON_KEY não configuradas — build seguirá só com o histórico institucional.');
    return [];
  }

  const endpoint = `${url}/rest/v1/news?select=*&status=eq.published&order=published_at.desc.nullslast`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn(`[fetchPublishedNews] Supabase respondeu ${res.status}: ${body}`);
      return [];
    }

    const rows = await res.json();
    return rows.map(toInsightShape);
  } catch (err) {
    console.warn(`[fetchPublishedNews] Falha ao buscar notícias do Supabase: ${err.message}`);
    return [];
  }
}

module.exports = { fetchPublishedNews, toInsightShape };
