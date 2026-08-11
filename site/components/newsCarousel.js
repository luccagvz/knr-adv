const articleCard = require('./articleCard');

// Carrossel de notícias recentes (CMS) na home. Só renderiza se houver pelo
// menos 1 notícia; recebe no máximo as 5 mais recentes (fila FIFO — a 6ª
// publicada empurra a mais antiga pra fora do carrossel, mas ela continua
// listada normalmente em /insights/).
module.exports = function newsCarousel(items) {
  if (!items || !items.length) return '';

  const slides = items.map((i) => `<div class="carousel-slide">${articleCard(i)}</div>`).join('\n');

  return `
  <section class="section news-carousel-section" data-carousel>
    <div class="container">
      <div class="news-carousel__head">
        <div class="section-header reveal" style="margin-bottom:0">
          <span class="eyebrow">Novidades</span>
          <h2>O que está acontecendo na KNR</h2>
        </div>
        <div class="news-carousel__nav">
          <button type="button" class="carousel-btn" data-carousel-prev aria-label="Notícia anterior">←</button>
          <button type="button" class="carousel-btn" data-carousel-next aria-label="Próxima notícia">→</button>
        </div>
      </div>
      <div class="news-carousel__viewport" data-carousel-track>
        <div class="news-carousel__track">
          ${slides}
        </div>
      </div>
    </div>
  </section>`;
};
