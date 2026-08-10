(function () {
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 40) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScroll();
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal-ready');
    var revealEls = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var to = form.getAttribute('data-mailto');
      var data = new FormData(form);
      var nome = data.get('nome') || '';
      var email = data.get('email') || '';
      var telefone = data.get('telefone') || '';
      var empresaNome = data.get('empresa') || '';
      var area = data.get('area') || '';
      var mensagem = data.get('mensagem') || '';

      var subject = 'Contato pelo site — ' + nome;
      var body =
        'Nome: ' + nome + '\n' +
        'E-mail: ' + email + '\n' +
        'Telefone: ' + telefone + '\n' +
        'Empresa: ' + empresaNome + '\n' +
        'Área de interesse: ' + area + '\n\n' +
        'Mensagem:\n' + mensagem;

      var mailto =
        'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }
})();
