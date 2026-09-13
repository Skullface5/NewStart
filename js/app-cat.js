
    (function () {
      const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
      const supabase = window.__rosaSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      let currentLanguage = localStorage.getItem('language') || 'fr';

      const translations = {
        fr: {
          home: 'ACCUEIL', women: 'FEMME', unisex: 'UNISEXE', kids: 'ENFANTS',
          login: 'Se connecter', profile: 'Mon Profil', back: 'Retour à l\'accueil',
          menCat: 'Parfums Homme', menDesc: 'Des fragrances boisées, épicées et audacieuses qui révèlent votre caractère et votre élégance.',
          addToCart: 'Ajouter', addedToCart: '✨ Article ajouté', cart: 'Panier', emptyCart: 'Votre panier est vide.',
          total: 'Total', payment: 'PAIEMENT', delivery: 'Livraison', fullName: 'Nom complet *',
          phone: 'Téléphone *', email: 'Email *', address: 'Adresse *', yourOrder: 'Votre commande',
          cancel: 'Annuler', confirm: 'Confirmer', orderConfirmed: '✅ Commande confirmée!',
          cartEmptyWarning: '🛒 Panier vide', error: '❌ Erreur', details: 'Détails', close: 'Fermer',
          loading: 'Chargement...', noProducts: 'Aucun parfum disponible', errorLoading: '❌ Erreur', reload: 'Recharger', removed: '🗑️ Retiré',
          filters: 'Filtrer', searchPlaceholder: 'Rechercher un parfum par nom ou marque...',
          brand: 'Marque', allBrands: 'Toutes les marques',
          season: 'Saison', allSeasons: 'Toutes saisons', summer: 'Été', winter: 'Hiver', spring: 'Printemps', autumn: 'Automne',
          availability: 'Disponibilité', inStock: 'En stock', lowStock: 'Stock faible', outOfStock: 'Rupture',
          sort: 'Trier', nameAZ: 'Nom (A à Z)', nameZA: 'Nom (Z à A)', priceAsc: 'Prix (croissant)', priceDesc: 'Prix (décroissant)',
          reset: 'Réinitialiser', all: 'Tous',
          footerDescription: "Nous vous proposons un univers de parfums luxueux, aux senteurs élégantes et spontanées, qui touchent les émotions et laissent une impression durable.",
          footerPerfumesTitle: "Parfums", footerMen: "Homme", footerWomen: "Femme", footerUnisex: "Unisexe", footerKids: "Enfants",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisie", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. Tous droits réservés."
        },
        en: {
          home: 'HOME', women: 'WOMEN', unisex: 'UNISEX', kids: 'KIDS',
          login: 'Sign in', profile: 'My Profile', back: 'Back to home',
          menCat: 'Men Perfumes', menDesc: 'Woody, spicy and bold fragrances that reveal your character and elegance.',
          addToCart: 'Add to cart', addedToCart: '✨ Added to cart', cart: 'Cart', emptyCart: 'Your cart is empty.',
          total: 'Total', payment: 'PAYMENT', delivery: 'Delivery', fullName: 'Full name *',
          phone: 'Phone *', email: 'Email *', address: 'Address *', yourOrder: 'Your order',
          cancel: 'Cancel', confirm: 'Confirm', orderConfirmed: '✅ Order confirmed!',
          cartEmptyWarning: '🛒 Cart is empty', error: '❌ Error', details: 'Details', close: 'Close',
          loading: 'Loading...', noProducts: 'No perfumes available', errorLoading: '❌ Error', reload: 'Reload', removed: '🗑️ Removed',
          filters: 'Filter', searchPlaceholder: 'Search perfume by name or brand...',
          brand: 'Brand', allBrands: 'All brands',
          season: 'Season', allSeasons: 'All seasons', summer: 'Summer', winter: 'Winter', spring: 'Spring', autumn: 'Autumn',
          availability: 'Availability', inStock: 'In stock', lowStock: 'Low stock', outOfStock: 'Out of stock',
          sort: 'Sort', nameAZ: 'Name (A to Z)', nameZA: 'Name (Z to A)', priceAsc: 'Price (low to high)', priceDesc: 'Price (high to low)',
          reset: 'Reset', all: 'All',
          footerDescription: "We offer you a world of luxurious perfumes, with elegant and spontaneous scents, that touch the emotions and leave a lasting impression.",
          footerPerfumesTitle: "Perfumes", footerMen: "Men", footerWomen: "Women", footerUnisex: "Unisex", footerKids: "Kids",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisia", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. All rights reserved."
        },
        ar: {
          home: 'الرئيسية', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال',
          login: 'تسجيل الدخول', profile: 'ملفي الشخصي', back: 'العودة للرئيسية',
          menCat: 'عطور رجالية', menDesc: 'عطور خشبية وحارة وجريئة تكشف عن شخصيتك وأناقتك.',
          addToCart: 'أضف إلى السلة', addedToCart: '✨ تمت الإضافة', cart: 'سلة التسوق', emptyCart: 'سلة التسوق فارغة.',
          total: 'المجموع', payment: 'الدفع', delivery: 'التوصيل', fullName: 'الاسم الكامل *',
          phone: 'الهاتف *', email: 'البريد الإلكتروني *', address: 'العنوان *', yourOrder: 'طلبك',
          cancel: 'إلغاء', confirm: 'تأكيد', orderConfirmed: '✅ تم تأكيد الطلب!',
          cartEmptyWarning: '🛒 السلة فارغة', error: '❌ خطأ', details: 'التفاصيل', close: 'إغلاق',
          loading: 'جاري التحميل...', noProducts: 'لا توجد عطور', errorLoading: '❌ خطأ', reload: 'إعادة تحميل', removed: '🗑️ تمت الإزالة',
          filters: 'تصفية', searchPlaceholder: 'البحث عن عطر بالاسم أو العلامة...',
          brand: 'العلامة', allBrands: 'جميع العلامات',
          season: 'الموسم', allSeasons: 'كل المواسم', summer: 'صيف', winter: 'شتاء', spring: 'ربيع', autumn: 'خريف',
          availability: 'التوفر', inStock: 'متوفر', lowStock: 'مخزون منخفض', outOfStock: 'غير متوفر',
          sort: 'ترتيب', nameAZ: 'الاسم (أ إلى ي)', nameZA: 'الاسم (ي إلى أ)', priceAsc: 'السعر (من الأقل إلى الأعلى)', priceDesc: 'السعر (من الأعلى إلى الأقل)',
          reset: 'إعادة تعيين', all: 'الكل',
          footerDescription: "نقدم لكم عالماً من العطور الفاخرة، بروائح أنيقة وعفوية، تلامس المشاعر وتترك انطباعاً دائماً.",
          footerPerfumesTitle: "العطور", footerMen: "رجالي", footerWomen: "نسائي", footerUnisex: "للجنسين", footerKids: "أطفال",
          footerContactTitle: "اتصل بنا", footerAddress: "تونس، تونس", footerPhone: "366 163 96 216+",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 روزا للعطور. جميع الحقوق محفوظة."
        }
      };

      // ============================================================
      // Generic category page (?cat=slug) — whitelist + labels FR/EN/AR
      // Mirrors js/app-collections.js SPEC-hero-collections.md
      // ============================================================
      const CATEGORY_LABELS = {
        inspires: {
          fr: { name: 'Parfums inspirés', desc: 'Nos interprétations des grandes signatures de la parfumerie mondiale, recomposées avec passion.' },
          en: { name: 'Inspired perfumes', desc: 'Our takes on the world\'s great signature fragrances, recreated with passion.' },
          ar: { name: 'عطور مستوحاة', desc: 'تفسيراتنا لأشهر العطور العالمية، أعيد تركيبها بشغف.' }
        },
        voiture: {
          fr: { name: 'Parfums pour voiture', desc: "Des parfums d'auto qui transforment chaque trajet en une expérience sensorielle élégante." },
          en: { name: 'Car perfumes', desc: 'Car fragrances that turn every drive into an elegant sensorial experience.' },
          ar: { name: 'عطور السيارات', desc: 'عطور للسيارة تجعل كل رحلة تجربة حسية أنيقة.' }
        },
        ambiance: {
          fr: { name: "Parfums d'ambiance", desc: "Des parfums d'intérieur qui habillent votre maison de notes chaleureuses et raffinées." },
          en: { name: 'Home fragrances', desc: 'Home fragrances that dress your space in warm and refined notes.' },
          ar: { name: 'عطورات الجو', desc: 'عطور منزلية تضفي على فضاءاتك نفحات دافئة وراقية.' }
        },
        musc: {
          fr: { name: 'Musc', desc: 'Des muscs blancs et poudrés, délicats et enveloppants, pour un sillon pur et soyeux.' },
          en: { name: 'Musk', desc: 'Soft, powdery musks — delicate and enveloping, for a pure and silky trail.' },
          ar: { name: 'مسك', desc: 'عطور المسك الناعمة والبودرية لأثر نقي وحريري.' }
        },
        accessoires: {
          fr: { name: 'Accessoires', desc: 'Des accessoires sélectionnés pour compléter votre rituel parfumé au quotidien.' },
          en: { name: 'Accessories', desc: 'Curated accessories to complete your daily fragrance ritual.' },
          ar: { name: 'إكسسوارات', desc: 'إكسسوارات مختارة لتكمل طقوسك العطرية اليومية.' }
        }
      };
      const DEFAULT_CATEGORY = 'voiture';
      const WHITELIST = Object.keys(CATEGORY_LABELS);

      function resolveCategorySlug() {
        let raw = '';
        try { raw = (new URLSearchParams(window.location.search).get('cat') || '').trim().toLowerCase(); } catch (e) { raw = ''; }
        const slug = WHITELIST.indexOf(raw) !== -1 ? raw : DEFAULT_CATEGORY;
        try {
          const url = new URL(window.location.href);
          if ((url.searchParams.get('cat') || '').toLowerCase() !== slug) {
            url.searchParams.set('cat', slug);
            history.replaceState(null, '', url.toString());
          }
        } catch (e) { /* old browser / sandboxed: keep slug, skip URL rewrite */ }
        return slug;
      }
      const CATEGORY_SLUG = resolveCategorySlug();

      // Inject catName/catDesc into each language dict so translatePage's
      // data-translate pattern resolves them dynamically per active lang.
      ['fr', 'en', 'ar'].forEach(function (lg) {
        translations[lg].catName = CATEGORY_LABELS[CATEGORY_SLUG][lg].name;
        translations[lg].catDesc = CATEGORY_LABELS[CATEGORY_SLUG][lg].desc;
        translations[lg].notreCollection = (lg === 'fr') ? 'Notre Collection' : (lg === 'en') ? 'Our Collection' : 'مجموعتنا';
      });

      function translatePage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.style.textAlign = lang === 'ar' ? 'right' : 'left';
        const dict = translations[lang] || translations.fr;
        document.title = 'Rosa Fragrances | ' + (dict.catName || 'Parfums');
        const names = { fr: 'FRANÇAIS', en: 'ENGLISH', ar: 'العربية' };
        const langSpan = document.getElementById('currentLangText');
        if (langSpan) langSpan.textContent = names[lang];
        document.querySelectorAll('[data-translate]').forEach(el => {
          const key = el.getAttribute('data-translate');
          if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = translations[lang][key];
            else el.textContent = translations[lang][key];
          }
        });
        if (typeof renderProducts === 'function' && products.length > 0) renderProducts();
        if (typeof renderCart === 'function') renderCart();
      }

      let products = [];
      let filteredProducts = [];
      let cart = JSON.parse(localStorage.getItem('RosaFragrances_cart')) || [];
      let uniqueBrands = new Set();

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
      const filterDrawer = document.getElementById('filterDrawer');
      const filterDrawerOverlay = document.getElementById('filterDrawerOverlay');
      const openFilterDrawerBtn = document.getElementById('openFilterDrawerBtn');
      const closeDrawerBtn = document.getElementById('closeDrawerBtn');
      const brandFilterDrawer = document.getElementById('brandFilterDrawer');
      const seasonFilterDrawer = document.getElementById('seasonFilterDrawer');
      const availabilityFilterDrawer = document.getElementById('availabilityFilterDrawer');
      const sortFilterDrawer = document.getElementById('sortFilterDrawer');
      const resetFiltersDrawer = document.getElementById('resetFiltersDrawer');
      const activeFiltersContainer = document.getElementById('activeFilters');

      function openDrawer() {
        filterDrawer.classList.add('open');
        filterDrawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      function closeDrawer() {
        filterDrawer.classList.remove('open');
        filterDrawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
      openFilterDrawerBtn?.addEventListener('click', openDrawer);
      closeDrawerBtn?.addEventListener('click', closeDrawer);
      filterDrawerOverlay?.addEventListener('click', closeDrawer);

      function showToast(msgKey, productName = '') {
        if (!toast) return;
        let msg = translations[currentLanguage][msgKey] || msgKey;
        if (productName) msg = msg.replace('✨', '✨ ') + ' ' + productName;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }

      function formatPrice(p) { return parseFloat(p).toFixed(3).replace('.', ',') + ' TND'; }
      function calculateTotal() { return cart.reduce((s, i) => s + (i.price * i.quantity), 0); }
      function updateCartCount() { const total = cart.reduce((a, i) => a + (i.quantity || 1), 0); if (cartCountSpan) cartCountSpan.textContent = total; }
      function saveCart() { localStorage.setItem('RosaFragrances_cart', JSON.stringify(cart)); updateCartCount(); renderCart(); }
      function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }

      function getStockStatus(quantity) {
        if (!quantity || quantity === 0) return 'outOfStock';
        if (quantity < 5) return 'lowStock';
        return 'inStock';
      }

      function getStockIcon(quantity) {
        if (!quantity || quantity === 0) return '<i class="fas fa-times-circle"></i>';
        if (quantity < 5) return '<i class="fas fa-exclamation-triangle"></i>';
        return '<i class="fas fa-check-circle"></i>';
      }

      function parseSeasons(seasonStr) {
        if (!seasonStr || seasonStr === 'all') return ['summer', 'winter', 'spring', 'autumn'];
        return seasonStr.split(',');
      }

      function updateActiveFilters() {
        if (!activeFiltersContainer) return;
        const filters = [];
        const searchVal = searchInput?.value;
        const brandVal = brandFilterDrawer?.value;
        const seasonVal = seasonFilterDrawer?.value;
        const availabilityVal = availabilityFilterDrawer?.value;
        const sortVal = sortFilterDrawer?.value;
        if (searchVal && searchVal !== '') filters.push({ key: 'search', label: `🔍 "${searchVal.substring(0, 20)}${searchVal.length > 20 ? '...' : ''}"` });
        if (brandVal && brandVal !== 'all') filters.push({ key: 'brand', label: `🏷️ ${brandVal}` });
        if (seasonVal && seasonVal !== 'all') {
          const seasonNames = { summer: translations[currentLanguage].summer, winter: translations[currentLanguage].winter, spring: translations[currentLanguage].spring, autumn: translations[currentLanguage].autumn };
          filters.push({ key: 'season', label: `📅 ${seasonNames[seasonVal]}` });
        }
        if (availabilityVal && availabilityVal !== 'all') {
          const availNames = { inStock: translations[currentLanguage].inStock, lowStock: translations[currentLanguage].lowStock, outOfStock: translations[currentLanguage].outOfStock };
          filters.push({ key: 'availability', label: `📦 ${availNames[availabilityVal]}` });
        }
        if (sortVal && sortVal !== 'name_asc') {
          const sortNames = { name_asc: translations[currentLanguage].nameAZ, name_desc: translations[currentLanguage].nameZA, price_asc: translations[currentLanguage].priceAsc, price_desc: translations[currentLanguage].priceDesc };
          filters.push({ key: 'sort', label: `↕️ ${sortNames[sortVal]}` });
        }
        if (filters.length === 0) { activeFiltersContainer.innerHTML = ''; return; }
        activeFiltersContainer.innerHTML = filters.map(filter => `<div class="filter-tag" data-filter="${filter.key}">${filter.label}<i class="fas fa-times-circle" onclick="removeFilter('${filter.key}')"></i></div>`).join('');
      }

      window.removeFilter = function (filterKey) {
        switch (filterKey) {
          case 'search': if (searchInput) searchInput.value = ''; break;
          case 'brand': if (brandFilterDrawer) brandFilterDrawer.value = 'all'; break;
          case 'season': if (seasonFilterDrawer) seasonFilterDrawer.value = 'all'; break;
          case 'availability': if (availabilityFilterDrawer) availabilityFilterDrawer.value = 'all'; break;
          case 'sort': if (sortFilterDrawer) sortFilterDrawer.value = 'name_asc'; break;
        }
        applyFiltersAndSort();
        closeDrawer();
      };

      function applyFiltersAndSort() {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const selectedBrand = brandFilterDrawer?.value || 'all';
        const selectedSeason = seasonFilterDrawer?.value || 'all';
        const selectedAvailability = availabilityFilterDrawer?.value || 'all';
        const sortValue = sortFilterDrawer?.value || 'name_asc';

        filteredProducts = products.filter(product => {
          if (searchTerm && !product.name.toLowerCase().includes(searchTerm) && !product.brand.toLowerCase().includes(searchTerm)) return false;
          if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;
          if (selectedSeason !== 'all') {
            const productSeasons = parseSeasons(product.season);
            if (!productSeasons.includes(selectedSeason)) return false;
          }
          const stockStatus = getStockStatus(product.quantity);
          if (selectedAvailability !== 'all' && stockStatus !== selectedAvailability) return false;
          return true;
        });

        filteredProducts.sort((a, b) => {
          switch (sortValue) {
            case 'name_asc': return a.name.localeCompare(b.name);
            case 'name_desc': return b.name.localeCompare(a.name);
            case 'price_asc': return a.price - b.price;
            case 'price_desc': return b.price - a.price;
            default: return 0;
          }
        });
        renderProducts();
        updateActiveFilters();
      }

      function populateBrandFilter() {
        uniqueBrands.clear();
        products.forEach(product => { if (product.brand) uniqueBrands.add(product.brand); });
        const sortedBrands = Array.from(uniqueBrands).sort();
        if (brandFilterDrawer) {
          brandFilterDrawer.innerHTML = `<option value="all">${translations[currentLanguage].allBrands}</option>`;
          sortedBrands.forEach(brand => { brandFilterDrawer.innerHTML += `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`; });
        }
      }

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
                            <div class="cart-item-title">${escapeHtml(item.name)}</div>
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
        cartItemsContainer.innerHTML = html;
        if (cartTotalSpan) cartTotalSpan.textContent = formatPrice(total);
      }

      function addToCart(id, name, price, icon, image, quantityLeft) {
        if (quantityLeft <= 0) { showToast('outOfStock'); return; }
        const existing = cart.find(i => i.id === id);
        if (existing) {
          if (existing.quantity >= quantityLeft) { showToast('outOfStock'); return; }
          existing.quantity = (existing.quantity || 1) + 1;
        } else {
          cart.push({ id, name, price, icon: icon || 'fa-crown', image, quantity: 1 });
        }
        saveCart();
        showToast('addedToCart', name);
      }

      function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveCart(); showToast('removed'); }
      function updateQuantity(id, action) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        const product = products.find(p => p.id === id);
        if (action === 'increase') {
          if (product && item.quantity >= product.quantity) { showToast('outOfStock'); return; }
          item.quantity = (item.quantity || 1) + 1;
        } else if (action === 'decrease') {
          if (item.quantity > 1) item.quantity -= 1;
          else { removeFromCart(id); return; }
        }
        saveCart();
      }

      function openCart() { cartSidebar?.classList.add('open'); cartOverlay?.classList.add('active'); document.body.style.overflow = 'hidden'; }
      function closeCart() { cartSidebar?.classList.remove('open'); cartOverlay?.classList.remove('active'); document.body.style.overflow = ''; }

      
 function rosaSaveCache(key, data) { try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {} }

 function paintCachedProducts() {
   try {
     const raw = localStorage.getItem('rosa_cache_cat_' + CATEGORY_SLUG);
     if (!raw) return false;
     const obj = JSON.parse(raw);
     const data = obj && obj.data;
     if (!Array.isArray(data) || !data.length || Date.now() - (obj.ts || 0) > 86400000) return false;
     products = data;
     populateBrandFilter();
     applyFiltersAndSort();
     if (loadingEl) loadingEl.style.display = 'none';
     return true;
   } catch (e) { return false; }
 }
async function loadProducts() {
        if (loadingEl) loadingEl.style.display = 'block';
        try {
          const { data, error } = await supabase.from('products').select('*').eq('category', CATEGORY_SLUG).order('created_at', { ascending: true });
          if (error) throw error;
          products = (data || []).map(p => {
            let firstImage = '';
            if (p.images) {
              try {
                const imgArr = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
                firstImage = Array.isArray(imgArr) ? imgArr[0] || '' : '';
              } catch (e) { firstImage = ''; }
            }
            if (!firstImage && p.image) firstImage = p.image;
            return { ...p, image: firstImage };
          });
          populateBrandFilter();
          applyFiltersAndSort();
 rosaSaveCache('rosa_cache_cat_' + CATEGORY_SLUG, products);
        } catch (err) {
          console.error(err);
          const __hasCards = productGrid && productGrid.querySelector('.product-card'); if (!__hasCards && productGrid) productGrid.innerHTML = `<div class="empty-cart-message">${translations[currentLanguage].errorLoading}<br><button onclick="location.reload()" style="margin-top:0.8rem;padding:0.4rem 0.8rem;background:var(--gold);color:white;border:none;border-radius:50px;font-size:0.7rem;">${translations[currentLanguage].reload}</button></div>`;
        } finally {
          if (loadingEl) loadingEl.style.display = 'none';
        }
      }

      function renderProducts() {
        if (!productGrid) return;
        if (!filteredProducts || filteredProducts.length === 0) {
          productGrid.innerHTML = `<div class="empty-cart-message">${translations[currentLanguage].noProducts}</div>`;
          return;
        }
        let html = '';
        filteredProducts.forEach(p => {
          const imgHtml = p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async">` : `<i class="fas fa-crown"></i>`;
          const stockStatus = getStockStatus(p.quantity);
          const stockIcon = getStockIcon(p.quantity);
          const stockText = translations[currentLanguage][stockStatus];
          const isOutOfStock = stockStatus === 'outOfStock';
          html += `<div class="product-card" data-product-id="${p.id}">
                        <div class="product-clickable" data-product-id="${p.id}">
                            <div class="product-img">${imgHtml}</div>
                            <div class="product-title">${escapeHtml(p.name)}</div>
                            <div class="product-brand">${escapeHtml(p.brand)}</div>
                            <div class="product-price">${formatPrice(p.price)}</div>
                            <div class="stock-indicator ${stockStatus}">${stockIcon} ${stockText}</div>
                        </div>
                        <button class="add-to-cart ${isOutOfStock ? 'disabled' : ''}" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}" data-image="${p.image || ''}" data-quantity="${p.quantity || 0}" ${isOutOfStock ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> ${translations[currentLanguage].addToCart}
                        </button>
                    </div>`;
        });
        productGrid.innerHTML = html;
        document.querySelectorAll('.product-clickable').forEach(el => {
          el.addEventListener('click', (e) => { if (e.target.closest('.add-to-cart')) return; window.location.href = `product.html?id=${el.dataset.productId}`; });
        });
        document.querySelectorAll('.add-to-cart').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.classList.contains('disabled')) return;
            addToCart(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price), 'fa-crown', btn.dataset.image, parseInt(btn.dataset.quantity));
          });
        });
      }

      searchInput?.addEventListener('input', () => applyFiltersAndSort());
      brandFilterDrawer?.addEventListener('change', () => { applyFiltersAndSort(); closeDrawer(); });
      seasonFilterDrawer?.addEventListener('change', () => { applyFiltersAndSort(); closeDrawer(); });
      availabilityFilterDrawer?.addEventListener('change', () => { applyFiltersAndSort(); closeDrawer(); });
      sortFilterDrawer?.addEventListener('change', () => { applyFiltersAndSort(); closeDrawer(); });
      resetFiltersDrawer?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (brandFilterDrawer) brandFilterDrawer.value = 'all';
        if (seasonFilterDrawer) seasonFilterDrawer.value = 'all';
        if (availabilityFilterDrawer) availabilityFilterDrawer.value = 'all';
        if (sortFilterDrawer) sortFilterDrawer.value = 'name_asc';
        applyFiltersAndSort();
        closeDrawer();
      });

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
        const { data: { user } } = await supabase.auth.getUser();
        const emailField = document.getElementById('emailFieldGroup'), loggedDiv = document.getElementById('loggedInEmailDisplay'), emailInp = document.getElementById('customerEmail');
        if (user) {
          emailField.style.display = 'none';
          loggedDiv.style.display = 'block';
          document.getElementById('displayEmail').textContent = user.email;
          emailInp.required = false;
        } else {
          emailField.style.display = 'block';
          loggedDiv.style.display = 'none';
          emailInp.required = true;
        }
        document.getElementById('modalCartItems').innerHTML = cart.map(i => `<div style="display:flex;justify-content:space-between;padding:5px 0;"><span>${escapeHtml(i.name)} x${i.quantity}</span><span>${(i.price * i.quantity).toFixed(3).replace('.', ',')} TND</span></div>`).join('');
        document.getElementById('modalTotal').textContent = calculateTotal().toFixed(3).replace('.', ',') + ' TND';
        document.getElementById('checkoutModal').style.display = 'flex';
      });

      window.processOrder = async (event) => {
        event.preventDefault();
        const btn = document.getElementById('submitOrderBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
          const { data: { user } } = await supabase.auth.getUser();
          const email = user ? user.email : document.getElementById('customerEmail').value;
          const orderData = {
            items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, id: item.id })),
            total: calculateTotal(),
            customer_name: document.getElementById('customerName').value,
            customer_phone: document.getElementById('customerPhone').value,
            customer_email: email,
            shipping_address: document.getElementById('shippingAddress').value,
            status: 'pending',
            user_id: user ? user.id : null
          };
          const { data: orderResult, error: orderError } = await supabase.from('orders').insert([orderData]).select();
          if (orderError) throw orderError;
          const orderId = orderResult?.[0]?.id;
          try { await supabase.functions.invoke('send-order-email', { body: { order: { ...orderData, id: orderId } } }); } catch (emailErr) { console.error('Email error:', emailErr); }
          cart = [];
          localStorage.removeItem('RosaFragrances_cart');
          saveCart();
          closeCheckoutModal();
          closeCart();
          showToast('orderConfirmed');
        } catch (error) { console.error(error); showToast('error'); }
        finally { btn.disabled = false; btn.innerHTML = translations[currentLanguage].confirm; }
      };
      document.getElementById('checkoutForm')?.addEventListener('submit', window.processOrder);
      window.closeCheckoutModal = () => document.getElementById('checkoutModal').style.display = 'none';
      window.closeProductModal = function () { document.getElementById('productModal').style.display = 'none'; };

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
        } catch (error) { console.error(error); }
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
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        if (navLinks.classList.contains('active')) closeCart();
      }
      if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
      if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

      const langMenu = document.getElementById('langMenu');
      const langCurrentBtn = document.getElementById('langCurrentBtn');
      if (langCurrentBtn) langCurrentBtn.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('active'); });
      document.querySelectorAll('.lang-option').forEach(opt => { opt.addEventListener('click', () => { translatePage(opt.dataset.lang); langMenu.classList.remove('active'); }); });
      document.addEventListener('click', (e) => { if (langMenu && !langMenu.contains(e.target)) langMenu.classList.remove('active'); });

      translatePage(currentLanguage);
      paintCachedProducts(); supabase.auth.refreshSession().then(() => { loadProducts(); saveCart(); });

      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
      revealElements.forEach(el => observer.observe(el));
    })();

    function initTheme() {
      const saved = localStorage.getItem('theme') || 'light';
      if (saved === 'dark') {
        document.body.classList.add('dark');
        document.querySelector('#themeToggle .fa-sun').style.display = 'none';
        document.querySelector('#themeToggle .fa-moon').style.display = 'inline-block';
      }
    }
    function toggleTheme() {
      if (document.body.classList.contains('dark')) {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        document.querySelector('#themeToggle .fa-sun').style.display = 'inline-block';
        document.querySelector('#themeToggle .fa-moon').style.display = 'none';
      } else {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        document.querySelector('#themeToggle .fa-sun').style.display = 'none';
        document.querySelector('#themeToggle .fa-moon').style.display = 'inline-block';
      }
    }
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
      initTheme();
    });
  