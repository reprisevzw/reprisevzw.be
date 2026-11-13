// Menu op een smal scherm: de knop "Menu" opent en sluit het menu.
// Zonder JavaScript springt de link "Menu" naar de links onderaan de pagina.
(function () {
  var knop = document.querySelector('.kop__menu-knop');
  var menu = document.getElementById('menu');
  if (!knop || !menu) return;
  var root = document.documentElement;
  var breed = window.matchMedia('(min-width: 900px)');

  function open() {
    menu.hidden = false;
    knop.setAttribute('aria-expanded', 'true');
    root.classList.add('menu-open');
    var eerste = menu.querySelector('a');
    if (eerste) eerste.focus();
  }

  function sluit(focusTerug) {
    menu.hidden = true;
    knop.setAttribute('aria-expanded', 'false');
    root.classList.remove('menu-open');
    if (focusTerug) knop.focus();
  }

  knop.addEventListener('click', function () {
    if (menu.hidden) open(); else sluit(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) sluit(true);
  });

  // Tab vanaf de laatste link in het menu gaat terug naar de knop.
  menu.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var links = menu.querySelectorAll('a');
    var laatste = links[links.length - 1];
    if (!e.shiftKey && document.activeElement === laatste) {
      e.preventDefault();
      knop.focus();
    }
  });

  breed.addEventListener('change', function (e) {
    if (e.matches && !menu.hidden) sluit(false);
  });
})();
