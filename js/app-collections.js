/**
 * ROSA — "Notre Collection" nav menu (shared across all storefront pages).
 * Owner: collections-menu agent. Contract: SPEC-hero-collections.md.
 * Public API: window.RosaCollections = { init, setLang }
 */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
  // Public anon key: reuse the page's exported client, or a data-anon-key attr on our script tag.
  function resolveAnonKey() {
    var c = window.__rosaSupabase;
    try {
      var h = c && (c.headers ? c : (c.supabase || null));
      h = h && h.headers;
      if (h) {
        if (h.apikey || h.apiKey) return h.apikey || h.apiKey;
        if (typeof h.get === 'function') { var k = h.get('apikey'); if (k) return k; }
      }
    } catch (e) {}
    var s = document.querySelector('script[src*="app-collections.js"]');
    if (s && s.getAttribute('data-anon-key')) return s.getAttribute('data-anon-key');
    return null;
  }

  // Trigger + chrome labels rendered by this module itself.
  const UI = {
    notreCollection: {
      fr: 'Notre Collection',
      en: 'Our Collection',
      ar: 'مجموعتنا'
    }
  };

  // Category labels whitelist (SPEC section 4).
  const CAT_LABELS = {
    voiture: { fr: 'Parfums pour voiture', en: 'Car perfumes', ar: 'عطور السيارات' },
    ambiance: { fr: "Parfums d'ambiance", en: 'Home fragrances', ar: 'عطورات الجو' },
    musc: { fr: 'Musc', en: 'Musk', ar: 'مسك' },
    accessoires: { fr: 'Accessoires', en: 'Accessories', ar: 'إكسسوارات' },
    man: { fr: 'Homme', en: 'Men', ar: 'رجالي' },
    women: { fr: 'Femme', en: 'Women', ar: 'نسائي' },
    unisexe: { fr: 'Unisexe', en: 'Unisex', ar: 'للجنسين' },
    kids: { fr: 'Enfants', en: 'Kids', ar: 'أطفال' }
  };

  // Hrefs for child slugs; anything not listed falls back to the cat.html filter.
  const CHILD_HREFS = {
    man: 'man.html',
    women: 'women.html',
    unisexe: 'unisexe.html',
    kids: 'kids.html'
  };


  // Built-in fallback = SPEC contract (admin-editable five; Parfums appended by code).
  const DEFAULT_ADMIN_ITEMS = [
    { slug: 'inspires', fr: 'Parfums inspirés', en: 'Inspired perfumes', ar: 'عطور مستوحاة', href: 'cat.html?cat=inspires' },
    { slug: 'voiture', fr: 'Parfums pour voiture', en: 'Car perfumes', ar: 'عطور السيارات', href: 'cat.html?cat=voiture' },
    { slug: 'ambiance', fr: "Parfums d'ambiance", en: 'Home fragrances', ar: 'عطورات الجو', href: 'cat.html?cat=ambiance' },
    { slug: 'musc', fr: 'Musc', en: 'Musk', ar: 'مسك', href: 'cat.html?cat=musc' },
    { slug: 'accessoires', fr: 'Accessoires', en: 'Accessories', ar: 'إكسسوارات', href: 'cat.html?cat=accessoires' }
  ];

  let lang = 'fr';
  let items = withParfums(DEFAULT_ADMIN_ITEMS);
  let mounts = [];
  let fetched = false;
  let keyTries = 0;

  function normalizeLang(l) {
    return (l === 'en' || l === 'ar') ? l : 'fr';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function safeHref(h) {
    h = String(h == null ? '' : h).trim();
    if (!h || /^(javascript|data|vbscript):/i.test(h.replace(/[\s\u0000-\u001f]+/g, ''))) return '#';
    return esc(h);
  }

  function labelOf(item) {
    return item[lang] || item.fr || item.en || item.slug || '';
  }

  function normalizeChild(child) {
    if (typeof child === 'string') {
      const l = CAT_LABELS[child];
      return {
        slug: child,
        fr: (l && l.fr) || child,
        en: (l && l.en) || child,
        ar: (l && l.ar) || child,
        href: CHILD_HREFS[child] || ('cat.html?cat=' + encodeURIComponent(child))
      };
    }
    if (child && typeof child === 'object') {
      const c = Object.assign({}, child);
      const meta = CAT_LABELS[c.slug];
      if (meta) {
        if (!c.fr) c.fr = meta.fr;
        if (!c.en) c.en = meta.en;
        if (!c.ar) c.ar = meta.ar;
      }
      if (!c.href && c.slug) c.href = CHILD_HREFS[c.slug] || ('cat.html?cat=' + encodeURIComponent(c.slug));
      return c;
    }
    return null;
  }

  function validItem(item) {
    return item && typeof item === 'object' && (item.href || item.children) &&
      (item.fr || item.en || item.ar || item.slug);
  }

  function withParfums(list) {
    const arr = (Array.isArray(list) ? list : [])
      .filter(validItem)
      .map(function (it) { return Object.assign({}, it); });
    if (!arr.length) DEFAULT_ADMIN_ITEMS.forEach(function (it) { arr.push(Object.assign({}, it)); });
    return arr;
  }

  function renderOptions(list) {
    let html = '';
    list.forEach(function (item) {
      const href = safeHref(item.href || '#');
      html += '<a class="collections-option" role="menuitem" href="' + href + '">' + esc(labelOf(item)) + '</a>';
      if (Array.isArray(item.children) && item.children.length) {
        html += '<div class="collections-submenu" role="group">';
        item.children.forEach(function (raw) {
          const c = normalizeChild(raw);
          if (!c) return;
          html += '<a class="collections-sublink" role="menuitem" href="' + safeHref(c.href) + '">' + esc(labelOf(c)) + '</a>';
        });
        html += '</div>';
      }
    });
    return html;
  }

  function renderMount(mount) {
    const wasActive = mount.classList.contains('active');
    const title = UI.notreCollection[lang] || UI.notreCollection.fr;
    mount.innerHTML =
      '<button type="button" class="collections-current" aria-expanded="' + (wasActive ? 'true' : 'false') + '" aria-haspopup="true">' +
        '<span class="collections-current-label" data-translate="notreCollection">' + esc(title) + '</span>' +
        '<i class="fas fa-chevron-down" aria-hidden="true"></i>' +
      '</button>' +
      '<div class="collections-options" role="menu">' + renderOptions(items) + '</div>';
    const panel = mount.querySelector('.collections-options');
    if (panel) panel.style.maxHeight = wasActive ? panel.scrollHeight + 'px' : '0px';
  }

  function renderAll() {
    collectMounts();
    mounts.forEach(renderMount);
  }

  function collectMounts() {
    const found = Array.prototype.slice.call(document.querySelectorAll('.collections-menu'));
    found.forEach(function (m) {
      if (m.__rosaBound) return;
      m.__rosaBound = true;
      m.addEventListener('click', onMountClick);
    });
    mounts = found;
  }

  function closeMount(mount) {
    if (!mount.classList.contains('active')) return;
    mount.classList.remove('active');
    const btn = mount.querySelector('.collections-current');
    const panel = mount.querySelector('.collections-options');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (panel) panel.style.maxHeight = '0px';
  }

  function toggleMount(mount) {
    const willOpen = !mount.classList.contains('active');
    mounts.forEach(function (m) { if (m !== mount) closeMount(m); });
    const btn = mount.querySelector('.collections-current');
    const panel = mount.querySelector('.collections-options');
    if (willOpen) {
      mount.classList.add('active');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      closeMount(mount);
    }
  }

  function onMountClick(e) {
    const mount = this;
    if (e.target.closest('.collections-current')) {
      e.preventDefault();
      e.stopPropagation();
      toggleMount(mount);
      return;
    }
    if (e.target.closest('.collections-option, .collections-sublink')) {
      closeMount(mount); // navigating away — reset accordion state
    }
  }

  document.addEventListener('click', function (e) {
    mounts.forEach(function (m) {
      if (m.contains(e.target)) return;
      closeMount(m);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      const anyOpen = mounts.some(function (m) { return m.classList.contains('active'); });
      if (anyOpen) {
        mounts.forEach(closeMount);
        const btn = document.querySelector('.collections-menu .collections-current');
        if (btn) btn.focus();
      }
    }
  });

  function applyFetched(value) {
    items = withParfums(Array.isArray(value) ? value : null);
    renderAll();
  }

  function fetchCollections() {
    if (fetched) return Promise.resolve();
    var k = resolveAnonKey();
    if (!k) { keyTries++; if (keyTries < 12) setTimeout(fetchCollections, 400); return Promise.resolve(); }
    fetched = true;
    return fetch(SUPABASE_URL + '/rest/v1/settings?select=*&key=eq.collections', {
      headers: { apikey: k, Authorization: 'Bearer ' + k }
    })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function (rows) {
        const row = Array.isArray(rows) && rows[0];
        if (row && Array.isArray(row.value) && row.value.length) applyFetched(row.value);
      })
      .catch(function () { /* offline / RLS / bad data => keep built-in defaults */ });
  }

  function init(opts) {
    opts = opts || {};
    lang = normalizeLang(opts.lang || localStorage.getItem('language') || 'fr');
    renderAll();
    fetchCollections();
    return window.RosaCollections;
  }

  function setLang(nextLang) {
    lang = normalizeLang(nextLang);
    renderAll();
    return window.RosaCollections;
  }

  window.RosaCollections = { init: init, setLang: setLang };

  // Auto-init: scripts live at end of <body>, DOM is parsed at this point.
  // Placed BEFORE each page's app-*.js so the page's translatePage() also sees
  // the [data-translate="notreCollection"] label.
  init();
})();
