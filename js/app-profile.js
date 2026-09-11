
    (function () {
      const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
      const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      let currentLanguage = localStorage.getItem('language') || 'fr';

      const translations = {
        fr: {
          home: 'ACCUEIL', men: 'HOMME', women: 'FEMME', unisex: 'UNISEXE', kids: 'ENFANTS',
          login: 'Se connecter', profile: 'Mon Profil', logout: 'Déconnexion',
          cart: 'Panier', emptyCart: 'Votre panier est vide.', total: 'Total', payment: 'PAIEMENT',
          addedToCart: '✨ Article ajouté', removed: '🗑️ Retiré',
          totalOrders: 'Commandes totales', pending: 'En cours', delivered: 'Livrées',
          orderHistory: 'Historique des commandes', all: 'Toutes', pendingStatus: 'En attente',
          review: 'En révision', shipped: 'Expédiées', deliveredStatus: 'Livrées',
          cancelOrder: 'Annuler', shopNow: 'Découvrir nos parfums',
          notLoggedIn: 'Non connecté', pleaseLogin: 'Veuillez vous connecter pour voir votre profil et vos commandes.',
          noOrders: 'Aucune commande trouvée', errorLoading: 'Erreur lors du chargement',
          orderCancelled: '✅ Commande annulée', cancelConfirm: 'Annuler cette commande ?',
          orderConfirmed: '✅ Commande confirmée!', cartEmptyWarning: '🛒 Panier vide', error: '❌ Erreur',
          footerDescription: "Nous vous proposons un univers de parfums luxueux, aux senteurs élégantes et spontanées, qui touchent les émotions et laissent une impression durable.",
          footerPerfumesTitle: "Parfums", footerMen: "Homme", footerWomen: "Femme", footerUnisex: "Unisexe", footerKids: "Enfants",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisie", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. Tous droits réservés."
        },
        en: {
          home: 'HOME', men: 'MEN', women: 'WOMEN', unisex: 'UNISEX', kids: 'KIDS',
          login: 'Sign in', profile: 'My Profile', logout: 'Logout',
          cart: 'Cart', emptyCart: 'Your cart is empty.', total: 'Total', payment: 'PAYMENT',
          addedToCart: '✨ Added to cart', removed: '🗑️ Removed',
          totalOrders: 'Total orders', pending: 'In progress', delivered: 'Delivered',
          orderHistory: 'Order history', all: 'All', pendingStatus: 'Pending',
          review: 'Under review', shipped: 'Shipped', deliveredStatus: 'Delivered', cancelled: 'Cancelled',
          cancelOrder: 'Cancel', shopNow: 'Discover our perfumes',
          notLoggedIn: 'Not logged in', pleaseLogin: 'Please log in to view your profile and orders.',
          noOrders: 'No orders found', errorLoading: 'Error loading',
          orderCancelled: '✅ Order cancelled', cancelConfirm: 'Cancel this order?',
          orderConfirmed: '✅ Order confirmed!', cartEmptyWarning: '🛒 Cart is empty', error: '❌ Error',
          footerDescription: "We offer you a world of luxurious perfumes, with elegant and spontaneous scents, that touch the emotions and leave a lasting impression.",
          footerPerfumesTitle: "Perfumes", footerMen: "Men", footerWomen: "Women", footerUnisex: "Unisex", footerKids: "Kids",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisia", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. All rights reserved."
        },
        ar: {
          home: 'الرئيسية', men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال',
          login: 'تسجيل الدخول', profile: 'ملفي الشخصي', logout: 'تسجيل الخروج',
          cart: 'سلة التسوق', emptyCart: 'سلة التسوق فارغة.', total: 'المجموع', payment: 'الدفع',
          addedToCart: '✨ تمت الإضافة', removed: '🗑️ تمت الإزالة',
          totalOrders: 'إجمالي الطلبات', pending: 'قيد المعالجة', delivered: 'تم التوصيل',
          orderHistory: 'سجل الطلبات', all: 'الكل', pendingStatus: 'قيد الانتظار',
          review: 'قيد المراجعة', shipped: 'تم الشحن', deliveredStatus: 'تم التوصيل', cancelled: 'ملغاة',
          cancelOrder: 'إلغاء', shopNow: 'اكتشف عطورنا',
          notLoggedIn: 'غير مسجل الدخول', pleaseLogin: 'الرجاء تسجيل الدخول لعرض ملفك الشخصي وطلباتك.',
          noOrders: 'لا توجد طلبات', errorLoading: 'خطأ في التحميل',
          orderCancelled: '✅ تم إلغاء الطلب', cancelConfirm: 'إلغاء هذا الطلب؟',
          orderConfirmed: '✅ تم تأكيد الطلب!', cartEmptyWarning: '🛒 السلة فارغة', error: '❌ خطأ',
          footerDescription: "نقدم لكم عالماً من العطور الفاخرة، بروائح أنيقة وعفوية، تلامس المشاعر وتترك انطباعاً دائماً.",
          footerPerfumesTitle: "العطور", footerMen: "رجالي", footerWomen: "نسائي", footerUnisex: "للجنسين", footerKids: "أطفال",
          footerContactTitle: "اتصل بنا", footerAddress: "تونس، تونس", footerPhone: "366 163 96 216+",
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
        document.querySelectorAll('[data-translate]').forEach(el => {
          const key = el.getAttribute('data-translate');
          if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = translations[lang][key];
            else el.textContent = translations[lang][key];
          }
        });
        if (typeof renderCart === 'function') renderCart();
        if (allOrders && allOrders.length > 0) displayOrders(currentFilter);
      }

      let cart = JSON.parse(localStorage.getItem('RosaFragrances_cart')) || [];
      let currentUser = null;
      let allOrders = [];
      let currentFilter = 'all';

      const profileContainer = document.getElementById('profileContainer');
      const notLoggedInDiv = document.getElementById('notLoggedIn');
      const userName = document.getElementById('userName');
      const userEmail = document.getElementById('userEmail');
      const totalOrdersEl = document.getElementById('totalOrders');
      const pendingOrdersEl = document.getElementById('pendingOrders');
      const deliveredOrdersEl = document.getElementById('deliveredOrders');
      const ordersListEl = document.getElementById('ordersList');
      const logoutBtn = document.getElementById('logoutBtn');
      const authLink = document.getElementById('authLink');
      const profileLink = document.getElementById('profileLink');
      const adminLink = document.getElementById('adminLink');

      const menuToggle = document.getElementById('menuToggle');
      const navLinks = document.getElementById('navLinks');
      const menuOverlay = document.getElementById('menuOverlay');
      const langMenu = document.getElementById('langMenu');
      const langCurrentBtn = document.getElementById('langCurrentBtn');
      const themeToggle = document.getElementById('themeToggle');

      const cartToggle = document.getElementById('cartToggle');
      const cartSidebar = document.getElementById('cartSidebar');
      const cartOverlayEl = document.getElementById('cartOverlay');
      const closeCartBtn = document.getElementById('closeCartBtn');
      const cartCountSpan = document.getElementById('cartCount');
      const cartItemsContainer = document.getElementById('cartItemsContainer');
      const cartTotalSpan = document.getElementById('cartTotalPrice');
      const toast = document.getElementById('toast');
      const checkoutBtn = document.getElementById('checkoutBtn');

      function showToast(msgKey, productName = '') {
        if (!toast) return;
        let msg = translations[currentLanguage][msgKey] || msgKey;
        if (productName) msg = msg.replace('✨', '✨ ') + ' ' + productName;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }

      function formatPrice(p) { return parseFloat(p).toFixed(3).replace('.', ',') + ' TND'; }
      function calculateTotal() { return cart.reduce((sum, i) => sum + (i.price * i.quantity), 0); }

      function updateCartCount() {
        const total = cart.reduce((acc, i) => acc + (i.quantity || 1), 0);
        if (cartCountSpan) cartCountSpan.textContent = total;
      }

      function saveCart() {
        localStorage.setItem('RosaFragrances_cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
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
          const sub = item.price * (item.quantity || 1); total += sub;
          const imageHtml = item.image ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async">` : `<i class="fas ${item.icon || 'fa-crown'}"></i>`;
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

      function addToCart(id, name, price, icon, image) {
        const existing = cart.find(i => i.id === id);
        if (existing) existing.quantity = (existing.quantity || 1) + 1;
        else cart.push({ id, name, price, icon: icon || 'fa-crown', image, quantity: 1 });
        saveCart();
        showToast('addedToCart', name);
      }

      function removeFromCart(id) {
        cart = cart.filter(i => i.id !== id);
        saveCart();
        showToast('removed');
      }

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

      function openCart() {
        cartSidebar?.classList.add('open');
        cartOverlayEl?.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closeCart() {
        cartSidebar?.classList.remove('open');
        cartOverlayEl?.classList.remove('active');
        document.body.style.overflow = '';
      }

      function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
      }

      function toggleMenu() {
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        if (navLinks.classList.contains('active')) closeCart();
      }

      let isUpdatingUser = false, updateUserTimeout;

      async function updateUserDisplay() {
        if (isUpdatingUser) return; isUpdatingUser = true;
        try {
          const { data: { user } } = await supabase.auth.getUser();
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
        } finally { isUpdatingUser = false; }
      }

      async function checkUser() {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            if (profileContainer) profileContainer.style.display = 'none';
            if (notLoggedInDiv) notLoggedInDiv.style.display = 'block';
            return;
          }
          currentUser = user;
          if (profileContainer) profileContainer.style.display = 'block';
          if (notLoggedInDiv) notLoggedInDiv.style.display = 'none';
          if (userName) userName.textContent = user.email?.split('@')[0] || 'Client';
          if (userEmail) userEmail.textContent = user.email;
          await loadOrders();
        } catch (err) {
          console.error(err);
          if (profileContainer) profileContainer.style.display = 'none';
          if (notLoggedInDiv) notLoggedInDiv.style.display = 'block';
        }
      }

      async function loadOrders() {
        if (!ordersListEl) return;
        try {
          ordersListEl.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';
          const { data, error } = await supabase.from('orders').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
          if (error) throw error;
          allOrders = data || [];
          updateStats();
          displayOrders('all');
        } catch (error) {
          console.error('Error loading orders:', error);
          ordersListEl.innerHTML = `<div class="empty-orders">${translations[currentLanguage].errorLoading}</div>`;
        }
      }

      function updateStats() {
        if (totalOrdersEl) totalOrdersEl.textContent = allOrders.length;
        const pending = allOrders.filter(o => ['pending', 'review', 'shipped'].includes(o.status)).length;
        const delivered = allOrders.filter(o => o.status === 'delivered').length;
        if (pendingOrdersEl) pendingOrdersEl.textContent = pending;
        if (deliveredOrdersEl) deliveredOrdersEl.textContent = delivered;
      }

      function displayOrders(filter) {
        if (!ordersListEl) return;
        currentFilter = filter;
        let filtered = filter === 'all' ? allOrders : allOrders.filter(o => o.status === filter);

        if (filtered.length === 0) {
          ordersListEl.innerHTML = `<div class="empty-orders"><i class="fas fa-box-open"></i><p>${translations[currentLanguage].noOrders}</p><a href="index.html" class="shop-now-btn">${translations[currentLanguage].shopNow}</a></div>`;
          return;
        }

        let html = '';
        filtered.forEach((order) => {
          const statusText = {
            pending: translations[currentLanguage].pendingStatus,
            review: translations[currentLanguage].review,
            shipped: translations[currentLanguage].shipped,
            delivered: translations[currentLanguage].deliveredStatus,
            cancelled: translations[currentLanguage].cancelled || 'Annulée'
          }[order.status];

          const statusClass = `status-${order.status}`;
          const date = new Date(order.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

          let itemsHtml = '';
          if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
              itemsHtml += `
              <div class="order-item">
                <div class="order-item-name">
                  <i class="fas fa-crown"></i>
                  <span>${escapeHtml(item.name)}</span>
                  <span class="order-item-quantity">x${item.quantity}</span>
                </div>
                <span class="order-item-price">${(item.price * item.quantity).toFixed(3).replace('.', ',')} TND</span>
              </div>
            `;
            });
          }

          html += `
          <div class="order-card">
            <div class="order-header">
              <div class="order-id"><i class="fas fa-receipt"></i> ${order.id.slice(0, 8)}...</div>
              <div class="order-date"><i class="fas fa-calendar-alt"></i> ${date}</div>
              <div class="order-status ${statusClass}"><i class="fas ${order.status === 'pending' ? 'fa-clock' : order.status === 'review' ? 'fa-search' : order.status === 'shipped' ? 'fa-truck' : order.status === 'delivered' ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${statusText}</div>
            </div>
            <div class="order-items">${itemsHtml}</div>
            <div class="order-total"><span>${translations[currentLanguage].total}</span><span>${order.total.toFixed(3).replace('.', ',')} TND</span></div>
            ${order.status === 'pending' ? `<div><button onclick="cancelOrder('${order.id}')" class="cancel-btn"><i class="fas fa-times"></i> ${translations[currentLanguage].cancelOrder}</button></div>` : ''}
          </div>
        `;
        });
        ordersListEl.innerHTML = html;
      }

      window.cancelOrder = async function (orderId) {
        if (!confirm(translations[currentLanguage].cancelConfirm)) return;
        try {
          const { error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId).eq('user_id', currentUser.id);
          if (error) throw error;
          alert(translations[currentLanguage].orderCancelled);
          await loadOrders();
        } catch (err) { alert('❌ Erreur'); }
      };

      window.filterOrders = function (filter, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        displayOrders(filter);
      };

      if (cartToggle) cartToggle.addEventListener('click', openCart);
      if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
      if (cartOverlayEl) cartOverlayEl.addEventListener('click', closeCart);
      if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
          const rm = e.target.closest('.cart-item-remove');
          if (rm) { removeFromCart(rm.dataset.id); return; }
          const qtyBtn = e.target.closest('.quantity-btn');
          if (qtyBtn) updateQuantity(qtyBtn.dataset.id, qtyBtn.dataset.action);
        });
      }

      checkoutBtn?.addEventListener('click', async () => {
        if (cart.length === 0) { showToast('cartEmptyWarning'); return; }
        const { data: { user } } = await supabase.auth.getUser();
        const emailField = document.getElementById('emailFieldGroup');
        const loggedDiv = document.getElementById('loggedInEmailDisplay');
        const emailInp = document.getElementById('customerEmail');
        if (user) {
          emailField.style.display = 'none'; loggedDiv.style.display = 'block';
          document.getElementById('displayEmail').textContent = user.email;
          emailInp.required = false;
        } else {
          emailField.style.display = 'block'; loggedDiv.style.display = 'none';
          emailInp.required = true;
        }
        document.getElementById('modalCartItems').innerHTML = cart.map(i =>
          `<div style="display:flex;justify-content:space-between;padding:5px 0;"><span>${escapeHtml(i.name)} x${i.quantity}</span><span>${(i.price * i.quantity).toFixed(3).replace('.', ',')} TND</span></div>`
        ).join('');
        document.getElementById('modalTotal').textContent = calculateTotal().toFixed(3).replace('.', ',') + ' TND';
        document.getElementById('checkoutModal').style.display = 'flex';
      });

      window.closeCheckoutModal = () => { document.getElementById('checkoutModal').style.display = 'none'; };

      window.processOrder = async (event) => {
        event.preventDefault();
        const btn = document.getElementById('submitOrderBtn');
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
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
            status: 'pending', user_id: user ? user.id : null
          };
          const { data: orderResult, error: orderError } = await supabase.from('orders').insert([orderData]).select();
          if (orderError) throw orderError;
          const orderId = orderResult?.[0]?.id;
          const { error: emailError } = await supabase.functions.invoke('send-order-email', { body: { order: { ...orderData, id: orderId } } });
          if (emailError) console.error('Email error:', emailError);
          cart = []; localStorage.removeItem('RosaFragrances_cart'); saveCart();
          closeCheckoutModal(); closeCart();
          showToast('orderConfirmed');
          await loadOrders();
        } catch (error) {
          console.error('Order error:', error); showToast('error');
        } finally {
          btn.disabled = false; btn.innerHTML = 'Confirmer';
        }
      };
      document.getElementById('checkoutForm')?.addEventListener('submit', window.processOrder);

      if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
      if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

      if (langCurrentBtn) {
        langCurrentBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          langMenu.classList.toggle('active');
        });
      }

      document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
          const lang = opt.dataset.lang;
          translatePage(lang);
          langMenu.classList.remove('active');
        });
      });

      document.addEventListener('click', (e) => {
        if (langMenu && !langMenu.contains(e.target)) langMenu.classList.remove('active');
      });

      if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
          await supabase.auth.signOut();
          window.location.reload();
        });
      }

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

      if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

      initTheme();
      translatePage(currentLanguage);
      checkUser();
      updateUserDisplay();

      supabase.auth.onAuthStateChange((event, session) => {
        if (['SIGNED_IN', 'SIGNED_OUT', 'INITIAL_SESSION'].includes(event)) {
          if (updateUserTimeout) clearTimeout(updateUserTimeout);
          updateUserTimeout = setTimeout(() => { checkUser(); updateUserDisplay(); }, 100);
        }
      });

      saveCart();
    })();
  