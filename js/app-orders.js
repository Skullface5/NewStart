
    (function() {
      const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
      const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      let currentLanguage = localStorage.getItem('language') || 'fr';
      let allOrders = [], currentPage = 1, rowsPerPage = 10;
      let currentSearch = '', currentStatus = 'all', currentDateFrom = '', currentDateTo = '';
      let pendingOrderId = null;

      const translations = {
        fr: {
          home: 'ACCUEIL', men: 'HOMME', women: 'FEMME', unisex: 'UNISEXE', kids: 'ENFANTS', existing: 'PARFUMS EXISTANTS', login: 'Se connecter', profile: 'Mon Profil',
          ordersManagement: 'Gestion des commandes', totalOrders: 'Total', pendingStatus: 'En attente', review: 'En révision', shipped: 'Expédiée', deliveredStatus: 'Livrée', cancelled: 'Annulée',
          allStatus: 'Tous statuts', orderDetails: 'Détails', updateStatus: 'Modifier statut', newStatus: 'Nouveau statut',
          confirm: 'Confirmer', cancel: 'Annuler', notAuthorized: 'Accès non autorisé', adminOnly: 'Page réservée aux administrateurs',
          orderId: 'N° commande', customer: 'Client', phone: 'Tél', email: 'Email', address: 'Adresse', total: 'Total', status: 'Statut', date: 'Date', actions: 'Actions',
          view: 'Voir', edit: 'Modifier', noOrders: 'Aucune commande', loading: 'Chargement...', errorLoading: 'Erreur', orderUpdated: '✅ Statut mis à jour',
          items: 'Produits', quantity: 'Qté', price: 'Prix', searchPlaceholder: 'Rechercher...', dateFrom: 'Du', dateTo: 'Au',
          footerDescription: "Parfumerie d'exception depuis 1985. L'art de la parfumerie orientale réinventé pour les connaisseurs exigeants.",
          footerPerfumesTitle: "Parfums", footerMen: "Homme", footerWomen: "Femme", footerUnisex: "Unisexe", footerKids: "Enfants",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisie", footerPhone: "+216 96 163 366", footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. Tous droits réservés."
        },
        en: {
          home: 'HOME', men: 'MEN', women: 'WOMEN', unisex: 'UNISEX', kids: 'KIDS', existing: 'EXISTING PERFUMES', login: 'Sign in', profile: 'My Profile',
          ordersManagement: 'Order Management', totalOrders: 'Total', pendingStatus: 'Pending', review: 'Under review', shipped: 'Shipped', deliveredStatus: 'Delivered', cancelled: 'Cancelled',
          allStatus: 'All statuses', orderDetails: 'Details', updateStatus: 'Update status', newStatus: 'New status',
          confirm: 'Confirm', cancel: 'Cancel', notAuthorized: 'Access denied', adminOnly: 'Admin only',
          orderId: 'Order ID', customer: 'Customer', phone: 'Phone', email: 'Email', address: 'Address', total: 'Total', status: 'Status', date: 'Date', actions: 'Actions',
          view: 'View', edit: 'Edit', noOrders: 'No orders', loading: 'Loading...', errorLoading: 'Error', orderUpdated: '✅ Status updated',
          items: 'Items', quantity: 'Qty', price: 'Price', searchPlaceholder: 'Search...', dateFrom: 'From', dateTo: 'To',
          footerDescription: "Exceptional perfumery since 1985. The art of oriental perfumery reinvented for discerning connoisseurs.",
          footerPerfumesTitle: "Perfumes", footerMen: "Men", footerWomen: "Women", footerUnisex: "Unisex", footerKids: "Kids",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisia", footerPhone: "+216 96 163 366", footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. All rights reserved."
        },
        ar: {
          home: 'الرئيسية', men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال', existing: 'العطور الموجودة', login: 'تسجيل الدخول', profile: 'ملفي الشخصي',
          ordersManagement: 'إدارة الطلبات', totalOrders: 'الإجمالي', pendingStatus: 'قيد الانتظار', review: 'قيد المراجعة', shipped: 'تم الشحن', deliveredStatus: 'تم التوصيل', cancelled: 'ملغية',
          allStatus: 'جميع الحالات', orderDetails: 'التفاصيل', updateStatus: 'تحديث الحالة', newStatus: 'الحالة الجديدة',
          confirm: 'تأكيد', cancel: 'إلغاء', notAuthorized: 'غير مصرح', adminOnly: 'للمشرفين فقط',
          orderId: 'رقم الطلب', customer: 'العميل', phone: 'الهاتف', email: 'البريد', address: 'العنوان', total: 'المجموع', status: 'الحالة', date: 'التاريخ', actions: 'إجراءات',
          view: 'عرض', edit: 'تعديل', noOrders: 'لا توجد طلبات', loading: 'جاري التحميل...', errorLoading: 'خطأ', orderUpdated: '✅ تم تحديث الحالة',
          items: 'المنتجات', quantity: 'الكمية', price: 'السعر', searchPlaceholder: 'بحث...', dateFrom: 'من', dateTo: 'إلى',
          footerDescription: "عطور استثنائية منذ 1985. فن العطور الشرقية المعاد ابتكاره للخبراء المميزين.",
          footerPerfumesTitle: "العطور", footerMen: "رجالي", footerWomen: "نسائي", footerUnisex: "للجنسين", footerKids: "أطفال",
          footerContactTitle: "اتصل بنا", footerAddress: "تونس، تونس", footerPhone: "366 163 96 216+", footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 روزا للعطور. جميع الحقوق محفوظة."
        }
      };

      function translatePage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
        const names = { fr: 'FRANÇAIS', en: 'ENGLISH', ar: 'العربية' };
        const langSpan = document.getElementById('currentLangText');
        if (langSpan) langSpan.textContent = names[lang];
        document.querySelectorAll('[data-translate]').forEach(el => {
          const key = el.getAttribute('data-translate');
          if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = translations[lang][key];
            else if (el.tagName === 'OPTION') el.textContent = translations[lang][key];
            else el.textContent = translations[lang][key];
          }
        });
        if (typeof renderAll === 'function') renderAll();
      }

      function showToast(msgKey) {
        const toast = document.getElementById('adminToast');
        toast.textContent = translations[currentLanguage][msgKey] || msgKey;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      }

      function formatDate(d) { return new Date(d).toLocaleString(currentLanguage === 'ar' ? 'ar-TN' : currentLanguage === 'fr' ? 'fr-FR' : 'en-US', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
      function formatPrice(p) { return parseFloat(p).toFixed(3).replace('.',',') + ' TND'; }
      function getStatusLabel(s) { const labels = { pending: translations[currentLanguage].pendingStatus, review: translations[currentLanguage].review, shipped: translations[currentLanguage].shipped, delivered: translations[currentLanguage].deliveredStatus, cancelled: translations[currentLanguage].cancelled }; return labels[s] || s; }
      function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m])); }

      async function loadOrders() {
        try {
          document.getElementById('loadingOrders').style.display = 'block';
          const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
          if (error) throw error;
          allOrders = data || [];
          updateStats();
          renderAll();
        } catch (err) { console.error(err); document.getElementById('ordersTableContent').innerHTML = `<div style="text-align:center; padding:2rem;">${translations[currentLanguage].errorLoading}</div>`; }
        finally { document.getElementById('loadingOrders').style.display = 'none'; }
      }

      function updateStats() {
        document.getElementById('totalOrders').innerText = allOrders.length;
        document.getElementById('pendingCount').innerText = allOrders.filter(o => o.status === 'pending').length;
        document.getElementById('shippedCount').innerText = allOrders.filter(o => o.status === 'shipped').length;
        document.getElementById('deliveredCount').innerText = allOrders.filter(o => o.status === 'delivered').length;
        document.getElementById('cancelledCount').innerText = allOrders.filter(o => o.status === 'cancelled').length;
      }

      function filterOrders() {
        let filtered = [...allOrders];
        if (currentSearch) {
          const term = currentSearch.toLowerCase();
          filtered = filtered.filter(o => o.id.toLowerCase().includes(term) ||
            (o.customer_name && o.customer_name.toLowerCase().includes(term)) ||
            (o.customer_phone && o.customer_phone.includes(term)) ||
            (o.customer_email && o.customer_email.toLowerCase().includes(term)) ||
            (o.shipping_address && o.shipping_address.toLowerCase().includes(term)));
        }
        if (currentStatus !== 'all') filtered = filtered.filter(o => o.status === currentStatus);
        if (currentDateFrom) filtered = filtered.filter(o => new Date(o.created_at) >= new Date(currentDateFrom));
        if (currentDateTo) filtered = filtered.filter(o => new Date(o.created_at) <= new Date(currentDateTo + 'T23:59:59'));
        return filtered;
      }

      function renderAll() {
        const filtered = filterOrders();
        const totalPages = Math.ceil(filtered.length / rowsPerPage);
        if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
        const start = (currentPage - 1) * rowsPerPage;
        const pageOrders = filtered.slice(start, start + rowsPerPage);
        renderCards(pageOrders);
        renderTable(pageOrders);
        renderPagination(totalPages);
      }

      function renderCards(orders) {
        const container = document.getElementById('ordersCardsContainer');
        if (!container) return;
        if (orders.length === 0) { container.innerHTML = `<div style="text-align:center; padding:2rem;">${translations[currentLanguage].noOrders}</div>`; return; }
        let html = '';
        orders.forEach(order => {
          const itemsSummary = order.items && order.items.length ? order.items.map(i => `<li><span>${escapeHtml(i.name)} x${i.quantity}</span><span>${formatPrice(i.price * i.quantity)}</span></li>`).join('') : '<li>Aucun produit</li>';
          html += `
            <div class="order-card">
              <div class="order-header">
                <span class="order-id">${order.id.slice(0,8)}...</span>
                <span class="order-status" style="background:rgba(180,154,106,0.2); padding:0.2rem 0.6rem; border-radius:50px;">${getStatusLabel(order.status)}</span>
              </div>
              <div class="order-details">
                <div class="detail-row"><span class="detail-label">${translations[currentLanguage].customer}:</span><span class="detail-value">${escapeHtml(order.customer_name || '-')}</span></div>
                <div class="detail-row"><span class="detail-label">${translations[currentLanguage].phone}:</span><span class="detail-value">${escapeHtml(order.customer_phone || '-')}</span></div>
                <div class="detail-row"><span class="detail-label">${translations[currentLanguage].total}:</span><span class="detail-value">${formatPrice(order.total)}</span></div>
                <div class="detail-row"><span class="detail-label">${translations[currentLanguage].date}:</span><span class="detail-value">${formatDate(order.created_at)}</span></div>
              </div>
              <details class="order-items"><summary>${translations[currentLanguage].items} (${order.items?.length || 0})</summary><ul>${itemsSummary}</ul></details>
              <div class="order-actions">
                <button class="action-btn-card" onclick="viewOrderDetails('${order.id}')"><i class="fas fa-eye"></i> ${translations[currentLanguage].view}</button>
                <button class="action-btn-card" onclick="openStatusModal('${order.id}')"><i class="fas fa-edit"></i> ${translations[currentLanguage].edit}</button>
              </div>
            </div>
          `;
        });
        container.innerHTML = html;
      }

      function renderTable(orders) {
        const tableDiv = document.getElementById('ordersTableContent');
        if (!tableDiv) return;
        if (orders.length === 0) { tableDiv.innerHTML = `<div style="text-align:center; padding:2rem;">${translations[currentLanguage].noOrders}</div>`; return; }
        let html = `<table class="orders-table"><thead><tr><th>${translations[currentLanguage].orderId}</th><th>${translations[currentLanguage].customer}</th><th>${translations[currentLanguage].phone}</th><th>${translations[currentLanguage].total}</th><th>${translations[currentLanguage].status}</th><th>${translations[currentLanguage].date}</th><th>${translations[currentLanguage].actions}</th></tr></thead><tbody>`;
        orders.forEach(order => {
          html += `<tr>
            <td>${order.id.slice(0,8)}...</td>
            <td>${escapeHtml(order.customer_name || '-')}</td>
            <td>${escapeHtml(order.customer_phone || '-')}</td>
            <td>${formatPrice(order.total)}</td>
            <td><span class="status-badge" style="display:inline-block; padding:0.2rem 0.6rem; border-radius:50px; background:rgba(180,154,106,0.2);">${getStatusLabel(order.status)}</span></td>
            <td>${formatDate(order.created_at)}</td>
            <td><button class="action-btn" onclick="viewOrderDetails('${order.id}')"><i class="fas fa-eye"></i></button> <button class="action-btn" onclick="openStatusModal('${order.id}')"><i class="fas fa-edit"></i></button></td>
          </tr>`;
        });
        html += `</tbody></table>`;
        tableDiv.innerHTML = html;
      }

      function renderPagination(totalPages) {
        const pagDiv = document.getElementById('pagination');
        if (!pagDiv) return;
        if (totalPages <= 1) { pagDiv.innerHTML = ''; return; }
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
          html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        pagDiv.innerHTML = html;
        document.querySelectorAll('.page-btn').forEach(btn => {
          btn.addEventListener('click', (e) => { currentPage = parseInt(e.target.dataset.page); renderAll(); });
        });
      }

      window.viewOrderDetails = function(orderId) {
        const order = allOrders.find(o => o.id === orderId);
        if (!order) return;
        let itemsHtml = '<ul style="margin-left:1rem;">';
        if (order.items && order.items.length) order.items.forEach(i => itemsHtml += `<li><strong>${escapeHtml(i.name)}</strong> x${i.quantity} — ${formatPrice(i.price * i.quantity)}</li>`);
        else itemsHtml += '<li>Aucun produit</li>';
        itemsHtml += '</ul>';
        const body = `
          <p><strong>${translations[currentLanguage].orderId}:</strong> ${order.id}</p>
          <p><strong>${translations[currentLanguage].customer}:</strong> ${escapeHtml(order.customer_name || '-')}</p>
          <p><strong>${translations[currentLanguage].phone}:</strong> ${escapeHtml(order.customer_phone || '-')}</p>
          <p><strong>${translations[currentLanguage].email}:</strong> ${escapeHtml(order.customer_email || '-')}</p>
          <p><strong>${translations[currentLanguage].address}:</strong> ${escapeHtml(order.shipping_address || '-')}</p>
          <p><strong>${translations[currentLanguage].total}:</strong> ${formatPrice(order.total)}</p>
          <p><strong>${translations[currentLanguage].status}:</strong> <span style="display:inline-block; padding:0.2rem 0.6rem; border-radius:50px; background:rgba(180,154,106,0.2);">${getStatusLabel(order.status)}</span></p>
          <p><strong>${translations[currentLanguage].date}:</strong> ${formatDate(order.created_at)}</p>
          <p><strong>${translations[currentLanguage].items}:</strong></p>${itemsHtml}
        `;
        document.getElementById('orderDetailBody').innerHTML = body;
        document.getElementById('orderDetailModal').style.display = 'flex';
      };
      window.closeOrderDetailModal = () => document.getElementById('orderDetailModal').style.display = 'none';

      window.openStatusModal = function(orderId) {
        pendingOrderId = orderId;
        const order = allOrders.find(o => o.id === orderId);
        if (order) document.getElementById('newStatusSelect').value = order.status;
        document.getElementById('statusModal').style.display = 'flex';
      };
      window.closeStatusModal = () => document.getElementById('statusModal').style.display = 'none';
      document.getElementById('confirmStatusBtn').addEventListener('click', async () => {
        if (!pendingOrderId) return;
        const newStatus = document.getElementById('newStatusSelect').value;
        try {
          const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', pendingOrderId);
          if (error) throw error;
          showToast('orderUpdated');
          closeStatusModal();
          loadOrders();
        } catch(err) { showToast('errorLoading'); }
      });

      let searchTimeout;
      document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => { currentSearch = e.target.value; currentPage = 1; renderAll(); }, 300);
      });
      document.getElementById('statusFilter').addEventListener('change', (e) => { currentStatus = e.target.value; currentPage = 1; renderAll(); });
      document.getElementById('dateFrom').addEventListener('change', (e) => { currentDateFrom = e.target.value; currentPage = 1; renderAll(); });
      document.getElementById('dateTo').addEventListener('change', (e) => { currentDateTo = e.target.value; currentPage = 1; renderAll(); });

      // Auth and UI
      let updateUserTimeout, isUpdatingUser = false;
      async function updateUserDisplay() {
        if (isUpdatingUser) return;
        isUpdatingUser = true;
        try {
          const { data: { user } } = await supabase.auth.getUser();
          const authLink = document.getElementById('authLink'), profileLink = document.getElementById('profileLink'), adminLink = document.getElementById('adminLink'), ordersLink = document.getElementById('ordersLink'), loggedInAs = document.getElementById('loggedInAs');
          if (user) {
            if (authLink) authLink.style.display = 'none';
            if (profileLink) profileLink.style.display = 'block';
            if (loggedInAs) loggedInAs.textContent = `⚡ ${user.email}`;
            if (user.email === 'azmmeli146@gmail.com') {
              if (adminLink) adminLink.style.display = 'block';
              if (ordersLink) ordersLink.style.display = 'block';
            } else {
              if (adminLink) adminLink.style.display = 'none';
              if (ordersLink) ordersLink.style.display = 'none';
            }
          } else {
            if (authLink) authLink.style.display = 'block';
            if (profileLink) profileLink.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
            if (ordersLink) ordersLink.style.display = 'none';
            if (loggedInAs) loggedInAs.textContent = '';
          }
        } finally { isUpdatingUser = false; }
      }
      updateUserDisplay();
      supabase.auth.onAuthStateChange(() => updateUserDisplay());

      async function checkAdminAccess() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.email !== 'azmmeli146@gmail.com') {
          document.getElementById('adminContent').style.display = 'none';
          document.getElementById('notAuthorized').style.display = 'block';
          return;
        }
        document.getElementById('adminContent').style.display = 'block';
        document.getElementById('notAuthorized').style.display = 'none';
        loadOrders();
      }
      checkAdminAccess();

      function initTheme() { const saved = localStorage.getItem('theme') || 'light'; if (saved === 'dark') document.body.classList.add('dark'); }
      function toggleTheme() { document.body.classList.toggle('dark'); localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light'); }
      document.getElementById('themeToggle')?.addEventListener('click', toggleTheme); initTheme();

      const menuToggle = document.getElementById('menuToggle'), navLinks = document.getElementById('navLinks'), menuOverlay = document.getElementById('menuOverlay');
      menuToggle?.addEventListener('click', () => { navLinks.classList.toggle('active'); menuOverlay.classList.toggle('active'); });
      menuOverlay?.addEventListener('click', () => { navLinks.classList.remove('active'); menuOverlay.classList.remove('active'); });

      const langMenu = document.getElementById('langMenu'), langCurrentBtn = document.getElementById('langCurrentBtn');
      langCurrentBtn?.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('active'); });
      document.querySelectorAll('.lang-option').forEach(opt => { opt.addEventListener('click', () => { translatePage(opt.dataset.lang); langMenu.classList.remove('active'); }); });
      document.addEventListener('click', (e) => { if (langMenu && !langMenu.contains(e.target)) langMenu.classList.remove('active'); });

      translatePage(currentLanguage);
    })();
  