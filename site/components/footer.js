const empresa = require('../content/empresa');
const areas = require('../content/areas');

const ICON_FACEBOOK = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 1.888-.287 1.379h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>`;

const ICON_INSTAGRAM = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.885 5.885 0 0 0 2.126-1.384c.667-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.888 5.888 0 0 0-1.384-2.126A5.868 5.868 0 0 0 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 0 1-.9 1.382 3.744 3.744 0 0 1-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 0 1-1.379-.9 3.644 3.644 0 0 1-.9-1.38c-.165-.42-.36-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.86.06-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>`;

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
            <li><a href="mailto:${empresa.email}">${empresa.email}</a></li>
            <li class="site-footer__social">
              <a href="${empresa.redesSociais.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-icon">${ICON_FACEBOOK}</a>
              <a href="${empresa.redesSociais.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon">${ICON_INSTAGRAM}</a>
            </li>
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
