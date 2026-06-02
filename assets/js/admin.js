/* ============================================
   UAE PropHub — Admin Panel JavaScript (admin.js)
   Place this file at: assets/js/admin.js
   ============================================ */

// ── CREDENTIALS (change these after first login) ──
let adminUser = 'admin@uaeprophub.com';
let adminPass = 'UAE@2024';

// ── PROJECTS DATA ─────────────────────────────
let projects = [
  { name:'Emaar Beach Vista',              dev:'Emaar Properties',     loc:'Emaar Beachfront, Dubai',         city:'dubai',    emoji:'🏖️', bg:'#0d1f2d', badge:'Ready Q1 2025',  roi:'6.8%', price:'From AED 2.1M', plan:'20/80',         handover:'Q1 2025', type:'Apartment',          desc:'' },
  { name:'DAMAC Lagoons',                  dev:'DAMAC Properties',     loc:'Dubailand, Dubai',                city:'dubai',    emoji:'💧', bg:'#1a0d2d', badge:'Off-Plan',        roi:'7.2%', price:'From AED 1.4M', plan:'1% Monthly',    handover:'Q4 2026', type:'Villa / Townhouse',  desc:'' },
  { name:'Aldar Yas Acres',                dev:'Aldar Properties',     loc:'Yas Island, Abu Dhabi',           city:'abudhabi', emoji:'🌴', bg:'#0d2d1a', badge:'Off-Plan',        roi:'6.5%', price:'From AED 3.2M', plan:'40/60',         handover:'Q2 2027', type:'Villa',              desc:'' },
  { name:'Sobha Hartland II',              dev:'Sobha Realty',         loc:'Mohammed Bin Rashid City, Dubai', city:'dubai',    emoji:'🌿', bg:'#1a2d0d', badge:'Off-Plan',        roi:'7.5%', price:'From AED 1.8M', plan:'30/70',         handover:'Q3 2026', type:'Apartment',          desc:'' },
  { name:'Nakheel Rixos Hotel Residences', dev:'Nakheel',              loc:'Palm Jumeirah, Dubai',            city:'dubai',    emoji:'🌴', bg:'#2d1a0d', badge:'New Launch',      roi:'8.1%', price:'From AED 4.5M', plan:'50/50',         handover:'Q1 2027', type:'Branded Residences', desc:'' },
  { name:'Aldar Saadiyat Grove',           dev:'Aldar Properties',     loc:'Saadiyat Island, Abu Dhabi',      city:'abudhabi', emoji:'🎨', bg:'#2d0d1a', badge:'Off-Plan',        roi:'7.0%', price:'From AED 2.8M', plan:'40/60',         handover:'Q4 2027', type:'Apartment',          desc:'' },
  { name:'Emaar Golf Gate',                dev:'Emaar Properties',     loc:'Dubai Hills Estate, Dubai',       city:'dubai',    emoji:'⛳', bg:'#0d2d2d', badge:'Off-Plan',        roi:'6.9%', price:'From AED 1.6M', plan:'30/70',         handover:'Q2 2027', type:'Apartment',          desc:'' },
  { name:'Masdar City Residences',         dev:'Masdar',               loc:'Masdar City, Abu Dhabi',          city:'abudhabi', emoji:'♻️', bg:'#1a2d2d', badge:'Ready',          roi:'6.2%', price:'From AED 900K', plan:'Mortgage Ready',handover:'Ready',   type:'Apartment',          desc:'' },
  { name:'Binghatti Venus',                dev:'Binghatti Developers', loc:'JVC, Dubai',                      city:'dubai',    emoji:'🌟', bg:'#2d2d0d', badge:'Off-Plan',        roi:'7.8%', price:'From AED 750K', plan:'50/50',         handover:'Q3 2025', type:'Apartment',          desc:'' },
];

// ── AREA DATA ─────────────────────────────────
let areas = [
  { name:'Dubai Marina',             city:'dubai',    rate:8 },
  { name:'Downtown Dubai',           city:'dubai',    rate:9 },
  { name:'Dubai Hills Estate',       city:'dubai',    rate:7 },
  { name:'Palm Jumeirah',            city:'dubai',    rate:10 },
  { name:'JVC',                      city:'dubai',    rate:6 },
  { name:'Business Bay',             city:'dubai',    rate:8 },
  { name:'Yas Island',               city:'abudhabi', rate:7 },
  { name:'Saadiyat Island',          city:'abudhabi', rate:9 },
  { name:'Al Reem Island',           city:'abudhabi', rate:6 },
  { name:'Mohammed Bin Zayed City',  city:'abudhabi', rate:7 },
];

let plans = ['30/70', '40/60', '50/50', '20/80', '60/40', '1% Monthly'];

// ── LOGIN ─────────────────────────────────────
function doLogin() {
  const u = document.getElementById('l-user').value.trim();
  const p = document.getElementById('l-pass').value;
  if (u === adminUser && p === adminPass) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-screen').style.display = 'block';
    document.getElementById('admin-name-badge').textContent = u;
    document.getElementById('acc-display-user').textContent = u;
    document.getElementById('acc-user').value = u;
    document.getElementById('last-login').textContent = new Date().toLocaleString('en-GB');
    renderAll();
  } else {
    document.getElementById('login-err').style.display = 'block';
  }
}

function doLogout() {
  document.getElementById('admin-screen').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('l-pass').value = '';
  document.getElementById('login-err').style.display = 'none';
}

// ── NAVIGATION ────────────────────────────────
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (el) el.classList.add('active');
}

// ── RENDER ALL ────────────────────────────────
function renderAll() {
  renderDash();
  renderProjects();
  renderAreas();
  renderPlans();
}

// ── DASHBOARD ─────────────────────────────────
function renderDash() {
  const dubai  = projects.filter(p => p.city === 'dubai').length;
  const ad     = projects.filter(p => p.city === 'abudhabi').length;
  const avgROI = projects.reduce((s, p) => s + parseFloat(p.roi || 0), 0) / projects.length;

  document.getElementById('dash-projects').textContent = projects.length;
  document.getElementById('dash-dubai').textContent    = dubai;
  document.getElementById('dash-ad').textContent       = ad;
  document.getElementById('dash-avgROI').textContent   = avgROI.toFixed(1) + '%';

  document.getElementById('dash-tbody').innerHTML = projects.slice(0, 6).map(p => `
    <tr>
      <td>${p.emoji} ${p.name}</td>
      <td style="color:var(--muted)">${p.dev}</td>
      <td><span class="city-tag ${p.city === 'dubai' ? 'tag-dubai' : 'tag-ad'}">${p.city === 'dubai' ? 'Dubai' : 'Abu Dhabi'}</span></td>
      <td style="color:var(--green)">${p.roi}</td>
      <td>${p.price}</td>
      <td><span class="status-on">● ${p.badge}</span></td>
    </tr>`).join('');
}

// ── PROJECTS TABLE ────────────────────────────
function renderProjects() {
  document.getElementById('proj-count').textContent = projects.length + ' projects';
  document.getElementById('proj-tbody').innerHTML = projects.map((p, i) => `
    <tr>
      <td style="color:var(--muted)">${i + 1}</td>
      <td><b>${p.emoji} ${p.name}</b></td>
      <td style="color:var(--muted)">${p.dev}</td>
      <td><span class="city-tag ${p.city === 'dubai' ? 'tag-dubai' : 'tag-ad'}">${p.city === 'dubai' ? 'Dubai' : 'Abu Dhabi'}</span></td>
      <td style="color:var(--muted);font-size:.78rem">${p.loc}</td>
      <td style="color:var(--gold)">${p.price}</td>
      <td style="color:var(--green)">${p.roi}</td>
      <td>${p.plan}</td>
      <td>${p.handover}</td>
      <td>
        <div style="display:flex;gap:.4rem;">
          <button class="btn-sm btn-edit" onclick="editProject(${i})">✏️</button>
          <button class="btn-sm btn-del"  onclick="deleteProject(${i})">🗑️</button>
        </div>
      </td>
    </tr>`).join('');
}

// ── PROJECT MODAL ─────────────────────────────
function openModal(idx) {
  document.getElementById('proj-modal').classList.add('open');
  document.getElementById('edit-idx').value = idx !== undefined ? idx : -1;
  document.getElementById('modal-title').textContent = idx !== undefined ? 'Edit Project' : 'Add New Project';

  if (idx !== undefined) {
    const p = projects[idx];
    document.getElementById('f-name').value    = p.name;
    document.getElementById('f-dev').value     = p.dev;
    document.getElementById('f-loc').value     = p.loc;
    document.getElementById('f-city').value    = p.city;
    document.getElementById('f-price').value   = p.price;
    document.getElementById('f-roi').value     = p.roi;
    document.getElementById('f-plan').value    = p.plan;
    document.getElementById('f-handover').value= p.handover;
    document.getElementById('f-type').value    = p.type;
    document.getElementById('f-badge').value   = p.badge;
    document.getElementById('f-emoji').value   = p.emoji;
    document.getElementById('f-bg').value      = p.bg;
    document.getElementById('f-desc').value    = p.desc || '';
  } else {
    ['f-name','f-dev','f-loc','f-price','f-roi','f-plan','f-handover','f-type','f-badge','f-desc']
      .forEach(id => document.getElementById(id).value = '');
    document.getElementById('f-city').value  = 'dubai';
    document.getElementById('f-emoji').value = '🏢';
    document.getElementById('f-bg').value    = '#0d1f2d';
  }
}

function closeModal() {
  document.getElementById('proj-modal').classList.remove('open');
}

function editProject(idx)   { openModal(idx); }

function deleteProject(idx) {
  if (!confirm(`Delete "${projects[idx].name}"?`)) return;
  projects.splice(idx, 1);
  renderAll();
  showToast('Project deleted successfully');
}

function saveProject() {
  const name = document.getElementById('f-name').value.trim();
  const dev  = document.getElementById('f-dev').value.trim();
  if (!name || !dev) { alert('Project Name and Developer are required.'); return; }

  const proj = {
    name, dev,
    loc:     document.getElementById('f-loc').value,
    city:    document.getElementById('f-city').value,
    price:   document.getElementById('f-price').value,
    roi:     document.getElementById('f-roi').value,
    plan:    document.getElementById('f-plan').value,
    handover:document.getElementById('f-handover').value,
    type:    document.getElementById('f-type').value,
    badge:   document.getElementById('f-badge').value,
    emoji:   document.getElementById('f-emoji').value || '🏢',
    bg:      document.getElementById('f-bg').value,
    desc:    document.getElementById('f-desc').value,
  };

  const idx = +document.getElementById('edit-idx').value;
  if (idx === -1) { projects.push(proj); } else { projects[idx] = proj; }

  closeModal();
  renderAll();
  showToast(idx === -1 ? '✅ Project added successfully!' : '✅ Project updated successfully!');
}

// ── AREAS ─────────────────────────────────────
function renderAreas() {
  document.getElementById('areas-tbody').innerHTML = areas.map((a, i) => `
    <tr>
      <td><input value="${a.name}" onchange="areas[${i}].name=this.value"
        style="background:var(--dark3);border:1px solid var(--border);color:var(--text);padding:6px 10px;border-radius:6px;font-size:.83rem;width:220px;outline:none;"></td>
      <td>
        <select onchange="areas[${i}].city=this.value"
          style="background:var(--dark3);border:1px solid var(--border);color:var(--text);padding:6px 10px;border-radius:6px;font-size:.83rem;outline:none;">
          <option value="dubai"    ${a.city === 'dubai'    ? 'selected' : ''}>Dubai</option>
          <option value="abudhabi" ${a.city === 'abudhabi' ? 'selected' : ''}>Abu Dhabi</option>
        </select>
      </td>
      <td><input type="number" value="${a.rate}" onchange="areas[${i}].rate=+this.value"
        style="background:var(--dark3);border:1px solid var(--border);color:var(--gold);padding:6px 10px;border-radius:6px;font-size:.88rem;width:80px;outline:none;text-align:right;font-weight:700;"></td>
      <td><button class="btn-sm btn-del" onclick="areas.splice(${i},1);renderAreas()">🗑️</button></td>
    </tr>`).join('');
}

function addAreaRow() {
  areas.push({ name: 'New Area', city: 'dubai', rate: 7 });
  renderAreas();
}

function saveAreas() { showToast('✅ Area rates saved!'); }

// ── PAYMENT PLANS ─────────────────────────────
function renderPlans() {
  document.getElementById('plan-list').innerHTML = plans.map((p, i) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid rgba(255,255,255,.04);">
      <span style="font-size:.85rem;">${p}</span>
      <button class="btn-sm btn-del" style="padding:3px 10px;" onclick="plans.splice(${i},1);renderPlans()">✕</button>
    </div>`).join('');
}

function addPlan() {
  const v = document.getElementById('new-plan-label').value.trim();
  if (!v) return;
  plans.push(v);
  document.getElementById('new-plan-label').value = '';
  renderPlans();
}

function savePlans() { showToast('✅ Payment plans saved!'); }

// ── SETTINGS SAVE ─────────────────────────────
function saveCalcSettings(type) {
  showToast(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} defaults saved!`);
}

function saveFees(city) {
  const label = city === 'dubai' ? 'Dubai' : city === 'abudhabi' ? 'Abu Dhabi' : 'Other';
  showToast(`✅ ${label} fees saved!`);
}

// ── CHANGE PASSWORD ───────────────────────────
function changePassword() {
  const cur    = document.getElementById('acc-cur').value;
  const newP   = document.getElementById('acc-new').value;
  const conf   = document.getElementById('acc-confirm').value;
  const newU   = document.getElementById('acc-user').value.trim();
  const msg    = document.getElementById('pwd-msg');

  if (cur !== adminPass) {
    msg.style.color = 'var(--red)';
    msg.textContent = '❌ Current password is incorrect.';
    return;
  }
  if (newP.length < 6) {
    msg.style.color = 'var(--red)';
    msg.textContent = '❌ New password must be at least 6 characters.';
    return;
  }
  if (newP !== conf) {
    msg.style.color = 'var(--red)';
    msg.textContent = '❌ Passwords do not match.';
    return;
  }

  adminPass = newP;
  adminUser = newU;
  document.getElementById('acc-display-user').textContent = newU;
  document.getElementById('admin-name-badge').textContent = newU;
  msg.style.color = 'var(--green)';
  msg.textContent = '✅ Credentials updated successfully!';
  showToast('✅ Password changed!');
}

// ── TOAST NOTIFICATION ────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}