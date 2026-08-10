function initials(nome) {
  return nome
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

module.exports = function partnerCard(socio) {
  return `
  <article class="card partner-card">
    <div class="partner-avatar" aria-hidden="true">${initials(socio.nome)}</div>
    <h3><a href="/socios/${socio.slug}/">${socio.nome}</a></h3>
    <div class="partner-card__cargo">${socio.cargo}</div>
    <div class="partner-card__areas">${socio.areas.join(' · ')}</div>
    <a class="area-card__link" href="/socios/${socio.slug}/">Ver perfil →</a>
  </article>`;
};
