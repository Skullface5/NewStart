
    (function () {
      const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
      const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      let currentLanguage = localStorage.getItem('language') || 'fr';

      const translations = {
        fr: {
          home: 'ACCUEIL', men: 'HOMME', women: 'FEMME', unisex: 'UNISEXE', kids: 'ENFANTS',
          existing: 'PARFUMS EXISTANTS', login: 'Se connecter', profile: 'Mon Profil',
          manageProducts: 'Gérer les produits', addPerfume: 'Ajouter un parfum',
          productName: 'Nom du produit', brand: 'Marque / Maison', price: 'Prix (TND)',
          quantity: 'Quantité en stock',
          description: 'Description', productImages: 'Images du produit', addImages: 'Ajouter des images',
          imagesInfo: 'Vous pouvez ajouter plusieurs images. La première sera l\'image principale.',
          category: 'Catégorie', menCat: 'Homme', womenCat: 'Femme', unisexCat: 'Unisexe', kidsCat: 'Enfants',
          season: 'Saisons (plusieurs choix possibles)', summer: 'Été', winter: 'Hiver', spring: 'Printemps', autumn: 'Automne',
          seasonHint: 'Sélectionnez une ou plusieurs saisons (cliquez pour sélectionner/désélectionner)',
          saveProduct: 'Enregistrer le produit', storageInfo: 'Les images sont optimisées (WebP) et stockées dans Supabase Storage',
          viewExisting: 'Voir les parfums existants', notAuthorized: 'Accès non autorisé',
          adminOnly: 'Cette page est réservée aux administrateurs. Veuillez vous connecter avec un compte administrateur.',
          productAdded: '✅ Produit ajouté', errorAdding: '❌ Erreur lors de l\'ajout',
          invalidFields: '❌ Nom, marque et prix valides requis', noImages: 'Aucune image',
          footerDescription: "Parfumerie d'exception depuis 1985. L'art de la parfumerie orientale réinventé pour les connaisseurs exigeants.",
          footerPerfumesTitle: "Parfums", footerMen: "Homme", footerWomen: "Femme", footerUnisex: "Unisexe", footerKids: "Enfants",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisie", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. Tous droits réservés."
        },
        en: {
          home: 'HOME', men: 'MEN', women: 'WOMEN', unisex: 'UNISEX', kids: 'KIDS',
          existing: 'EXISTING PERFUMES', login: 'Sign in', profile: 'My Profile',
          manageProducts: 'Manage Products', addPerfume: 'Add Perfume',
          productName: 'Product Name', brand: 'Brand / House', price: 'Price (TND)',
          quantity: 'Quantity in stock',
          description: 'Description', productImages: 'Product Images', addImages: 'Add Images',
          imagesInfo: 'You can add multiple images. The first one will be the main image.',
          category: 'Category', menCat: 'Men', womenCat: 'Women', unisexCat: 'Unisex', kidsCat: 'Kids',
          season: 'Seasons (multiple choices possible)', summer: 'Summer', winter: 'Winter', spring: 'Spring', autumn: 'Autumn',
          seasonHint: 'Select one or more seasons (click to select/deselect)',
          saveProduct: 'Save Product', storageInfo: 'Images are optimized (WebP) and stored in Supabase Storage',
          viewExisting: 'View existing perfumes', notAuthorized: 'Access Denied',
          adminOnly: 'This page is for administrators only. Please log in with an admin account.',
          productAdded: '✅ Product added', errorAdding: '❌ Error adding product',
          invalidFields: '❌ Valid name, brand and price required', noImages: 'No images',
          footerDescription: "Exceptional perfumery since 1985. The art of oriental perfumery reinvented for discerning connoisseurs.",
          footerPerfumesTitle: "Perfumes", footerMen: "Men", footerWomen: "Women", footerUnisex: "Unisex", footerKids: "Kids",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisia", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. All rights reserved."
        },
        ar: {
          home: 'الرئيسية', men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال',
          existing: 'العطور الموجودة', login: 'تسجيل الدخول', profile: 'ملفي الشخصي',
          manageProducts: 'إدارة المنتجات', addPerfume: 'إضافة عطر',
          productName: 'اسم المنتج', brand: 'العلامة التجارية', price: 'السعر (دينار)',
          quantity: 'الكمية في المخزون',
          description: 'الوصف', productImages: 'صور المنتج', addImages: 'إضافة صور',
          imagesInfo: 'يمكنك إضافة عدة صور. الصورة الأولى ستكون الصورة الرئيسية.',
          category: 'الفئة', menCat: 'رجالي', womenCat: 'نسائي', unisexCat: 'للجنسين', kidsCat: 'أطفال',
          season: 'المواسم (اختيارات متعددة ممكنة)', summer: 'صيف', winter: 'شتاء', spring: 'ربيع', autumn: 'خريف',
          seasonHint: 'اختر موسماً واحداً أو أكثر (انقر للتحديد/إلغاء التحديد)',
          saveProduct: 'حفظ المنتج', storageInfo: 'تتم تحسين الصور (WebP) وتخزينها في Supabase Storage',
          viewExisting: 'عرض العطور الموجودة', notAuthorized: 'وصول غير مصرح به',
          adminOnly: 'هذه الصفحة مخصصة للمشرفين فقط. الرجاء تسجيل الدخول بحساب مشرف.',
          productAdded: '✅ تمت إضافة المنتج', errorAdding: '❌ خطأ في إضافة المنتج',
          invalidFields: '❌ الاسم والعلامة التجارية والسعر مطلوبة', noImages: 'لا توجد صور',
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
        updateImagePreview();
      }

      function showAdminToast(msgKey) {
        const toast = document.getElementById('adminToast');
        toast.textContent = translations[currentLanguage][msgKey] || msgKey;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      }

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
        if (navLinks.classList.contains('active')) closeCart?.();
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


      // Image compression -> WebP (keeps DB + Storage lean)
      function compressToWebp(file) {
        return new Promise((resolve) => {
          const url = URL.createObjectURL(file);
          const img = new Image();
          img.onload = () => {
            URL.revokeObjectURL(url);
            try {
              let { width: w, height: h } = img;
              if (Math.max(w, h) > 1000) {
                const k = 1000 / Math.max(w, h);
                w = Math.round(w * k); h = Math.round(h * k);
              }
              const canvas = document.createElement('canvas');
              canvas.width = w; canvas.height = h;
              canvas.getContext('2d').drawImage(img, 0, 0, w, h);
              canvas.toBlob((blob) => {
                if (blob && blob.type === 'image/webp') resolve({ blob, ext: 'webp' });
                else resolve({ blob: file, ext: (file.name.split('.').pop() || 'jpg').toLowerCase() });
              }, 'image/webp', 0.82);
            } catch (e) {
              resolve({ blob: file, ext: (file.name.split('.').pop() || 'jpg').toLowerCase() });
            }
          };
          img.onerror = () => { URL.revokeObjectURL(url); resolve({ blob: file, ext: (file.name.split('.').pop() || 'jpg').toLowerCase() }); };
          img.src = url;
        });
      }
      function extOf(mime, fallback) {
        if (mime === 'image/webp') return 'webp';
        if (mime === 'image/png') return 'png';
        if (mime === 'image/gif') return 'gif';
        return fallback;
      }

      // Image Upload
      let uploadedImages = []; // { blob, ext, preview }
      const imagePreviewGrid = document.getElementById('imagePreviewGrid');
      const imageUpload = document.getElementById('imageUpload');
      const addMoreImagesBtn = document.getElementById('addMoreImagesBtn');

      function updateImagePreview() {
        if (!imagePreviewGrid) return;
        imagePreviewGrid.innerHTML = '';
        if (uploadedImages.length === 0) {
          const emptyDiv = document.createElement('div');
          emptyDiv.style.cssText = 'grid-column:1/-1; text-align:center; padding:1rem; color:var(--text-mid);';
          emptyDiv.innerHTML = `<i class="fas fa-images"></i> ${translations[currentLanguage].noImages}`;
          imagePreviewGrid.appendChild(emptyDiv);
        } else {
          uploadedImages.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
              <img src="${item.preview}" alt="image ${index + 1}" loading="lazy">
              <button class="remove-image-btn" data-index="${index}"><i class="fas fa-times"></i></button>
            `;
            imagePreviewGrid.appendChild(div);
          });
        }

        document.querySelectorAll('.remove-image-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            try { URL.revokeObjectURL(uploadedImages[index].preview); } catch (e) {}
            uploadedImages.splice(index, 1);
            updateImagePreview();
          });
        });
      }

      addMoreImagesBtn?.addEventListener('click', () => imageUpload.click());
      imageUpload?.addEventListener('change', function (e) {
        const files = Array.from(e.target.files);
        (async () => {
          for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            const { blob, ext } = await compressToWebp(file);
            uploadedImages.push({ blob, ext, preview: URL.createObjectURL(blob) });
            updateImagePreview();
          }
        })();
        imageUpload.value = '';
      });

      // Category selection
      let selectedCategory = 'man';

      document.querySelectorAll('.category-option').forEach(opt => {
        opt.addEventListener('click', () => {
          document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          selectedCategory = opt.dataset.category;
        });
      });

      // Multi-season selection
      let selectedSeasons = [];

      document.querySelectorAll('.season-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const season = opt.dataset.season;
          if (selectedSeasons.includes(season)) {
            selectedSeasons = selectedSeasons.filter(s => s !== season);
            opt.classList.remove('selected');
          } else {
            selectedSeasons.push(season);
            opt.classList.add('selected');
          }
        });
      });

      // Add Product
      async function addProduct() {
        const name = document.getElementById('productName')?.value.trim();
        const brand = document.getElementById('productBrand')?.value.trim();
        const price = parseFloat(document.getElementById('productPrice')?.value);
        const quantity = parseInt(document.getElementById('productQuantity')?.value) || 0;
        const description = document.getElementById('productDescription')?.value.trim();

        if (!name || !brand || isNaN(price) || price <= 0) {
          showAdminToast('invalidFields');
          return;
        }

        // If no seasons selected, default to all
        const seasonsToSave = selectedSeasons.length > 0 ? selectedSeasons : ['all'];

        try {
          // Upload images to Supabase Storage -> public webp/CDN URLs
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'prod';
          const ts = Date.now();
          const urls = [];
          for (let i = 0; i < uploadedImages.length; i++) {
            const item = uploadedImages[i];
            const path = `admin/${slug}-${ts}/${i}.${item.ext}`;
            const { data: up, error: upErr } = await supabase.storage
              .from('product-images')
              .upload(path, item.blob, { contentType: `image/${item.ext}`, upsert: true });
            if (upErr) throw upErr;
            const { data: pub } = supabase.storage.from('product-images').getPublicUrl(path);
            urls.push(pub.publicUrl);
          }

          const newProduct = {
            name, brand, price, quantity,
            description: description || null,
            images: JSON.stringify(urls),
            icon: 'fa-crown',
            category: selectedCategory,
            season: seasonsToSave.join(',') // Store as comma-separated string
          };

          const { error } = await supabase.from('products').insert([newProduct]);
          if (error) throw error;

          // Reset form
          document.getElementById('productName').value = '';
          document.getElementById('productBrand').value = '';
          document.getElementById('productPrice').value = '';
          document.getElementById('productQuantity').value = '0';
          document.getElementById('productDescription').value = '';
          uploadedImages.forEach(item => { try { URL.revokeObjectURL(item.preview); } catch (e) {} });
          uploadedImages = [];
          updateImagePreview();

          // Reset category
          document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
          document.querySelector('.category-option[data-category="man"]').classList.add('selected');
          selectedCategory = 'man';

          // Reset seasons
          selectedSeasons = [];
          document.querySelectorAll('.season-option').forEach(o => o.classList.remove('selected'));

          showAdminToast('productAdded');
        } catch (error) {
          console.error('Error adding product:', error);
          showAdminToast('errorAdding');
        }
      }

      document.getElementById('addProductBtn')?.addEventListener('click', addProduct);

      // Auth Check
      let isUpdatingUser = false, updateUserTimeout;

      async function checkAdminAccess() {
        const adminContent = document.getElementById('adminContent');
        const notAuthorized = document.getElementById('notAuthorized');
        const loggedInAs = document.getElementById('loggedInAs');

        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            if (adminContent) adminContent.style.display = 'none';
            if (notAuthorized) notAuthorized.style.display = 'block';
            return;
          }

          // Check if user is admin (azmmeli146@gmail.com)
          if (user.email !== 'azmmeli146@gmail.com') {
            if (adminContent) adminContent.style.display = 'none';
            if (notAuthorized) notAuthorized.style.display = 'block';
            return;
          }

          // User is admin - show content
          if (adminContent) adminContent.style.display = 'block';
          if (notAuthorized) notAuthorized.style.display = 'none';
          if (loggedInAs) loggedInAs.textContent = `⚡ ${user.email} · ${new Date().toLocaleDateString('fr-FR')}`;

        } catch (error) {
          console.error('Auth check error:', error);
          if (adminContent) adminContent.style.display = 'none';
          if (notAuthorized) notAuthorized.style.display = 'block';
        }
      }

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

      checkAdminAccess();
      updateUserDisplay();

      supabase.auth.onAuthStateChange((event, session) => {
        if (['SIGNED_IN', 'SIGNED_OUT', 'INITIAL_SESSION'].includes(event)) {
          if (updateUserTimeout) clearTimeout(updateUserTimeout);
          updateUserTimeout = setTimeout(() => {
            checkAdminAccess();
            updateUserDisplay();
          }, 100);
        }
      });

      translatePage(currentLanguage);
      updateImagePreview();
    })();
  