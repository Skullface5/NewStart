
    (function() {
      // Supabase config
      const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
      const supabase = window.__rosaSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      let currentLanguage = localStorage.getItem('language') || 'fr';
      let allProducts = [];
      let currentProduct = null;
      let cart = JSON.parse(localStorage.getItem('RosaFragrances_cart')) || [];
      let currentImageIndex = 0;
      let productImages = [];

      // Translations (same as before, keep all)
      const translations = {
        fr: {
          home: 'ACCUEIL', men: 'HOMME', women: 'FEMME', unisex: 'UNISEXE', kids: 'ENFANTS',
          login: 'Se connecter', profile: 'Mon Profil', notreCollection: 'Notre Collection', back: 'Retour',
          cart: 'Panier', emptyCart: 'Votre panier est vide.', total: 'Total', payment: 'PAIEMENT',
          addToCart: 'Ajouter au panier', addedToCart: '✨ Article ajouté', removed: '🗑️ Retiré',
          loading: 'Chargement...', errorLoading: '❌ Erreur de chargement', productNotFound: '❌ Produit non trouvé',
          youMayLike: 'Vous aimerez aussi', discover: 'Découvrez ce parfum d\'exception, une fragrance unique qui révèle votre personnalité.',
          inStock: 'En stock', lowStock: 'Stock faible', outOfStock: 'Rupture de stock',
          quantityLeft: 'pièces restantes', seasons: 'Saisons',
          footerDescription: "Nous vous proposons un univers de parfums luxueux, aux senteurs élégantes et spontanées, qui touchent les émotions et laissent une impression durable.",
          footerPerfumesTitle: "Parfums", footerMen: "Homme", footerWomen: "Femme", footerUnisex: "Unisexe", footerKids: "Enfants",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisie", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. Tous droits réservés.",
          orderConfirmed: '✅ Commande confirmée!', cartEmptyWarning: '🛒 Panier vide', error: '❌ Erreur',
          confirm: 'Confirmer', cancel: 'Annuler', yourOrder: 'Votre commande',
          fullName: 'Nom complet *', phone: 'Téléphone *', email: 'Email *',
          address: 'Adresse *', delivery: 'Livraison'
        },
        en: {
          home: 'HOME', men: 'MEN', women: 'WOMEN', unisex: 'UNISEX', kids: 'KIDS',
          login: 'Sign in', profile: 'My Profile', notreCollection: 'Our Collection', back: 'Back',
          cart: 'Cart', emptyCart: 'Your cart is empty.', total: 'Total', payment: 'PAYMENT',
          addToCart: 'Add to cart', addedToCart: '✨ Added to cart', removed: '🗑️ Removed',
          loading: 'Loading...', errorLoading: '❌ Error loading', productNotFound: '❌ Product not found',
          youMayLike: 'You may also like', discover: 'Discover this exceptional perfume, a unique fragrance that reveals your personality.',
          inStock: 'In stock', lowStock: 'Low stock', outOfStock: 'Out of stock',
          quantityLeft: 'pieces left', seasons: 'Seasons',
          footerDescription: "We offer you a world of luxurious perfumes, with elegant and spontaneous scents, that touch the emotions and leave a lasting impression.",
          footerPerfumesTitle: "Perfumes", footerMen: "Men", footerWomen: "Women", footerUnisex: "Unisex", footerKids: "Kids",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisia", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. All rights reserved.",
          orderConfirmed: '✅ Order confirmed!', cartEmptyWarning: '🛒 Cart is empty', error: '❌ Error',
          confirm: 'Confirm', cancel: 'Cancel', yourOrder: 'Your order',
          fullName: 'Full name *', phone: 'Phone *', email: 'Email *',
          address: 'Address *', delivery: 'Delivery'
        },
        ar: {
          home: 'الرئيسية', men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال',
          login: 'تسجيل الدخول', profile: 'ملفي الشخصي', notreCollection: 'مجموعتنا', back: 'رجوع',
          cart: 'سلة التسوق', emptyCart: 'سلة التسوق فارغة.', total: 'المجموع', payment: 'الدفع',
          addToCart: 'أضف إلى السلة', addedToCart: '✨ تمت الإضافة', removed: '🗑️ تمت الإزالة',
          loading: 'جاري التحميل...', errorLoading: '❌ خطأ في التحميل', productNotFound: '❌ المنتج غير موجود',
          youMayLike: 'قد يعجبك أيضاً', discover: 'اكتشف هذا العطر الاستثنائي، رائحة فريدة تكشف عن شخصيتك.',
          inStock: 'متوفر', lowStock: 'مخزون منخفض', outOfStock: 'غير متوفر',
          quantityLeft: 'قطعة متبقية', seasons: 'المواسم',
          footerDescription: "نقدم لكم عالماً من العطور الفاخرة، بروائح أنيقة وعفوية، تلامس المشاعر وتترك انطباعاً دائماً.",
          footerPerfumesTitle: "العطور", footerMen: "رجالي", footerWomen: "نسائي", footerUnisex: "للجنسين", footerKids: "أطفال",
          footerContactTitle: "اتصل بنا", footerAddress: "تونس، تونس", footerPhone: "366 163 96 216+",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 روزا للعطور. جميع الحقوق محفوظة.",
          orderConfirmed: '✅ تم تأكيد الطلب!', cartEmptyWarning: '🛒 السلة فارغة', error: '❌ خطأ',
          confirm: 'تأكيد', cancel: 'إلغاء', yourOrder: 'طلبك',
          fullName: 'الاسم الكامل *', phone: 'الهاتف *', email: 'البريد الإلكتروني *',
          address: 'العنوان *', delivery: 'التوصيل'
        }
      };

      // DOM elements
      const productDetailContainer = document.getElementById('productDetailContainer');
      const suggestionsContainer = document.getElementById('suggestionsContainer');
      const suggestionsGrid = document.getElementById('suggestionsGrid');
      const cartSidebar = document.getElementById('cartSidebar');
      const cartOverlay = document.getElementById('cartOverlay');
      const cartToggle = document.getElementById('cartToggle');
      const closeCartBtn = document.getElementById('closeCartBtn');
      const cartCountSpan = document.getElementById('cartCount');
      const cartItemsContainer = document.getElementById('cartItemsContainer');
      const cartTotalSpan = document.getElementById('cartTotalPrice');
      const toast = document.getElementById('toast');
      const menuToggle = document.getElementById('menuToggle');
      const navLinks = document.getElementById('navLinks');
      const menuOverlay = document.getElementById('menuOverlay');
      const checkoutBtn = document.getElementById('checkoutBtn');

      // Helper functions
      function formatPrice(p) { return parseFloat(p).toFixed(3).replace('.', ',') + ' TND'; }
      function promoPriceHtml(row) {
        // STE-style promo: struck old price before current price
        try {
          var op = row.old_price != null ? parseFloat(row.old_price) : NaN;
          var cp = parseFloat(row.price);
          if (isFinite(op) && isFinite(cp) && op > cp) {
            return '<s style="opacity:.5;font-weight:300;font-size:.8em;margin-inline-end:7px;">' + formatPrice(op) + '</s>' + formatPrice(cp);
          }
        } catch (e) {}
        return formatPrice(row.price);
      }

      function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }
      function showToast(msgKey, productName = '') {
        if (!toast) return;
        let msg = translations[currentLanguage][msgKey] || msgKey;
        if (productName) msg = msg.replace('✨', '✨ ') + ' ' + productName;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }
      function calculateTotal() { return cart.reduce((sum, i) => sum + (i.price * i.quantity), 0); }
      function updateCartCount() { const total = cart.reduce((acc, i) => acc + (i.quantity || 1), 0); if (cartCountSpan) cartCountSpan.textContent = total; }
      function saveCart() { localStorage.setItem('RosaFragrances_cart', JSON.stringify(cart)); updateCartCount(); renderCart(); }
      
      function renderCart() {
        if (!cartItemsContainer) return;
        if (cart.length === 0) {
          cartItemsContainer.innerHTML = `<div class="empty-cart-message">${translations[currentLanguage].emptyCart}</div>`;
          if (cartTotalSpan) cartTotalSpan.textContent = '0,000 TND';
          return;
        }
        let html = '', total = 0;
        cart.forEach(item => {
          const sub = item.price * (item.quantity || 1); total += sub;
          const imageHtml = item.image ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" onerror="this.onerror=null;this.style.display='none';this.parentElement.innerHTML='<i class=\'fas fa-crown\'></i>';">` : `<i class="fas ${item.icon || 'fa-crown'}"></i>`;
          html += `<div class="cart-item" data-id="${item.id}">
            <div class="cart-item-icon">${imageHtml}</div>
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

      // Fixed addToCart with proper stock check using allProducts
      function addToCart(id, name, price, icon, image) {
        const product = allProducts.find(p => p.id == id);
        if (!product) return;
        const stock = product.quantity || 0;
        const existing = cart.find(i => i.id === id);
        const currentQty = existing ? existing.quantity : 0;
        if (currentQty >= stock) {
          showToast('outOfStock');
          return;
        }
        if (existing) {
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
        const product = allProducts.find(p => p.id == id);
        const stock = product ? (product.quantity || 0) : 0;
        if (action === 'increase') {
          if ((item.quantity || 1) + 1 > stock) { showToast('outOfStock'); return; }
          item.quantity = (item.quantity || 1) + 1;
        } else if (action === 'decrease') {
          if (item.quantity > 1) item.quantity -= 1;
          else { removeFromCart(id); return; }
        }
        saveCart();
      }

      function openCart() { cartSidebar?.classList.add('open'); cartOverlay?.classList.add('active'); document.body.style.overflow = 'hidden'; }
      function closeCart() { cartSidebar?.classList.remove('open'); cartOverlay?.classList.remove('active'); document.body.style.overflow = ''; }
      function toggleMenu() { navLinks.classList.toggle('active'); menuOverlay.classList.toggle('active'); document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : ''; if (navLinks.classList.contains('active')) closeCart(); }

      function getSeasonNames(seasonStr) {
        if (!seasonStr) return [];
        const seasonMap = { summer: { icon: 'fas fa-sun', name: 'Été' }, winter: { icon: 'fas fa-snowflake', name: 'Hiver' }, spring: { icon: 'fas fa-seedling', name: 'Printemps' }, autumn: { icon: 'fas fa-leaf', name: 'Automne' } };
        if (seasonStr === 'all') return [{ icon: 'fas fa-calendar-check', name: 'Toutes saisons' }];
        return seasonStr.split(',').map(s => seasonMap[s]).filter(s => s);
      }

      function getStockStatusHTML(quantity) {
        if (!quantity || quantity === 0) return `<div class="stock-status stock-out"><i class="fas fa-times-circle"></i> <span>${translations[currentLanguage].outOfStock}</span></div>`;
        else if (quantity < 5) return `<div class="stock-status stock-low"><i class="fas fa-exclamation-triangle"></i> <span>${translations[currentLanguage].lowStock}</span> <span class="quantity-info">(${quantity} ${translations[currentLanguage].quantityLeft})</span></div>`;
        else return `<div class="stock-status stock-available"><i class="fas fa-check-circle"></i> <span>${translations[currentLanguage].inStock}</span> <span class="quantity-info">(${quantity} ${translations[currentLanguage].quantityLeft})</span></div>`;
      }

      function setupSwipeAndNavigation(images) {
        if (!images || images.length <= 1) return;
        let touchStartX = 0, touchEndX = 0;
        const container = document.querySelector('.main-image-container');
        if (!container) return;
        container.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
        container.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const diff = touchEndX - touchStartX;
          if (Math.abs(diff) < 50) return;
          if (diff > 0) changeImage(currentImageIndex - 1);
          else changeImage(currentImageIndex + 1);
        });
        const prevArrow = document.querySelector('.nav-arrow.prev');
        const nextArrow = document.querySelector('.nav-arrow.next');
        if (prevArrow) prevArrow.addEventListener('click', () => changeImage(currentImageIndex - 1));
        if (nextArrow) nextArrow.addEventListener('click', () => changeImage(currentImageIndex + 1));
        const changeImage = (newIndex) => {
          if (newIndex < 0 || newIndex >= images.length || newIndex === currentImageIndex) return;
          currentImageIndex = newIndex;
          const mainImg = document.getElementById('mainImage');
          if (mainImg) mainImg.src = images[currentImageIndex];
          document.querySelectorAll('.thumbnail').forEach((thumb, idx) => { thumb.classList.toggle('active', idx === currentImageIndex); });
          document.querySelectorAll('.swipe-dot').forEach((dot, idx) => { dot.classList.toggle('active', idx === currentImageIndex); });
        };
      }

      function displayProduct(product) {
        // Parse images
        try {
          if (product.images && typeof product.images === 'string') productImages = JSON.parse(product.images);
          else if (product.images && Array.isArray(product.images)) productImages = product.images;
          else if (product.image) productImages = [product.image];
          else productImages = [];
        } catch(e) { productImages = []; }
        
        const categoryNames = { man: 'Homme', women: 'Femme', unisexe: 'Unisexe', kids: 'Enfants', inspires: 'Inspires', voiture: 'Voiture', ambiance: 'Ambiance', musc: 'Musc', accessoires: 'Accessoires' };
        const categoryName = categoryNames[product.category] || product.category;
        const seasons = getSeasonNames(product.season);
        const seasonsHtml = seasons.length ? `<span class="meta-badge"><i class="fas fa-calendar-alt"></i> ${translations[currentLanguage].seasons}: ${seasons.map(s => `<i class="${s.icon}" style="margin-left: 5px;"></i> ${s.name}`).join(', ')}</span>` : '';
        let thumbnailsHtml = '', mainImageHtml = '', swipeIndicatorsHtml = '', arrowsHtml = '';
        if (productImages.length) {
          mainImageHtml = `<img src="${productImages[0]}" alt="${escapeHtml(product.name)}" id="mainImage" onerror="this.onerror=null;this.style.display='none';this.parentElement.innerHTML='<i class=\'fas fa-crown\'></i>';">`;
          thumbnailsHtml = productImages.map((img, idx) => `<div class="thumbnail ${idx === 0 ? 'active' : ''}" data-img="${img}"><img src="${img}" alt="thumbnail ${idx+1}" loading="lazy" decoding="async" onerror="this.onerror=null;this.style.display='none';this.parentElement.innerHTML='<i class=\'fas fa-crown\'></i>';"></div>`).join('');
          swipeIndicatorsHtml = productImages.map((_, idx) => `<div class="swipe-dot ${idx === 0 ? 'active' : ''}"></div>`).join('');
          if (productImages.length > 1) arrowsHtml = `<div class="nav-arrow prev"><i class="fas fa-chevron-left"></i></div><div class="nav-arrow next"><i class="fas fa-chevron-right"></i></div>`;
        } else {
          mainImageHtml = `<i class="fas fa-crown"></i>`;
        }
        const stockStatusHTML = getStockStatusHTML(product.quantity);
        const isOutOfStock = !product.quantity || product.quantity === 0;
        const addToCartDisabled = isOutOfStock ? 'disabled' : '';
        productDetailContainer.innerHTML = `
          <div class="product-detail">
            <div class="product-gallery">
              <div class="main-image-container">
                <div class="image-container">${mainImageHtml}</div>
                ${arrowsHtml}
                <div class="swipe-indicators">${swipeIndicatorsHtml}</div>
              </div>
              ${productImages.length > 1 ? `<div class="thumbnail-grid">${thumbnailsHtml}</div>` : ''}
            </div>
            <div class="product-info">
              <h1>${escapeHtml(product.name)}</h1>
              <div class="product-brand">${escapeHtml(product.brand)}</div>
              <div class="product-meta"><span class="meta-badge"><i class="fas fa-tag"></i> ${categoryName}</span>${seasonsHtml}</div>
              ${stockStatusHTML}
              <div class="product-price">${promoPriceHtml(product)}</div>
              <div class="product-description">${escapeHtml(product.description || translations[currentLanguage].discover)}</div>
              <button class="add-to-cart-btn ${addToCartDisabled}" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${product.price}" data-icon="fa-crown" data-image="${productImages[0] || ''}" ${isOutOfStock ? 'disabled' : ''}>
                <i class="fas fa-shopping-cart"></i> ${translations[currentLanguage].addToCart}
              </button>
            </div>
          </div>
        `;
        const addBtn = document.querySelector('.add-to-cart-btn');
        if (addBtn && !isOutOfStock) {
          addBtn.addEventListener('click', () => { addToCart(addBtn.dataset.id, addBtn.dataset.name, parseFloat(addBtn.dataset.price), addBtn.dataset.icon, addBtn.dataset.image); });
        }
        if (productImages.length > 1) setupSwipeAndNavigation(productImages);
      }

      function loadSuggestions() {
        if (!currentProduct || !allProducts.length) return;
        const suggestions = allProducts.filter(p => p.id !== currentProduct.id && p.category === currentProduct.category).slice(0, 4);
        if (suggestions.length === 0) { suggestionsContainer.style.display = 'none'; return; }
        suggestionsContainer.style.display = 'block';
        let html = '';
        suggestions.forEach(product => {
          let firstImage = '';
          try { const prodImages = product.images ? JSON.parse(product.images) : []; firstImage = prodImages[0] || ''; } catch(e) {}
          const imgHtml = firstImage ? `<img src="${firstImage}" alt="${escapeHtml(product.name)}" onerror="this.onerror=null;this.style.display='none';this.parentElement.innerHTML='<i class=\'fas fa-crown\'></i>';">` : `<i class="fas fa-crown"></i>`;
          html += `<div class="suggestion-card" onclick="window.location.href='product.html?id=${product.id}'"><div class="suggestion-img">${imgHtml}</div><div class="suggestion-name">${escapeHtml(product.name)}</div><div class="suggestion-brand">${escapeHtml(product.brand)}</div><div class="suggestion-price">${formatPrice(product.price)}</div></div>`;
        });
        suggestionsGrid.innerHTML = html;
      }

      // Main initialization with DOMContentLoaded and skeleton
      document.addEventListener('DOMContentLoaded', async () => {
        // Show skeleton immediately
        productDetailContainer.innerHTML = `
          <div class="product-detail skeleton">
            <div class="product-gallery">
              <div class="main-image-container skeleton-img"></div>
              <div class="thumbnail-grid skeleton-thumbs" style="display: flex; gap: 0.8rem;"><div class="skeleton-img" style="width:70px; height:70px; border-radius:12px;"></div><div class="skeleton-img" style="width:70px; height:70px; border-radius:12px;"></div></div>
            </div>
            <div class="product-info">
              <div class="skeleton-title"></div>
              <div class="skeleton-brand"></div>
              <div class="skeleton-price"></div>
              <div class="skeleton-description"></div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        `;
        
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        if (!productId) {
          productDetailContainer.innerHTML = `<div class="error-message">${translations[currentLanguage].productNotFound}</div>`;
          return;
        }
        
 let cachedPainted = false;
 try {
   const raw = localStorage.getItem('rosa_cache_all');
   if (raw) {
     const obj = JSON.parse(raw);
     if (obj && Array.isArray(obj.data) && obj.data.length && Date.now() - (obj.ts || 0) < 86400000) {
       allProducts = obj.data;
       currentProduct = allProducts.find(p => p.id == productId);
       if (currentProduct) { displayProduct(currentProduct); loadSuggestions(); renderCart(); updateUserDisplay(); cachedPainted = true; }
     }
   }
 } catch (e) {}

 try {
 // Load all products once
          const { data: allData, error: allError } = await supabase.from('products').select('*');
          if (allError) throw allError;
          allProducts = allData || [];
 rosaSaveCache('rosa_cache_all', allProducts);
          // Find current product
          currentProduct = allProducts.find(p => p.id == productId);
          if (!currentProduct) throw new Error('Not found');
          // Display product (replaces skeleton)
          displayProduct(currentProduct);
          // Load suggestions
          loadSuggestions();
          // Render cart (if any)
          renderCart();
          // Update user display for admin etc.
          updateUserDisplay();
        } catch (err) {
          console.error(err);
          if (!currentProduct) productDetailContainer.innerHTML = `<div class="error-message">${translations[currentLanguage].errorLoading}</div>`;
        }
      });

      // Cart event listeners
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
      if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
      if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

      // Checkout modal
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
          if (cart.length === 0) { showToast('cartEmptyWarning'); return; }
          const { data: { user } } = await supabase.auth.getUser();
          const emailField = document.getElementById('emailFieldGroup');
          const loggedDiv = document.getElementById('loggedInEmailDisplay');
          const emailInp = document.getElementById('customerEmail');
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
      }
      window.closeCheckoutModal = () => { document.getElementById('checkoutModal').style.display = 'none'; };
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
          try {
            await supabase.functions.invoke('send-order-email', { body: { order: { ...orderData, id: orderId } } });
          } catch (emailErr) { console.error('Email not sent:', emailErr); }
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

      // User auth state
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
      supabase.auth.onAuthStateChange((event, session) => {
        if (['SIGNED_IN', 'SIGNED_OUT', 'INITIAL_SESSION'].includes(event)) {
          if (updateUserTimeout) clearTimeout(updateUserTimeout);
          updateUserTimeout = setTimeout(() => updateUserDisplay(), 100);
        }
      });

      // Language menu
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
        if (currentProduct) displayProduct(currentProduct);
        renderCart();
      }
      const langMenu = document.getElementById('langMenu');
      const langCurrentBtn = document.getElementById('langCurrentBtn');
      if (langCurrentBtn) langCurrentBtn.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('active'); });
      document.querySelectorAll('.lang-option').forEach(opt => { opt.addEventListener('click', () => { translatePage(opt.dataset.lang); langMenu.classList.remove('active'); }); });
      document.addEventListener('click', (e) => { if (langMenu && !langMenu.contains(e.target)) langMenu.classList.remove('active'); });
      translatePage(currentLanguage);

      // Theme toggle (persist in localStorage as requested)
      function initTheme() {
        const saved = localStorage.getItem('theme') || 'light';
        if (saved === 'dark') {
          document.body.classList.add('dark');
          const sun = document.querySelector('#themeToggle .fa-sun');
          const moon = document.querySelector('#themeToggle .fa-moon');
          if (sun) sun.style.display = 'none';
          if (moon) moon.style.display = 'inline-block';
        }
      }
      function toggleTheme() {
        if (document.body.classList.contains('dark')) {
          document.body.classList.remove('dark');
          localStorage.setItem('theme', 'light');
          const sun = document.querySelector('#themeToggle .fa-sun');
          const moon = document.querySelector('#themeToggle .fa-moon');
          if (sun) sun.style.display = 'inline-block';
          if (moon) moon.style.display = 'none';
        } else {
          document.body.classList.add('dark');
          localStorage.setItem('theme', 'dark');
          const sun = document.querySelector('#themeToggle .fa-sun');
          const moon = document.querySelector('#themeToggle .fa-moon');
          if (sun) sun.style.display = 'none';
          if (moon) moon.style.display = 'inline-block';
        }
      }
      const themeToggleBtn = document.getElementById('themeToggle');
      if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
      initTheme();

      // Scroll reveal observer
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } }); }, { threshold: 0.1 });
      revealElements.forEach(el => observer.observe(el));
    })();
  