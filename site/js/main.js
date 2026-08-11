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

  document.querySelectorAll('[data-carousel]').forEach(function (section) {
    var track = section.querySelector('[data-carousel-track]');
    var prevBtn = section.querySelector('[data-carousel-prev]');
    var nextBtn = section.querySelector('[data-carousel-next]');
    if (!track) return;

    function slideStep() {
      var slide = track.querySelector('.carousel-slide');
      if (!slide) return track.clientWidth;
      var gap = parseFloat(window.getComputedStyle(track).columnGap || '0') || 0;
      return slide.getBoundingClientRect().width + gap;
    }

    function advance(dir) {
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      var atStart = track.scrollLeft <= 4;
      if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
      else if (dir < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      else track.scrollBy({ left: slideStep() * dir, behavior: 'smooth' });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { advance(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { advance(1); });

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timer = null;
    var canScroll = false;

    function play() {
      if (reduceMotion || timer || !canScroll) return;
      timer = window.setInterval(function () { advance(1); }, 5000);
    }
    function pause() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    // Sem overflow (poucos cards / tela larga) não tem o que rolar — some
    // com as setas e desliga o autoplay em vez de deixá-los sem efeito.
    function updateOverflow() {
      canScroll = track.scrollWidth > track.clientWidth + 4;
      var nav = section.querySelector('.news-carousel__nav');
      if (nav) nav.style.display = canScroll ? '' : 'none';
      if (canScroll) play();
      else pause();
    }

    section.addEventListener('mouseenter', pause);
    section.addEventListener('mouseleave', play);
    section.addEventListener('touchstart', pause, { passive: true });
    section.addEventListener('focusin', pause);
    section.addEventListener('focusout', play);

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateOverflow, 200);
    });

    updateOverflow();
  });

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
