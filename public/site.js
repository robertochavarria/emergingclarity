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
  applyTheme(savedTheme() === "light" ? "light" : "dark");

  var mainEl = document.querySelector("main");
  if (mainEl && !mainEl.id) mainEl.id = "main";

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
