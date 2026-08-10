const layout = require('../components/layout');
const pageIntro = require('../components/pageIntro');
const caseBlock = require('../components/caseBlock');
const ctaBand = require('../components/ctaBand');
const casos = require('../content/experiencia');

module.exports = function experiencia() {
  const firstHalf = casos.slice(0, 6);
  const secondHalf = casos.slice(6);

  const content = `
  ${pageIntro({
    trail: [{ label: 'Home', href: '/' }, { label: 'Experiência' }],
    eyebrow: 'Experiência',
    title: 'Experiência que atravessa setores.',
    lede: 'A experiência e a capacitação da equipe técnica da KNR são demonstradas por alguns dos projetos abaixo, que contaram com a participação de profissionais do escritório.',
  })}

  <section class="section--tight">
    <div class="container">
      ${firstHalf.map((c, i) => caseBlock(c, i)).join('\n')}
    </div>
  </section>

  <div class="image-breaker" style="background-image:url('/img/office/sala-reuniao-vidro.webp')"></div>

  <section class="section--tight">
    <div class="container">
      ${secondHalf.map((c, i) => caseBlock(c, i)).join('\n')}
    </div>
  </section>

  ${ctaBand({ titulo: 'Sua operação também exige experiência multidisciplinar? Fale com a nossa equipe.' })}
  `;

  return layout({
    title: 'Experiência',
    description: 'Setores e operações em que a KNR Advogados já atuou: energia, indústria, turismo, hotelaria, imobiliário e investimentos estrangeiros.',
    path: '/experiencia/',
    content,
  });
};
