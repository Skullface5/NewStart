
    (function () {
      const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co',
        SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
      const supabase = window.__rosaSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      let currentLanguage = localStorage.getItem('language') || 'fr';
      let allProductsData = [];
      let currentFilter = 'all';

      const translations = {
        fr: {
          collection: 'COLLECTION', exclusives: 'EXCLUSIVITÉS', gifts: 'COFFRETS', login: 'Se connecter', profile: 'Mon Profil', notreCollection: 'Notre Collection',
          addToCart: 'Ajouter', addedToCart: '✨ Article ajouté', cart: 'Panier', emptyCart: 'Votre panier est vide.',
          total: 'Total', payment: 'PAIEMENT', delivery: 'Livraison', fullName: 'Nom complet *', phone: 'Téléphone *',
          email: 'Email *', address: 'Adresse *', yourOrder: 'Votre commande', cancel: 'Annuler', confirm: 'Confirmer',
          orderConfirmed: '✅ Commande confirmée!', cartEmptyWarning: '🛒 Panier vide', error: '❌ Erreur', details: 'Détails',
          close: 'Fermer', loading: 'Chargement...', noProducts: 'Aucun parfum trouvé', errorLoading: '❌ Erreur',
          reload: 'Recharger', removed: '🗑️ Retiré', collectionLabel: 'Notre Collection', collectionTitle: 'Parfums',
          exclusive: 'Exclusifs', men: 'Homme', women: 'Femme', unisex: 'Unisexe', kids: 'Enfants', allTab: 'Tous', menTab: 'Homme', womenTab: 'Femme', unisexTab: 'Unisexe', kidsTab: 'Enfants',
          searchPlaceholder: 'Rechercher un parfum...',
          footerDescription: "Nous vous proposons un univers de parfums luxueux, aux senteurs élégantes et spontanées, qui touchent les émotions et laissent une impression durable.",
          footerPerfumesTitle: "Parfums", footerMen: "Homme", footerWomen: "Femme", footerUnisex: "Unisexe", footerKids: "Enfants",
          footerNew: "Nouveautés", footerContactTitle: "Contact", footerAddress: "Tunis, Tunisie", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. Tous droits réservés."
        },
        en: {
          collection: 'COLLECTION', exclusives: 'EXCLUSIVES', gifts: 'GIFT SETS', login: 'Sign in', profile: 'My Profile', notreCollection: 'Our Collection',
          addToCart: 'Add to cart', addedToCart: '✨ Added to cart', cart: 'Cart', emptyCart: 'Your cart is empty.',
          total: 'Total', payment: 'PAYMENT', delivery: 'Delivery', fullName: 'Full name *', phone: 'Phone *',
          email: 'Email *', address: 'Address *', yourOrder: 'Your order', cancel: 'Cancel', confirm: 'Confirm',
          orderConfirmed: '✅ Order confirmed!', cartEmptyWarning: '🛒 Cart is empty', error: '❌ Error', details: 'Details',
          close: 'Close', loading: 'Loading...', noProducts: 'No perfumes found', errorLoading: '❌ Error',
          reload: 'Reload', removed: '🗑️ Removed', collectionLabel: 'Our Collection', collectionTitle: 'Perfumes',
          exclusive: 'Exclusive', men: 'Men', women: 'Women', unisex: 'Unisex', kids: 'Kids', allTab: 'All', menTab: 'Men', womenTab: 'Women', unisexTab: 'Unisex', kidsTab: 'Kids',
          searchPlaceholder: 'Search perfume...',
          footerDescription: "We offer you a world of luxurious perfumes, with elegant and spontaneous scents, that touch the emotions and leave a lasting impression.",
          footerPerfumesTitle: "Perfumes", footerMen: "Men", footerWomen: "Women", footerUnisex: "Unisex", footerKids: "Kids",
          footerNew: "New Arrivals", footerContactTitle: "Contact", footerAddress: "Tunis, Tunisia", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. All rights reserved."
        },
        ar: {
          collection: 'المجموعة', exclusives: 'الحصريات', gifts: 'الهدايا', login: 'تسجيل الدخول', profile: 'ملفي الشخصي', notreCollection: 'مجموعتنا',
          addToCart: 'أضف إلى السلة', addedToCart: '✨ تمت الإضافة', cart: 'سلة التسوق', emptyCart: 'سلة التسوق فارغة.',
          total: 'المجموع', payment: 'الدفع', delivery: 'التوصيل', fullName: 'الاسم الكامل *', phone: 'الهاتف *',
          email: 'البريد الإلكتروني *', address: 'العنوان *', yourOrder: 'طلبك', cancel: 'إلغاء', confirm: 'تأكيد',
          orderConfirmed: '✅ تم تأكيد الطلب!', cartEmptyWarning: '🛒 السلة فارغة', error: '❌ خطأ', details: 'التفاصيل',
          close: 'إغلاق', loading: 'جاري التحميل...', noProducts: 'لا توجد عطور', errorLoading: '❌ خطأ',
          reload: 'إعادة تحميل', removed: '🗑️ تمت الإزالة', collectionLabel: 'مجموعتنا', collectionTitle: 'العطور',
          exclusive: 'الحصرية', men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال', allTab: 'الكل', menTab: 'رجالي', womenTab: 'نسائي', unisexTab: 'للجنسين', kidsTab: 'أطفال',
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

      function formatPrice(p) { return parseFloat(p).toFixed(3).replace('.', ',') + ' TND'; }
      function calculateTotal() { return cart.reduce((s, i) => s + (i.price * i.quantity), 0); }
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

      function addToCart(id, name, price, icon, image) {
        const existing = cart.find(i => i.id === id);
        if (existing) existing.quantity = (existing.quantity || 1) + 1;
        else cart.push({ id, name, price, icon: icon || 'fa-crown', image, quantity: 1 });
        saveCart();
        showToast('addedToCart', name);
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
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        const activeIndex = { all: 0, man: 1, women: 2, unisexe: 3, kids: 4 }[category];
        if (tabs[activeIndex]) tabs[activeIndex].classList.add('active');
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
     allProductsData = data;
     renderProducts();
     if (loadingEl) loadingEl.style.display = 'none';
     return true;
   } catch (e) { return false; }
 }
async function loadProducts() {
        if (loadingEl) loadingEl.style.display = 'block';
        try {
          const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
          if (error) throw error;
          allProductsData = (data || []).map(p => {
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
          renderProducts();
 rosaSaveCache('rosa_cache_all', allProductsData);
        } catch (err) {
          console.error(err);
          const __hasCards = productGrid && productGrid.querySelector('.product-card'); if (!__hasCards && productGrid) productGrid.innerHTML = `<div class="empty-cart-message">${translations[currentLanguage].errorLoading}<br><button onclick="location.reload()" style="margin-top:0.8rem;padding:0.4rem 0.8rem;background:var(--gold);color:white;border:none;border-radius:50px;font-size:0.7rem;">${translations[currentLanguage].reload}</button></div>`;
        } finally {
          if (loadingEl) loadingEl.style.display = 'none';
        }
      }

      function renderProducts() {
        if (!productGrid) return;
        let filteredProducts = allProductsData;
        if (currentFilter !== 'all') {
          filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
        }
        if (!filteredProducts || filteredProducts.length === 0) {
          productGrid.innerHTML = `<div class="empty-cart-message">${translations[currentLanguage].noProducts}</div>`;
          return;
        }
        let html = '';
        filteredProducts.forEach(p => {
          const imgHtml = p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async">` : `<i class="fas fa-crown"></i>`;
          html += `<div class="product-card" data-product-id="${p.id}">
            <div class="product-clickable" data-product-id="${p.id}">
              <div class="product-img">${imgHtml}</div>
              <div class="product-title">${escapeHtml(p.name)}</div>
              <div class="product-brand">${escapeHtml(p.brand)}</div>
              <div class="product-price">${parseFloat(p.price).toFixed(3).replace('.', ',')} TND</div>
            </div>
            <button class="add-to-cart" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}" data-image="${p.image || ''}"><i class="fas fa-shopping-cart"></i> ${translations[currentLanguage].addToCart}</button>
          </div>`;
        });
        productGrid.innerHTML = html;
        document.querySelectorAll('.product-clickable').forEach(el => {
          el.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) return;
            window.location.href = `product.html?id=${el.dataset.productId}`;
          });
        });
        document.querySelectorAll('.add-to-cart').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price), 'fa-crown', btn.dataset.image);
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
        const { data: { user } } = await supabase.auth.getUser();
        const emailField = document.getElementById('emailFieldGroup'), loggedDiv = document.getElementById('loggedInEmailDisplay'), emailInp = document.getElementById('customerEmail');
        if (user) {
          if (emailField) emailField.style.display = 'none';
          if (loggedDiv) loggedDiv.style.display = 'block';
          const displaySpan = document.getElementById('displayEmail');
          if (displaySpan) displaySpan.textContent = user.email;
          if (emailInp) emailInp.required = false;
        } else {
          if (emailField) emailField.style.display = 'block';
          if (loggedDiv) loggedDiv.style.display = 'none';
          if (emailInp) emailInp.required = true;
        }
        const modalCartItems = document.getElementById('modalCartItems');
        if (modalCartItems) {
          modalCartItems.innerHTML = cart.map(i => `<div style="display:flex;justify-content:space-between;padding:5px 0;"><span>${escapeHtml(i.name)} x${i.quantity}</span><span>${(i.price * i.quantity).toFixed(3).replace('.', ',')} TND</span></div>`).join('');
        }
        const modalTotalSpan = document.getElementById('modalTotal');
        if (modalTotalSpan) modalTotalSpan.textContent = calculateTotal().toFixed(3).replace('.', ',') + ' TND';
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) checkoutModal.style.display = 'flex';
      });

      window.processOrder = async (event) => {
        event.preventDefault();
        const btn = document.getElementById('submitOrderBtn');
        if (btn) btn.disabled = true;
        if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
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
          try {
            const { error: emailError } = await supabase.functions.invoke('send-order-email', { body: { order: { ...orderData, id: orderId } } });
            if (emailError) console.error('Email sending error:', emailError);
          } catch (emailErr) {
            console.error('Email function not available:', emailErr);
          }
          cart = [];
          localStorage.removeItem('RosaFragrances_cart');
          saveCart();
          closeCheckoutModal();
          closeCart();
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
      window.closeCheckoutModal = () => { const modal = document.getElementById('checkoutModal'); if (modal) modal.style.display = 'none'; };
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
  