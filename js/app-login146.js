
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
        showMessage('❌ Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
      }
      if (password !== confirm) {
        showMessage('❌ Les mots de passe ne correspondent pas', 'error');
        return;
      }

      signupBtn.disabled = true;
      signupBtn.innerHTML = '<span class="loading-spinner"></span> Création...';

      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: { emailRedirectTo: window.location.origin + '/index.html' }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            showMessage('❌ Cet email est déjà utilisé', 'error');
          } else {
            showMessage('❌ ' + error.message, 'error');
          }
          signupBtn.disabled = false;
          signupBtn.innerHTML = '<span>CRÉER MON COMPTE</span>';
        } else {
          showMessage('✅ Compte créé! Bienvenue chez Rosa Fragrances ✨', 'success');
          document.getElementById('signupEmail').value = '';
          document.getElementById('signupPassword').value = '';
          document.getElementById('signupConfirmPassword').value = '';
          signupBtn.disabled = false;
          signupBtn.innerHTML = '<span>CRÉER MON COMPTE</span>';
          setTimeout(() => window.switchTab('signin'), 2000);
        }
      } catch (err) {
        showMessage('❌ Une erreur est survenue', 'error');
        signupBtn.disabled = false;
        signupBtn.innerHTML = '<span>CRÉER MON COMPTE</span>';
      }
    }

    // Handle Sign In
    window.handleSignIn = async function (event) {
      event.preventDefault();

      const email = document.getElementById('signinEmail').value;
      const password = document.getElementById('signinPassword').value;

      signinBtn.disabled = true;
      signinBtn.innerHTML = '<span class="loading-spinner"></span> Connexion...';

      try {
        console.log('Attempting sign in with:', email);
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          console.error('Sign in error:', error);
          showMessage('❌ Email ou mot de passe incorrect', 'error');
          signinBtn.disabled = false;
          signinBtn.innerHTML = '<span>SE CONNECTER</span>';
        } else {
          console.log('✅ Sign in successful, user:', data.user);
          console.log('Session:', data.session);
          showMessage('✅ Connexion réussie! Redirection...', 'success');
          // Wait a bit longer to ensure session is saved
          setTimeout(() => {
            console.log('Redirecting to index.html');
            window.location.href = 'index.html';
          }, 2000);
        }
      } catch (err) {
        console.error('Sign in catch error:', err);
        showMessage('❌ Une erreur est survenue', 'error');
        signinBtn.disabled = false;
        signinBtn.innerHTML = '<span>SE CONNECTER</span>';
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
        console.log('checkLoggedIn - user found:', user);
        if (user) {
          console.log('✅ User already logged in, redirecting to index.html');
          document.body.style.opacity = '0';
          document.body.style.transition = 'opacity 0.5s';
          setTimeout(() => window.location.href = 'index.html', 500);
        } else {
          console.log('❌ No user logged in, staying on login page');
        }
      } catch (err) {
        console.error('Error checking login status:', err);
      }
    }

    // Wait for page to be ready before checking
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log('Page loaded, checking session...');
        initPasswordToggles();
        checkLoggedIn();
      });
    } else {
      console.log('Page already loaded, checking session...');
      initPasswordToggles();
      checkLoggedIn();
    }
  