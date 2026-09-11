
(function(){
  const SB_URL  = 'https://dtwciuhwwanwlwpydeko.supabase.co';
  const SB_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d2NpdWh3d2Fud2x3cHlkZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4MTYsImV4cCI6MjA4ODU2NDgxNn0.hUPGHckNyOZuIlJZb8f-bGDup50C3kS_0zrfh4nzMAQ';
  const ADMIN   = 'azmmeli146@gmail.com';
  const sb      = window.supabase.createClient(SB_URL, SB_KEY);

  let allOrders    = [];
  let curStatus    = 'all';
  let curGroup     = 'date';
  let searchQ      = '';

  const SL = { pending:'En attente', review:'En révision', shipped:'Expédiée', delivered:'Livrée', cancelled:'Annulée' };
  const SI = { pending:'fa-clock', review:'fa-search', shipped:'fa-truck', delivered:'fa-check-circle', cancelled:'fa-times-circle' };

  // ─── Auth guard ───────────────────────────────────────────────
  async function boot(){
    try{
      const { data:{ user } } = await sb.auth.getUser();
      hide('authLoading');
      if(!user || user.email !== ADMIN){ show('accessDenied'); return; }
      show('mainContent');
      await loadOrders();
    } catch(e){ hide('authLoading'); show('accessDenied'); }
  }

  // ─── Load orders ──────────────────────────────────────────────
  async function loadOrders(manual=false){
    const ico = document.getElementById('refreshIcon');
    ico.classList.add('fa-spin');
    try{
      const { data, error } = await sb.from('orders').select('*').order('created_at',{ ascending:false });
      if(error) throw error;
      allOrders = data || [];
      refreshStats();
      refreshCounts();
      render();
      if(manual) toast('✅ Commandes actualisées');
    } catch(e){ console.error(e); toast('❌ Erreur de chargement'); }
    finally{ ico.classList.remove('fa-spin'); }
  }
  window.loadOrders = loadOrders;

  // ─── Stats ────────────────────────────────────────────────────
  function refreshStats(){
    const rev = allOrders.filter(o=>['shipped','delivered'].includes(o.status)).reduce((s,o)=>s+(parseFloat(o.total)||0),0);
    setText('sRevenue',  rev.toFixed(3).replace('.',','));
    setText('sTotal',    allOrders.length);
    setText('sPending',  allOrders.filter(o=>o.status==='pending').length);
    setText('sReview',   allOrders.filter(o=>o.status==='review').length);
    setText('sShipped',  allOrders.filter(o=>o.status==='shipped').length);
    setText('sDelivered',allOrders.filter(o=>o.status==='delivered').length);
    setText('sCancelled',allOrders.filter(o=>o.status==='cancelled').length);
  }

  // ─── Tab counts ───────────────────────────────────────────────
  function refreshCounts(){
    ['all','pending','review','shipped','delivered','cancelled'].forEach(s=>{
      const el = document.getElementById('c-'+s);
      if(el) el.textContent = s==='all' ? allOrders.length : allOrders.filter(o=>o.status===s).length;
    });
  }

  // ─── Filter + search ──────────────────────────────────────────
  function filtered(){
    let list = curStatus==='all' ? allOrders : allOrders.filter(o=>o.status===curStatus);
    if(searchQ.trim()){
      const q = searchQ.toLowerCase();
      list = list.filter(o=>[
        o.id, o.customer_name, o.customer_phone, o.customer_email, o.shipping_address,
        ...(o.items||[]).map(i=>i.name)
      ].some(v=>(v||'').toLowerCase().includes(q)));
    }
    return list;
  }

  // ─── Grouping ─────────────────────────────────────────────────
  function groupDate(orders){
    const now=new Date(), td=now.toDateString(), yd=new Date(now-864e5).toDateString(), wa=new Date(now-7*864e5), ma=new Date(now-30*864e5);
    const G={"Aujourd'hui":[],"Hier":[],"Cette semaine":[],"Ce mois":[],"Plus ancien":[]};
    orders.forEach(o=>{ const d=new Date(o.created_at),ds=d.toDateString();
      if(ds===td) G["Aujourd'hui"].push(o);
      else if(ds===yd) G["Hier"].push(o);
      else if(d>=wa) G["Cette semaine"].push(o);
      else if(d>=ma) G["Ce mois"].push(o);
      else G["Plus ancien"].push(o);
    });
    return Object.entries(G).filter(([,v])=>v.length);
  }

  function groupCity(orders){
    const M={};
    orders.forEach(o=>{
      const addr = o.shipping_address || '';
      // Try last comma-separated part, fallback to last word
      const parts = addr.split(',').map(s=>s.trim()).filter(Boolean);
      const city  = parts.length>1 ? parts[parts.length-1] : (parts[0]||'Ville inconnue');
      if(!M[city]) M[city]=[];
      M[city].push(o);
    });
    return Object.entries(M).sort((a,b)=>b[1].length-a[1].length);
  }

  function groupProduct(orders){
    const M={};
    orders.forEach(o=>{
      const names=[...new Set((o.items||[]).map(i=>i.name).filter(Boolean))];
      names.forEach(name=>{ if(!M[name]) M[name]=[]; if(!M[name].find(x=>x.id===o.id)) M[name].push(o); });
    });
    return Object.entries(M).sort((a,b)=>b[1].length-a[1].length);
  }

  // ─── Render ───────────────────────────────────────────────────
  function render(){
    const out = document.getElementById('ordersOut');
    const list = filtered();
    if(!list.length){
      out.innerHTML=`<div class="orders-empty"><i class="fas fa-box-open"></i><p>Aucune commande trouvée pour cette recherche.</p></div>`;
      return;
    }
    if(curGroup==='none'){
      out.innerHTML=`<div class="orders-grid">${list.map(card).join('')}</div>`;
    } else {
      const groups = curGroup==='date' ? groupDate(list) : curGroup==='city' ? groupCity(list) : groupProduct(list);
      out.innerHTML = groups.map(([label,orders])=>`
        <div class="group-section">
          <div class="group-header">
            <h3>${esc(label)}</h3>
            <span class="group-badge">${orders.length} commande${orders.length>1?'s':''}</span>
          </div>
          <div class="orders-grid">${orders.map(card).join('')}</div>
        </div>`).join('');
    }
  }

  // ─── Order card ───────────────────────────────────────────────
  function card(o){
    const date = new Date(o.created_at).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
    const shortId = (o.id||'').slice(0,8).toUpperCase();
    const items = (o.items||[]).map(i=>`
      <div class="item-row">
        <span class="item-n"><i class="fas fa-crown" style="color:var(--gold);font-size:0.6rem;"></i>${esc(i.name)} <span class="item-q">×${i.quantity}</span></span>
        <span class="item-p">${(i.price*i.quantity).toFixed(3).replace('.',',')} TND</span>
      </div>`).join('') || `<div class="item-row"><span style="color:var(--text-mid);font-size:0.72rem;">Aucun article</span></div>`;
    return `
    <div class="order-card">
      <div class="oc-header">
        <div>
          <div class="oc-id" onclick="copyId('${o.id}')" title="Copier l'ID complet">
            <i class="fas fa-receipt" style="color:var(--gold);font-size:0.7rem;"></i>
            #${shortId}…<i class="fas fa-copy ci"></i>
          </div>
          <div class="oc-date"><i class="fas fa-calendar-alt" style="font-size:0.58rem;"></i> ${date}</div>
        </div>
        <span class="sbadge ${o.status}"><i class="fas ${SI[o.status]||'fa-circle'}"></i> ${SL[o.status]||o.status}</span>
      </div>
      <div class="oc-customer">
        <div class="cf"><span class="cl"><i class="fas fa-user"></i> Client</span><span class="cv">${esc(o.customer_name||'—')}</span></div>
        <div class="cf"><span class="cl"><i class="fas fa-phone"></i> Tél</span><span class="cv"><a href="tel:${esc(o.customer_phone||'')}">${esc(o.customer_phone||'—')}</a></span></div>
        <div class="cf"><span class="cl"><i class="fas fa-envelope"></i> Email</span><span class="cv"><a href="mailto:${esc(o.customer_email||'')}" title="${esc(o.customer_email||'')}">${esc((o.customer_email||'—').split('@')[0])}@…</a></span></div>
        <div class="cf"><span class="cl"><i class="fas fa-box"></i> Articles</span><span class="cv">${(o.items||[]).length} art.</span></div>
      </div>
      <div class="oc-address"><i class="fas fa-map-marker-alt" style="color:var(--gold);margin-top:1px;flex-shrink:0;"></i><span>${esc(o.shipping_address||'—')}</span></div>
      <div class="oc-items">${items}</div>
      <div class="oc-footer">
        <div class="oc-total">Total : <span>${parseFloat(o.total||0).toFixed(3).replace('.',',')} TND</span></div>
        <select class="status-sel" onchange="updateStatus('${o.id}',this.value)">
          <option value="pending"   ${o.status==='pending'   ?'selected':''}>⏳ En attente</option>
          <option value="review"    ${o.status==='review'    ?'selected':''}>🔍 En révision</option>
          <option value="shipped"   ${o.status==='shipped'   ?'selected':''}>🚚 Expédiée</option>
          <option value="delivered" ${o.status==='delivered' ?'selected':''}>✅ Livrée</option>
          <option value="cancelled" ${o.status==='cancelled' ?'selected':''}>❌ Annulée</option>
        </select>
      </div>
    </div>`;
  }

  // ─── Update status ────────────────────────────────────────────
  window.updateStatus = async function(id, newStatus){
    try{
      const { error } = await sb.from('orders').update({ status:newStatus }).eq('id',id);
      if(error) throw error;
      const o = allOrders.find(x=>x.id===id);
      if(o) o.status = newStatus;
      refreshStats(); refreshCounts(); render();
      toast('✅ Statut → '+SL[newStatus]);
    } catch(e){ console.error(e); toast('❌ Erreur de mise à jour'); }
  };

  // ─── Copy ID ──────────────────────────────────────────────────
  window.copyId = function(id){
    navigator.clipboard.writeText(id).then(()=>toast('📋 ID copié'));
  };

  // ─── Controls ─────────────────────────────────────────────────
  window.setStatus = function(s,btn){
    curStatus = s;
    document.querySelectorAll('.s-tab').forEach(b=>b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    render();
  };
  window.setGroup = function(g,btn){
    curGroup = g;
    document.querySelectorAll('.g-btn').forEach(b=>b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    render();
  };

  let searchT;
  document.getElementById('searchInput').addEventListener('input', e=>{
    clearTimeout(searchT);
    searchT = setTimeout(()=>{ searchQ=e.target.value; render(); }, 220);
  });

  // ─── Helpers ──────────────────────────────────────────────────
  function esc(s){ return (s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function setText(id,v){ const el=document.getElementById(id); if(el) el.textContent=v; }
  function show(id){ const el=document.getElementById(id); if(el) el.style.display=''; }
  function hide(id){ const el=document.getElementById(id); if(el) el.style.display='none'; }

  function toast(msg){
    const t=document.getElementById('toast');
    t.textContent=msg; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),2500);
  }

  // ─── Theme ────────────────────────────────────────────────────
  (function initTheme(){
    if(localStorage.getItem('theme')==='dark'){
      document.body.classList.add('dark');
      document.querySelector('#themeToggle .fa-sun').style.display='none';
      document.querySelector('#themeToggle .fa-moon').style.display='inline-block';
    }
  })();
  document.getElementById('themeToggle').addEventListener('click',()=>{
    const dark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', dark?'dark':'light');
    document.querySelector('#themeToggle .fa-sun').style.display  = dark?'none':'inline-block';
    document.querySelector('#themeToggle .fa-moon').style.display = dark?'inline-block':'none';
  });

  boot();
})();
