
        (function () {
            const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
            const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
            const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

            let currentLanguage = localStorage.getItem('language') || 'fr';
            let productId = null;
            let currentProduct = null;
            let uploadedImages = [];

            const translations = {
                fr: {
                    home: 'ACCUEIL', men: 'HOMME', women: 'FEMME', unisex: 'UNISEXE', kids: 'ENFANTS',
                    existing: 'PARFUMS EXISTANTS', login: 'Se connecter', profile: 'Mon Profil',
                    back: 'Retour', editProduct: 'Modifier le produit', productInfo: 'Informations produit',
                    productName: 'Nom du produit', brand: 'Marque / Maison', price: 'Prix (TND)',
                    quantity: 'Quantité en stock', description: 'Description', productImages: 'Images du produit',
                    addImages: 'Ajouter des images', imagesInfo: 'Vous pouvez ajouter plusieurs images. La première sera l\'image principale.',
                    category: 'Catégorie', menCat: 'Homme', womenCat: 'Femme', unisexCat: 'Unisexe', kidsCat: 'Enfants',
                    season: 'Saisons (plusieurs choix possibles)', summer: 'Été', winter: 'Hiver', spring: 'Printemps', autumn: 'Automne',
                    seasonHint: 'Sélectionnez une ou plusieurs saisons (cliquez pour sélectionner/désélectionner)',
                    saveChanges: 'Enregistrer les modifications', cancel: 'Annuler',
                    loading: 'Chargement...', productNotFound: '❌ Produit non trouvé',
                    productUpdated: '✅ Produit mis à jour', errorUpdating: '❌ Erreur lors de la mise à jour',
                    invalidFields: '❌ Nom, marque et prix valides requis',
                    footerDescription: "Parfumerie d'exception depuis 1985. L'art de la parfumerie orientale réinventé pour les connaisseurs exigeants.",
                    footerPerfumesTitle: "Parfums", footerMen: "Homme", footerWomen: "Femme", footerUnisex: "Unisexe", footerKids: "Enfants",
                    footerContactTitle: "Contact", footerAddress: "Tunis, Tunisie", footerPhone: "+216 96 163 366",
                    footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. Tous droits réservés."
                },
                en: {
                    home: 'HOME', men: 'MEN', women: 'WOMEN', unisex: 'UNISEX', kids: 'KIDS',
                    existing: 'EXISTING PERFUMES', login: 'Sign in', profile: 'My Profile',
                    back: 'Back', editProduct: 'Edit Product', productInfo: 'Product Information',
                    productName: 'Product Name', brand: 'Brand / House', price: 'Price (TND)',
                    quantity: 'Quantity in stock', description: 'Description', productImages: 'Product Images',
                    addImages: 'Add Images', imagesInfo: 'You can add multiple images. The first one will be the main image.',
                    category: 'Category', menCat: 'Men', womenCat: 'Women', unisexCat: 'Unisex', kidsCat: 'Kids',
                    season: 'Seasons (multiple choices possible)', summer: 'Summer', winter: 'Winter', spring: 'Spring', autumn: 'Autumn',
                    seasonHint: 'Select one or more seasons (click to select/deselect)',
                    saveChanges: 'Save changes', cancel: 'Cancel',
                    loading: 'Loading...', productNotFound: '❌ Product not found',
                    productUpdated: '✅ Product updated', errorUpdating: '❌ Error updating product',
                    invalidFields: '❌ Valid name, brand and price required',
                    footerDescription: "Exceptional perfumery since 1985. The art of oriental perfumery reinvented for discerning connoisseurs.",
                    footerPerfumesTitle: "Perfumes", footerMen: "Men", footerWomen: "Women", footerUnisex: "Unisex", footerKids: "Kids",
                    footerContactTitle: "Contact", footerAddress: "Tunis, Tunisia", footerPhone: "+216 96 163 366",
                    footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. All rights reserved."
                },
                ar: {
                    home: 'الرئيسية', men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال',
                    existing: 'العطور الموجودة', login: 'تسجيل الدخول', profile: 'ملفي الشخصي',
                    back: 'رجوع', editProduct: 'تعديل المنتج', productInfo: 'معلومات المنتج',
                    productName: 'اسم المنتج', brand: 'العلامة التجارية', price: 'السعر (دينار)',
                    quantity: 'الكمية في المخزون', description: 'الوصف', productImages: 'صور المنتج',
                    addImages: 'إضافة صور', imagesInfo: 'يمكنك إضافة عدة صور. الصورة الأولى ستكون الصورة الرئيسية.',
                    category: 'الفئة', menCat: 'رجالي', womenCat: 'نسائي', unisexCat: 'للجنسين', kidsCat: 'أطفال',
                    season: 'المواسم (اختيارات متعددة ممكنة)', summer: 'صيف', winter: 'شتاء', spring: 'ربيع', autumn: 'خريف',
                    seasonHint: 'اختر موسماً واحداً أو أكثر (انقر للتحديد/إلغاء التحديد)',
                    saveChanges: 'حفظ التغييرات', cancel: 'إلغاء',
                    loading: 'جاري التحميل...', productNotFound: '❌ المنتج غير موجود',
                    productUpdated: '✅ تم تحديث المنتج', errorUpdating: '❌ خطأ في تحديث المنتج',
                    invalidFields: '❌ الاسم والعلامة التجارية والسعر مطلوبة',
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
            }

            function showToast(msg) {
                const toast = document.getElementById('adminToast');
                toast.textContent = msg;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2500);
            }

            function parseImages(images) {
                if (!images) return [];
                try {
                    return typeof images === 'string' ? JSON.parse(images) : (images || []);
                } catch (e) {
                    return [];
                }
            }

            function parseSeasons(seasonStr) {
                if (!seasonStr) return [];
                if (seasonStr === 'all') return ['summer', 'winter', 'spring', 'autumn'];
                return seasonStr.split(',');
            }

            function updateImagePreview() {
                const grid = document.getElementById('imagePreviewGrid');
                if (!grid) return;

                grid.innerHTML = '';
                if (uploadedImages.length === 0) {
                    const emptyDiv = document.createElement('div');
                    emptyDiv.style.cssText = 'grid-column:1/-1; text-align:center; padding:1rem; color:var(--text-mid);';
                    emptyDiv.innerHTML = `<i class="fas fa-images"></i> ${translations[currentLanguage].noImages || 'Aucune image'}`;
                    grid.appendChild(emptyDiv);
                } else {
                    uploadedImages.forEach((imgBase64, index) => {
                        const div = document.createElement('div');
                        div.className = 'preview-item';
                        div.innerHTML = `
              <img src="${imgBase64}" alt="image ${index + 1}">
              <button class="remove-image-btn" data-index="${index}"><i class="fas fa-times"></i></button>
            `;
                        grid.appendChild(div);
                    });
                }

                document.querySelectorAll('.remove-image-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const index = parseInt(btn.dataset.index);
                        uploadedImages.splice(index, 1);
                        updateImagePreview();
                    });
                });
            }

            async function loadProduct() {
                const urlParams = new URLSearchParams(window.location.search);
                productId = urlParams.get('id');

                if (!productId) {
                    document.getElementById('errorContent').style.display = 'block';
                    document.getElementById('errorContent').innerHTML = translations[currentLanguage].productNotFound;
                    document.getElementById('loadingContent').style.display = 'none';
                    return;
                }

                try {
                    const { data, error } = await supabase.from('products').select('*').eq('id', productId).single();
                    if (error) throw error;
                    if (!data) {
                        document.getElementById('errorContent').style.display = 'block';
                        document.getElementById('errorContent').innerHTML = translations[currentLanguage].productNotFound;
                        document.getElementById('loadingContent').style.display = 'none';
                        return;
                    }

                    currentProduct = data;
                    populateForm(data);
                    document.getElementById('loadingContent').style.display = 'none';
                    document.getElementById('editFormContainer').style.display = 'block';
                } catch (error) {
                    console.error('Error loading product:', error);
                    document.getElementById('errorContent').style.display = 'block';
                    document.getElementById('errorContent').innerHTML = translations[currentLanguage].productNotFound;
                    document.getElementById('loadingContent').style.display = 'none';
                }
            }

            function populateForm(product) {
                document.getElementById('productName').value = product.name || '';
                document.getElementById('productBrand').value = product.brand || '';
                document.getElementById('productPrice').value = product.price || '';
                document.getElementById('productQuantity').value = product.quantity || 0;
                document.getElementById('productDescription').value = product.description || '';

                const existingImages = parseImages(product.images);
                uploadedImages = [...existingImages];
                updateImagePreview();

                // Set category
                const categoryOptions = document.querySelectorAll('.category-option');
                categoryOptions.forEach(opt => {
                    opt.classList.remove('selected');
                    if (opt.dataset.category === product.category) {
                        opt.classList.add('selected');
                    }
                });

                // Set seasons (multi-select)
                const seasonOptions = document.querySelectorAll('.season-option');
                seasonOptions.forEach(opt => opt.classList.remove('selected'));

                const selectedSeasons = parseSeasons(product.season);
                seasonOptions.forEach(opt => {
                    if (selectedSeasons.includes(opt.dataset.season)) {
                        opt.classList.add('selected');
                    }
                });
            }

            async function updateProduct() {
                const name = document.getElementById('productName').value.trim();
                const brand = document.getElementById('productBrand').value.trim();
                const price = parseFloat(document.getElementById('productPrice').value);
                const quantity = parseInt(document.getElementById('productQuantity').value) || 0;
                const description = document.getElementById('productDescription').value.trim();

                if (!name || !brand || isNaN(price) || price <= 0) {
                    showToast(translations[currentLanguage].invalidFields);
                    return;
                }

                const selectedCategory = document.querySelector('.category-option.selected')?.dataset.category || 'man';

                // Get selected seasons (multi-select)
                const selectedSeasons = [];
                document.querySelectorAll('.season-option.selected').forEach(opt => {
                    selectedSeasons.push(opt.dataset.season);
                });

                // Store as comma-separated string, or 'all' if all four are selected
                let seasonValue = selectedSeasons.join(',');
                if (selectedSeasons.length === 4) {
                    seasonValue = 'all';
                }

                try {
                    const updateData = {
                        name,
                        brand,
                        price,
                        quantity,
                        description: description || null,
                        images: JSON.stringify(uploadedImages),
                        category: selectedCategory,
                        season: seasonValue,
                        updated_at: new Date().toISOString()
                    };

                    const { error } = await supabase.from('products').update(updateData).eq('id', productId);
                    if (error) throw error;

                    showToast(translations[currentLanguage].productUpdated);
                    setTimeout(() => {
                        window.location.href = document.referrer || 'existed.html';
                    }, 1500);
                } catch (error) {
                    console.error('Error updating product:', error);
                    showToast(translations[currentLanguage].errorUpdating);
                }
            }

            // Image upload
            const imageUpload = document.getElementById('imageUpload');
            const addMoreImagesBtn = document.getElementById('addMoreImagesBtn');

            addMoreImagesBtn?.addEventListener('click', () => imageUpload.click());
            imageUpload?.addEventListener('change', function (e) {
                const files = Array.from(e.target.files);
                files.forEach(file => {
                    if (!file.type.startsWith('image/')) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        uploadedImages.push(ev.target.result);
                        updateImagePreview();
                    };
                    reader.readAsDataURL(file);
                });
                imageUpload.value = '';
            });

            // Category selection (single)
            document.querySelectorAll('.category-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');
                });
            });

            // Season selection (multi-select)
            document.querySelectorAll('.season-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    opt.classList.toggle('selected');
                });
            });

            document.getElementById('updateProductBtn')?.addEventListener('click', updateProduct);

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
            document.getElementById('loadingContent').style.display = 'block';
            loadProduct();
        })();
    