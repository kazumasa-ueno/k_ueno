/* ============================================================
   Kazumasa Ueno — site interactions
   - language toggle (ja / en) with persistence
   - light / dark theme toggle with persistence
   - page titles and legacy section links
   - email obfuscation
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var page = document.body.getAttribute("data-page") || "overview";
  var PAGE_TITLES = {
    overview: { ja: "Home", en: "Home" },
    news: { ja: "Updates", en: "Updates" },
    cv: { ja: "CV", en: "CV" },
    publications: { ja: "論文・発表", en: "Publications & Presentations" }
  };

  /* ---------- Keep links from the former single-page site working ---------- */
  if (page === "overview") {
    var legacyPages = {
      "#news": "news/#news",
      "#publications": "publications/#publications"
    };
    var followLegacyLink = function () {
      var path = legacyPages[window.location.hash];
      if (!path) return;
      var destination = new URL(path, window.location.href);
      destination.search = window.location.search;
      window.location.replace(destination.href);
    };
    followLegacyLink();
    window.addEventListener("hashchange", followLegacyLink);
  }

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
    document.title = (PAGE_TITLES[page] || PAGE_TITLES.overview)[lang] + " | " + META[lang].title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", META[lang].desc);
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", document.title);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", META[lang].desc);
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-set-lang") === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try { localStorage.setItem("lang", lang); } catch (e) {}
    renderLatestNews();
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

  /* ---------- Home: latest three entries from the news archive ---------- */
  var latestNews = document.getElementById("latestNews");
  var latestNewsStatus = document.getElementById("latestNewsStatus");
  var newsEntries = [];
  function renderLatestNews() {
    if (!latestNews || !newsEntries) return;
    var lang = root.getAttribute("data-lang");
    var visibleEntries = newsEntries.filter(function (entry) {
      return !entry.classList.contains(lang === "en" ? "lang-ja" : "lang-en");
    });
    var fragment = document.createDocumentFragment();
    visibleEntries.slice(0, 3).forEach(function (entry) {
      fragment.appendChild(document.importNode(entry, true));
    });
    latestNews.replaceChildren(fragment);
  }
  function showNewsLoadError() {
    if (latestNewsStatus) latestNewsStatus.hidden = false;
  }
  if (latestNews && typeof fetch === "function") {
    var newsURL = new URL(latestNews.getAttribute("data-news-source"), window.location.href);
    fetch(newsURL.href)
      .then(function (response) {
        if (!response.ok) throw new Error("News could not be loaded");
        return response.text();
      })
      .then(function (html) {
        var archive = new DOMParser().parseFromString(html, "text/html");
        var entries = Array.prototype.slice.call(archive.querySelectorAll(".news-list > li"));
        if (!entries.length) return;
        entries.sort(function (a, b) {
          return b.querySelector(".news-date").textContent.trim()
            .localeCompare(a.querySelector(".news-date").textContent.trim());
        });
        entries.forEach(function (entry) {
          entry.querySelectorAll("a[href]").forEach(function (link) {
            link.setAttribute("href", new URL(link.getAttribute("href"), newsURL).href);
          });
        });
        newsEntries = entries;
        renderLatestNews();
      })
      .catch(showNewsLoadError);
  } else if (latestNews) {
    showNewsLoadError();
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
