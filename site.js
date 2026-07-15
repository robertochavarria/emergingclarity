/* ============================================================
   EMERGING CLARITY — shared site behavior
   Injects nav + footer on every page, wires motion & interactions.
   Each page sets <body data-page="home|about|work|writing|connect">
   ============================================================ */
(function () {
  "use strict";

  var PAGE = document.body.getAttribute("data-page") || "";
  var THEME_KEY = "emerging-clarity-theme";
  var root = document.documentElement;

  function savedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#07090a" : "#f5f5f0");
  }
  applyTheme(savedTheme() === "dark" ? "dark" : "light");

  var LINKS = [
    { href: "about.html",        id: "about",        label: "About Roberto" },
    { href: "work.html",         id: "work",         label: "Our Work Together" },
    { href: "testimonials.html", id: "testimonials", label: "Stories" },
    { href: "connect.html",      id: "connect",      label: "Connect" }
  ];

  /* ---------- Skip-to-content ---------- */
  if (!document.querySelector(".skiplink")) {
    var skip = document.createElement("a");
    skip.className = "skiplink";
    skip.href = "#main";
    skip.textContent = "Skip to content";
    document.body.insertBefore(skip, document.body.firstChild);
  }
  /* Make sure <main> has the expected anchor id */
  var mainEl = document.querySelector("main");
  if (mainEl && !mainEl.id) mainEl.id = "main";

  /* ---------- NAV ---------- */
  var navHost = document.getElementById("site-nav");
  if (navHost) {
    var linksHtml = LINKS.map(function (l) {
      var isActive = l.id === PAGE;
      return '<a href="' + l.href + '"' +
        (isActive ? ' class="active" aria-current="page"' : "") +
        ">" + l.label + "</a>";
    }).join("");
    navHost.outerHTML =
      '<header class="nav" id="nav">' +
        '<a class="nav__brand" href="index.html" aria-label="Emerging Clarity home">' +
          '<span class="a">Emerging <b>Clarity</b></span>' +
          '<span class="b">Life Threshold Coaching</span>' +
        "</a>" +
        '<nav class="nav__links" aria-label="Primary">' + linksHtml + "</nav>" +
        '<a class="nav__cta" href="connect.html">Begin a conversation</a>' +
        '<button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to dark mode" title="Switch to dark mode"></button>' +
        '<button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      "</header>";
  }

  /* ---------- Theme ---------- */
  var themeToggle = document.getElementById("theme-toggle");
  function updateThemeToggle() {
    if (!themeToggle) return;
    var isLight = root.getAttribute("data-theme") === "light";
    var nextLabel = isLight ? "dark" : "light";
    var icon = isLight
      ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.6 15.8A8.6 8.6 0 0 1 8.2 3.4 8.6 8.6 0 1 0 20.6 15.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.9 4.9l1.55 1.55M17.55 17.55l1.55 1.55M19.1 4.9l-1.55 1.55M6.45 17.55L4.9 19.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    themeToggle.innerHTML = icon;
    themeToggle.setAttribute("aria-label", "Switch to " + nextLabel + " mode");
    themeToggle.setAttribute("title", "Switch to " + nextLabel + " mode");
  }
  updateThemeToggle();
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(nextTheme);
      try { localStorage.setItem(THEME_KEY, nextTheme); } catch (e) {}
      updateThemeToggle();
    });
  }

  /* ---------- FOOTER ---------- */
  var footHost = document.getElementById("site-footer");
  if (footHost) {
    footHost.outerHTML =
      '<footer class="footer">' +
        '<div class="wrap wrap-wide">' +
          '<div class="footer__top">' +
            '<div class="footer__brand">' +
              '<span class="a">Emerging <b>Clarity</b></span>' +
              "<p>Soulful mentoring for those standing at a threshold.</p>" +
              '<a class="footer__practice" href="https://robertochavarria.com" target="_blank" rel="noopener">A practice of Roberto Chavarria <span aria-hidden="true">&#8599;</span></a>' +
              '<div class="footer__social">' +
                '<a href="mailto:hello@emergingclarity.com" aria-label="Email"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="2"/></svg></a>' +
              "</div>" +
            "</div>" +
            '<div class="footer__col">' +
              "<h4>Explore</h4>" +
              '<a href="about.html">About Roberto</a>' +
              '<a href="work.html">Our Work Together</a>' +
              '<a href="testimonials.html">Stories</a>' +
              '<a href="connect.html">Connect</a>' +
            "</div>" +
            '<div class="footer__col">' +
              "<h4>Begin</h4>" +
              '<a href="connect.html">Book an exploration call</a>' +
              '<a href="mailto:hello@emergingclarity.com">hello@emergingclarity.com</a>' +
              '<span>Sessions held online, worldwide</span>' +
            "</div>" +
          "</div>" +
          '<div class="footer__legal">' +
            "<span>© " + new Date().getFullYear() + " Emerging Clarity · Roberto Chavarria</span>" +

          "</div>" +
        "</div>" +
      "</footer>";
  }

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById("nav");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 36); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav__links a, .nav__cta").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); });
    });
  }

  /* ---------- Reveal ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = [].slice.call(document.querySelectorAll(".reveal"));
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Magnetic primary CTAs ---------- */
  (function () {
    if (reduced) return;
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;
    var MAX = 6, STRENGTH = 0.3, EASE = 0.18;
    document.querySelectorAll(".btn--aqua").forEach(function (btn) {
      var tx = 0, ty = 0, rx = 0, ry = 0, active = false, rafId = null;
      function tick() {
        rx += (tx - rx) * EASE;
        ry += (ty - ry) * EASE;
        var lift = active ? -3 : 0;
        btn.style.transform = "translate3d(" + rx.toFixed(2) + "px," + (ry + lift).toFixed(2) + "px,0)";
        if (active || Math.abs(rx) > 0.08 || Math.abs(ry) > 0.08) {
          rafId = requestAnimationFrame(tick);
        } else {
          btn.style.transform = "";
          rafId = null;
        }
      }
      btn.addEventListener("mouseenter", function () { active = true; if (!rafId) tick(); });
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        var dy = (e.clientY - (r.top + r.height / 2)) * STRENGTH;
        tx = Math.max(-MAX, Math.min(MAX, dx));
        ty = Math.max(-MAX, Math.min(MAX, dy));
      });
      btn.addEventListener("mouseleave", function () { active = false; tx = 0; ty = 0; if (!rafId) tick(); });
    });
  })();

})();
