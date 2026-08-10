const NAV = [
  { label: 'O Escritório', href: '/quem-somos/' },
  { label: 'Áreas de Atuação', href: '/areas-de-atuacao/' },
  { label: 'Experiência', href: '/experiencia/' },
  { label: 'Sócios', href: '/socios/' },
  { label: 'Clientes', href: '/clientes/' },
  { label: 'Insights', href: '/insights/' },
  { label: 'Contato', href: '/contato/' },
];

module.exports = function header({ transparent = false } = {}) {
  const items = NAV.map(
    (item) => `<li><a href="${item.href}">${item.label}</a></li>`
  ).join('\n');

  return `
  <header class="site-header${transparent ? ' site-header--transparent' : ''}" data-header>
    <div class="site-header__inner">
      <a href="/" class="site-header__logo" aria-label="KNR Advogados — página inicial">
        <img src="/img/logo-knr.png" alt="KNR — Kruschewsky e Nunes Ribeiro Advogados Associados" width="170" height="58">
      </a>
      <button class="nav-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" data-nav-toggle>
        <span></span><span></span><span></span>
      </button>
      <ul class="site-nav" data-nav>
        ${items}
      </ul>
    </div>
  </header>`;
};
