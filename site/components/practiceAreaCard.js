module.exports = function practiceAreaCard(area, index) {
  const num = String(index + 1).padStart(2, '0');
  return `
  <article class="card area-card">
    <div class="area-card__index">${num}</div>
    <h3>${area.nome}</h3>
    <p>${area.resumo}</p>
    <a class="area-card__link" href="/areas-de-atuacao/${area.slug}/">Ler mais →</a>
  </article>`;
};
