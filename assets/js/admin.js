/* ============================================
   UAE PropHub — Admin JS (admin.js)
   Saves all changes to localStorage so
   index.html always reflects updates.
   ============================================ */

// ── STORAGE KEYS ──────────────────────────────
const KEYS = {
  projects : 'uae_projects',
  areas    : 'uae_areas',
  plans    : 'uae_plans',
  fees     : 'uae_fees',
  calcCfg  : 'uae_calc_config',
};

// ── SAVE / LOAD HELPERS ───────────────────────
function persist(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

// ── CREDENTIALS ───────────────────────────────
let adminUser = load('uae_admin_user', 'admin@uaeprophub.com');
let adminPass = load('uae_admin_pass', 'UAE@2024');

// ── DEFAULT DATA ──────────────────────────────
const DEFAULT_PROJECTS = [
  { name:'Emaar Beach Vista',              dev:'Emaar Properties',     loc:'Emaar Beachfront, Dubai',         city:'dubai',    emoji:'🏖️', bg:'#0d1f2d', badge:'Ready Q1 2025',  roi:'6.8%', price:'From AED 2.1M', plan:'20/80',          handover:'Q1 2025', type:'Apartment',          desc:'' },
  { name:'DAMAC Lagoons',                  dev:'DAMAC Properties',     loc:'Dubailand, Dubai',                city:'dubai',    emoji:'💧', bg:'#1a0d2d', badge:'Off-Plan',        roi:'7.2%', price:'From AED 1.4M', plan:'1% Monthly',     handover:'Q4 2026', type:'Villa / Townhouse',  desc:'' },
  { name:'Aldar Yas Acres',                dev:'Aldar Properties',     loc:'Yas Island, Abu Dhabi',           city:'abudhabi', emoji:'🌴', bg:'#0d2d1a', badge:'Off-Plan',        roi:'6.5%', price:'From AED 3.2M', plan:'40/60',          handover:'Q2 2027', type:'Villa',              desc:'' },
  { name:'Sobha Hartland II',              dev:'Sobha Realty',         loc:'Mohammed Bin Rashid City, Dubai', city:'dubai',    emoji:'🌿', bg:'#1a2d0d', badge:'Off-Plan',        roi:'7.5%', price:'From AED 1.8M', plan:'30/70',          handover:'Q3 2026', type:'Apartment',          desc:'' },
  { name:'Nakheel Rixos Hotel Residences', dev:'Nakheel',              loc:'Palm Jumeirah, Dubai',            city:'dubai',    emoji:'🌴', bg:'#2d1a0d', badge:'New Launch',      roi:'8.1%', price:'From AED 4.5M', plan:'50/50',          handover:'Q1 2027', type:'Branded Residences', desc:'' },
  { name:'Aldar Saadiyat Grove',           dev:'Aldar Properties',     loc:'Saadiyat Island, Abu Dhabi',      city:'abudhabi', emoji:'🎨', bg:'#2d0d1a', badge:'Off-Plan',        roi:'7.0%', price:'From AED 2.8M', plan:'40/60',          handover:'Q4 2027', type:'Apartment',          desc:'' },
  { name:'Emaar Golf Gate',                dev:'Emaar Properties',     loc:'Dubai Hills Estate, Dubai',       city:'dubai',    emoji:'⛳', bg:'#0d2d2d', badge:'Off-Plan',        roi:'6.9%', price:'From AED 1.6M', plan:'30/70',          handover:'Q2 2027', type:'Apartment',          desc:'' },
  { name:'Masdar City Residences',         dev:'Masdar',               loc:'Masdar City, Abu Dhabi',          city:'abudhabi', emoji:'♻️', bg:'#1a2d2d', badge:'Ready',          roi:'6.2%', price:'From AED 900K', plan:'Mortgage Ready', handover:'Ready',   type:'Apartment',          desc:'' },
  { name:'Binghatti Venus',                dev:'Binghatti Developers', loc:'JVC, Dubai',                      city:'dubai',    emoji:'🌟', bg:'#2d2d0d', badge:'Off-Plan',        roi:'7.8%', price:'From AED 750K', plan:'50/50',          handover:'Q3 2025', type:'Apartment',          desc:'' },
];

const DEFAULT_AREAS = [
  { name:'Dubai Marina',            city:'dubai',    rate:8  },
  { name:'Downtown Dubai',          city:'dubai',    rate:9  },
  { name:'Dubai Hills Estate',      city:'dubai',    rate:7  },
  { name:'Palm Jumeirah',           city:'dubai',    rate:10 },
  { name:'JVC',                     city:'dubai',    rate:6  },
  { name:'Business Bay',            city:'dubai',    rate:8  },
  { name:'Yas Island',              city:'abudhabi', rate:7  },
  { name:'Saadiyat Island',         city:'abudhabi', rate:9  },
  { name:'Al Reem Island',          city:'abudhabi', rate:6  },
  { name:'Mohammed Bin Zayed City', city:'abudhabi', rate:7  },
];

const DEFAULT_PLANS = ['30/70','40/60','50/50','20/80','60/40','1% Monthly'];

const DEFAULT_FEES = {
  dxb: { transfer:4, admin:4200, title:580, agent:2, mort:0.25 },
  ad:  { transfer:2, admin:3000, title:500, agent:2, mort:0.10 },
  other: { val:3500, noc:1000, rera:2000 },
};

const DEFAULT_CALC = {
  roi:  { price:1500000, rent:90000, service:15000, vacancy:5, maint:5000 },
  mort: { value:2000000, down:20, rate:4.5, tenure:25, ltvUae:80, ltvExp:75, ltvNr:50 },
  ca:   { price:1500000, years:10, rent:90000 },
};

// ── LIVE STATE (loaded from storage or defaults) ──
let projects = load(KEYS.projects, DEFAULT_PROJECTS);
let areas    = load(KEYS.areas,    DEFAULT_AREAS);
let plans    = load(KEYS.plans,    DEFAULT_PLANS);
let fees     = load(KEYS.fees,     DEFAULT_FEES);
let calcCfg  = load(KEYS.calcCfg,  DEFAULT_CALC);

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
    loadSettingsUI();
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
    document.getElementById('f-name').value     = p.name;
    document.getElementById('f-dev').value      = p.dev;
    document.getElementById('f-loc').value      = p.loc;
    document.getElementById('f-city').value     = p.city;
    document.getElementById('f-price').value    = p.price;
    document.getElementById('f-roi').value      = p.roi;
    document.getElementById('f-plan').value     = p.plan;
    document.getElementById('f-handover').value = p.handover;
    document.getElementById('f-type').value     = p.type;
    document.getElementById('f-badge').value    = p.badge;
    document.getElementById('f-emoji').value    = p.emoji;
    document.getElementById('f-bg').value       = p.bg;
    document.getElementById('f-desc').value     = p.desc || '';
  } else {
    ['f-name','f-dev','f-loc','f-price','f-roi','f-plan','f-handover','f-type','f-badge','f-desc']
      .forEach(id => document.getElementById(id).value = '');
    document.getElementById('f-city').value  = 'dubai';
    document.getElementById('f-emoji').value = '🏢';
    document.getElementById('f-bg').value    = '#0d1f2d';
  }
}

function closeModal() { document.getElementById('proj-modal').classList.remove('open'); }
function editProject(idx) { openModal(idx); }

function deleteProject(idx) {
  if (!confirm(`Delete "${projects[idx].name}"?`)) return;
  projects.splice(idx, 1);
  persist(KEYS.projects, projects);   // 🔄 sync to index.html
  renderAll();
  showToast('🗑️ Project deleted — index.html updated');
}

function saveProject() {
  const name = document.getElementById('f-name').value.trim();
  const dev  = document.getElementById('f-dev').value.trim();
  if (!name || !dev) { alert('Project Name and Developer are required.'); return; }

  const proj = {
    name, dev,
    loc:      document.getElementById('f-loc').value,
    city:     document.getElementById('f-city').value,
    price:    document.getElementById('f-price').value,
    roi:      document.getElementById('f-roi').value,
    plan:     document.getElementById('f-plan').value,
    handover: document.getElementById('f-handover').value,
    type:     document.getElementById('f-type').value,
    badge:    document.getElementById('f-badge').value,
    emoji:    document.getElementById('f-emoji').value || '🏢',
    bg:       document.getElementById('f-bg').value,
    desc:     document.getElementById('f-desc').value,
  };

  const idx = +document.getElementById('edit-idx').value;
  if (idx === -1) { projects.push(proj); } else { projects[idx] = proj; }

  persist(KEYS.projects, projects);   // 🔄 sync to index.html
  closeModal();
  renderAll();
  showToast(idx === -1 ? '✅ Project added — index.html updated!' : '✅ Project updated — index.html updated!');
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
          <option value="dubai"    ${a.city==='dubai'    ? 'selected':''}>Dubai</option>
          <option value="abudhabi" ${a.city==='abudhabi' ? 'selected':''}>Abu Dhabi</option>
        </select>
      </td>
      <td><input type="number" value="${a.rate}" onchange="areas[${i}].rate=+this.value"
        style="background:var(--dark3);border:1px solid var(--border);color:var(--gold);padding:6px 10px;border-radius:6px;font-size:.88rem;width:80px;outline:none;text-align:right;font-weight:700;"></td>
      <td><button class="btn-sm btn-del" onclick="areas.splice(${i},1);renderAreas()">🗑️</button></td>
    </tr>`).join('');
}

function addAreaRow() { areas.push({ name:'New Area', city:'dubai', rate:7 }); renderAreas(); }

function saveAreas() {
  persist(KEYS.areas, areas);         // 🔄 sync to index.html
  showToast('✅ Area rates saved — index.html updated!');
}

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

function savePlans() {
  persist(KEYS.plans, plans);         // 🔄 sync to index.html
  showToast('✅ Payment plans saved — index.html updated!');
}

// ── CALCULATOR SETTINGS ───────────────────────
function loadSettingsUI() {
  // ROI
  document.getElementById('s-roi-price').value   = calcCfg.roi.price;
  document.getElementById('s-roi-rent').value    = calcCfg.roi.rent;
  document.getElementById('s-roi-service').value = calcCfg.roi.service;
  document.getElementById('s-roi-vacancy').value = calcCfg.roi.vacancy;
  document.getElementById('s-roi-maint').value   = calcCfg.roi.maint;
  // Mortgage
  document.getElementById('s-m-value').value    = calcCfg.mort.value;
  document.getElementById('s-m-down').value     = calcCfg.mort.down;
  document.getElementById('s-m-rate').value     = calcCfg.mort.rate;
  document.getElementById('s-m-tenure').value   = calcCfg.mort.tenure;
  document.getElementById('s-m-ltv-uae').value  = calcCfg.mort.ltvUae;
  document.getElementById('s-m-ltv-exp').value  = calcCfg.mort.ltvExp;
  document.getElementById('s-m-ltv-nr').value   = calcCfg.mort.ltvNr;
  // Appreciation
  document.getElementById('s-ca-price').value = calcCfg.ca.price;
  document.getElementById('s-ca-years').value = calcCfg.ca.years;
  document.getElementById('s-ca-rent').value  = calcCfg.ca.rent;
  // Fees Dubai
  document.getElementById('f-dxb-transfer').value = fees.dxb.transfer;
  document.getElementById('f-dxb-admin').value    = fees.dxb.admin;
  document.getElementById('f-dxb-title').value    = fees.dxb.title;
  document.getElementById('f-dxb-agent').value    = fees.dxb.agent;
  document.getElementById('f-dxb-mort').value     = fees.dxb.mort;
  // Fees Abu Dhabi
  document.getElementById('f-ad-transfer').value = fees.ad.transfer;
  document.getElementById('f-ad-admin').value    = fees.ad.admin;
  document.getElementById('f-ad-title').value    = fees.ad.title;
  document.getElementById('f-ad-agent').value    = fees.ad.agent;
  document.getElementById('f-ad-mort').value     = fees.ad.mort;
  // Other fees
  document.getElementById('f-val').value  = fees.other.val;
  document.getElementById('f-noc').value  = fees.other.noc;
  document.getElementById('f-rera').value = fees.other.rera;
}

function saveCalcSettings(type) {
  if (type === 'roi') {
    calcCfg.roi = {
      price:   +document.getElementById('s-roi-price').value,
      rent:    +document.getElementById('s-roi-rent').value,
      service: +document.getElementById('s-roi-service').value,
      vacancy: +document.getElementById('s-roi-vacancy').value,
      maint:   +document.getElementById('s-roi-maint').value,
    };
  } else if (type === 'mortgage') {
    calcCfg.mort = {
      value:   +document.getElementById('s-m-value').value,
      down:    +document.getElementById('s-m-down').value,
      rate:    +document.getElementById('s-m-rate').value,
      tenure:  +document.getElementById('s-m-tenure').value,
      ltvUae:  +document.getElementById('s-m-ltv-uae').value,
      ltvExp:  +document.getElementById('s-m-ltv-exp').value,
      ltvNr:   +document.getElementById('s-m-ltv-nr').value,
    };
  } else if (type === 'appreciation') {
    calcCfg.ca = {
      price: +document.getElementById('s-ca-price').value,
      years: +document.getElementById('s-ca-years').value,
      rent:  +document.getElementById('s-ca-rent').value,
    };
  }
  persist(KEYS.calcCfg, calcCfg);    // 🔄 sync to index.html
  showToast(`✅ ${type} defaults saved — index.html updated!`);
}

function saveFees(city) {
  if (city === 'dubai') {
    fees.dxb = {
      transfer: +document.getElementById('f-dxb-transfer').value,
      admin:    +document.getElementById('f-dxb-admin').value,
      title:    +document.getElementById('f-dxb-title').value,
      agent:    +document.getElementById('f-dxb-agent').value,
      mort:     +document.getElementById('f-dxb-mort').value,
    };
  } else if (city === 'abudhabi') {
    fees.ad = {
      transfer: +document.getElementById('f-ad-transfer').value,
      admin:    +document.getElementById('f-ad-admin').value,
      title:    +document.getElementById('f-ad-title').value,
      agent:    +document.getElementById('f-ad-agent').value,
      mort:     +document.getElementById('f-ad-mort').value,
    };
  } else {
    fees.other = {
      val:  +document.getElementById('f-val').value,
      noc:  +document.getElementById('f-noc').value,
      rera: +document.getElementById('f-rera').value,
    };
  }
  persist(KEYS.fees, fees);          // 🔄 sync to index.html
  const label = city === 'dubai' ? 'Dubai' : city === 'abudhabi' ? 'Abu Dhabi' : 'Other';
  showToast(`✅ ${label} fees saved — index.html updated!`);
}

// ── CHANGE PASSWORD ───────────────────────────
function changePassword() {
  const cur  = document.getElementById('acc-cur').value;
  const newP = document.getElementById('acc-new').value;
  const conf = document.getElementById('acc-confirm').value;
  const newU = document.getElementById('acc-user').value.trim();
  const msg  = document.getElementById('pwd-msg');

  if (cur !== adminPass)  { msg.style.color='var(--red)';   msg.textContent='❌ Current password is incorrect.'; return; }
  if (newP.length < 6)    { msg.style.color='var(--red)';   msg.textContent='❌ New password must be at least 6 characters.'; return; }
  if (newP !== conf)      { msg.style.color='var(--red)';   msg.textContent='❌ Passwords do not match.'; return; }

  adminPass = newP;
  adminUser = newU;
  localStorage.setItem('uae_admin_user', newU);
  localStorage.setItem('uae_admin_pass', newP);
  document.getElementById('acc-display-user').textContent = newU;
  document.getElementById('admin-name-badge').textContent = newU;
  msg.style.color = 'var(--green)';
  msg.textContent = '✅ Credentials updated successfully!';
  showToast('✅ Password changed!');
}

// ── TOAST ─────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
