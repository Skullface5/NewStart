
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
            let CAT = _params.get('cat') || 'women';
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
                    collTitle: 'Menu Notre Collection', collHelp: 'Les lignes ci-dessous composent le menu « Notre Collection » du site. Réorganisez avec ↑/↓, remplissez les 3 langues, puis Enregistrer.', collAdd: 'Ajouter une entrée', collSave: 'Enregistrer le menu', collSavedBadge: 'Enregistré', collSaved: '✅ Menu enregistré', collLimit: 'Maximum 8 entrées.', collNeedLangs: 'Chaque entrée doit avoir un nom FR, EN et AR.', collDel: 'Supprimer',
heroTitle: 'Images Héro',
                    heroHelp: "Jusqu'à 6 images en haut de l'accueil. La première est l'image principale. Cliquez une vignette, puis déplacez et zoomez dans le cadre pour régler sa position.",
                    heroPosHint: 'Glissez pour repositionner — molette ou curseur pour zoomer.',
                    heroRecenter: 'Recentrer',
                    heroSave: 'Enregistrer le héro',
                    heroSavedBadge: 'Enregistré',
                    heroSaved: '✅ Héro enregistré',
                    heroUploading: 'Envoi de',
                    heroLimit: 'Maximum 6 images — limite atteinte.',
                    heroRemove: 'Retirer',
                    heroAddAria: 'Ajouter des images héro',
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
                    collTitle: 'Notre Collection Menu', collHelp: 'The rows below build the site\'s « Notre Collection » menu. Reorder with ↑/↓, fill the 3 languages, then Save.', collAdd: 'Add entry', collSave: 'Save menu', collSavedBadge: 'Saved', collSaved: '✅ Menu saved', collLimit: 'Maximum 8 entries.', collNeedLangs: 'Each entry needs FR, EN and AR names.', collDel: 'Delete',
heroTitle: 'Hero Images',
                    heroHelp: 'Up to 6 images on the home hero. The first one is the main image. Click a thumbnail, then drag and zoom inside the frame to set its position.',
                    heroPosHint: 'Drag to reposition — wheel or slider to zoom.',
                    heroRecenter: 'Recenter',
                    heroSave: 'Save hero',
                    heroSavedBadge: 'Saved',
                    heroSaved: '✅ Hero saved',
                    heroUploading: 'Uploading',
                    heroLimit: 'Maximum 6 images — limit reached.',
                    heroRemove: 'Remove',
                    heroAddAria: 'Add hero images',
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
                    collTitle: 'قائمة مجموعتنا', collHelp: 'الأسطر أدناه تُنشئ قائمة «مجموعتنا» في الموقع. رتّب بالأسهم، املأ اللغات الثلاث، ثم احفظ.', collAdd: 'إضافة عنصر', collSave: 'حفظ القائمة', collSavedBadge: 'تم الحفظ', collSaved: '✅ تم حفظ القائمة', collLimit: 'الحد الأقصى 8 عناصر.', collNeedLangs: 'كل عنصر يحتاج اسمًا بالفرنسية والإنجليزية والعربية.', collDel: 'حذف',
heroTitle: 'صور الواجهة',
                    heroHelp: 'حتى ٦ صور في واجهة الصفحة الرئيسية. الصورة الأولى هي الرئيسية. انقر على مصغّرة ثم اسحب وكبّر داخل الإطار لضبط موضعها.',
                    heroPosHint: 'اسحب لإعادة الضبط — العجلة أو المؤشر للتكبير.',
                    heroRecenter: 'إعادة التمركز',
                    heroSave: 'حفظ الواجهة',
                    heroSavedBadge: 'تم الحفظ',
                    heroSaved: '✅ تم حفظ الواجهة',
                    heroUploading: 'جاري رفع',
                    heroLimit: 'الحد الأقصى ٦ صور — تم بلوغ الحد.',
                    heroRemove: 'إزالة',
                    heroAddAria: 'إضافة صور الواجهة',
                    heroError: 'فشل الحفظ. تأكد من تسجيل الدخول كمسؤول.'
                }
            };

            function translatePage(lang) {
                currentLanguage = lang;
                localStorage.setItem('language', lang);
                document.title = 'Rosa Fragrances | ' + translations[lang].catName + ' - Administration';
                const _catIcon = document.getElementById('catIcon');
                if (_catIcon) _catIcon.className = 'fas ' + CATS[CAT].icon;
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
                // hero gallery thumbnails carry generated labels (remove/add) — repaint them
                if (typeof renderHeroGallery === 'function') renderHeroGallery();
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

            // ==================================================================
            // Hero images manager — settings rows hero_images + hero_position
            // (ported from STE admin2.js #hpEditor; same clamps & transform math)
            // ==================================================================
            const HERO_MAX = 6;
            const heroState = {
                list: [],          // saved public URLs (hero_images)
                newFiles: [],      // pending File objects (key 'new:<idx>' until upload)
                posMap: {},        // key (url or 'new:i') -> {tx, ty, zoom}  (numbers)
                posBase: {},       // snapshot of posMap as saved server-side
                selected: null,    // current editor key
                objUrls: {},       // 'new:i' -> object URL cache
                dirtyPos: false,
                saving: false
            };

            function heroT(key) {
                const d = translations[currentLanguage] || translations.fr;
                return d[key] || (translations.fr[key] || key);
            }

            function hpClamp(v, lo, hi) { return Math.min(hi, Math.max(lo, isFinite(v) ? v : 0)); }

            // Accepts {tx:"0%", ty:"-8%", zoom:1} (percent strings, per contract)
            // or numbers; clamps exactly like STE (-50..50, zoom 1..3).
            function hpNormalize(pos) {
                const d = { tx: 0, ty: -8, zoom: 1 };
                pos = (pos && typeof pos === 'object') ? pos : {};
                const num = (v, dflt) => {
                    if (v == null) return dflt;
                    return hpClamp(parseFloat(String(v)), -50, 50);
                };
                return {
                    tx: num(pos.tx, d.tx),
                    ty: num(pos.ty, d.ty),
                    zoom: hpClamp(Number(pos.zoom != null ? pos.zoom : d.zoom), 1, 3)
                };
            }

            // raw: { "<url>": {tx,ty,zoom}, ... } OR legacy single {tx,ty,zoom} (applies to all)
            function hpSeedMap(raw, list) {
                const map = {};
                raw = (raw && typeof raw === 'object') ? raw : {};
                const isLegacy = (typeof raw.tx === 'string' || typeof raw.tx === 'number') ||
                    (typeof raw.ty === 'string' || typeof raw.ty === 'number') ||
                    typeof raw.zoom === 'number';
                if (isLegacy) {
                    list.forEach(u => { map[u] = hpNormalize(raw); });
                    return map;
                }
                Object.keys(raw).forEach(u => {
                    if (raw[u] && typeof raw[u] === 'object') map[u] = hpNormalize(raw[u]);
                });
                return map;
            }

            function hpCloneMap(m) {
                return Object.keys(m).reduce((acc, k) => { acc[k] = Object.assign({}, m[k]); return acc; }, {});
            }

            function hpMapJson(m) {
                return JSON.stringify(Object.keys(m).sort().map(k => {
                    const p = m[k];
                    return [k, Math.round(p.tx * 10) / 10, Math.round(p.ty * 10) / 10, Math.round(p.zoom * 100) / 100];
                }));
            }

            function hpSelKey() {
                const k = heroState.selected;
                if (k && (heroState.posMap[k] !== undefined || k.indexOf('new:') === 0)) {
                    if (k.indexOf('new:') === 0) {
                        if (heroState.newFiles[Number(k.slice(4))]) return k;
                    } else if (heroState.list.indexOf(k) >= 0) {
                        return k;
                    }
                }
                if (heroState.list[0]) return heroState.list[0];
                return heroState.newFiles[0] ? 'new:0' : null;
            }

            function hpSelPos(key) {
                if (!key) return null;
                if (!heroState.posMap[key]) heroState.posMap[key] = hpNormalize();
                return heroState.posMap[key];
            }

            function hpSelSrc(key) {
                if (!key) return '';
                if (key.indexOf('new:') === 0) {
                    const i = Number(key.slice(4));
                    const f = heroState.newFiles[i];
                    if (!f) return '';
                    if (!heroState.objUrls[key]) heroState.objUrls[key] = URL.createObjectURL(f);
                    return heroState.objUrls[key];
                }
                return key;
            }

            function hpDropUrl(url) {
                delete heroState.posMap[url];
                if (heroState.selected === url) heroState.selected = null;
                hpDirty();
            }

            function hpDropFileIdx(idx) {
                Object.keys(heroState.posMap).forEach(k => {
                    if (k.indexOf('new:') === 0 && Number(k.slice(4)) === idx) delete heroState.posMap[k];
                });
                const remap = {};
                Object.keys(heroState.posMap).forEach(k => {
                    if (k.indexOf('new:') === 0) {
                        const i = Number(k.slice(4));
                        remap['new:' + (i > idx ? i - 1 : i)] = heroState.posMap[k];
                    } else {
                        remap[k] = heroState.posMap[k];
                    }
                });
                heroState.posMap = remap;
                if (heroState.selected === 'new:' + idx) heroState.selected = null;
                hpDirty();
            }

            function hpDirty() {
                heroState.dirtyPos = hpMapJson(heroState.posMap) !== hpMapJson(heroState.posBase || {});
                const sb = document.getElementById('btnSaveHero');
                if (sb && heroState.dirtyPos) {
                    sb.classList.remove('hp-btn--pulse'); void sb.offsetWidth; sb.classList.add('hp-btn--pulse');
                }
            }

            function renderHeroGallery() {
                const box = document.getElementById('heroGallery');
                if (!box) return;
                let html = heroState.list.map(u => {
                    return '<div class="g-thumb" data-gurl="' + escapeHtml(u) + '">' +
                        '<img src="' + escapeHtml(u) + '" alt="" loading="lazy" onerror="this.parentElement.remove()">' +
                        '<button type="button" class="g-del" data-hdel="' + escapeHtml(u) + '" aria-label="' + heroT('heroRemove') + '">&#10005;</button>' +
                        '</div>';
                }).join('');
                html += heroState.newFiles.map((f, i) => {
                    return '<div class="g-thumb g-thumb--new" data-gfile="' + i + '">' +
                        '<img src="' + escapeHtml(URL.createObjectURL(f)) + '" alt="">' +
                        '<button type="button" class="g-del" data-hdelfile="' + i + '" aria-label="' + heroT('heroRemove') + '">&#10005;</button>' +
                        '</div>';
                }).join('');
                if (heroState.list.length + heroState.newFiles.length < HERO_MAX) {
                    html += '<label class="g-add" for="heroFileInput" aria-label="' + heroT('heroAddAria') + '">+</label>';
                }
                box.innerHTML = html;
                const badge = document.getElementById('heroCountBadge');
                if (badge) badge.textContent = (heroState.list.length + heroState.newFiles.length) + '/' + HERO_MAX;
                hpRender();
            }

            function hpRender() {
                const wrap = document.getElementById('hpWrap');
                if (!wrap) return;
                const key = hpSelKey();
                const img = document.getElementById('hpImg');
                const badge = document.getElementById('hpBadge');
                const z = document.getElementById('hpZoom');
                if (!key) { wrap.hidden = true; renderHeroActiveThumb(null); return; }
                wrap.hidden = false;
                const src = hpSelSrc(key);
                if (img && img.getAttribute('data-src') !== src) {
                    img.setAttribute('data-src', src);
                    img.src = src;
                }
                const p = hpSelPos(key);
                if (img) img.style.transform = 'scale(' + p.zoom + ') translate(' + p.tx + '%, ' + p.ty + '%)';
                if (badge) {
                    const n = heroState.list.length + heroState.newFiles.length;
                    const idx = (key.indexOf('new:') === 0)
                        ? heroState.list.length + Number(key.slice(4)) + 1
                        : heroState.list.indexOf(key) + 1;
                    badge.textContent = (n > 1 ? ('#' + idx + ' · ') : '') +
                        Math.round(p.tx) + ' / ' + Math.round(p.ty) + ' · ×' + p.zoom.toFixed(1);
                }
                if (z && document.activeElement !== z) z.value = p.zoom;
                renderHeroActiveThumb(key);
            }

            function renderHeroActiveThumb(key) {
                const box = document.getElementById('heroGallery');
                if (!box) return;
                box.querySelectorAll('.g-thumb').forEach(th => {
                    const isActive = th.getAttribute('data-gurl') === key ||
                        th.getAttribute('data-gfile') === (key && key.indexOf('new:') === 0 ? key.slice(4) : '__none__');
                    th.classList.toggle('g-thumb--active', isActive);
                });
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

            function heroMsg(text, ok) {
                const el = document.getElementById('heroMsg');
                if (!el) return;
                if (!text) { el.classList.remove('show', 'ok'); el.textContent = ''; return; }
                el.textContent = text;
                el.classList.add('show');
                el.classList.toggle('ok', !!ok);
            }

            async function loadHeroSettings() {
                try {
                    const { data, error } = await supabase.from('settings').select('*');
                    if (error) throw error;
                    const settings = {};
                    (data || []).forEach(row => { settings[row.key] = row.value; });
                    let list = Array.isArray(settings.hero_images) ? settings.hero_images
                        .filter(u => typeof u === 'string' && u).slice(0, HERO_MAX) : [];
                    if (!list.length && typeof settings.hero_image === 'string' && settings.hero_image) {
                        list = [settings.hero_image]; // legacy single-image key
                    }
                    heroState.list = list;
                    heroState.newFiles = [];
                    heroState.objUrls = {};
                    heroState.selected = null;
                    heroState.posMap = hpSeedMap(settings.hero_position, list);
                    heroState.posBase = hpCloneMap(heroState.posMap);
                    heroState.dirtyPos = false;
                    renderHeroGallery();
                } catch (e) {
                    heroMsg('⚠ ' + (e && e.message ? e.message : String(e)));
                }
            }

            async function saveHeroSettings() {
                if (heroState.saving) return;
                heroState.saving = true;
                const btn = document.getElementById('btnSaveHero');
                if (btn) btn.disabled = true;
                try {
                    const list = heroState.list.slice();
                    // 1. upload pending files to bucket product-images, folder hero/
                    for (let i = 0; i < heroState.newFiles.length; i++) {
                        heroMsg(heroT('heroUploading') + ' ' + (i + 1) + '/' + heroState.newFiles.length + '…', true);
                        const { blob, ext } = await heroCompress(heroState.newFiles[i]);
                        const path = 'hero/hero-' + Date.now() + '-' + i + '.' + ext;
                        const { error: upErr } = await supabase.storage
                            .from('product-images')
                            .upload(path, blob, { contentType: 'image/' + ext, upsert: true });
                        if (upErr) throw upErr;
                        const { data: pub } = supabase.storage.from('product-images').getPublicUrl(path);
                        const url = pub.publicUrl;
                        if (heroState.posMap['new:' + i]) {
                            heroState.posMap[url] = heroState.posMap['new:' + i];
                            delete heroState.posMap['new:' + i];
                        }
                        list.push(url);
                    }
                    // 2. merge-duplicates upsert of the two settings rows
                    const rows = [{ key: 'hero_images', value: list }];
                    const willSavePos = heroState.dirtyPos || heroState.newFiles.length > 0;
                    if (willSavePos) {
                        const posMap = {};
                        list.forEach(u => {
                            const p = heroState.posMap[u];
                            if (p) posMap[u] = {
                                tx: (Math.round(p.tx * 10) / 10) + '%',
                                ty: (Math.round(p.ty * 10) / 10) + '%',
                                zoom: Math.round(p.zoom * 100) / 100
                            };
                        });
                        rows.push({ key: 'hero_position', value: posMap });
                    }
                    const { error: sbErr } = await supabase
                        .from('settings')
                        .upsert(rows, { onConflict: 'key' }); // -> Prefer: resolution=merge-duplicates
                    if (sbErr) throw sbErr;
                    // 3. commit local state
                    heroState.list = list;
                    heroState.newFiles = [];
                    Object.keys(heroState.objUrls).forEach(k => {
                        try { URL.revokeObjectURL(heroState.objUrls[k]); } catch (e) { }
                    });
                    heroState.objUrls = {};
                    const savedPos = {};
                    list.forEach(u => {
                        const p = heroState.posMap[u];
                        if (p) savedPos[u] = {
                            tx: (Math.round(p.tx * 10) / 10) + '%',
                            ty: (Math.round(p.ty * 10) / 10) + '%',
                            zoom: Math.round(p.zoom * 100) / 100
                        };
                    });
                    heroState.posMap = hpSeedMap(savedPos, list);
                    heroState.posBase = hpCloneMap(heroState.posMap);
                    heroState.selected = list[0] || null;
                    heroState.dirtyPos = false;
                    if (btn) btn.classList.remove('hp-btn--pulse');
                    renderHeroGallery();
                    heroMsg('');
                    const saved = document.getElementById('heroSavedBadge');
                    if (saved) {
                        saved.hidden = false;
                        clearTimeout(saveHeroSettings._t);
                        saveHeroSettings._t = setTimeout(() => { saved.hidden = true; }, 3500);
                    }
                    showToast(heroT('heroSaved'));
                } catch (e) {
                    heroMsg('⚠ ' + (e && e.message ? e.message : heroT('heroError')));
                } finally {
                    heroState.saving = false;
                    if (btn) btn.disabled = false;
                }
            }

            function bindHeroEditor() {
                const frame = document.getElementById('hpFrame');
                if (!frame || frame.dataset.hpBound) return;
                frame.dataset.hpBound = '1';

                let drag = null;
                frame.addEventListener('pointerdown', (e) => {
                    const p = hpSelPos(hpSelKey());
                    if (!p) return;
                    drag = { x: e.clientX, y: e.clientY, tx: p.tx, ty: p.ty };
                    frame.classList.add('dragging');
                    try { frame.setPointerCapture(e.pointerId); } catch (err) { }
                    e.preventDefault();
                });
                frame.addEventListener('pointermove', (e) => {
                    if (!drag) return;
                    const r = frame.getBoundingClientRect();
                    const p = hpSelPos(hpSelKey());
                    if (!p) return;
                    p.tx = hpClamp(drag.tx + (e.clientX - drag.x) / r.width * 100, -50, 50);
                    p.ty = hpClamp(drag.ty + (e.clientY - drag.y) / r.height * 100, -50, 50);
                    hpDirty(); hpRender();
                });
                ['pointerup', 'pointercancel'].forEach(ev => {
                    frame.addEventListener(ev, () => {
                        drag = null;
                        frame.classList.remove('dragging');
                    });
                });
                frame.addEventListener('wheel', (e) => {
                    const p = hpSelPos(hpSelKey());
                    if (!p) return;
                    e.preventDefault();
                    p.zoom = hpClamp(p.zoom * (e.deltaY < 0 ? 1.06 : 1 / 1.06), 1, 3);
                    hpDirty(); hpRender();
                }, { passive: false });

                document.getElementById('hpZoom').addEventListener('input', function () {
                    const p = hpSelPos(hpSelKey());
                    if (!p) return;
                    p.zoom = hpClamp(Number(this.value), 1, 3);
                    hpDirty(); hpRender();
                });
                document.getElementById('hpReset').addEventListener('click', () => {
                    const key = hpSelKey();
                    if (!key) return;
                    heroState.posMap[key] = hpNormalize();
                    hpDirty(); hpRender();
                });

                const box = document.getElementById('heroGallery');
                if (box) box.addEventListener('click', (e) => {
                    const del = e.target.closest('[data-hdel]');
                    if (del) {
                        e.stopPropagation();
                        hpDropUrl(del.getAttribute('data-hdel'));
                        heroState.list = heroState.list.filter(u => u !== del.getAttribute('data-hdel'));
                        renderHeroGallery();
                        return;
                    }
                    const delF = e.target.closest('[data-hdelfile]');
                    if (delF) {
                        e.stopPropagation();
                        const idx = Number(delF.getAttribute('data-hdelfile'));
                        hpDropFileIdx(idx);
                        heroState.newFiles.splice(idx, 1);
                        renderHeroGallery();
                        return;
                    }
                    const th = e.target.closest('.g-thumb');
                    if (!th) return;
                    const url = th.getAttribute('data-gurl');
                    const fi = th.getAttribute('data-gfile');
                    heroState.selected = url || ('new:' + fi);
                    hpRender();
                });

                const fileInput = document.getElementById('heroFileInput');
                if (fileInput) fileInput.addEventListener('change', async (e) => {
                    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
                    fileInput.value = '';
                    for (const file of files) {
                        if (heroState.list.length + heroState.newFiles.length >= HERO_MAX) {
                            heroMsg('⚠ ' + heroT('heroLimit'));
                            break;
                        }
                        heroState.newFiles.push(file);
                    }
                    renderHeroGallery();
                    const keys = heroState.newFiles.map((_, i) => 'new:' + i);
                    if (keys.length) heroState.selected = keys[keys.length - 1];
                    hpRender();
                });

                document.getElementById('btnSaveHero').addEventListener('click', saveHeroSettings);
            }


            // ════════════ Notre Collection menu editor ════════════
            const COLL_MAX = 8;
            const COLL_SLUGS = ['inspires', 'voiture', 'ambiance', 'musc', 'accessoires', 'custom'];
            const COLL_DEFAULTS = [
                { slug: 'inspires', fr: 'Parfums inspirés', en: 'Inspired perfumes', ar: 'عطور مستوحاة', href: 'cat.html?cat=inspires' },
                { slug: 'voiture', fr: 'Parfums pour voiture', en: 'Car perfumes', ar: 'عطور السيارات', href: 'cat.html?cat=voiture' },
                { slug: 'ambiance', fr: "Parfums d'ambiance", en: 'Home fragrances', ar: 'عطورات الجو', href: 'cat.html?cat=ambiance' },
                { slug: 'musc', fr: 'Musc', en: 'Musk', ar: 'مسك', href: 'cat.html?cat=musc' },
                { slug: 'accessoires', fr: 'Accessoires', en: 'Accessories', ar: 'إكسسوارات', href: 'cat.html?cat=accessoires' }
            ];
            let collState = [];
            let collLoaded = false;

            function collEsc(s) {
                return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
                    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
            }
            function collT(key) {
                const d = translations[currentLanguage] || translations.fr;
                return d[key] || (translations.fr[key] || key);
            }
            function collMsg(text, ok) {
                const el = document.getElementById('collMsg');
                if (!el) return;
                el.textContent = text || '';
                el.style.color = ok ? 'var(--green, #1d7a4f)' : 'var(--red, #b04a4a)';
                if (text) setTimeout(() => { if (el.textContent === text) el.textContent = ''; }, 6000);
            }
            function collRenderRows() {
                const host = document.getElementById('collRows');
                if (!host) return;
                document.getElementById('collCountBadge').textContent = collState.length + '/' + COLL_MAX;
                host.innerHTML = collState.length
                    ? '<div class="coll-lang-head"><span></span><span>FR</span><span>EN</span><span>AR</span><span>SLUG</span><span></span><span></span></div>'
                    : '';
                collState.forEach((it, i) => {
                    const row = document.createElement('div');
                    row.className = 'coll-row';
                    row.innerHTML =
                        '<div class="coll-ord">' +
                            '<button type="button" data-cmove="up"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
                            '<button type="button" data-cmove="down"' + (i === collState.length - 1 ? ' disabled' : '') + '>↓</button>' +
                        '</div>' +
                        '<input data-cfield="fr" maxlength="60" placeholder="Nom FR" value="' + collEsc(it.fr) + '">' +
                        '<input data-cfield="en" maxlength="60" placeholder="Name EN" value="' + collEsc(it.en) + '">' +
                        '<input data-cfield="ar" maxlength="60" placeholder="الاسم AR" dir="rtl" value="' + collEsc(it.ar) + '">' +
                        '<select data-cfield="slug">' + COLL_SLUGS.map(s =>
                            '<option value="' + s + '"' + (it.slug === s ? ' selected' : '') + '>' + s + '</option>').join('') +
                        '</select>' +
                        '<button type="button" class="coll-del" data-cdel title="' + collEsc(collT('collDel')) + '"><i class="fas fa-trash"></i></button>';
                    host.appendChild(row);
                });
            }
            function collBind() {
                const host = document.getElementById('collRows');
                if (!host) return;
                host.addEventListener('input', e => {
                    const row = e.target.closest('.coll-row');
                    const inp = e.target.closest('[data-cfield]');
                    if (!row || !inp) return;
                    const i = Array.from(host.querySelectorAll('.coll-row')).indexOf(row);
                    if (i >= 0) { collState[i][inp.getAttribute('data-cfield')] = inp.value; collLoaded = true; }
                });
                host.addEventListener('click', e => {
                    const mv = e.target.closest('[data-cmove]');
                    const del = e.target.closest('[data-cdel]');
                    const row = e.target.closest('.coll-row');
                    if (!row) return;
                    const i = Array.from(host.querySelectorAll('.coll-row')).indexOf(row);
                    if (i < 0) return;
                    if (mv) {
                        const dir = mv.getAttribute('data-cmove') === 'up' ? -1 : 1;
                        if (i + dir < 0 || i + dir >= collState.length) return;
                        const tmp = collState[i]; collState[i] = collState[i + dir]; collState[i + dir] = tmp;
                        collRenderRows();
                    } else if (del) {
                        collState.splice(i, 1);
                        collRenderRows();
                    }
                });
                document.getElementById('btnAddCollRow').addEventListener('click', () => {
                    if (collState.length >= COLL_MAX) { collMsg('⚠ ' + collT('collLimit')); return; }
                    collState.push({ slug: 'custom', fr: '', en: '', ar: '', href: '' });
                    collRenderRows();
                });
                document.getElementById('btnSaveColl').addEventListener('click', saveCollSettings);
            }
            async function loadCollSettings() {
                try {
                    const { data, error } = await supabase.from('settings').select('*').eq('key', 'collections');
                    if (error) throw error;
                    const v = data && data[0] && data[0].value;
                    collState = Array.isArray(v) && v.length
                        ? v.slice(0, COLL_MAX).map(it => ({
                            slug: String(it.slug || 'custom'),
                            fr: String(it.fr || ''), en: String(it.en || ''), ar: String(it.ar || ''),
                            href: String(it.href || '')
                        }))
                        : COLL_DEFAULTS.map(d => Object.assign({}, d));
                } catch (e) {
                    console.error('collections load', e);
                    collState = COLL_DEFAULTS.map(d => Object.assign({}, d));
                }
                collRenderRows();
            }
            async function saveCollSettings() {
                const rows = collState.map(it => ({
                    slug: String(it.slug || 'custom').trim().toLowerCase(),
                    fr: String(it.fr || '').trim(),
                    en: String(it.en || '').trim(),
                    ar: String(it.ar || '').trim(),
                    href: String(it.href || '').trim()
                }));
                if (!rows.length) { collMsg('⚠ ' + collT('collNeedLangs')); return; }
                for (const r of rows) {
                    if (!r.fr || !r.en || !r.ar) { collMsg('⚠ ' + collT('collNeedLangs')); return; }
                }
                const btn = document.getElementById('btnSaveColl');
                btn.disabled = true;
                try {
                    const { error } = await supabase.from('settings').upsert(
                        [{ key: 'collections', value: rows }], { onConflict: 'key' });
                    if (error) throw error;
                    collMsg(collT('collSaved'), true);
                    const badge = document.getElementById('collSavedBadge');
                    badge.hidden = false;
                    setTimeout(() => { badge.hidden = true; }, 2500);
                } catch (e) {
                    console.error(e);
                    collMsg('❌ ' + (e.message || e));
                } finally {
                    btn.disabled = false;
                }
            }

            translatePage(currentLanguage);
            loadProducts();
            bindHeroEditor();
            loadHeroSettings();
            collBind();
            loadCollSettings();
        })();
    