module.exports = function seoHead({ title, description, path, ogTitle, ogDescription, ogImage, ogType = 'website' }) {
  const fullTitle = title
    ? `${title} | KNR Advogados`
    : 'KNR Advogados — Kruschewsky e Nunes Ribeiro Advogados Associados';
  const canonical = `https://www.knr.adv.br${path}`;
  const resolvedOgTitle = ogTitle || fullTitle;
  const resolvedOgDescription = ogDescription || description || '';
  const resolvedOgImage = ogImage
    ? (ogImage.startsWith('http') ? ogImage : `https://www.knr.adv.br${ogImage}`)
    : 'https://www.knr.adv.br/img/logo-knr.png';
  return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${fullTitle}</title>
    <meta name="description" content="${description || ''}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:title" content="${resolvedOgTitle}">
    <meta property="og:description" content="${resolvedOgDescription}">
    <meta property="og:image" content="${resolvedOgImage}">
    <meta property="og:url" content="${canonical}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="preload" href="/fonts/playfair-display-600.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/css/fonts.css">
    <link rel="stylesheet" href="/css/tokens.css">
    <link rel="stylesheet" href="/css/base.css">
    <link rel="stylesheet" href="/css/layout.css">
    <link rel="stylesheet" href="/css/components.css">
  `;
};
