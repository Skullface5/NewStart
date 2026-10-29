
    (function () {
      const RP = window.RosaPromo || { setSettings: function(){}, settings: function(){return {};}, percent: function(){return null;}, isPromo: function(){return false;}, badge: function(){return '';}, badgeHtml: function(){return '';}, priceHtml: function(r,f){return f ? f(r.price) : r.price;}, buyIcon: function(){return '';}, bg: function(){return '#1E9E57';}, priceColor: function(){return '#D62828';}, injectCss: function(){} };
      const VR = window.RosaVariants || { parse: function () { return []; }, priceFor: function (p) { return parseFloat(p && p.price) || 0; }, inStock: function (p) { return !p || p.quantity == null || Number(p.quantity) > 0; }, stockOf: function (p) { return p && p.quantity != null ? Number(p.quantity) : null; }, esc: function (s) { return s == null ? '' : String(s).replace(/[&<>"]/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]; }); } };

      const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co',
        SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
      const supabase = window.__rosaSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      let currentLanguage = localStorage.getItem('language') || 'fr';
      let allProductsData = [];
      let currentFilter = 'all';

      const translations = {
        fr: {
          collection: 'COLLECTION', exclusives: 'EXCLUSIVITÉS', gifts: 'COFFRETS', login: 'Se connecter', profile: 'Mon Profil', notreCollection: 'Notre Collection',
          buyNow: 'Acheter', buyNowNote: 'Remplissez le formulaire, on vous appelle dans les plus brefs délais!',
          addToCart: 'Ajouter', addedToCart: '✨ Article ajouté', cart: 'Panier', emptyCart: 'Votre panier est vide.',
          total: 'Total', payment: 'PAIEMENT', delivery: 'Livraison', fullName: 'Nom complet *', ourProducts: 'Nos Produits', phone: 'Téléphone *',
          email: 'Email *', address: 'Adresse *', yourOrder: 'Votre commande', cancel: 'Annuler', confirm: 'Confirmer',
          orderConfirmed: '✅ Commande confirmée!', cartEmptyWarning: '🛒 Panier vide', error: '❌ Erreur', details: 'Détails',
          close: 'Fermer', loading: 'Chargement...', noProducts: 'Aucun parfum trouvé', errorLoading: '❌ Erreur',
          reload: 'Recharger', removed: '🗑️ Retiré', collectionLabel: 'Notre Collection', collectionTitle: 'Parfums',
          exclusive: 'Exclusifs', men: 'Homme', women: 'Femme', unisex: 'Unisexe', kids: 'Enfants', allTab: 'Tous', menTab: 'Homme', womenTab: 'Femme', unisexTab: 'Unisexe', kidsTab: 'Enfants', inspiresTab: 'Inspires', voitureTab: 'Auto', ambianceTab: 'Ambiance', muscTab: 'Musc', accessoiresTab: 'Accessoires',
          searchPlaceholder: 'Rechercher un parfum...',
          footerDescription: "Nous vous proposons un univers de parfums luxueux, aux senteurs élégantes et spontanées, qui touchent les émotions et laissent une impression durable.",
          footerPerfumesTitle: "Parfums", footerMen: "Homme", footerWomen: "Femme", footerUnisex: "Unisexe", footerKids: "Enfants",
          footerNew: "Nouveautés", footerContactTitle: "Contact", footerAddress: "Tunis, Tunisie", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. Tous droits réservés."
        },
        en: {
          collection: 'COLLECTION', exclusives: 'EXCLUSIVES', gifts: 'GIFT SETS', login: 'Sign in', profile: 'My Profile', notreCollection: 'Our Collection',
          buyNow: 'Buy', buyNowNote: 'Fill in the form, we will call you as soon as possible!',
          addToCart: 'Add to cart', addedToCart: '✨ Added to cart', cart: 'Cart', emptyCart: 'Your cart is empty.',
          total: 'Total', payment: 'PAYMENT', delivery: 'Delivery', fullName: 'Full name *', ourProducts: 'Our Products', phone: 'Phone *',
          email: 'Email *', address: 'Address *', yourOrder: 'Your order', cancel: 'Cancel', confirm: 'Confirm',
          orderConfirmed: '✅ Order confirmed!', cartEmptyWarning: '🛒 Cart is empty', error: '❌ Error', details: 'Details',
          close: 'Close', loading: 'Loading...', noProducts: 'No perfumes found', errorLoading: '❌ Error',
          reload: 'Reload', removed: '🗑️ Removed', collectionLabel: 'Our Collection', collectionTitle: 'Perfumes',
          exclusive: 'Exclusive', men: 'Men', women: 'Women', unisex: 'Unisex', kids: 'Kids', allTab: 'All', menTab: 'Men', womenTab: 'Women', unisexTab: 'Unisex', kidsTab: 'Kids', inspiresTab: 'Inspired', voitureTab: 'Car Fragrances', ambianceTab: 'Ambience', muscTab: 'Musk', accessoiresTab: 'Accessories',
          searchPlaceholder: 'Search perfume...',
          footerDescription: "We offer you a world of luxurious perfumes, with elegant and spontaneous scents, that touch the emotions and leave a lasting impression.",
          footerPerfumesTitle: "Perfumes", footerMen: "Men", footerWomen: "Women", footerUnisex: "Unisex", footerKids: "Kids",
          footerNew: "New Arrivals", footerContactTitle: "Contact", footerAddress: "Tunis, Tunisia", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. All rights reserved."
        },
        ar: {
          collection: 'المجموعة', exclusives: 'الحصريات', gifts: 'الهدايا', login: 'تسجيل الدخول', profile: 'ملفي الشخصي', notreCollection: 'مجموعتنا',
          buyNow: 'اشتري الآن', buyNowNote: 'املأ النموذج وسنتصل بك في أقرب وقت ممكن!',
          addToCart: 'أضف إلى السلة', addedToCart: '✨ تمت الإضافة', cart: 'سلة التسوق', emptyCart: 'سلة التسوق فارغة.',
          total: 'المجموع', payment: 'الدفع', delivery: 'التوصيل', fullName: 'الاسم الكامل *', ourProducts: 'منتجاتنا', phone: 'الهاتف *',
          email: 'البريد الإلكتروني *', address: 'العنوان *', yourOrder: 'طلبك', cancel: 'إلغاء', confirm: 'تأكيد',
          orderConfirmed: '✅ تم تأكيد الطلب!', cartEmptyWarning: '🛒 السلة فارغة', error: '❌ خطأ', details: 'التفاصيل',
          close: 'إغلاق', loading: 'جاري التحميل...', noProducts: 'لا توجد عطور', errorLoading: '❌ خطأ',
          reload: 'إعادة تحميل', removed: '🗑️ تمت الإزالة', collectionLabel: 'مجموعتنا', collectionTitle: 'العطور',
          exclusive: 'الحصرية', men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال', allTab: 'الكل', menTab: 'رجالي', womenTab: 'نسائي', unisexTab: 'للجنسين', kidsTab: 'أطفال', inspiresTab: 'عطور مستوحاة', voitureTab: 'معطرات سيارات', ambianceTab: 'معطرات أجواء', muscTab: 'مسك', accessoiresTab: 'إكسسوارات',
          searchPlaceholder: 'البحث عن عطر...',
          footerDescription: "نقدم لكم عالماً من العطور الفاخرة، بروائح أنيقة وعفوية، تلامس المشاعر وتترك انطباعاً دائماً.",
          footerPerfumesTitle: "العطور", footerMen: "رجالي", footerWomen: "نسائي", footerUnisex: "للجنسين", footerKids: "أطفال",
          footerNew: "الوافدون الجدد", footerContactTitle: "اتصل بنا", footerAddress: "تونس، تونس", footerPhone: "366 163 96 216+",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 روزا للعطور. جميع الحقوق محفوظة."
        }
      };

      function translatePage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.style.textAlign = lang === 'ar' ? 'right' : 'left';
        const names = { fr: 'FRANÇAIS', en: 'ENGLISH', ar: 'العربية' };
        const langSpan = document.getElementById('currentLangText');
        if (langSpan) langSpan.textContent = names[lang];
        if (window.RosaCollections) window.RosaCollections.setLang(lang);
        document.querySelectorAll('[data-translate]').forEach(el => {
          const key = el.getAttribute('data-translate');
          if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = translations[lang][key];
            else el.textContent = translations[lang][key];
          }
        });
        if (typeof renderProducts === 'function' && allProductsData.length > 0) renderProducts();
        if (typeof renderCart === 'function') renderCart();
      }

      let cart = JSON.parse(localStorage.getItem('RosaFragrances_cart')) || [];
      const productGrid = document.getElementById('productGrid');
      const loadingEl = document.getElementById('loadingProducts');
      const cartSidebar = document.getElementById('cartSidebar');
      const cartOverlay = document.getElementById('cartOverlay');
      const cartToggle = document.getElementById('cartToggle');
      const closeCartBtn = document.getElementById('closeCartBtn');
      const cartCountSpan = document.getElementById('cartCount');
      const cartItemsContainer = document.getElementById('cartItemsContainer');
      const cartTotalSpan = document.getElementById('cartTotalPrice');
      const toast = document.getElementById('toast');
      const checkoutBtn = document.getElementById('checkoutBtn');
      const menuToggle = document.getElementById('menuToggle');
      const navLinks = document.getElementById('navLinks');
      const menuOverlay = document.getElementById('menuOverlay');
      const searchInput = document.getElementById('searchInput');
      const searchDropdown = document.getElementById('searchDropdown');
      const searchWrapper = document.querySelector('.search-wrapper');

      function showToast(msgKey, productName = '') {
        if (!toast) return;
        let msg = translations[currentLanguage][msgKey] || msgKey;
        if (productName) msg = msg.replace('✨', '✨ ') + ' ' + productName;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }

      function formatPrice(p) { var n = parseFloat(p); if (!isFinite(n)) return ''; return n.toFixed(3).replace('.', ',') + ' TND'; }
      // Guarantees a card can always render: name as string, price as number (or null), image resolved
      // from images[]/image/image_url no matter which shape a cached row or query happened to have.
      function normalizeProduct(p) {
        if (!p || typeof p !== 'object') return null;
        var firstImage = '';
        if (Array.isArray(p.images)) firstImage = p.images[0] || '';
        else if (typeof p.images === 'string' && p.images) {
          try { var arr = JSON.parse(p.images); if (Array.isArray(arr)) firstImage = arr[0] || ''; } catch (e) {}
        }
        if (!firstImage && typeof p.image === 'string') firstImage = p.image;
        if (!firstImage && typeof p.image_url === 'string') firstImage = p.image_url;
        var nm = (p.name == null) ? '' : String(p.name);
        if (nm === 'NaN' || nm === 'undefined' || nm === 'null') nm = '';
        var pr = parseFloat(p.price);
        return Object.assign({}, p, { name: nm, price: isFinite(pr) ? pr : null, image: firstImage });
      }
      function normalizeList(list) { return (Array.isArray(list) ? list : []).map(normalizeProduct).filter(Boolean); }
      function promoPriceHtml(row) {
        // STE-style promo: struck old price before current price
        try { return RP.priceHtml(row, formatPrice); } catch (e) {}
        try {
          var op = row.old_price != null ? parseFloat(row.old_price) : NaN;
          var cp = parseFloat(row.price);
          if (isFinite(op) && isFinite(cp) && op > cp) {
            return '<s style="opacity:.5;font-weight:300;font-size:.8em;margin-inline-end:7px;">' + formatPrice(op) + '</s>' + formatPrice(cp);
          }
        } catch (e) {}
        return formatPrice(row.price);
      }
      function calculateTotal() { return cart.reduce((s, i) => s + (i.price * i.quantity), 0); }
      function deliveryFee() {
        return (window.RosaShop && typeof window.RosaShop.deliveryFee === 'function')
          ? window.RosaShop.deliveryFee() : 0;
      }
      /* what the customer actually pays: goods + delivery (delivery is 0 by default) */
      function orderTotal() { return calculateTotal() + (cart.length ? deliveryFee() : 0); }
      window.addEventListener('rosa-shop-ready', function () { try { renderCart(); } catch (e) {} });
      function updateCartCount() { const total = cart.reduce((a, i) => a + (i.quantity || 1), 0); if (cartCountSpan) cartCountSpan.textContent = total; }
      function saveCart() { localStorage.setItem('RosaFragrances_cart', JSON.stringify(cart)); updateCartCount(); renderCart(); }
      function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }

      function renderCart() {
        if (!cartItemsContainer) return;
        if (cart.length === 0) {
          cartItemsContainer.innerHTML = `<div class="empty-cart-message">${translations[currentLanguage].emptyCart}</div>`;
          if (cartTotalSpan) cartTotalSpan.textContent = '0,000 TND';
          return;
        }
        let html = '', total = 0;
        cart.forEach(item => {
          const sub = item.price * (item.quantity || 1);
          total += sub;
          html += `<div class="cart-item" data-id="${item.id}">
            <div class="cart-item-icon">${item.image ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async">` : `<i class="fas fa-crown"></i>`}</div>
            <div class="cart-item-info">
              <div class="cart-item-title">${escapeHtml(item.name)}${item.variant ? ` <span class="cart-item-sub">(${escapeHtml(item.variant)})</span>` : ''}</div>
              <div class="cart-item-price">${formatPrice(item.price)}</div>
              <div class="cart-item-quantity">
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.quantity || 1}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
              </div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
          </div>`;
        });
        if (deliveryFee() > 0) {
          html += '<div style="display:flex;justify-content:space-between;padding:6px 2px;font-size:0.85rem"><span>' + translations[currentLanguage].delivery + '</span><span>' + formatPrice(deliveryFee()) + '</span></div>';
        }
        cartItemsContainer.innerHTML = html;
        if (cartTotalSpan) cartTotalSpan.textContent = formatPrice(total + deliveryFee());
      }

      function addToCart(id, name, price, icon, image, quantityLeft, variantLabel) {
        const lineId = variantLabel ? (id + '::' + variantLabel) : id;
        const existing = cart.find(i => i.id === lineId);
        if (existing) {
          if (quantityLeft != null && existing.quantity >= quantityLeft) { showToast('outOfStock'); return; }
          existing.quantity = (existing.quantity || 1) + 1;
        }
        else cart.push({ id: lineId, productId: id, variant: variantLabel || '', name, price, icon: icon || 'fa-crown', image, quantity: 1 });
        saveCart();
        showToast('addedToCart', name);
        if (window.RosaPixel) window.RosaPixel.addToCart({ productId: id, name: name, price: price, variant: variantLabel, quantity: 1 });
      }

      function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveCart(); showToast('removed'); }
      function updateQuantity(id, action) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        if (action === 'increase') item.quantity = (item.quantity || 1) + 1;
        else if (action === 'decrease') {
          if (item.quantity > 1) item.quantity -= 1;
          else { removeFromCart(id); return; }
        }
        saveCart();
      }

      function openCart() { cartSidebar?.classList.add('open'); cartOverlay?.classList.add('active'); }
      function closeCart() { cartSidebar?.classList.remove('open'); cartOverlay?.classList.remove('active'); }

      window.filterProducts = function (category) {
        currentFilter = category;
        // was a hardcoded index map covering only five tabs, so Inspires,
        // Voiture, Ambiance, Musc and Accessoires never got highlighted
        document.querySelectorAll('#catTabs .tab').forEach(tab => {
          tab.classList.toggle('active', tab.dataset.category === category);
        });
        renderProducts();
      };

      function updateSearchDropdown() {
        const searchTerm = searchInput?.value.toLowerCase().trim() || '';
        if (!searchTerm || searchTerm.length < 2) {
          if (searchDropdown) searchDropdown.classList.remove('show');
          if (searchDropdown) searchDropdown.innerHTML = '';
          return;
        }
        const matchingProducts = allProductsData.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm)
        ).slice(0, 8);
        if (matchingProducts.length === 0) {
          if (searchDropdown) searchDropdown.innerHTML = `<div class="search-no-results">Aucun parfum trouvé pour "${escapeHtml(searchTerm)}"</div>`;
          if (searchDropdown) searchDropdown.classList.add('show');
          return;
        }
        const categoryNames = { man: 'Homme', women: 'Femme', unisexe: 'Unisexe', kids: 'Enfants' };
        let html = '';
        matchingProducts.forEach(product => {
          let firstImage = '';
          if (product.images) {
            try {
              const imgArr = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
              firstImage = Array.isArray(imgArr) ? imgArr[0] || '' : '';
            } catch (e) { firstImage = ''; }
          }
          if (!firstImage && product.image) firstImage = product.image;
          const imgHtml = firstImage ? `<img src="${firstImage}" alt="${escapeHtml(product.name)}">` : `<i class="fas fa-crown"></i>`;
          const categoryName = categoryNames[product.category] || product.category;
          html += `
            <div class="search-result-item" onclick="window.location.href='product.html?id=${product.id}'">
              <div class="search-result-img">${imgHtml}</div>
              <div class="search-result-info">
                <div class="search-result-name">${escapeHtml(product.name)}</div>
                <div class="search-result-brand">${escapeHtml(product.brand)}</div>
                <div class="search-result-category"><i class="fas fa-tag"></i> ${categoryName}</div>
              </div>
              <div class="search-result-price">${formatPrice(product.price)}</div>
            </div>
          `;
        });
        if (searchDropdown) {
          searchDropdown.innerHTML = html;
          searchDropdown.classList.add('show');
        }
      }

      function hideSearchDropdown() {
        setTimeout(() => { if (searchDropdown) searchDropdown.classList.remove('show'); }, 200);
      }

      
 function rosaSaveCache(key, data) { try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {} }

 function paintCachedProducts() {
   try {
     const raw = localStorage.getItem('rosa_cache_all');
     if (!raw) return false;
     const obj = JSON.parse(raw);
     const data = obj && obj.data;
     if (!Array.isArray(data) || !data.length || Date.now() - (obj.ts || 0) > 86400000) return false;
     allProductsData = normalizeList(data);
     hideEmptyTabs(allProductsData);
     renderProducts();
     if (loadingEl) loadingEl.style.display = 'none';
     return true;
   } catch (e) { return false; }
 }

 function hideEmptyTabs(list) {
   /* Five of the ten category tabs had zero products, so tapping them landed on
      a blank page. A tab is hidden only when the catalogue actually loaded and
      that category counts zero - it comes back by itself the moment the owner
      adds stock, no deploy needed. Never hides "Tous". */
   try {
     var tabs = document.querySelectorAll('#catTabs .tab[data-category]');
     if (!tabs.length || !Array.isArray(list) || !list.length) return;
     var counts = {};
     list.forEach(function (p) {
       var c = p && p.category ? String(p.category).trim().toLowerCase() : '';
       if (c) counts[c] = (counts[c] || 0) + 1;
     });
     var any = 0;
     Object.keys(counts).forEach(function (k) { any += counts[k]; });
     if (!any) return;
     var activeHidden = false;
     for (var i = 0; i < tabs.length; i++) {
       var cat = tabs[i].dataset.category;
       if (!cat || cat === 'all') continue;
       var n = counts[cat] || 0;
       tabs[i].style.display = n > 0 ? '' : 'none';
       if (n === 0 && tabs[i].classList.contains('active')) activeHidden = true;
     }
     if (activeHidden && typeof window.filterProducts === 'function') window.filterProducts('all');
   } catch (e) {}
 }

async function loadProducts() {
        if (loadingEl) loadingEl.style.display = 'block';
        try {
          const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
          if (error) throw error;
          allProductsData = normalizeList(data);
          hideEmptyTabs(allProductsData);
          renderProducts();
 rosaSaveCache('rosa_cache_all', allProductsData);
        } catch (err) {
          console.error(err);
          const __hasCards = productGrid && productGrid.querySelector('.product-card'); if (!__hasCards && productGrid) productGrid.innerHTML = `<div class="empty-cart-message">${translations[currentLanguage].errorLoading}<br><button onclick="location.reload()" style="margin-top:0.8rem;padding:0.4rem 0.8rem;background:var(--gold);color:white;border:none;border-radius:50px;font-size:0.7rem;">${translations[currentLanguage].reload}</button></div>`;
        } finally {
          if (loadingEl) loadingEl.style.display = 'none';
        }
      }

      function productCardHtml(p) {
        const __vs = VR.parse(p.variants);
        const __vf = __vs.length ? (__vs.find(v => VR.inStock(p, v)) || __vs[0]) : null;
        const __chip = __vs.length ? `<div class="variant-chip">${VR.esc(__vs.map(v => v.label).join(' / '))}</div>` : '';
        const __badge = RP.badge(p);
        const imgHtml = p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async">` : `<i class="fas fa-crown"></i>`;
        return `<div class="product-card" data-product-id="${p.id}">
            <div class="product-clickable" data-product-id="${p.id}">
              <div class="product-img">${imgHtml}${__badge}</div>
              <div class="product-title">${escapeHtml(p.name)}</div>
              <div class="product-brand">${escapeHtml(p.brand)}</div>
              <div class="product-price">${promoPriceHtml(p)}</div>
              ${__chip}
            </div>
            <div class="rp-buy-row">
            <button class="buy-now-btn rp-buy-btn" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${__vf ? VR.priceFor(p, __vf) : p.price}" data-variant="${__vf ? VR.esc(__vf.label) : ''}" data-image="${p.image || ''}">${translations[currentLanguage].buyNow}</button>
            <button type="button" class="rp-cart-btn rp-add-btn" title="${translations[currentLanguage].addToCart}" aria-label="${translations[currentLanguage].addToCart}"
                data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${__vf ? VR.priceFor(p, __vf) : p.price}" data-variant="${__vf ? VR.esc(__vf.label) : ''}" data-image="${p.image || ''}">
                ${RP.buyIcon()}
            </button>
            </div>
          </div>`;
      }

      const GROUP_OTHERS_LABEL = { fr: 'Autres', en: 'Others', ar: 'أخرى' };

      function groupHeadHtml(label, count) {
        return `<div class="product-group-head">
            <h3>${escapeHtml(label)}</h3>
            <span class="group-rule"></span>
            <span class="group-count">${count}</span>
          </div>`;
      }

      function renderProducts() {
        if (!productGrid) return;
        let filteredProducts = allProductsData;
        if (currentFilter !== 'all') {
          filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
        }
        if (!filteredProducts || filteredProducts.length === 0) {
          productGrid.classList.remove('grouped');
          productGrid.innerHTML = `<div class="empty-cart-message">${translations[currentLanguage].noProducts}</div>`;
          return;
        }
        if (currentFilter === 'all') {
          // "Tous" used to be one 41-card stream: now one labelled grid per
          // category, in the order the client's own tabs are written.
          const order = [];
          document.querySelectorAll('#catTabs .tab').forEach(tab => {
            const key = tab.dataset.category;
            if (key && key !== 'all' && !order.some(g => g.key === key)) {
              order.push({ key: key, label: tab.textContent.trim() });
            }
          });
          const placed = new Set();
          let html = '';
          order.forEach(g => {
            const items = filteredProducts.filter(p => p.category === g.key);
            if (!items.length) return;
            items.forEach(p => placed.add(p.id));
            html += `<div class="product-group">${groupHeadHtml(g.label, items.length)}<div class="product-grid">${items.map(productCardHtml).join('')}</div></div>`;
          });
          const rest = filteredProducts.filter(p => !placed.has(p.id));
          if (rest.length) {
            const label = GROUP_OTHERS_LABEL[currentLanguage] || GROUP_OTHERS_LABEL.fr;
            html += `<div class="product-group">${groupHeadHtml(label, rest.length)}<div class="product-grid">${rest.map(productCardHtml).join('')}</div></div>`;
          }
          productGrid.classList.add('grouped');
          productGrid.innerHTML = html;
        } else {
          productGrid.classList.remove('grouped');
          productGrid.innerHTML = filteredProducts.map(productCardHtml).join('');
        }
        document.querySelectorAll('.product-clickable').forEach(el => {
          el.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) return;
            window.location.href = `product.html?id=${el.dataset.productId}`;
          });
        });
        document.querySelectorAll('.buy-now-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openBuyNow(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price), btn.dataset.image, btn.dataset.variant);
          });
        });
        document.querySelectorAll('.rp-add-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.disabled) return;
const __arr = (typeof allProductsData !== 'undefined' && allProductsData) || (typeof allProducts !== 'undefined' && allProducts) || (typeof products !== 'undefined' && products) || (typeof allProductsData !== 'undefined' && allProductsData) || [];
            const prod = __arr.find(x => x.id == btn.dataset.id);
            if (!prod) return;
            const _v = (window.RosaVariants && window.RosaVariants.parse(prod.variants).find(x => x.label === btn.dataset.variant)) || null;
            let _left = window.RosaVariants ? window.RosaVariants.stockOf(prod, _v) : prod.quantity;
            if (_left == null) _left = prod.quantity;
            addToCart(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price), prod.icon, btn.dataset.image, _left, btn.dataset.variant);
          });
        });
      }

      if (searchInput && searchWrapper) {
        searchInput.addEventListener('input', updateSearchDropdown);
        searchInput.addEventListener('focus', updateSearchDropdown);
        document.addEventListener('click', (e) => {
          if (searchWrapper && !searchWrapper.contains(e.target)) {
            hideSearchDropdown();
          }
        });
      }

      if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
          const rm = e.target.closest('.cart-item-remove');
          if (rm) { removeFromCart(rm.dataset.id); return; }
          const qtyBtn = e.target.closest('.quantity-btn');
          if (qtyBtn) updateQuantity(qtyBtn.dataset.id, qtyBtn.dataset.action);
        });
      }
      if (cartToggle) cartToggle.addEventListener('click', openCart);
      if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
      if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

      checkoutBtn?.addEventListener('click', async () => {
        if (cart.length === 0) { showToast('cartEmptyWarning'); return; }
        if (window.RosaPixel) window.RosaPixel.initiateCheckout(cart);
        const { data: { user } } = await supabase.auth.getUser();
        const loggedDiv = document.getElementById('loggedInEmailDisplay');
        if (user) {
          if (loggedDiv) loggedDiv.style.display = 'block';
          const displaySpan = document.getElementById('displayEmail');
          if (displaySpan) displaySpan.textContent = user.email;
        } else {
          if (loggedDiv) loggedDiv.style.display = 'none';
        }
        const modalCartItems = document.getElementById('modalCartItems');
        if (modalCartItems) {
          modalCartItems.innerHTML = cart.map(i => `<div style="display:flex;justify-content:space-between;padding:5px 0;"><span>${escapeHtml(i.name)} x${i.quantity}</span><span>${(i.price * i.quantity).toFixed(3).replace('.', ',')} TND</span></div>`).join('');
        }
        if (deliveryFee() > 0) {
          var dBox = document.getElementById('modalCartItems');
          if (dBox) dBox.innerHTML += '<div style="display:flex;justify-content:space-between;padding:5px 0"><span>' + translations[currentLanguage].delivery + '</span><span>' + deliveryFee().toFixed(3).replace('.', ',') + ' TND</span></div>';
        }
        document.getElementById('modalTotal').textContent = orderTotal().toFixed(3).replace('.', ',') + ' TND';
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) checkoutModal.style.display = 'flex';
      });


      /* === BUY NOW (ambra.tn pattern): card/product button -> same checkout modal, single item === */
      let buyNowItem = null; // when set, processOrder submits ONLY this item and never touches the cart
      window.openBuyNow = function (id, name, price, image, variant) {
        if (window.RosaPixel) window.RosaPixel.initiateCheckout([{ productId: id, name: name, price: price, variant: variant, quantity: 1 }]);
        buyNowItem = { id, name, price, quantity: 1, image: image || '', variant: variant || '' };
        const noteEl = document.getElementById('buyNowNote');
        if (noteEl) { noteEl.textContent = translations[currentLanguage].buyNowNote; noteEl.style.display = 'block'; }
        const badgeEl = document.getElementById('buyNowBadge');
        if (badgeEl) { badgeEl.textContent = '⚡ ' + translations[currentLanguage].buyNow; badgeEl.style.display = 'inline'; }
        const cartTitle = document.getElementById('cartModeTitle');
        if (cartTitle) cartTitle.style.display = 'none';
        document.getElementById('modalCartItems').innerHTML = '<div style="display:flex;justify-content:space-between;padding:5px 0;"><span>' + escapeHtml(name) + (variant ? ' <span class="cart-item-sub">(' + escapeHtml(variant) + ')</span>' : '') + ' x1</span><span>' + price.toFixed(3).replace('.', ',') + ' TND</span></div>';
        if (deliveryFee() > 0) {
          var dBox = document.getElementById('modalCartItems');
          if (dBox) dBox.innerHTML += '<div style="display:flex;justify-content:space-between;padding:5px 0"><span>' + translations[currentLanguage].delivery + '</span><span>' + deliveryFee().toFixed(3).replace('.', ',') + ' TND</span></div>';
        }
        document.getElementById('modalTotal').textContent = (price + deliveryFee()).toFixed(3).replace('.', ',') + ' TND';
        document.getElementById('checkoutModal').style.display = 'flex';
      };
      window.closeBuyNow = function () { buyNowItem = null; closeCheckoutModal(); };

      window.processOrder = async (event) => {
        event.preventDefault();
        const btn = document.getElementById('submitOrderBtn');
        if (btn) btn.disabled = true;
        if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
          const { data: { user } } = await supabase.auth.getUser();
          const email = user ? user.email : null;
          const orderData = {
            items: buyNowItem ? [{ name: buyNowItem.name, quantity: 1, price: buyNowItem.price, id: buyNowItem.id, variant: buyNowItem.variant || null }] : cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, id: item.productId || item.id, variant: item.variant || null })),
            total: buyNowItem ? (buyNowItem.price + deliveryFee()) : orderTotal(),
            customer_name: document.getElementById('customerName').value,
            customer_phone: document.getElementById('customerPhone').value,
            customer_email: email,
            shipping_address: document.getElementById('shippingAddress').value,
            status: 'pending',
            user_id: user ? user.id : null
          };
          const { error: orderError } = await supabase.from('orders').insert([orderData]);
          if (orderError) throw orderError;
          if (window.RosaPixel) window.RosaPixel.purchase(orderData.items, orderData.total);
          const orderId = null;
          try {
            const { error: emailError } = await supabase.functions.invoke('send-order-email', { body: { order: { ...orderData, id: orderId } } });
            if (emailError) console.error('Email sending error:', emailError);
          } catch (emailErr) {
            console.error('Email function not available:', emailErr);
          }
          if (buyNowItem) {
            buyNowItem = null;
            closeCheckoutModal();
          } else {
            cart = [];
            localStorage.removeItem('RosaFragrances_cart');
            saveCart();
            closeCheckoutModal();
            closeCart();
          }
          showToast('orderConfirmed');
        } catch (error) {
          console.error('Order error:', error);
          showToast('error');
        } finally {
          if (btn) btn.disabled = false;
          if (btn) btn.innerHTML = translations[currentLanguage].confirm;
        }
      };

      document.getElementById('checkoutForm')?.addEventListener('submit', window.processOrder);
      window.closeCheckoutModal = () => {  const noteEl = document.getElementById('buyNowNote'); if (noteEl) noteEl.style.display = 'none'; const badgeEl = document.getElementById('buyNowBadge'); if (badgeEl) badgeEl.style.display = 'none'; const cartTitle = document.getElementById('cartModeTitle'); if (cartTitle) cartTitle.style.display = 'inline'; buyNowItem = null; const modal = document.getElementById('checkoutModal'); if (modal) modal.style.display = 'none';  };
      window.closeProductModal = function () { const modal = document.getElementById('productModal'); if (modal) modal.style.display = 'none'; };

      let updateUserTimeout, isUpdatingUser = false;
      async function updateUserDisplay() {
        if (isUpdatingUser) return;
        isUpdatingUser = true;
        try {
          const { data: { user } } = await supabase.auth.getUser();
          const authLink = document.getElementById('authLink'), profileLink = document.getElementById('profileLink'), adminLink = document.getElementById('adminLink');
          if (user) {
            if (authLink) authLink.style.display = 'none';
            if (profileLink) profileLink.style.display = 'block';
            if (user.email === 'azmmeli146@gmail.com') { if (adminLink) adminLink.style.display = 'block'; }
            else { if (adminLink) adminLink.style.display = 'none'; }
          } else {
            if (authLink) authLink.style.display = 'block';
            if (profileLink) profileLink.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
          }
        } catch (error) { console.error('Error checking user:', error); }
        finally { isUpdatingUser = false; }
      }
      updateUserDisplay();
      supabase.auth.onAuthStateChange((event, session) => {
        if (['SIGNED_IN', 'SIGNED_OUT', 'INITIAL_SESSION'].includes(event)) {
          if (updateUserTimeout) clearTimeout(updateUserTimeout);
          updateUserTimeout = setTimeout(() => updateUserDisplay(), 100);
        }
      });

      function toggleMenu() {
        if (navLinks) navLinks.classList.toggle('active');
        if (menuOverlay) menuOverlay.classList.toggle('active');
        document.body.style.overflow = (navLinks && navLinks.classList.contains('active')) ? 'hidden' : '';
        if (navLinks && navLinks.classList.contains('active')) closeCart();
      }
      if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
      if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

      const langMenu = document.getElementById('langMenu');
      const langCurrentBtn = document.getElementById('langCurrentBtn');
      if (langCurrentBtn) langCurrentBtn.addEventListener('click', (e) => { e.stopPropagation(); if (langMenu) langMenu.classList.toggle('active'); });
      document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => { translatePage(opt.dataset.lang); if (langMenu) langMenu.classList.remove('active'); });
      });
      document.addEventListener('click', (e) => { if (langMenu && !langMenu.contains(e.target)) langMenu.classList.remove('active'); });

      translatePage(currentLanguage);
      paintCachedProducts(); supabase.auth.refreshSession().then(() => { loadProducts(); saveCart(); });

      // Returning from the admin page can restore a stale, half-hydrated snapshot from the
      // browser's back/forward cache. Force a repaint + refetch whenever the page is restored.
      window.addEventListener('pageshow', function (e) {
        if (!e.persisted) return;
        try {
          if (!allProductsData.length) paintCachedProducts();
          else renderProducts();
          if (typeof renderCart === 'function') renderCart();
          loadProducts();
        } catch (err) {}
      });

      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      // threshold:0 breaks on tall grids (e.g. 7700px grid in a 700px viewport:
      // 10% of the element can NEVER be 50%-visible, so cards stay at opacity:0 forever).
      // threshold:0 fires the moment ANY pixel of the element enters the shrunken root.
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } });
      }, { threshold: 0, rootMargin: '0px 0px -50px 0px' });
      revealElements.forEach(el => observer.observe(el));
    })();

    function initTheme() {
      const saved = localStorage.getItem('theme') || 'light';
      if (saved === 'dark') {
        document.body.classList.add('dark');
        const sunIcon = document.querySelector('#themeToggle .fa-sun');
        const moonIcon = document.querySelector('#themeToggle .fa-moon');
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'inline-block';
      }
    }
    function toggleTheme() {
      if (document.body.classList.contains('dark')) {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        const sunIcon = document.querySelector('#themeToggle .fa-sun');
        const moonIcon = document.querySelector('#themeToggle .fa-moon');
        if (sunIcon) sunIcon.style.display = 'inline-block';
        if (moonIcon) moonIcon.style.display = 'none';
      } else {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        const sunIcon = document.querySelector('#themeToggle .fa-sun');
        const moonIcon = document.querySelector('#themeToggle .fa-moon');
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'inline-block';
      }
    }
    document.addEventListener('DOMContentLoaded', () => {
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
      initTheme();
    });
  