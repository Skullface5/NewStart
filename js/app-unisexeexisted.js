
        (function () {
            const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
            const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
            const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

            let currentLanguage = localStorage.getItem('language') || 'fr';
            let products = [];
            let searchTerm = '';

            const translations = {
                fr: {
                    home: 'ACCUEIL', men: 'HOMME', women: 'FEMME', unisex: 'UNISEXE', kids: 'ENFANTS',
                    existing: 'PARFUMS EXISTANTS', login: 'Se connecter', profile: 'Mon Profil',
                    back: 'Retour aux catégories', unisexCat: 'Parfums Unisexe',
                    products: 'produits', searchPlaceholder: 'Rechercher un produit...',
                    addProduct: 'Ajouter un produit', loading: 'Chargement...',
                    noProducts: 'Aucun produit trouvé', image: 'Image', name: 'Nom', brand: 'Marque',
                    price: 'Prix', dateAdded: 'Date d\'ajout', quantity: 'Quantité', status: 'Statut',
                    actions: 'Actions', edit: 'Modifier', delete: 'Supprimer',
                    productDeleted: '✅ Produit supprimé', deleteConfirm: 'Supprimer ce produit ?',
                    inStock: 'En stock', lowStock: 'Stock faible', outOfStock: 'Rupture',
                    footerDescription: "Parfumerie d'exception depuis 1985. L'art de la parfumerie orientale réinventé pour les connaisseurs exigeants.",
                    footerPerfumesTitle: "Parfums", footerMen: "Homme", footerWomen: "Femme", footerUnisex: "Unisexe", footerKids: "Enfants",
                    footerContactTitle: "Contact", footerAddress: "Tunis, Tunisie", footerPhone: "+216 96 163 366",
                    footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. Tous droits réservés."
                },
                en: {
                    home: 'HOME', men: 'MEN', women: 'WOMEN', unisex: 'UNISEX', kids: 'KIDS',
                    existing: 'EXISTING PERFUMES', login: 'Sign in', profile: 'My Profile',
                    back: 'Back to categories', unisexCat: 'Unisex Perfumes',
                    products: 'products', searchPlaceholder: 'Search product...',
                    addProduct: 'Add product', loading: 'Loading...',
                    noProducts: 'No products found', image: 'Image', name: 'Name', brand: 'Brand',
                    price: 'Price', dateAdded: 'Date added', quantity: 'Quantity', status: 'Status',
                    actions: 'Actions', edit: 'Edit', delete: 'Delete',
                    productDeleted: '✅ Product deleted', deleteConfirm: 'Delete this product?',
                    inStock: 'In stock', lowStock: 'Low stock', outOfStock: 'Out of stock',
                    footerDescription: "Exceptional perfumery since 1985. The art of oriental perfumery reinvented for discerning connoisseurs.",
                    footerPerfumesTitle: "Perfumes", footerMen: "Men", footerWomen: "Women", footerUnisex: "Unisex", footerKids: "Kids",
                    footerContactTitle: "Contact", footerAddress: "Tunis, Tunisia", footerPhone: "+216 96 163 366",
                    footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. All rights reserved."
                },
                ar: {
                    home: 'الرئيسية', men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال',
                    existing: 'العطور الموجودة', login: 'تسجيل الدخول', profile: 'ملفي الشخصي',
                    back: 'العودة للفئات', unisexCat: 'عطور للجنسين',
                    products: 'منتجات', searchPlaceholder: 'البحث عن منتج...',
                    addProduct: 'إضافة منتج', loading: 'جاري التحميل...',
                    noProducts: 'لا توجد منتجات', image: 'الصورة', name: 'الاسم', brand: 'العلامة',
                    price: 'السعر', dateAdded: 'تاريخ الإضافة', quantity: 'الكمية', status: 'الحالة',
                    actions: 'إجراءات', edit: 'تعديل', delete: 'حذف',
                    productDeleted: '✅ تم حذف المنتج', deleteConfirm: 'حذف هذا المنتج؟',
                    inStock: 'متوفر', lowStock: 'مخزون منخفض', outOfStock: 'غير متوفر',
                    footerDescription: "عطور استثنائية منذ 1985. فن العطور الشرقية المعاد ابتكاره للخبراء المميزين.",
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
                renderProductsTable();
            }

            function showToast(msg) {
                const toast = document.getElementById('adminToast');
                toast.textContent = msg;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2500);
            }

            function formatDate(dateString) {
                if (!dateString) return '-';
                const date = new Date(dateString);
                return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }

            function formatPrice(price) {
                return parseFloat(price).toFixed(3).replace('.', ',') + ' TND';
            }

            function getStatusBadge(quantity) {
                if (!quantity || quantity === 0) {
                    return `<span class="status-badge status-out"><i class="fas fa-times-circle"></i> ${translations[currentLanguage].outOfStock}</span>`;
                } else if (quantity < 5) {
                    return `<span class="status-badge status-low"><i class="fas fa-exclamation-triangle"></i> ${translations[currentLanguage].lowStock}</span>`;
                } else {
                    return `<span class="status-badge status-available"><i class="fas fa-check-circle"></i> ${translations[currentLanguage].inStock}</span>`;
                }
            }

            function getFirstImage(images) {
                if (!images) return null;
                try {
                    const imgArray = typeof images === 'string' ? JSON.parse(images) : images;
                    return imgArray[0] || null;
                } catch (e) {
                    return null;
                }
            }

            async function loadProducts() {
                const loadingEl = document.getElementById('loadingProducts');
                const tableContent = document.getElementById('productsTableContent');
                if (loadingEl) loadingEl.style.display = 'block';

                try {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')
                        .eq('category', 'unisexe')
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    products = data || [];

                    if (document.getElementById('productCount')) {
                        document.getElementById('productCount').textContent = products.length;
                    }

                    renderProductsTable();
                } catch (error) {
                    console.error('Error loading products:', error);
                    if (tableContent) {
                        tableContent.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${translations[currentLanguage].noProducts}</p></div>`;
                    }
                } finally {
                    if (loadingEl) loadingEl.style.display = 'none';
                }
            }

            function renderProductsTable() {
                const tableContent = document.getElementById('productsTableContent');
                if (!tableContent) return;

                let filteredProducts = products;
                if (searchTerm) {
                    filteredProducts = products.filter(p =>
                        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                if (filteredProducts.length === 0) {
                    tableContent.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i><p>${translations[currentLanguage].noProducts}</p></div>`;
                    return;
                }

                let html = `
          <table class="products-table">
            <thead>
              <tr>
                <th>${translations[currentLanguage].image}</th>
                <th>${translations[currentLanguage].name}</th>
                <th>${translations[currentLanguage].brand}</th>
                <th>${translations[currentLanguage].price}</th>
                <th>${translations[currentLanguage].dateAdded}</th>
                <th>${translations[currentLanguage].quantity}</th>
                <th>${translations[currentLanguage].status}</th>
                <th>${translations[currentLanguage].actions}</th>
              </tr>
            </thead>
            <tbody>
        `;

                filteredProducts.forEach(product => {
                    const firstImage = getFirstImage(product.images);
                    const imageHtml = firstImage
                        ? `<img src="${firstImage}" alt="${escapeHtml(product.name)}" class="product-image" loading="lazy" decoding="async">`
                        : `<div class="product-image-placeholder"><i class="fas fa-crown"></i></div>`;

                    const dateAdded = formatDate(product.created_at);
                    const quantity = product.quantity || 0;
                    const statusBadge = getStatusBadge(quantity);

                    html += `
            <tr data-product-id="${product.id}">
              <td>${imageHtml}</td>
              <td><strong>${escapeHtml(product.name)}</strong></td>
              <td>${escapeHtml(product.brand)}</div></td>
              <td>${formatPrice(product.price)}</div></td>
              <td>${dateAdded}</td>
              <td>${quantity}</td>
              <td>${statusBadge}</td>
              <td>
                <div class="action-buttons">
                  <button class="edit-btn" onclick="editProduct('${product.id}')"><i class="fas fa-edit"></i> ${translations[currentLanguage].edit}</button>
                  <button class="delete-btn" onclick="deleteProduct('${product.id}')"><i class="fas fa-trash"></i> ${translations[currentLanguage].delete}</button>
                </div>
              </td>
            </tr>
          `;
                });

                html += `
            </tbody>
          </table>
        `;

                tableContent.innerHTML = html;
            }

            window.editProduct = function (productId) {
                window.location.href = `productedit.html?id=${productId}`;
            };

            window.deleteProduct = async function (productId) {
                if (!confirm(translations[currentLanguage].deleteConfirm)) return;

                try {
                    const { error } = await supabase.from('products').delete().eq('id', productId);
                    if (error) throw error;
                    showToast(translations[currentLanguage].productDeleted);
                    await loadProducts();
                } catch (error) {
                    console.error('Error deleting product:', error);
                    showToast('❌ ' + translations[currentLanguage].error);
                }
            };

            function escapeHtml(str) {
                if (!str) return '';
                return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
            }

            // Search functionality
            document.getElementById('searchInput')?.addEventListener('input', (e) => {
                searchTerm = e.target.value;
                renderProductsTable();
            });

            // Theme
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
                renderProductsTable();
            }

            document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
            initTheme();

            // Menu
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

            // Language
            const langMenu = document.getElementById('langMenu');
            const langCurrentBtn = document.getElementById('langCurrentBtn');
            if (langCurrentBtn) {
                langCurrentBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    langMenu.classList.toggle('active');
                });
            }
            document.querySelectorAll('.lang-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    translatePage(opt.dataset.lang);
                    langMenu.classList.remove('active');
                });
            });
            document.addEventListener('click', (e) => {
                if (langMenu && !langMenu.contains(e.target)) langMenu.classList.remove('active');
            });

            // Auth
            let updateUserTimeout, isUpdatingUser = false;

            async function updateUserDisplay() {
                if (isUpdatingUser) return;
                isUpdatingUser = true;
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const authLink = document.getElementById('authLink');
                    const profileLink = document.getElementById('profileLink');
                    const adminLink = document.getElementById('adminLink');

                    if (user) {
                        if (authLink) authLink.style.display = 'none';
                        if (profileLink) profileLink.style.display = 'block';
                        if (user.email === 'azmmeli146@gmail.com') {
                            if (adminLink) adminLink.style.display = 'block';
                        } else {
                            if (adminLink) adminLink.style.display = 'none';
                        }
                    } else {
                        if (authLink) authLink.style.display = 'block';
                        if (profileLink) profileLink.style.display = 'none';
                        if (adminLink) adminLink.style.display = 'none';
                    }
                } catch (error) {
                    console.error('Error checking user:', error);
                } finally {
                    isUpdatingUser = false;
                }
            }

            updateUserDisplay();
            supabase.auth.onAuthStateChange((event, session) => {
                if (['SIGNED_IN', 'SIGNED_OUT', 'INITIAL_SESSION'].includes(event)) {
                    if (updateUserTimeout) clearTimeout(updateUserTimeout);
                    updateUserTimeout = setTimeout(() => updateUserDisplay(), 100);
                }
            });

            // Initialize
            translatePage(currentLanguage);
            loadProducts();
        })();
    