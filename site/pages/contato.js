const layout = require('../components/layout');
const pageIntro = require('../components/pageIntro');
const empresa = require('../content/empresa');
const areas = require('../content/areas');

module.exports = function contato() {
  const enderecoQuery = encodeURIComponent(
    `${empresa.endereco.linha1}, ${empresa.endereco.bairro}, ${empresa.endereco.cidade} - ${empresa.endereco.estado}`
  );
  const areaOptions = areas.map((a) => `<option value="${a.nome}">${a.nome}</option>`).join('\n');

  const content = `
  ${pageIntro({
    trail: [{ label: 'Home', href: '/' }, { label: 'Contato' }],
    eyebrow: 'Contato',
    title: 'Vamos conversar?',
    lede: 'Preencha os campos abaixo e nossa equipe entra em contato.',
  })}

  <section class="section">
    <div class="container">
      <div class="grid grid--2" style="align-items:start">
        <form class="contact-form" id="contact-form" data-mailto="${empresa.email}">
          <div class="field-row">
            <div>
              <label for="nome">Nome</label>
              <input type="text" id="nome" name="nome" required>
            </div>
            <div>
              <label for="email">E-mail</label>
              <input type="email" id="email" name="email" required>
            </div>
          </div>
          <div class="field-row">
            <div>
              <label for="telefone">Telefone</label>
              <input type="tel" id="telefone" name="telefone">
            </div>
            <div>
              <label for="empresa">Empresa</label>
              <input type="text" id="empresa" name="empresa">
            </div>
          </div>
          <div>
            <label for="area">Área de interesse</label>
            <select id="area" name="area">
              <option value="">Selecione (opcional)</option>
              ${areaOptions}
            </select>
          </div>
          <div>
            <label for="mensagem">Mensagem</label>
            <textarea id="mensagem" name="mensagem" rows="5" required></textarea>
          </div>
          <button class="btn btn--primary" type="submit">Enviar mensagem</button>
        </form>

        <div>
          <ul class="contact-info">
            <li>
              <div class="contact-info__label">Telefone</div>
              <div><a href="tel:${empresa.telefoneHref}">${empresa.telefone}</a></div>
            </li>
            <li>
              <div class="contact-info__label">Endereço</div>
              <div>
                ${empresa.endereco.linha1}<br>
                ${empresa.endereco.linha2}<br>
                ${empresa.endereco.bairro} — ${empresa.endereco.cidade}, ${empresa.endereco.estado}<br>
                CEP ${empresa.endereco.cep}
              </div>
            </li>
          </ul>
          <div class="map-frame">
            <iframe
              title="Mapa — ${empresa.endereco.linha1}"
              src="https://www.google.com/maps?q=${enderecoQuery}&output=embed"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;

  return layout({
    title: 'Contato',
    description: `Fale com a KNR Advogados. ${empresa.endereco.linha1}, ${empresa.endereco.cidade}-${empresa.endereco.estado}. ${empresa.telefone}.`,
    path: '/contato/',
    content,
  });
};
