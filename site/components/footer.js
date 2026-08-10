const empresa = require('../content/empresa');
const areas = require('../content/areas');

module.exports = function footer() {
  const destaqueAreas = areas.filter((a) => a.destaque).slice(0, 5);
  const areaLinks = destaqueAreas
    .map((a) => `<li><a href="/areas-de-atuacao/${a.slug}/">${a.nome}</a></li>`)
    .join('\n');

  return `
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <div class="site-footer__logo">
            <img src="/img/logo-knr.png" alt="KNR Advogados" width="140" height="48">
          </div>
          <p>${empresa.posicionamento}</p>
        </div>
        <div>
          <h4>Áreas de Atuação</h4>
          <ul>
            ${areaLinks}
            <li><a href="/areas-de-atuacao/">Ver todas →</a></li>
          </ul>
        </div>
        <div>
          <h4>Escritório</h4>
          <ul>
            <li><a href="/quem-somos/">Quem somos</a></li>
            <li><a href="/experiencia/">Experiência</a></li>
            <li><a href="/socios/">Sócios</a></li>
            <li><a href="/clientes/">Clientes</a></li>
            <li><a href="/insights/">Insights</a></li>
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <ul>
            <li>${empresa.telefone}</li>
            <li>${empresa.endereco.linha1}<br>${empresa.endereco.bairro}, ${empresa.endereco.cidade}-${empresa.endereco.estado.slice(0,2).toUpperCase()}</li>
            <li><a href="${empresa.redesSociais.facebook}" target="_blank" rel="noopener">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div class="site-footer__bottom">
        <span>© ${new Date().getFullYear()} ${empresa.nomeCompleto}. Todos os direitos reservados.</span>
        <span>Salvador, Bahia</span>
      </div>
      <div class="site-footer__credit">
        Fotografias de Salvador — Caminho das Árvores: Natalia Rodrigues de Araújo e Samory Pereira Santos, via Wikimedia Commons (CC BY-SA 4.0).
      </div>
    </div>
  </footer>`;
};
