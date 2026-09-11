/* rosa-prefill: fill checkout from saved profile (auth metadata -> localStorage fallback) */
(function() {
  function fill() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem('rosa_profile')); } catch (e) {}
    const client = window.__rosaSupabase || (window.supabase && window.supabase.auth ? window.supabase : null);
    if (!client) return;
    client.auth.getUser().then(function(res) {
      const u = res && res.data && res.data.user;
      if (!u) return;
      const m = u.user_metadata || {};
      const n = document.getElementById('customerName');
      const ph = document.getElementById('customerPhone');
      const ad = document.getElementById('shippingAddress');
      if (n && !n.value.trim() && (m.full_name || (p && p.full_name))) n.value = m.full_name || p.full_name;
      if (ph && !ph.value.trim() && (m.phone || (p && p.phone))) ph.value = m.phone || p.phone;
      if (ad && !ad.value.trim() && (m.address || (p && p.address))) ad.value = m.address || p.address;
    }).catch(function() {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
  else fill();
})();
