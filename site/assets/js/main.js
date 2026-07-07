// Menu mobile
document.addEventListener('DOMContentLoaded', function () {
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var open = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Ano dinâmico no rodapé
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  // Feedback do formulário (sem back-end)
  var form = document.querySelector('#contato-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = encodeURIComponent(form.nome.value || '');
      var msg = encodeURIComponent(form.mensagem.value || '');
      var texto = 'Ola! Meu nome e ' + decodeURIComponent(nome) + '. ' + decodeURIComponent(msg);
      window.location.href = 'https://wa.me/5511947344475?text=' + encodeURIComponent(texto);
    });
  }
});
