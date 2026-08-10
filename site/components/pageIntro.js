const breadcrumb = require('./breadcrumb');

module.exports = function pageIntro({ trail, eyebrow, title, lede }) {
  return `
  <section class="page-intro">
    <div class="container">
      ${breadcrumb(trail)}
      <span class="eyebrow">${eyebrow}</span>
      <h1>${title}</h1>
      ${lede ? `<p style="max-width:640px;font-size:1.05rem">${lede}</p>` : ''}
    </div>
  </section>`;
};
