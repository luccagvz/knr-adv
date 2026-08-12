const { sanitizeNewsContent } = require('./sanitizeNews');
const { escapeHtml, safeSlug, safeUrl } = require('./safeText');

function toDateOnly(isoTimestamp) {
  if (!isoTimestamp) return null;
  return isoTimestamp.slice(0, 10);
}

// Converte uma linha da tabela `news` (Supabase) pro formato que
// insightsIndex()/insightDetail()/articleCard() já sabem renderizar.
//
// IMPORTANTE: título, resumo, categoria e campos de SEO são texto livre
// escrito por qualquer conta admin (RLS controla QUEM escreve, não O QUE é
// escrito) e vão direto pra templates HTML via interpolação de string — por
// isso são escapados aqui, no único ponto que alimenta tanto o build quanto
// o preview. `conteudo` é diferente: é HTML rico de propósito (rendered do
// Quill) e passa por sanitizeNewsContent (allowlist de tags), não por escape.
function toInsightShape(row) {
  return {
    slug: safeSlug(row.slug),
    imagem: safeUrl(row.cover_image),
    titulo: escapeHtml(row.title),
    data: toDateOnly(row.published_at) || toDateOnly(row.created_at),
    categoria: escapeHtml(row.category || 'Institucional'),
    resumo: escapeHtml(row.excerpt || ''),
    conteudo: sanitizeNewsContent(row.content),
    seoTitle: escapeHtml(row.seo_title || row.title),
    seoDescription: escapeHtml(row.seo_description || row.excerpt || ''),
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
    const insights = rows.map(toInsightShape);

    // slug inválido não pode virar rota — filtra e avisa em vez de gerar
    // uma página em /insights/ (colidindo com o próprio índice).
    const valid = insights.filter((i) => i.slug);
    if (valid.length < insights.length) {
      console.warn(`[fetchPublishedNews] ${insights.length - valid.length} notícia(s) com slug inválido foram ignoradas no build.`);
    }
    return valid;
  } catch (err) {
    console.warn(`[fetchPublishedNews] Falha ao buscar notícias do Supabase: ${err.message}`);
    return [];
  }
}

module.exports = { fetchPublishedNews, toInsightShape };
