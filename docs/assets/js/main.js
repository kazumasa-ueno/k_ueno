/* ============================================================
   Kazumasa Ueno — site interactions
   - language toggle (ja / en) with persistence
   - light / dark theme toggle with persistence
   - scroll-spy nav highlighting
   - email obfuscation
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Language ---------- */
  var META = {
    ja: {
      title: "上野和雅 | Kazumasa Ueno",
      desc: "上野和雅 — 東京大学大学院 地球惑星科学専攻 博士課程。大気科学における量子コンピュータの活用を研究しています。"
    },
    en: {
      title: "Kazumasa Ueno | 上野和雅",
      desc: "Kazumasa Ueno — Doctoral student at the University of Tokyo, studying the application of quantum computing to atmospheric science."
    }
  };

  function setLang(lang) {
    if (lang !== "ja" && lang !== "en") lang = "ja";
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    document.title = META[lang].title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", META[lang].desc);
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-set-lang") === lang);
    });
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  var savedLang;
  try { savedLang = localStorage.getItem("lang"); } catch (e) {}
  if (!savedLang) {
    savedLang = (navigator.language || "ja").toLowerCase().indexOf("ja") === 0 ? "ja" : "en";
  }
  setLang(savedLang);

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-set-lang"));
    });
  });

  /* ---------- Theme ---------- */
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }

  var savedTheme;
  try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
  if (!savedTheme) {
    savedTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  setTheme(savedTheme);

  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ---------- Email obfuscation ---------- */
  document.querySelectorAll(".email-link").forEach(function (el) {
    var user = el.getAttribute("data-user");
    var domain = el.getAttribute("data-domain");
    if (!user || !domain) return;
    var addr = user + "@" + domain;
    el.setAttribute("href", "mailto:" + addr);
    var textEl = el.querySelector(".email-text:not([data-keep])");
    if (textEl) textEl.textContent = addr;
  });

  /* ---------- Scroll-spy nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    sections.forEach(function (sec) { observer.observe(sec); });
  }

  /* ---------- News: show 3, expand for the rest ---------- */
  var newsList = document.querySelector(".news-list");
  var newsToggle = document.getElementById("newsToggle");
  if (newsList && newsToggle) {
    var NEWS_LIMIT = 3;
    var extra = newsList.querySelectorAll("li").length - NEWS_LIMIT;
    if (extra > 0) {
      newsList.classList.add("js-collapsed");
      newsToggle.hidden = false;
      var jaL = newsToggle.querySelector(".lang-ja");
      var enL = newsToggle.querySelector(".lang-en");
      var updateNewsLabel = function (open) {
        jaL.textContent = open ? "閉じる" : "もっと表示する（あと" + extra + "件）";
        enL.textContent = open ? "Show less" : "Show " + extra + " more";
      };
      updateNewsLabel(false);
      newsToggle.addEventListener("click", function () {
        var open = newsList.classList.toggle("is-open");
        newsToggle.setAttribute("aria-expanded", open ? "true" : "false");
        updateNewsLabel(open);
      });
    }
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
