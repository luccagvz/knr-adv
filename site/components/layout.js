const seoHead = require('./seoHead');
const header = require('./header');
const footer = require('./footer');

module.exports = function layout({ title, description, path, bodyClass = '', transparentHeader = false, content }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
${seoHead({ title, description, path })}
</head>
<body class="${bodyClass}">
${header({ transparent: transparentHeader })}
<main>
${content}
</main>
${footer()}
<script src="/js/main.js" defer></script>
</body>
</html>`;
};
