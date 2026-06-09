/* B&T Bargains — minimal UI: mobile nav, product image loading, year. */
(function () {
  "use strict";

  /* ---- Mobile nav ---- */
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

  /* ---- Product photos ----
     Each card has a typographic placeholder and an <img> pointing at
     assets/products/<name>.jpg. The image stays hidden until it loads
     successfully, so a missing file simply shows the clean label (never
     a broken-image icon). Drop the real photos in and they appear. */
  var medias = document.querySelectorAll(".product-media");
  medias.forEach(function (media) {
    var img = media.querySelector("img");
    if (!img) return;
    var show = function () { if (img.naturalWidth > 0) media.classList.add("is-loaded"); };
    if (img.complete) { show(); }
    img.addEventListener("load", show);
    img.addEventListener("error", function () { media.classList.remove("is-loaded"); });
  });

  /* ---- Footer year ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
