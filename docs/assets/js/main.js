// =====================================================================
// JB CARGO — interações "MANIFESTO"
// =====================================================================
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Menu mobile ---
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.burger');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    nav.querySelectorAll('.mainnav a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Estado do cabeçalho + Linha de Rota (progresso de scroll) ---
  var mast = document.querySelector('.masthead');
  var route = document.querySelector('.route-progress');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (mast) mast.classList.toggle('is-scrolled', y > 8);
      if (route && !reduceMotion) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        route.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      }
      ticking = false;
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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
          entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // --- Contadores de estatística ---
  function animateCount(el) {
    if (el.dataset.counted) return;
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target) || reduceMotion) return;
    el.dataset.counted = '1';
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
  // Fallback: garante valor final sem IntersectionObserver
  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = prefix + el.getAttribute('data-count') + suffix;
    });
  }

  // --- Parallax sutil do hero (10%) ---
  if (!reduceMotion) {
    var heroMedia = document.querySelector('.hero__media img, .pagehead__media img');
    if (heroMedia) {
      var hTicking = false;
      window.addEventListener('scroll', function () {
        if (hTicking) return;
        hTicking = true;
        requestAnimationFrame(function () {
          var offset = window.scrollY * 0.05;
          heroMedia.style.transform = 'translate3d(0,' + offset + 'px,0) scale(1.03)';
          hTicking = false;
        });
      }, { passive: true });
    }
  }

  // --- Formulário de contato → e-mail (mailto) ---
  var form = document.querySelector('#contato-form');
  if (form) {
    var DESTINO = 'comercial@jbcargo.com.br';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome = ((form.nome && form.nome.value) || '').trim();
      var email = ((form.email && form.email.value) || '').trim();
      var telefone = ((form.telefone && form.telefone.value) || '').trim();
      var mensagem = ((form.mensagem && form.mensagem.value) || '').trim();

      var assunto = 'Solicitação de orçamento — ' + (nome || 'Site JB Cargo');

      var corpo =
        'Nome: ' + nome + '\n' +
        'E-mail: ' + email + '\n' +
        'Telefone: ' + telefone + '\n\n' +
        'Mensagem:\n' + mensagem + '\n';

      // mailto: abre o programa de e-mail padrão (Gmail, Outlook, app do celular…)
      var link = 'mailto:' + DESTINO
        + '?subject=' + encodeURIComponent(assunto)
        + '&body=' + encodeURIComponent(corpo);

      window.location.href = link;
    });
  }
});
