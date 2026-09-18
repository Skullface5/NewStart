
    // Supabase Config
    const SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // DOM elements
    const signinTab = document.getElementById('signinTab');
    const signupTab = document.getElementById('signupTab');
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const signinBtn = document.getElementById('signinBtn');
    const signupBtn = document.getElementById('signupBtn');
    const messageBox = document.getElementById('messageBox');

    // i18n (FR/EN/AR, shared 'language' key with the rest of the shop)
    const LOGIN_TR = {
      fr: { tabSignin: 'CONNEXION', tabSignup: 'INSCRIPTION', email: 'Email', emailPh: 'votre@email.com',
        password: 'Mot de passe', fullName: 'Nom complet', namePh: 'Votre nom', passPh: 'Minimum 6 caractères',
        confirm: 'Confirmer', confirmPh: 'Confirmer', signinBtn: 'SE CONNECTER', signupBtn: 'CRÉER MON COMPTE',
        creating: 'Création...', connecting: 'Connexion...', or: 'ou', back: 'Retour à la boutique',
        errShort: '❌ Le mot de passe doit contenir au moins 6 caractères', errMismatch: '❌ Les mots de passe ne correspondent pas',
        errExists: '❌ Cet email est déjà utilisé', errCreds: '❌ Email ou mot de passe incorrect',
        errGeneric: '❌ Une erreur est survenue', okSignup: '✅ Compte créé! Bienvenue chez Rosa Fragrances ✨',
        okSignin: '✅ Connexion réussie! Redirection...' },
      en: { tabSignin: 'SIGN IN', tabSignup: 'SIGN UP', email: 'Email', emailPh: 'you@email.com',
        password: 'Password', fullName: 'Full name', namePh: 'Your name', passPh: 'Minimum 6 characters',
        confirm: 'Confirm', confirmPh: 'Confirm', signinBtn: 'SIGN IN', signupBtn: 'CREATE MY ACCOUNT',
        creating: 'Creating...', connecting: 'Signing in...', or: 'or', back: 'Back to shop',
        errShort: '❌ Password must be at least 6 characters', errMismatch: '❌ Passwords do not match',
        errExists: '❌ This email is already in use', errCreds: '❌ Wrong email or password',
        errGeneric: '❌ Something went wrong', okSignup: '✅ Account created! Welcome to Rosa Fragrances ✨',
        okSignin: '✅ Signed in! Redirecting...' },
      ar: { tabSignin: 'تسجيل الدخول', tabSignup: 'إنشاء حساب', email: 'البريد الإلكتروني', emailPh: 'you@email.com',
        password: 'كلمة المرور', fullName: 'الاسم الكامل', namePh: 'اسمك', passPh: '٦ أحرف على الأقل',
        confirm: 'تأكيد', confirmPh: 'تأكيد', signinBtn: 'تسجيل الدخول', signupBtn: 'إنشاء حسابي',
        creating: 'جارٍ الإنشاء...', connecting: 'جارٍ تسجيل الدخول...', or: 'أو', back: 'العودة إلى المتجر',
        errShort: '❌ يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل', errMismatch: '❌ كلمتا المرور غير متطابقتين',
        errExists: '❌ هذا البريد مستخدم بالفعل', errCreds: '❌ البريد أو كلمة المرور غير صحيحة',
        errGeneric: '❌ حدث خطأ ما', okSignup: '✅ تم إنشاء الحساب! مرحبًا بك في روزا ✨',
        okSignin: '✅ تم تسجيل الدخول! جارٍ التحويل...' }
    };
    let loginLang = 'fr';
    try { loginLang = localStorage.getItem('language') || 'fr'; } catch (e) { loginLang = 'fr'; }
    if (!LOGIN_TR[loginLang]) loginLang = 'fr';
    function tr(key) { return (LOGIN_TR[loginLang] && LOGIN_TR[loginLang][key]) || LOGIN_TR.fr[key] || key; }
    function applyLoginLang() {
      document.querySelectorAll('[data-tr]').forEach(function (el) { el.textContent = tr(el.getAttribute('data-tr')); });
      document.querySelectorAll('[data-tr-ph]').forEach(function (el) { el.setAttribute('placeholder', tr(el.getAttribute('data-tr-ph'))); });
      document.documentElement.setAttribute('dir', loginLang === 'ar' ? 'rtl' : 'ltr');
      document.querySelectorAll('[data-login-lang]').forEach(function (b) {
        b.style.fontWeight = b.getAttribute('data-login-lang') === loginLang ? '700' : '400';
      });
    }
    document.querySelectorAll('[data-login-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        loginLang = b.getAttribute('data-login-lang');
        try { localStorage.setItem('language', loginLang); } catch (e) { /* noop */ }
        applyLoginLang();
      });
    });
    applyLoginLang();

    // Theme Switcher
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

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    initTheme();

    // Switch between tabs with animation
    window.switchTab = function (tab) {
      if (tab === 'signin') {
        signinTab.classList.add('active');
        signupTab.classList.remove('active');
        signinForm.style.display = 'block';
        signupForm.style.display = 'none';
      } else {
        signupTab.classList.add('active');
        signinTab.classList.remove('active');
        signupForm.style.display = 'block';
        signinForm.style.display = 'none';
      }
      messageBox.style.display = 'none';
      messageBox.className = 'message';
    }

    // Show message with animation
    function showMessage(text, type) {
      messageBox.textContent = text;
      messageBox.className = `message ${type} show`;
      if (type === 'success') {
        setTimeout(() => {
          messageBox.style.display = 'none';
          messageBox.className = 'message';
        }, 3000);
      }
    }

    // Handle Sign Up
    window.handleSignUp = async function (event) {
      event.preventDefault();

      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirm = document.getElementById('signupConfirmPassword').value;

      if (password.length < 6) {
        showMessage(tr('errShort'), 'error');
        return;
      }
      if (password !== confirm) {
        showMessage(tr('errMismatch'), 'error');
        return;
      }

      signupBtn.disabled = true;
      signupBtn.innerHTML = '<span class="loading-spinner"></span> ' + tr('creating');

      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: { emailRedirectTo: window.location.origin + '/index.html',
          data: { full_name: (document.getElementById('signupName')?.value || '').trim() } }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            showMessage(tr('errExists'), 'error');
          } else {
            showMessage('❌ ' + error.message, 'error');
          }
          signupBtn.disabled = false;
          signupBtn.innerHTML = '<span>' + tr('signupBtn') + '</span>';
        } else {
          showMessage(tr('okSignup'), 'success');
          document.getElementById('signupEmail').value = '';
          document.getElementById('signupPassword').value = '';
          document.getElementById('signupConfirmPassword').value = '';
          signupBtn.disabled = false;
          signupBtn.innerHTML = '<span>' + tr('signupBtn') + '</span>';
          setTimeout(() => window.switchTab('signin'), 2000);
        }
      } catch (err) {
        showMessage(tr('errGeneric'), 'error');
        signupBtn.disabled = false;
        signupBtn.innerHTML = '<span>' + tr('signupBtn') + '</span>';
      }
    }

    // Handle Sign In
    window.handleSignIn = async function (event) {
      event.preventDefault();

      const email = document.getElementById('signinEmail').value;
      const password = document.getElementById('signinPassword').value;

      signinBtn.disabled = true;
      signinBtn.innerHTML = '<span class="loading-spinner"></span> ' + tr('connecting');

      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          showMessage(tr('errCreds'), 'error');
          signinBtn.disabled = false;
          signinBtn.innerHTML = '<span>' + tr('signinBtn') + '</span>';
        } else {
          showMessage(tr('okSignin'), 'success');
          // Wait a bit longer to ensure session is saved
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        }
      } catch (err) {
        showMessage(tr('errGeneric'), 'error');
        signinBtn.disabled = false;
        signinBtn.innerHTML = '<span>' + tr('signinBtn') + '</span>';
      }
    }

    // Toggle password visibility
    function initPasswordToggles() {
      document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
          const targetId = toggle.dataset.target;
          const targetInput = document.getElementById(targetId);
          if (!targetInput) return;
          const isPassword = targetInput.type === 'password';
          targetInput.type = isPassword ? 'text' : 'password';
          toggle.classList.toggle('fa-eye', !isPassword);
          toggle.classList.toggle('fa-eye-slash', isPassword);
        });
      });
    }

    // Check if user is already logged in
    async function checkLoggedIn() {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
          document.body.style.opacity = '0';
          document.body.style.transition = 'opacity 0.5s';
          setTimeout(() => window.location.href = 'index.html', 500);
        } else {
        }
      } catch (err) {
      }
    }

    // Wait for page to be ready before checking
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initPasswordToggles();
        checkLoggedIn();
      });
    } else {
      initPasswordToggles();
      checkLoggedIn();
    }
  