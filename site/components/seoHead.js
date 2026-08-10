module.exports = function seoHead({ title, description, path }) {
  const fullTitle = title
    ? `${title} | KNR Advogados`
    : 'KNR Advogados — Kruschewsky e Nunes Ribeiro Advogados Associados';
  return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${fullTitle}</title>
    <meta name="description" content="${description || ''}">
    <link rel="canonical" href="https://www.knr.adv.br${path}">
    <link rel="preload" href="/fonts/playfair-display-600.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/css/fonts.css">
    <link rel="stylesheet" href="/css/tokens.css">
    <link rel="stylesheet" href="/css/base.css">
    <link rel="stylesheet" href="/css/layout.css">
    <link rel="stylesheet" href="/css/components.css">
  `;
};
