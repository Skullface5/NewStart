
        (function () {
            const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
            const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
            const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

            let currentLanguage = localStorage.getItem('language') || 'fr';
            let products = [];
            let searchTerm = '';


            const CATS = {
                women:   { icon: 'fa-female',    fr: 'Parfums Femme',   en: 'Women Perfumes',  ar: 'عطور نسائية' },
                man:     { icon: 'fa-male',      fr: 'Parfums Homme',   en: 'Men Perfumes',    ar: 'عطور رجالية' },
                unisexe: { icon: 'fa-genderless', fr: 'Parfums Unisexe', en: 'Unisex Perfumes', ar: 'عطور للجنسين' },
                kids:    { icon: 'fa-child',     fr: 'Parfums Enfants', en: 'Kids Perfumes',   ar: 'عطور أطفال' },
                voiture:     { icon: 'fa-car',        fr: 'Parfums voiture',   en: 'Car perfumes',    ar: 'عطور السيارات' },
                ambiance:    { icon: 'fa-house-fire', fr: "Parfums d'ambiance", en: 'Home fragrances', ar: 'عطورات الجو' },
                musc:        { icon: 'fa-feather',    fr: 'Musc',              en: 'Musk',            ar: 'مسك' },
                accessoires: { icon: 'fa-gem',        fr: 'Accessoires',       en: 'Accessories',     ar: 'إكسسوارات' },
                inspires:    { icon: 'fa-wand-magic-sparkles', fr: 'Parfums inspirés', en: 'Inspired perfumes', ar: 'عطور مستوحاة' }
            };
            const _params = new URLSearchParams(window.location.search);
            // URL param wins; else the category selected earlier this session (survives reload /
            // mobile back-navigation, which re-loads the page); else default to the first tab.
            let CAT = _params.get('cat') || '';
            try { if (!CAT) CAT = sessionStorage.getItem('adminCat') || ''; } catch (e) {}
            if (!CATS[CAT]) CAT = 'women';

            const translations = {
                fr: {
                    home: 'ACCUEIL', men: 'HOMME', women: 'FEMME', unisex: 'UNISEXE', kids: 'ENFANTS',
                    existing: 'PARFUMS EXISTANTS', login: 'Se connecter', profile: 'Mon Profil',
                    back: 'Retour aux catégories', catName: CATS[CAT].fr,
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
                    footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. Tous droits réservés.",
                    bannerTitle: 'Médias Bannière Promo', bannerLinkLbl: 'Lien (optionnel)', bannerLinkClear: 'Retirer', bannerHelp: "Jusqu'à 6 images ou vidéos de la bannière promotion. Plusieurs = diaporama. Cliquez une vignette pour ajouter un lien (optionnel).", bannerAutoplay: 'Défilement automatique', bannerSave: 'Enregistrer la bannière', bannerSavedBadge: 'Enregistré', bannerSaved: '✅ Bannière enregistrée', bannerLimit: 'Maximum 6 images.',
                    collTitle: 'Menu Notre Collection', collHelp: 'Les lignes ci-dessous composent le menu « Notre Collection » du site. Réorganisez avec ↑/↓, remplissez les 3 langues, puis Enregistrer.', collAdd: 'Ajouter une entrée', collSave: 'Enregistrer le menu', collSavedBadge: 'Enregistré', collSaved: '✅ Menu enregistré', collLimit: 'Maximum 8 entrées.', collNeedLangs: 'Chaque entrée doit avoir un nom FR, EN et AR.', collDel: 'Supprimer',
                    heroUploading: 'Envoi de',
                    heroRemove: 'Retirer',
                    heroAddAria: 'Ajouter des images ou vidéos',
                    heroError: 'Erreur d\'enregistrement. Vérifiez que vous êtes connecté en administrateur.'
                },
                en: {
                    home: 'HOME', men: 'MEN', women: 'WOMEN', unisex: 'UNISEX', kids: 'KIDS',
                    existing: 'EXISTING PERFUMES', login: 'Sign in', profile: 'My Profile',
                    back: 'Back to categories', catName: CATS[CAT].en,
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
                    footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. All rights reserved.",
                    bannerTitle: 'Promo Banner Media', bannerLinkLbl: 'Link (optional)', bannerLinkClear: 'Remove', bannerHelp: 'Up to 6 images or videos for the home promo banner. Several = slideshow. Click a thumbnail to attach an optional link.', bannerAutoplay: 'Auto-play slideshow', bannerSave: 'Save banner', bannerSavedBadge: 'Saved', bannerSaved: '✅ Banner saved', bannerLimit: 'Maximum 6 images.',
                    collTitle: 'Notre Collection Menu', collHelp: 'The rows below build the site\'s « Notre Collection » menu. Reorder with ↑/↓, fill the 3 languages, then Save.', collAdd: 'Add entry', collSave: 'Save menu', collSavedBadge: 'Saved', collSaved: '✅ Menu saved', collLimit: 'Maximum 8 entries.', collNeedLangs: 'Each entry needs FR, EN and AR names.', collDel: 'Delete',
                    heroUploading: 'Uploading',
                    heroRemove: 'Remove',
                    heroAddAria: 'Add images or videos',
                    heroError: 'Save failed. Make sure you are signed in as an administrator.'
                },
                ar: {
                    home: 'الرئيسية', men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال',
                    existing: 'العطور الموجودة', login: 'تسجيل الدخول', profile: 'ملفي الشخصي',
                    back: 'العودة للفئات', catName: CATS[CAT].ar,
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
                    footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 روزا للعطور. جميع الحقوق محفوظة.",
                    bannerTitle: 'وسائط البانر الإعلاني', bannerLinkLbl: 'رابط (اختياري)', bannerLinkClear: 'إزالة', bannerHelp: 'حتى 6 صور أو مقاطع فيديو في بانر الصفحة الرئيسية. عدة عناصر = عرض تلقائي. اضغط على مصغّرة لإضافة رابط اختياري.', bannerAutoplay: 'عرض تلقائي', bannerSave: 'حفظ البانر', bannerSavedBadge: 'تم الحفظ', bannerSaved: '✅ تم حفظ البانر', bannerLimit: 'الحد الأقصى 6 صور.',
                    collTitle: 'قائمة مجموعتنا', collHelp: 'الأسطر أدناه تُنشئ قائمة «مجموعتنا» في الموقع. رتّب بالأسهم، املأ اللغات الثلاث، ثم احفظ.', collAdd: 'إضافة عنصر', collSave: 'حفظ القائمة', collSavedBadge: 'تم الحفظ', collSaved: '✅ تم حفظ القائمة', collLimit: 'الحد الأقصى 8 عناصر.', collNeedLangs: 'كل عنصر يحتاج اسمًا بالفرنسية والإنجليزية والعربية.', collDel: 'حذف',
                    heroUploading: 'جاري رفع',
                    heroRemove: 'إزالة',
                    heroAddAria: 'إضافة صور الواجهة',
                    heroError: 'فشل الحفظ. تأكد من تسجيل الدخول كمسؤول.'
                }
            };

            function translatePage(lang) {
                currentLanguage = lang;
                localStorage.setItem('language', lang);
                const _catIcon = document.getElementById('catIcon');
                if (_catIcon) _catIcon.className = 'fas ' + CATS[CAT].icon;
                document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
                document.body.style.textAlign = lang === 'ar' ? 'right' : 'left';
                const names = { fr: 'FRANÇAIS', en: 'ENGLISH', ar: 'العربية' };
                const langSpan = document.getElementById('currentLangText');
                if (langSpan) langSpan.textContent = names[lang];
                const scoped = document.querySelectorAll('#dash-collections [data-translate], #dash-settings [data-translate]');
                scoped.forEach(el => {
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
                        .eq('category', CAT)
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
              <td>${escapeHtml(product.brand)}</td>
              <td>${formatPrice(product.price)}</td>
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
                if (window.rosaLoadEdit) {
                    window.rosaEditId = productId;
                    location.hash = '#edit';
                    window.rosaLoadEdit();
                } else {
                    window.location.href = `productedit.html?id=${productId}`;
                }
            };
            window.rosaReloadCat = function () { if (typeof loadProducts === 'function') loadProducts(); };

            // ── Overview tab (fused from existed.html) ──
            async function loadOverviewStats() {
                try {
                    const { data } = await supabase.from('products').select('category');
                    const counts = {};
                    (data || []).forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
                    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v || 0; };
                    ['man', 'women', 'unisexe', 'kids', 'voiture', 'ambiance', 'musc', 'accessoires', 'inspires'].forEach(c => set('ovc-' + c, counts[c]));
                    set('ovManCount', counts['man']); set('ovWomenCount', counts['women']);
                    set('ovUnisexCount', counts['unisexe']); set('ovKidsCount', counts['kids']);
                    set('ovTotal', (data || []).length);
                } catch (e) { console.error('overview stats:', e); }
                try {
                    const { data: s } = await supabase.auth.getSession();
                    const emailEl = document.getElementById('loggedInAsOv');
                    const chipEl = document.getElementById('sessionEmailChip');
                    const em = s && s.session && s.session.user ? '· ' + s.session.user.email : '';
                    if (emailEl && em) emailEl.textContent = em.replace('· ', '');
                    if (chipEl) chipEl.textContent = em;
                } catch (e) {}
            }
            window.rosaLoadOverview = function () { loadOverviewStats(); };
            window.rosaReloadBanner = function () { loadBannerSettings(); };
            document.getElementById('ovRefresh')?.addEventListener('click', loadOverviewStats);

            // category cards in overview → open that category in Collections
            function setCat(slug, thenLoad) {
                if (!CATS[slug]) { return; }
                try { sessionStorage.setItem('adminCat', slug); } catch (e) {}
                if (slug === CAT) { if (thenLoad) loadProducts(); return; }
                CAT = slug;
                Object.keys(translations).forEach(l => { if (translations[l]) translations[l].catName = (CATS[slug] && CATS[slug][l]) || CATS[slug].fr; });
                const title = document.querySelector('#dash-collections h1 span[data-translate="catName"]');
                if (title) title.textContent = CATS[slug][currentLanguage] || CATS[slug].fr;
                const icon = document.getElementById('catIcon');
                if (icon) icon.className = 'fas ' + CATS[slug].icon;
                if (thenLoad) loadProducts();
            }
            document.querySelectorAll('.ov-card[data-cat]').forEach(c => {
                c.addEventListener('click', function () { window._rosaPendingCat = this.getAttribute('data-cat'); });
            });
            window.rosaActivateCat = function () {
                if (window._rosaPendingCat) { const c = window._rosaPendingCat; window._rosaPendingCat = null; setCat(c, true); }
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
                    const ordersLink = document.getElementById('ordersLink');

                    if (user) {
                        if (authLink) authLink.style.display = 'none';
                        if (profileLink) profileLink.style.display = 'block';
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

            function heroT(key) {
                const d = translations[currentLanguage] || translations.fr;
                return d[key] || (translations.fr[key] || key);
            }

            // Image compression -> WebP (same pipeline as app-adminadd.js)
            function heroCompress(file) {
                return new Promise((resolve) => {
                    const url = URL.createObjectURL(file);
                    const img = new Image();
                    img.onload = () => {
                        URL.revokeObjectURL(url);
                        try {
                            let { width: w, height: h } = img;
                            if (Math.max(w, h) > 1600) { // heroes are wide: keep a bit more detail
                                const k = 1600 / Math.max(w, h);
                                w = Math.round(w * k); h = Math.round(h * k);
                            }
                            const canvas = document.createElement('canvas');
                            canvas.width = w; canvas.height = h;
                            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                            canvas.toBlob((blob) => {
                                if (blob && blob.type === 'image/webp') resolve({ blob, ext: 'webp' });
                                else resolve({ blob: file, ext: (file.name.split('.').pop() || 'jpg').toLowerCase() });
                            }, 'image/webp', 0.85);
                        } catch (e) {
                            resolve({ blob: file, ext: (file.name.split('.').pop() || 'jpg').toLowerCase() });
                        }
                    };
                    img.onerror = () => {
                        URL.revokeObjectURL(url);
                        resolve({ blob: file, ext: (file.name.split('.').pop() || 'jpg').toLowerCase() });
                    };
                    img.src = url;
                });
            }

            // ════════════ Promo banner media manager (images + videos, optional per-slide link)
            // settings key banner_images = array of {src, type:'image'|'video', link?}  (legacy plain strings still load)
            const BANNER_MAX = 6;
            const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|$)/i;
            let bannerState = { list: [], newFiles: [], saving: false, sel: -1 };   // sel = index into combined strip (-1 none)

            function bannerMsg(text, isOk) {
                const el = document.getElementById('bannerMsg');
                if (!el) return;
                el.textContent = text || '';
                el.className = 'hero-admin-msg' + (text ? (isOk ? ' ok' : ' err') : '');
            }
            function isVideoSrc(u) { return VIDEO_EXT.test(String(u || '')); }
            function combinedLen() { return bannerState.list.length + bannerState.newFiles.length; }

            function renderBannerGallery() {
                const box = document.getElementById('bannerGallery');
                if (!box) return;
                let html = bannerState.list.map((it, i) => {
                    const thumb = it.type === 'video'
                        ? '<video src="' + escapeHtml(it.src) + '" muted preload="metadata" playsinline></video><span class="g-vid-tag"><i class="fas fa-play"></i></span>'
                        : '<img src="' + escapeHtml(it.src) + '" alt="" loading="lazy" onerror="this.parentElement.remove()">';
                    return '<div class="g-thumb' + (it.type === 'video' ? ' g-thumb--vid' : '') + (bannerState.sel === i ? ' g-thumb--active' : '') + '" data-gsel="' + i + '" data-gurl="' + escapeHtml(it.src) + '">' +
                        thumb +
                        (it.link ? '<span class="g-link-tag"><i class="fas fa-link"></i></span>' : '') +
                        '<button type="button" class="g-del" data-bdel="' + escapeHtml(it.src) + '" aria-label="' + heroT('heroRemove') + '">&#10005;</button>' +
                        '</div>';
                }).join('');
                html += bannerState.newFiles.map((f, j) => {
                    const li = bannerState.list.length + j;
                    const isVid = (f.file.type || '').indexOf('video/') === 0;
                    const thumb = isVid
                        ? '<video src="' + escapeHtml(URL.createObjectURL(f.file)) + '" muted preload="metadata" playsinline></video><span class="g-vid-tag"><i class="fas fa-play"></i></span>'
                        : '<img src="' + escapeHtml(URL.createObjectURL(f.file)) + '" alt="">';
                    return '<div class="g-thumb g-thumb--new' + (isVid ? ' g-thumb--vid' : '') + (bannerState.sel === li ? ' g-thumb--active' : '') + '" data-gsel="' + li + '">' +
                        thumb +
                        (f.link ? '<span class="g-link-tag"><i class="fas fa-link"></i></span>' : '') +
                        '<button type="button" class="g-del" data-bdelfile="' + j + '" aria-label="' + heroT('heroRemove') + '">&#10005;</button>' +
                        '</div>';
                }).join('');
                if (combinedLen() < BANNER_MAX) {
                    html += '<label class="g-add" for="bannerFileInput" aria-label="' + heroT('heroAddAria') + '">+</label>';
                }
                box.innerHTML = html;
                const badge = document.getElementById('bannerCountBadge');
                if (badge) badge.textContent = combinedLen() + '/' + BANNER_MAX;
                syncLinkRow();
                const saveBtn = document.getElementById('btnSaveBanner');
                if (saveBtn && bannerState.newFiles.length) {
                    saveBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    saveBtn.classList.remove('hp-btn--pulse'); void saveBtn.offsetWidth;
                    saveBtn.classList.add('hp-btn--pulse');
                } else if (saveBtn) {
                    saveBtn.classList.remove('hp-btn--pulse');
                }
            }

            // ── per-slide link editor (applies to selected thumbnail) ──
            function syncLinkRow() {
                const row = document.getElementById('bannerLinkRow');
                const inp = document.getElementById('bannerLinkInput');
                if (!row || !inp) return;
                const i = bannerState.sel;
                const it = i < bannerState.list.length ? bannerState.list[i] : bannerState.newFiles[i - bannerState.list.length];
                row.hidden = !it;
                inp.value = (it && it.link) || '';
                const lbl = document.getElementById('bannerLinkTarget');
                if (lbl) lbl.textContent = it ? ('#' + (i + 1)) : '';
            }
            async function loadBannerSettings() {
                try {
                    const { data, error } = await supabase.from('settings').select('*');
                    if (error) throw error;
                    const settings = {};
                    (data || []).forEach(row => { settings[row.key] = row.value; });
                    let raw = Array.isArray(settings.banner_images) ? settings.banner_images.slice(0, BANNER_MAX) : [];
                    if (!raw.length && typeof settings.banner_image === 'string' && settings.banner_image) {
                        raw = [settings.banner_image];
                    }
                    bannerState.list = raw.map(it => typeof it === 'string'
                        ? { src: it, type: isVideoSrc(it) ? 'video' : 'image', link: '' }
                        : { src: String(it.src || ''), type: (it.type === 'video' || isVideoSrc(it.src)) ? 'video' : 'image', link: String(it.link || '') })
                        .filter(it => it.src);
                    bannerState.newFiles = [];
                    bannerState.sel = -1;
                    const apEl = document.getElementById('bannerAutoplay');
                    if (apEl) apEl.checked = settings.banner_autoplay !== false;
                    renderBannerGallery();
                } catch (e) {
                    bannerMsg('⚠ ' + (e && e.message ? e.message : String(e)));
                }
            }

            async function saveBannerSettings() {
                if (bannerState.saving) return;
                bannerState.saving = true;
                const btn = document.getElementById('btnSaveBanner');
                if (btn) btn.disabled = true;
                try {
                    const list = bannerState.list.slice();
                    for (let i = 0; i < bannerState.newFiles.length; i++) {
                        const nf = bannerState.newFiles[i];
                        bannerMsg(heroT('heroUploading') + ' ' + (i + 1) + '/' + bannerState.newFiles.length + '...', true);
                        const isVid = (nf.file.type || '').indexOf('video/') === 0;
                        let blob, ext, mime;
                        if (isVid) {
                            blob = nf.file;
                            ext = (nf.file.name.split('.').pop() || 'mp4').toLowerCase();
                            mime = nf.file.type || ('video/' + (ext === 'mov' || ext === 'm4v' ? 'mp4' : ext));
                        } else {
                            const c = await heroCompress(nf.file);
                            blob = c.blob; ext = c.ext; mime = 'image/' + ext;
                        }
                        const path = 'admin/banner-' + Date.now() + '-' + i + '.' + ext;
                        const { error: upErr } = await supabase.storage
                            .from('product-images')
                            .upload(path, blob, { contentType: mime, upsert: true });
                        if (upErr) throw upErr;
                        const { data: pub } = supabase.storage.from('product-images').getPublicUrl(path);
                        list.push({ src: pub.publicUrl, type: isVid ? 'video' : 'image', link: nf.link || '' });
                    }
                    const apEl = document.getElementById('bannerAutoplay');
                    const rows = [
                        { key: 'banner_images', value: list },
                        { key: 'banner_autoplay', value: !(apEl && apEl.checked === false) }
                    ];
                    const { error: sbErr } = await supabase
                        .from('settings')
                        .upsert(rows, { onConflict: 'key' });
                    if (sbErr) throw sbErr;
                    bannerState.list = list;
                    bannerState.newFiles = [];
                    bannerState.sel = -1;
                    renderBannerGallery();
                    bannerMsg('');
                    const saved = document.getElementById('bannerSavedBadge');
                    if (saved) {
                        saved.hidden = false;
                        clearTimeout(saveBannerSettings._t);
                        saveBannerSettings._t = setTimeout(() => { saved.hidden = true; }, 3500);
                    }
                    showToast(heroT('bannerSaved'));
                } catch (e) {
                    const em = e && e.message ? e.message : heroT('heroError');
                    bannerMsg('⚠ ' + em);
                    showToast('⚠ ' + em);
                } finally {
                    bannerState.saving = false;
                    if (btn) btn.disabled = false;
                }
            }

            function bindBannerEditor() {
                const box = document.getElementById('bannerGallery');
                if (box) box.addEventListener('click', ev => {
                    const delUrl = ev.target.closest('[data-bdel]');
                    if (delUrl) {
                        const u = delUrl.getAttribute('data-bdel');
                        bannerState.list = bannerState.list.filter(x => x.src !== u);
                        if (bannerState.sel >= bannerState.list.length + bannerState.newFiles.length) bannerState.sel = -1;
                        renderBannerGallery();
                        return;
                    }
                    const delFile = ev.target.closest('[data-bdelfile]');
                    if (delFile) {
                        bannerState.newFiles.splice(parseInt(delFile.getAttribute('data-bdelfile'), 10), 1);
                        bannerState.sel = -1;
                        renderBannerGallery();
                        return;
                    }
                    const sel = ev.target.closest('[data-gsel]');
                    if (sel) {
                        const i = parseInt(sel.getAttribute('data-gsel'), 10);
                        bannerState.sel = (bannerState.sel === i) ? -1 : i;
                        renderBannerGallery();
                    }
                });
                const li = document.getElementById('bannerLinkInput');
                if (li) {
                    li.addEventListener('input', () => {
                        const i = bannerState.sel; if (i < 0) return;
                        const it = i < bannerState.list.length ? bannerState.list[i] : bannerState.newFiles[i - bannerState.list.length];
                        if (it) it.link = li.value.trim();
                    });
                    const clr = document.getElementById('bannerLinkClear');
                    if (clr) clr.addEventListener('click', () => {
                        const i = bannerState.sel; if (i < 0) return;
                        const it = i < bannerState.list.length ? bannerState.list[i] : bannerState.newFiles[i - bannerState.list.length];
                        if (it) { it.link = ''; renderBannerGallery(); }
                    });
                }
                const input = document.getElementById('bannerFileInput');
                if (input) input.addEventListener('change', () => {
                    const files = Array.prototype.slice.call(input.files || []);
                    input.value = '';
                    for (const file of files) {
                        if (combinedLen() >= BANNER_MAX) { bannerMsg('⚠ ' + heroT('bannerLimit')); break; }
                        const isVid = (file.type || '').indexOf('video/') === 0;
                        if (isVid && file.size > 25 * 1024 * 1024) { bannerMsg('⚠ Vidéo trop lourde (max 25 Mo)'); continue; }
                        bannerState.newFiles.push({ file, link: '' });
                    }
                    renderBannerGallery();
                });
                const saveBtn = document.getElementById('btnSaveBanner');
                if (saveBtn) saveBtn.addEventListener('click', saveBannerSettings);
            }
            bindBannerEditor();


translatePage(currentLanguage);
            loadProducts();
            loadBannerSettings();
                    })();
    