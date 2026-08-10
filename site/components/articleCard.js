function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${parseInt(d, 10)} ${meses[parseInt(m, 10) - 1]} ${y}`;
}

module.exports = function articleCard(insight) {
  const thumb = insight.imagem
    ? `<a href="/insights/${insight.slug}/" class="article-card__thumb" style="background-image:url('${insight.imagem}')" aria-hidden="true"></a>`
    : '';
  return `
  <article class="card article-card">
    ${thumb}
    <span class="article-card__date">${formatDate(insight.data)} · ${insight.categoria}</span>
    <h3><a href="/insights/${insight.slug}/">${insight.titulo}</a></h3>
    <p>${insight.resumo}</p>
    <a class="area-card__link" href="/insights/${insight.slug}/">Ler mais →</a>
  </article>`;
};

module.exports.formatDate = formatDate;
