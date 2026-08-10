module.exports = function ctaBand({ titulo = 'Decisões complexas exigem uma visão jurídica à altura.', ctaLabel = 'Fale com a KNR', ctaHref = '/contato/' } = {}) {
  return `
  <section class="cta-cinematic">
    <div class="container">
      <h2 class="reveal">${titulo}</h2>
      <div class="cta-cinematic__actions">
        <a class="btn btn--outline-light" href="${ctaHref}">${ctaLabel} <span class="btn__arrow">→</span></a>
      </div>
    </div>
  </section>`;
};
