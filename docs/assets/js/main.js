// ===== JB CARGO — interações =====
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Menu mobile ---
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Sombra do cabeçalho ao rolar ---
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- Ano dinâmico no rodapé ---
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  // --- Reveal on scroll ---
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else if (revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
          if (entry.target.hasAttribute('data-count')) animateCount(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // --- Contadores de estatística ---
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target) || reduceMotion) { return; }
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1200, start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  // Se IntersectionObserver não estiver disponível, garante o valor final
  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = prefix + el.getAttribute('data-count') + suffix;
    });
  }

  // --- Spotlight que segue o cursor nos cards de features ---
  if (!reduceMotion) {
    document.querySelectorAll('.feature').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // --- Formulário de contato → WhatsApp ---
  var form = document.querySelector('#contato-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = (form.nome && form.nome.value) || '';
      var email = (form.email && form.email.value) || '';
      var tel = (form.telefone && form.telefone.value) || '';
      var msg = (form.mensagem && form.mensagem.value) || '';
      var texto = 'Olá! Meu nome é ' + nome + '.';
      if (msg) texto += ' ' + msg;
      if (email) texto += '\nE-mail: ' + email;
      if (tel) texto += '\nTelefone: ' + tel;
      window.location.href = 'https://wa.me/5511947344475?text=' + encodeURIComponent(texto);
    });
  }
});
