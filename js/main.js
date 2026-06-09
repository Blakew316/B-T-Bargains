/* B&T Bargains — minimal UI: mobile nav + footer year. No animation. */
(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var list = document.getElementById("navList");
  if (toggle && list) {
    toggle.addEventListener("click", function () {
      var open = list.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        list.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var yr = document.getElementById("year");
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
