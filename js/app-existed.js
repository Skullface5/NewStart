
    (function () {
      const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
      const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      let currentLanguage = localStorage.getItem('language') || 'fr';

      const translations = {
        fr: {
          home: 'ACCUEIL', men: 'HOMME', women: 'FEMME', unisex: 'UNISEXE', kids: 'ENFANTS',
          existing: 'PARFUMS EXISTANTS', login: 'Se connecter', profile: 'Mon Profil', notreCollection: 'Notre Collection',
          existingPerfumes: 'Parfums Existants',
          menCat: 'Homme', menDesc: 'Boisés & épicés',
          womenCat: 'Femme', womenDesc: 'Floraux & sensuels',
          unisexCat: 'Unisexe', unisexDesc: 'Pour tous',
          kidsCat: 'Enfants', kidsDesc: 'Douceurs',
          catVoiture: 'Parfums voiture', catAmbiance: "Parfums d'ambiance", catMusc: 'Musc', catAccessoires: 'Accessoires', catInspires: 'Parfums inspirés',
          addProduct: 'Ajouter un produit', refresh: 'Rafraîchir',
          footerDescription: "Parfumerie d'exception depuis 1985. L'art de la parfumerie orientale réinventé pour les connaisseurs exigeants.",
          footerPerfumesTitle: "Parfums", footerMen: "Homme", footerWomen: "Femme", footerUnisex: "Unisexe", footerKids: "Enfants",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisie", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. Tous droits réservés."
        },
        en: {
          home: 'HOME', men: 'MEN', women: 'WOMEN', unisex: 'UNISEX', kids: 'KIDS',
          existing: 'EXISTING PERFUMES', login: 'Sign in', profile: 'My Profile', notreCollection: 'Our Collection',
          existingPerfumes: 'Existing Perfumes',
          menCat: 'Men', menDesc: 'Woody & spicy',
          womenCat: 'Women', womenDesc: 'Floral & sensual',
          unisexCat: 'Unisex', unisexDesc: 'For everyone',
          kidsCat: 'Kids', kidsDesc: 'Sweet scents',
          catVoiture: 'Car perfumes', catAmbiance: 'Home fragrances', catMusc: 'Musk', catAccessoires: 'Accessories', catInspires: 'Inspired perfumes',
          addProduct: 'Add product', refresh: 'Refresh',
          footerDescription: "Exceptional perfumery since 1985. The art of oriental perfumery reinvented for discerning connoisseurs.",
          footerPerfumesTitle: "Perfumes", footerMen: "Men", footerWomen: "Women", footerUnisex: "Unisex", footerKids: "Kids",
          footerContactTitle: "Contact", footerAddress: "Tunis, Tunisia", footerPhone: "+216 96 163 366",
          footerEmail: "contact@rosafragrances.tn", footerCopyright: "© 2026 Rosa Fragrances. All rights reserved."
        },
        ar: {
          home: 'الرئيسية', men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', kids: 'أطفال',
          existing: 'العطور الموجودة', login: 'تسجيل الدخول', profile: 'ملفي الشخصي', notreCollection: 'مجموعتنا',
          existingPerfumes: 'العطور الموجودة',
          menCat: 'رجالي', menDesc: 'خشبي و حار',
          womenCat: 'نسائي', womenDesc: 'زهري و حسي',
          unisexCat: 'للجنسين', unisexDesc: 'للجميع',
          kidsCat: 'أطفال', kidsDesc: 'روائح حلوة',
          catVoiture: 'عطور السيارات', catAmbiance: 'عطورات الجو', catMusc: 'مسك', catAccessoires: 'إكسسوارات', catInspires: 'عطور مستوحاة',
          addProduct: 'إضافة منتج', refresh: 'تحديث',
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
        if (window.RosaCollections) window.RosaCollections.setLang(lang);
        document.querySelectorAll('[data-translate]').forEach(el => {
          const key = el.getAttribute('data-translate');
          if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = translations[lang][key];
            else el.textContent = translations[lang][key];
          }
        });
      }

      function showAdminToast(msg) {
        const toast = document.getElementById('adminToast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      }

      async function loadStats() {
        try {
          const { data, error } = await supabase.from('products').select('category');
          if (error) throw error;

          let manCount = 0, womenCount = 0, unisexCount = 0, kidsCount = 0;
          data.forEach(product => {
            if (product.category === 'man') manCount++;
            else if (product.category === 'women') womenCount++;
            else if (product.category === 'unisexe') unisexCount++;
            else if (product.category === 'kids') kidsCount++;
          });

          document.getElementById('manCount').textContent = manCount;
          document.getElementById('womenCount').textContent = womenCount;
          document.getElementById('unisexCount').textContent = unisexCount;
          document.getElementById('kidsCount').textContent = kidsCount;
        } catch (error) {
          console.error('Error loading stats:', error);
        }
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

      // Refresh button
      document.getElementById('refreshBtn')?.addEventListener('click', () => {
        loadStats();
        showAdminToast('✨ Statistiques mises à jour');
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
          const loggedInAs = document.getElementById('loggedInAs');

          if (user) {
            if (authLink) authLink.style.display = 'none';
            if (profileLink) profileLink.style.display = 'block';
            if (loggedInAs) loggedInAs.textContent = `⚡ ${user.email} · ${new Date().toLocaleDateString('fr-FR')}`;
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
      loadStats();
    })();
  