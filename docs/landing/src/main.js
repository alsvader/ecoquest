// EcoQuest landing — JS mínimo: menú móvil. (El FAQ usa <details> nativo, sin JS.)
(function () {
  var btn = document.getElementById("menu-btn");
  var menu = document.getElementById("menu-movil");
  if (!btn || !menu) return;
  var label = btn.querySelector("[data-label]");
  function setOpen(open) {
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (label) label.textContent = open ? "Cerrar menú" : "Abrir menú";
    menu.hidden = !open;
    btn.classList.toggle("is-open", open);
  }
  btn.addEventListener("click", function () { setOpen(menu.hidden); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) { setOpen(false); btn.focus(); }
  });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", function (m) { if (m.matches) setOpen(false); });
})();
