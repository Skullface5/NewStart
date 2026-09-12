
(function () {
  const SB_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
  const SB_KEY = 'eyJhbG...zMAQ';
  const ADMIN = 'azmmeli146@gmail.com';
  let sb = null;
  try { if (window.supabase) sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) { console.error(e); }

  let allOrders = [];
  let curStatus = 'all';
  let curGroup = 'date';
  let searchQ = '';
  let currentLanguage = localStorage.getItem('language') || 'fr';

  // ─── i18n ─────────────────────────────────────────────────────
  const T = {
    fr: {
      home: 'ACCUEIL', men: 'HOMME', women: 'FEMME', unisex: 'UNISEXE', kids: 'ENFANTS',
      existing: 'PARFUMS EXISTANTS', login: 'Se connecter', profile: 'Mon Profil',
      pageTitle: 'Gestion des commandes', badgeWord: 'commandes',
      stRevenue: "Chiffre d'affaires", stRevenueSub: 'TND · expédiées + livrées',
      stTotal: 'Total commandes', stTotalSub: 'tous statuts confondus',
      stPending: 'En attente', stPendingSub: 'à traiter en priorité',
      stReview: 'En révision', stReviewSub: 'en cours de vérification',
      stShipped: 'Expédiées', stShippedSub: 'en transit',
      stDelivered: 'Livrées', stDeliveredSub: 'avec succès',
      stCancelled: 'Annulées', stCancelledSub: 'au total',
      searchPh: 'ID, nom, téléphone, email, adresse, produit...',
      gDate: 'Par date', gCity: 'Par ville', gProduct: 'Par produit', gFlat: 'Liste simple',
      refresh: 'Actualiser', tAll: 'Toutes',
      accessTitle: 'Accès réservé', accessText: 'Cette page est réservée aux administrateurs Rosa Fragrances.',
      backHome: "Retour à l'accueil", checking: 'Vérification des accès...',
      SL: { pending: 'En attente', review: 'En révision', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' },
      GR: { today: "Aujourd'hui", yesterday: 'Hier', week: 'Cette semaine', month: 'Ce mois', old: 'Plus ancien', unknown: 'Ville inconnue', none: 'Sans article' },
      empty: 'Aucune commande trouvée pour cette recherche.',
      upd: '✅ Statut → ', errLoad: '❌ Erreur de chargement', errUpd: '❌ Erreur de mise à jour',
      copied: '📋 ID copié', refreshed: '✅ Commandes actualisées',
      nOrders: 'commande', nOrdersPl: 'commandes', articles: 'art.', total: 'Total',
      footerDescription: "Parfumerie d'exception depuis 1985. L'art de la parfumerie orientale réinventé pour les connaisseurs exigeants.",
      footerPerfumesTitle: 'Parfums', footerMen: 'Homme', footerWomen: 'Femme', footerUnisex: 'Unisexe', footerKids: 'Enfants',
      footerContactTitle: 'Contact', footerAddress: 'Tunis, Tunisie', footerCopyright: '© 2026 Rosa Fragrances. Tous droits réservés.'
    },
    en: {
      home: 'HOME', men: 'MEN', women: 'WOMEN', unisex: 'UNISEX', kids: 'KIDS',
      existing: 'EXISTING PERFUMES', login: 'Sign in', profile: 'My Profile',
      pageTitle: 'Order management', badgeWord: 'orders',
      stRevenue: 'Revenue', stRevenueSub: 'TND · shipped + delivered',
      stTotal: 'Total orders', stTotalSub: 'all statuses',
      stPending: 'Pending', stPendingSub: 'handle first',
      stReview: 'In review', stReviewSub: 'being verified',
      stShipped: 'Shipped', stShippedSub: 'in transit',
      stDelivered: 'Delivered', stDeliveredSub: 'successfully',
      stCancelled: 'Cancelled', stCancelledSub: 'in total',
      searchPh: 'ID, name, phone, email, address, product...',
      gDate: 'By date', gCity: 'By city', gProduct: 'By product', gFlat: 'Flat list',
      refresh: 'Refresh', tAll: 'All',
      accessTitle: 'Staff only', accessText: 'This page is reserved for Rosa Fragrances administrators.',
      backHome: 'Back to home', checking: 'Checking access...',
      SL: { pending: 'Pending', review: 'In review', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' },
      GR: { today: 'Today', yesterday: 'Yesterday', week: 'This week', month: 'This month', old: 'Older', unknown: 'Unknown city', none: 'No items' },
      empty: 'No orders match this search.',
      upd: '✅ Status → ', errLoad: '❌ Load error', errUpd: '❌ Update error',
      copied: '📋 ID copied', refreshed: '✅ Orders refreshed',
      nOrders: 'order', nOrdersPl: 'orders', articles: 'items', total: 'Total',
      footerDescription: 'Exceptional perfumery since 1985. The art of oriental perfumery reinvented for discerning connoisseurs.',
      footerPerfumesTitle: 'Perfumes', footerMen: 'Men', footerWomen: 'Women', footerUnisex: 'Unisex', footerKids: 'Kids',
      footerContactTitle: 'Contact', footerAddress: 'Tunis, Tunisia', footerCopyright: '© 2026 Rosa Fragrances. All rights reserved.'
    },
    ar: {
      home: 'الرئيسية', men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال',
      existing: 'العطور الموجودة', login: 'تسجيل الدخول', profile: 'ملفي الشخصي',
      pageTitle: 'إدارة الطلبات', badgeWord: 'طلب',
      stRevenue: 'رقم الأعمال', stRevenueSub: 'دينار · مُشحنة + مُسلّمة',
      stTotal: 'إجمالي الطلبات', stTotalSub: 'كل الحالات',
      stPending: 'قيد الانتظار', stPendingSub: 'تحتاج معالجة أولاً',
      stReview: 'قيد المراجعة', stReviewSub: 'جاري التحقق',
      stShipped: 'مُشحنة', stShippedSub: 'قيد النقل',
      stDelivered: 'مُسلّمة', stDeliveredSub: 'بنجاح',
      stCancelled: 'ملغاة', stCancelledSub: 'مجموع',
      searchPh: 'الرقم، الاسم، الهاتف، البريد، العنوان، المنتج...',
      gDate: 'بالتاريخ', gCity: 'بالمدينة', gProduct: 'بالمنتج', gFlat: 'قائمة بسيطة',
      refresh: 'تحديث', tAll: 'الكل',
      accessTitle: 'دخول موظفين', accessText: 'هذه الصفحة مخصصة لمديري روزا للعطور.',
      backHome: 'العودة للرئيسية', checking: 'التحقق من الصلاحيات...',
      SL: { pending: 'قيد الانتظار', review: 'قيد المراجعة', shipped: 'مُشحنة', delivered: 'مُسلّمة', cancelled: 'ملغاة' },
      GR: { today: 'اليوم', yesterday: 'أمس', week: 'هذا الأسبوع', month: 'هذا الشهر', old: 'أقدم', unknown: 'مدينة غير معروفة', none: 'بدون منتجات' },
      empty: 'لا توجد طلبات مطابقة للبحث.',
      upd: '✅ الحالة → ', errLoad: '❌ خطأ في التحميل', errUpd: '❌ خطأ في التحديث',
      copied: '📋 تم نسخ الرقم', refreshed: '✅ تم تحديث الطلبات',
      nOrders: 'طلب', nOrdersPl: 'طلبات', articles: 'قطع', total: 'المجموع',
      footerDescription: 'عطور استثنائية منذ 1985. فن العطور الشرقية المعاد ابتكاره للخبراء المميزين.',
      footerPerfumesTitle: 'العطور', footerMen: 'رجالي', footerWomen: 'نسائي', footerUnisex: 'للجنسين', footerKids: 'أطفال',
      footerContactTitle: 'اتصل بنا', footerAddress: 'تونس، تونس', footerCopyright: '© 2026 روزا للعطور. جميع الحقوق محفوظة.'
    }
  };
  const t = () => T[currentLanguage] || T.fr;

  function translatePage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.title = 'Rosa Fragrances | ' + t().pageTitle + ' - Administration';
    document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.style.textAlign = lang === 'ar' ? 'right' : 'left';
    const names = { fr: 'FRANÇAIS', en: 'ENGLISH', ar: 'العربية' };
    const ls = document.getElementById('currentLangText');
    if (ls) ls.textContent = names[lang];
    document.querySelectorAll('[data-translate]').forEach(el => {
      const k = el.getAttribute('data-translate');
      if (t()[k]) el.textContent = t()[k];
    });
    document.querySelectorAll('[data-translate-ph]').forEach(el => {
      const k = el.getAttribute('data-translate-ph');
      if (t()[k]) el.placeholder = t()[k];
    });
    refreshStats();
    render();
  }

  // ─── Menu + lang wiring (sibling pattern) ─────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const menuOverlay = document.getElementById('menuOverlay');
  function toggleMenu() {
    navLinks.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  }
  menuToggle?.addEventListener('click', toggleMenu);
  menuOverlay?.addEventListener('click', toggleMenu);

  const langMenu = document.getElementById('langMenu');
  document.getElementById('langCurrentBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu.classList.toggle('active');
  });
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      translatePage(opt.dataset.lang);
      langMenu.classList.remove('active');
    });
  });
  document.addEventListener('click', (e) => {
    if (langMenu && !langMenu.contains(e.target)) langMenu.classList.remove('active');
  });

  // ─── User display (sibling pattern) ───────────────────────────
  async function updateUserDisplay() {
    try {
      const { data: { user } } = await sb.auth.getUser();
      const authLink = document.getElementById('authLink');
      const profileLink = document.getElementById('profileLink');
      const adminLink = document.getElementById('adminLink');
      const ordersLink = document.getElementById('ordersLink');
      const isAdmin = !!user && user.email === ADMIN;
      if (authLink) authLink.style.display = user ? 'none' : 'block';
      if (profileLink) profileLink.style.display = user ? 'block' : 'none';
      if (adminLink) adminLink.style.display = isAdmin ? 'block' : 'none';
      if (ordersLink) ordersLink.style.display = isAdmin ? 'block' : 'none';
    } catch (e) { /* session check elsewhere */ }
  }

  // ─── Auth guard ───────────────────────────────────────────────
  // Prefer the CACHED session (instant, offline-safe like the gate); getUser is
  // only a fallback. A network hiccup must never blank the page (invisible-card bug).
  async function boot() {
    if (!sb) { // CDN/supabase-js unavailable: show the (now visible) card instead of a blank page
      hide('authLoading');
      const d = document.getElementById('accessDenied');
      if (d) d.style.display = 'flex';
      return;
    }
    let user = null;
    try {
      const { data: { session } } = await sb.auth.getSession();
      user = session && session.user;
      if (!user) {
        const r = await sb.auth.getUser();
        user = r.data && r.data.user;
      }
    } catch (e) { console.error('adminorders auth check failed:', e); }
    hide('authLoading');
    if (!user || user.email !== ADMIN) {
      const d = document.getElementById('accessDenied');
      if (d) d.style.display = 'flex';
      return;
    }
    show('mainContent');
    updateUserDisplay();
    await loadOrders();
  }
  if (sb) sb.auth.onAuthStateChange(() => { updateUserDisplay(); });

  // ─── Load orders ──────────────────────────────────────────────
  async function loadOrders(manual = false) {
    const ico = document.getElementById('refreshIcon');
    if (ico) ico.classList.add('fa-spin');
    try {
      const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      allOrders = data || [];
      refreshStats();
      refreshCounts();
      render();
      if (manual) toast(t().refreshed);
    } catch (e) { console.error(e); toast(t().errLoad); }
    finally { if (ico) ico.classList.remove('fa-spin'); }
  }
  window.loadOrders = loadOrders;

  // ─── Stats ────────────────────────────────────────────────────
  function refreshStats() {
    const L = t();
    const rev = allOrders.filter(o => ['shipped', 'delivered'].includes(o.status)).reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
    setText('sRevenue', rev.toFixed(3).replace('.', ','));
    setText('sTotal', allOrders.length);
    setText('badgeCount', allOrders.length);
    setText('sPending', allOrders.filter(o => o.status === 'pending').length);
    setText('sReview', allOrders.filter(o => o.status === 'review').length);
    setText('sShipped', allOrders.filter(o => o.status === 'shipped').length);
    setText('sDelivered', allOrders.filter(o => o.status === 'delivered').length);
    setText('sCancelled', allOrders.filter(o => o.status === 'cancelled').length);
    const bw = document.querySelector('.stats-badge span:nth-child(3)');
    if (bw && bw.getAttribute('data-translate') === 'badgeWord') bw.textContent = L.badgeWord;
  }

  function refreshCounts() {
    ['all', 'pending', 'review', 'shipped', 'delivered', 'cancelled'].forEach(s => {
      const el = document.getElementById('c-' + s);
      if (el) el.textContent = s === 'all' ? allOrders.length : allOrders.filter(o => o.status === s).length;
    });
  }

  // ─── Filter + search ──────────────────────────────────────────
  function filtered() {
    let list = curStatus === 'all' ? allOrders : allOrders.filter(o => o.status === curStatus);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter(o => [
        o.id, o.customer_name, o.customer_phone, o.customer_email, o.shipping_address,
        ...(o.items || []).map(i => i.name)
      ].some(v => (v || '').toLowerCase().includes(q)));
    }
    return list;
  }

  // ─── Grouping ─────────────────────────────────────────────────
  function groupDate(orders) {
    const L = t();
    const now = new Date(), td = now.toDateString(), yd = new Date(now - 864e5).toDateString(), wa = new Date(now - 7 * 864e5), ma = new Date(now - 30 * 864e5);
    const G = { [L.GR.today]: [], [L.GR.yesterday]: [], [L.GR.week]: [], [L.GR.month]: [], [L.GR.old]: [] };
    orders.forEach(o => {
      const d = new Date(o.created_at), ds = d.toDateString();
      if (ds === td) G[L.GR.today].push(o);
      else if (ds === yd) G[L.GR.yesterday].push(o);
      else if (d >= wa) G[L.GR.week].push(o);
      else if (d >= ma) G[L.GR.month].push(o);
      else G[L.GR.old].push(o);
    });
    return Object.entries(G).filter(([, v]) => v.length);
  }

  function groupCity(orders) {
    const L = t();
    const M = {};
    orders.forEach(o => {
      const parts = (o.shipping_address || '').split(',').map(s => s.trim()).filter(Boolean);
      const city = parts.length > 1 ? parts[parts.length - 1] : (parts[0] || L.GR.unknown);
      if (!M[city]) M[city] = [];
      M[city].push(o);
    });
    return Object.entries(M).sort((a, b) => b[1].length - a[1].length);
  }

  function groupProduct(orders) {
    const M = {};
    orders.forEach(o => {
      const names = [...new Set((o.items || []).map(i => i.name).filter(Boolean))];
      names.forEach(name => { if (!M[name]) M[name] = []; if (!M[name].find(x => x.id === o.id)) M[name].push(o); });
    });
    return Object.entries(M).sort((a, b) => b[1].length - a[1].length);
  }

  // ─── Render ───────────────────────────────────────────────────
  function render() {
    const out = document.getElementById('ordersOut');
    if (!out) return;
    const L = t();
    const list = filtered();
    if (!list.length) {
      out.innerHTML = `<div class="orders-empty"><i class="fas fa-box-open"></i><p>${esc(L.empty)}</p></div>`;
      return;
    }
    if (curGroup === 'none') {
      out.innerHTML = `<div class="orders-grid">${list.map(card).join('')}</div>`;
    } else {
      const groups = curGroup === 'date' ? groupDate(list) : curGroup === 'city' ? groupCity(list) : groupProduct(list);
      out.innerHTML = groups.map(([label, orders]) => `
        <div class="group-section">
          <div class="group-header">
            <h3>${esc(label)}</h3>
            <span class="group-badge">${orders.length} ${orders.length > 1 ? L.nOrdersPl : L.nOrders}</span>
          </div>
          <div class="orders-grid">${orders.map(card).join('')}</div>
        </div>`).join('');
    }
  }

  // ─── Order card ───────────────────────────────────────────────
  const SI = { pending: 'fa-clock', review: 'fa-search', shipped: 'fa-truck', delivered: 'fa-check-circle', cancelled: 'fa-times-circle' };

  function card(o) {
    const L = t();
    const date = new Date(o.created_at).toLocaleString(currentLanguage === 'ar' ? 'ar-TN' : (currentLanguage === 'en' ? 'en-GB' : 'fr-FR'), { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const shortId = (o.id || '').slice(0, 8).toUpperCase();
    const items = (o.items || []).map(i => `
      <div class="item-row">
        <span class="item-n"><i class="fas fa-crown" style="color:var(--gold);font-size:0.6rem;"></i>${esc(i.name)} <span class="item-q">×${i.quantity}</span></span>
        <span class="item-p">${(i.price * i.quantity).toFixed(3).replace('.', ',')} TND</span>
      </div>`).join('') || `<div class="item-row"><span style="color:var(--text-mid);font-size:0.72rem;">${esc(L.GR.none)}</span></div>`;
    const opt = (v, ic) => `<option value="${v}" ${o.status === v ? 'selected' : ''}>${ic} ${esc(L.SL[v])}</option>`;
    return `
    <div class="order-card">
      <div class="oc-header">
        <div>
          <div class="oc-id" onclick="copyId('${o.id}')" title="${esc(L.copied)}">
            <i class="fas fa-receipt" style="color:var(--gold);font-size:0.7rem;"></i>
            #${shortId}…<i class="fas fa-copy ci"></i>
          </div>
          <div class="oc-date"><i class="fas fa-calendar-alt" style="font-size:0.58rem;"></i> ${date}</div>
        </div>
        <span class="sbadge ${o.status}"><i class="fas ${SI[o.status] || 'fa-circle'}"></i> ${esc(L.SL[o.status] || o.status)}</span>
      </div>
      <div class="oc-customer">
        <div class="cf"><span class="cl"><i class="fas fa-user"></i> ${currentLanguage === 'fr' ? 'Client' : currentLanguage === 'en' ? 'Customer' : 'العميل'}</span><span class="cv">${esc(o.customer_name || '—')}</span></div>
        <div class="cf"><span class="cl"><i class="fas fa-phone"></i> ${currentLanguage === 'fr' ? 'Tél' : currentLanguage === 'en' ? 'Phone' : 'الهاتف'}</span><span class="cv"><a href="tel:${esc(o.customer_phone || '')}">${esc(o.customer_phone || '—')}</a></span></div>
        <div class="cf"><span class="cl"><i class="fas fa-envelope"></i> Email</span><span class="cv"><a href="mailto:${esc(o.customer_email || '')}" title="${esc(o.customer_email || '')}">${esc((o.customer_email || '—').split('@')[0])}@…</a></span></div>
        <div class="cf"><span class="cl"><i class="fas fa-box"></i> ${esc(L.articles)}</span><span class="cv">${(o.items || []).length}</span></div>
      </div>
      <div class="oc-address"><i class="fas fa-map-marker-alt" style="color:var(--gold);margin-top:1px;flex-shrink:0;"></i><span>${esc(o.shipping_address || '—')}</span></div>
      <div class="oc-items">${items}</div>
      <div class="oc-footer">
        <div class="oc-total">${esc(L.total)} : <span>${parseFloat(o.total || 0).toFixed(3).replace('.', ',')} TND</span></div>
        <select class="status-sel" onchange="updateStatus('${o.id}',this.value)">
          ${opt('pending', '⏳')}${opt('review', '🔍')}${opt('shipped', '🚚')}${opt('delivered', '✅')}${opt('cancelled', '❌')}
        </select>
      </div>
    </div>`;
  }

  // ─── Update status ────────────────────────────────────────────
  window.updateStatus = async function (id, newStatus) {
    try {
      const { error } = await sb.from('orders').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      const o = allOrders.find(x => x.id === id);
      if (o) o.status = newStatus;
      refreshStats(); refreshCounts(); render();
      toast(t().upd + t().SL[newStatus]);
    } catch (e) { console.error(e); toast(t().errUpd); }
  };

  // ─── Copy ID ──────────────────────────────────────────────────
  window.copyId = function (id) {
    navigator.clipboard.writeText(id).then(() => toast(t().copied));
  };

  // ─── Controls ─────────────────────────────────────────────────
  window.setStatus = function (s, btn) {
    curStatus = s;
    document.querySelectorAll('.s-tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    render();
  };
  window.setGroup = function (g, btn) {
    curGroup = g;
    document.querySelectorAll('.g-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    render();
  };

  let searchT;
  document.getElementById('searchInput')?.addEventListener('input', e => {
    clearTimeout(searchT);
    searchT = setTimeout(() => { searchQ = e.target.value; render(); }, 220);
  });

  // ─── Helpers ──────────────────────────────────────────────────
  function esc(s) { return (s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
  function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }
  function show(id) { const el = document.getElementById(id); if (el) el.style.display = ''; }
  function hide(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }

  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg; el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
  }

  // ─── Theme (sibling pattern) ──────────────────────────────────
  (function initTheme() {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
      const s = document.querySelector('#themeToggle .fa-sun'), m = document.querySelector('#themeToggle .fa-moon');
      if (s) s.style.display = 'none';
      if (m) m.style.display = 'inline-block';
    }
  })();
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    document.querySelector('#themeToggle .fa-sun').style.display = dark ? 'none' : 'inline-block';
    document.querySelector('#themeToggle .fa-moon').style.display = dark ? 'inline-block' : 'none';
  });

  // apply saved language on first paint
  translatePage(currentLanguage);
  boot();
})();
