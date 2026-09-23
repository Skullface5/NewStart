/* Rosa admin gate — Ste-style login overlay, shared by all admin pages.
   RLS remains the real wall; this overlay is the first gate.
   Fail-CLOSED by design: any glitch keeps the page locked with a retry
   option instead of exposing the admin UI. */
(function () {
  var ADMIN = 'azmmeli146@gmail.com';
  var URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
  var I18N = {
    fr: { sub: 'Espace administration — accès réservé', email: 'Email', pw: 'Mot de passe', cta: 'Se connecter',
      show: 'Afficher le mot de passe', hide: 'Masquer le mot de passe', errFields: 'Veuillez remplir tous les champs',
      errBad: 'Email ou mot de passe incorrect', errNet: 'Connexion impossible — vérifiez le réseau',
      notAdmin: 'Ce compte n\x27est pas administrateur', logout: 'Déconnexion', wait: 'Connexion…' },
    en: { sub: 'Administration area — restricted access', email: 'Email', pw: 'Password', cta: 'Log in',
      show: 'Show password', hide: 'Hide password', errFields: 'Please fill in all fields',
      errBad: 'Wrong email or password', errNet: 'Connection failed — check your network',
      notAdmin: 'This account is not an administrator', logout: 'Log out', wait: 'Logging in…' },
    ar: { sub: 'منطقة الإدارة — وصول محظور', email: 'البريد الإلكتروني', pw: 'كلمة المرور', cta: 'تسجيل الدخول',
      show: 'إظهار كلمة المرور', hide: 'إخفاء كلمة المرور', errFields: 'يرجى ملء جميع الحقول',
      errBad: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', errNet: 'تعذّر الاتصال — تحقق من الشبكة',
      notAdmin: 'هذا الحساب ليس مديرًا', logout: 'تسجيل الخروج', wait: 'جارٍ تسجيل الدخول…' }
  };
  var lang = (function () { try { var l = localStorage.getItem('language') || 'fr'; return I18N[l] ? l : 'fr'; } catch (e) { return 'fr'; } })();
  var t = I18N[lang];

  if (document.getElementById('rosaAdminGate') || window.__rosaGate) return;
  window.__rosaGate = true;

  var style = document.createElement('style');
  style.textContent = [
    'html.rosa-locked body > *:not(#rosaAdminGate){display:none !important}',
    '#rosaAdminGate{position:fixed;inset:0;z-index:99999;display:flex;overflow-y:auto;-webkit-overflow-scrolling:touch;background:#F7F0E6;font-family:"Jost",sans-serif;padding:22px 14px}',
    '#rosaAdminGate .rag-card{margin:auto;width:100%;max-width:380px;background:#fff;border:1px solid #EDE4D6;border-radius:18px;padding:34px 26px;box-shadow:0 18px 45px rgba(58,50,40,.14);text-align:center}',
    
    '#rosaAdminGate .rag-mark{width:54px;height:54px;margin:0 auto 14px;border-radius:50%;border:1.6px solid #B49A6A;color:#B49A6A;display:flex;align-items:center;justify-content:center}',
    '#rosaAdminGate .rag-brand{font-family:"Cormorant Garamond",serif;font-size:30px;letter-spacing:.14em;color:#3A3228;margin:0 0 4px;font-weight:600}',
    '#rosaAdminGate .rag-sub{color:#6B5E4E;font-size:13px;letter-spacing:.06em;margin:0 0 22px}',
    '#rosaAdminGate .rag-field{text-align:start;margin-bottom:14px}',
    '#rosaAdminGate label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:#8A7150;margin-bottom:6px}',
    '#rosaAdminGate input{width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #E0D4C0;border-radius:12px;font:15px "Jost",sans-serif;color:#3A3228;background:#FBF7F0;outline:none}',
    '#rosaAdminGate input:focus{border-color:#B49A6A;box-shadow:0 0 0 3px rgba(180,154,106,.16)}',
    '#rosaAdminGate .rag-pwrow{position:relative}',
    '#rosaAdminGate .rag-pwrow input{padding-right:46px}',
    '#rosaAdminGate .rag-eye{position:absolute;top:50%;right:8px;transform:translateY(-50%);border:0;background:none;color:#8A7150;cursor:pointer;padding:6px;line-height:0}',
    '#rosaAdminGate .rag-msg{min-height:18px;color:#A4443A;font-size:13px;margin:2px 0 10px}',
    '#rosaAdminGate .rag-submit{width:100%;padding:13px;border:0;border-radius:12px;background:linear-gradient(135deg,#B49A6A,#8A7150);color:#FBF7F0;font:600 14px "Jost",sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}',
    '#rosaAdminGate .rag-submit:disabled{opacity:.6;cursor:wait}',
    '#rosaAdminChip{position:fixed;right:14px;bottom:14px;z-index:9998;display:flex;align-items:center;gap:10px;background:#3A3228;color:#D4B98A;font:500 12px "Jost",sans-serif;letter-spacing:.05em;padding:9px 14px;border-radius:999px;box-shadow:0 8px 22px rgba(0,0,0,.22)}',
    '#rosaAdminChip button{border:0;background:none;color:#B49A6A;font:inherit;text-decoration:underline;cursor:pointer;padding:0}'
  ].join('\n');
  document.head.appendChild(style);

  var gate = document.createElement('div');
  gate.id = 'rosaAdminGate';
  gate.setAttribute('role', 'dialog');
  gate.innerHTML =
    '<div class="rag-card">' +
      '<div class="rag-mark"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.4"/></svg></div>' +
      '<h1 class="rag-brand">ROSA</h1>' +
      '<p class="rag-sub">' + t.sub + '</p>' +
      '<form id="ragForm" novalidate>' +
        '<div class="rag-field"><label for="ragEmail">' + t.email + '</label>' +
          '<input id="ragEmail" name="email" type="email" autocomplete="username" inputmode="email" required></div>' +
        '<div class="rag-field"><label for="ragPw">' + t.pw + '</label>' +
          '<div class="rag-pwrow"><input id="ragPw" name="password" type="password" autocomplete="current-password" required>' +
          '<button type="button" class="rag-eye" id="ragEye" aria-label="' + t.show + '" aria-pressed="false"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/></svg></button></div></div>' +
        '<p class="rag-msg" id="ragMsg" role="alert"></p>' +
        '<button class="rag-submit" id="ragBtn" type="submit">' + t.cta + '</button>' +
      '</form>' +
    '</div>';
  document.documentElement.classList.add('rosa-locked');
  document.body.insertBefore(gate, document.body.firstChild);
  if (lang === 'ar') gate.setAttribute('dir', 'rtl');

  function msg(text) { var el = document.getElementById('ragMsg'); if (el) el.textContent = text || ''; }

  /* Fail-closed: never expose the admin UI on error. Show the reason in the
     gate with a retry button that reloads the page. */
  function lockedError(text) {
    document.documentElement.classList.add('rosa-locked');
    var m = document.getElementById('ragMsg');
    if (m) {
      m.textContent = text || t.errNet;
      if (!document.getElementById('ragRetry')) {
        var b = document.createElement('button');
        b.type = 'button';
        b.id = 'ragRetry';
        b.className = 'rag-submit';
        b.style.marginTop = '8px';
        b.textContent = '↻';
        b.setAttribute('aria-label', 'retry');
        b.addEventListener('click', function () { location.reload(); });
        var form = document.getElementById('ragForm');
        if (form) form.appendChild(b);
      }
    }
  }

  function silentUnlock(email) {
    document.documentElement.classList.remove('rosa-locked');
    var g = document.getElementById('rosaAdminGate'); if (g) g.remove();
    var chip = document.createElement('div');
    chip.id = 'rosaAdminChip';
    chip.innerHTML = '<span>⚡ ' + email + '</span>';
    var out = document.createElement('button');
    out.textContent = t.logout;
    out.addEventListener('click', function () {
      window.supabase.createClient(URL, KEY).auth.signOut().finally(function () { location.reload(); });
    });
    chip.appendChild(out);
    document.body.appendChild(chip);
  }

  function start() {
    var client = window.supabase.createClient(URL, KEY);

    var eye = document.getElementById('ragEye');
    if (eye) eye.addEventListener('click', function () {
      var pw = document.getElementById('ragPw');
      if (!pw) return;
      var on = pw.type === 'password';
      pw.type = on ? 'text' : 'password';
      this.setAttribute('aria-pressed', on ? 'true' : 'false');
      this.setAttribute('aria-label', on ? t.hide : t.show);
      pw.focus();
    });

    var form = document.getElementById('ragForm');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('ragEmail').value.trim();
      var pw = document.getElementById('ragPw').value;
      if (!email || !pw) { msg(t.errFields); return; }
      var btn = document.getElementById('ragBtn');
      btn.disabled = true; btn.textContent = t.wait; msg('');
      client.auth.signInWithPassword({ email: email, password: pw }).then(function (r) {
        btn.disabled = false; btn.textContent = t.cta;
        if (r.error) { msg(t.errBad); return; }
        var u = r.data.user;
        if (u && u.email === ADMIN) {
          location.reload(); // page scripts re-run with the fresh token -> full data loads
        } else {
          client.auth.signOut().finally(function () { msg(t.notAdmin); });
        }
      }).catch(function () { btn.disabled = false; btn.textContent = t.cta; msg(t.errNet); });
    });

    // ---- existing valid session? unlock without reload (page scripts already had it) ----
    // Fail-CLOSED: timeout or errors keep the gate locked with a retry option.
    var bail = setTimeout(function () { lockedError(t.errNet); }, 12000);
    client.auth.getSession().then(function (r) {
      clearTimeout(bail);
      var s = r.data && r.data.session;
      var u = s && s.user;
      if (u && u.email === ADMIN) { silentUnlock(u.email); return; }
      if (u) { client.auth.signOut().finally(function () { msg(t.notAdmin); }); return; }
    }).catch(function () { clearTimeout(bail); lockedError(t.errNet); });
  }

  try {
    if (window.supabase && window.supabase.createClient) start();
    else window.addEventListener('load', function () {
      if (window.supabase && window.supabase.createClient) start();
      else lockedError(t.errNet); // CDN unreachable: stay locked, offer retry
    });
  } catch (e) { try { lockedError(t.errNet); } catch (e2) { /* stay locked */ } }
})();
