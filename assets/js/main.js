/* ============================================
   UAE PropHub — Main Site JavaScript (main.js)
   Place this file at: assets/js/main.js
   ============================================ */

// ── HELPERS ──────────────────────────────────
const fmt = n => 'AED ' + Math.round(n).toLocaleString();
const pct = n => n.toFixed(2) + '%';

// ── TAB SWITCHING ─────────────────────────────
function switchTab(id) {
  document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  event.target.classList.add('active');
}

// ── ROI CALCULATOR ────────────────────────────
function calcROI() {
  const price    = +document.getElementById('roi-price').value;
  const rent     = +document.getElementById('roi-rent').value;
  const service  = +document.getElementById('roi-service').value;
  const vacancy  = +document.getElementById('roi-vacancy').value / 100;
  const maint    = +document.getElementById('roi-maint').value;

  const grossYield    = (rent / price) * 100;
  const effectiveRent = rent * (1 - vacancy);
  const netIncome     = effectiveRent - service - maint;
  const netYield      = (netIncome / price) * 100;
  const monthly       = netIncome / 12;
  const breakeven     = price / netIncome;
  const return10      = netIncome * 10;

  document.getElementById('r-gross').textContent = pct(grossYield);
  document.getElementById('r-gross').className = 'result-val ' + (grossYield >= 7 ? 'green' : grossYield >= 5 ? '' : 'red');
  document.getElementById('r-net').textContent = pct(netYield);
  document.getElementById('r-net').className = 'result-val ' + (netYield >= 5 ? 'green' : '');
  document.getElementById('r-gross-income').textContent = fmt(rent);
  document.getElementById('r-net-income').textContent   = fmt(netIncome);
  document.getElementById('r-monthly').textContent      = fmt(monthly);
  document.getElementById('r-breakeven').textContent    = breakeven.toFixed(1) + ' yrs';
  document.getElementById('r-10yr').textContent         = fmt(return10);

  const barW = Math.min(netYield * 10, 100);
  document.getElementById('yield-bar-wrap').style.display = 'block';
  document.getElementById('yield-bar').style.width = barW + '%';
  document.getElementById('yield-bar-label').textContent = pct(netYield);
}

// ── PAYMENT PLAN CALCULATOR ───────────────────
function calcPayment() {
  const price   = +document.getElementById('pp-price').value;
  const plan    = document.getElementById('pp-plan').value;
  const downPct = +document.getElementById('pp-down').value / 100;
  const start   = new Date(document.getElementById('pp-start').value + '-01');
  const end     = new Date(document.getElementById('pp-end').value + '-01');
  const months  = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24 * 30.44)));

  let schedule = [];
  const downAmt = price * downPct;
  schedule.push({ stage: 'Down Payment (Booking)', date: fmtDate(start), amount: downAmt, cumulative: downAmt });

  if (plan === '1-99') {
    let cum = downAmt;
    const monthly = price * 0.01;
    for (let i = 1; i <= Math.min(months, 99); i++) {
      const d = new Date(start);
      d.setMonth(d.getMonth() + i);
      cum += monthly;
      schedule.push({ stage: `Monthly Installment ${i}`, date: fmtDate(d), amount: monthly, cumulative: cum });
    }
  } else {
    const [cPct, hPct] = plan.split('-').map(Number);
    const constructionAmt = price * (cPct / 100) - downAmt;
    const handoverAmt     = price * (hPct / 100);
    const numInst         = Math.max(1, Math.floor(months / 3));
    const instAmt         = constructionAmt / numInst;
    let cum = downAmt;

    for (let i = 1; i <= numInst; i++) {
      const d = new Date(start);
      d.setMonth(d.getMonth() + i * 3);
      cum += instAmt;
      schedule.push({
        stage: `Construction ${Math.round(i * 100 / numInst)}%`,
        date: fmtDate(d),
        amount: instAmt,
        cumulative: Math.min(cum, price - handoverAmt)
      });
    }
    schedule.push({ stage: '🏠 On Handover', date: fmtDate(end), amount: handoverAmt, cumulative: price });
  }

  let html = `
    <div style="margin-bottom:1rem;">
      <div class="result-row"><span class="result-label">Property Price</span><span class="result-val">${fmt(price)}</span></div>
      <div class="result-row"><span class="result-label">Plan</span><span class="result-val">${plan}</span></div>
      <div class="result-row"><span class="result-label">Total Installments</span><span class="result-val">${schedule.length}</span></div>
    </div>
    <div style="overflow-x:auto;max-height:320px;overflow-y:auto;">
    <table class="schedule-table">
      <thead><tr><th>Stage</th><th>Date</th><th>Amount (AED)</th><th>Cumulative</th></tr></thead>
      <tbody>`;

  schedule.forEach(r => {
    html += `<tr>
      <td>${r.stage}</td>
      <td>${r.date}</td>
      <td style="color:var(--gold)">${Math.round(r.amount).toLocaleString()}</td>
      <td>${Math.round(r.cumulative).toLocaleString()}</td>
    </tr>`;
  });

  html += `</tbody></table></div>`;
  document.getElementById('pp-result').innerHTML = html;
}

function fmtDate(d) {
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

// ── MORTGAGE CALCULATOR ───────────────────────
function calcMortgage() {
  const val      = +document.getElementById('m-value').value;
  const downPct  = +document.getElementById('m-down').value / 100;
  const rate     = +document.getElementById('m-rate').value / 100 / 12;
  const n        = +document.getElementById('m-tenure').value * 12;
  const resident = document.getElementById('m-resident').value;

  const maxLTV = { uae: 0.8, expat: 0.75, nonresident: 0.5 }[resident];
  const dp     = val * downPct;
  const loan   = val - dp;
  const ltv    = loan / val;
  const monthly      = loan * rate * Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1);
  const totalRepay   = monthly * n;
  const totalInterest = totalRepay - loan;

  document.getElementById('m-loan').textContent     = fmt(loan);
  document.getElementById('m-dp').textContent       = fmt(dp);
  document.getElementById('m-monthly').textContent  = fmt(monthly);
  document.getElementById('m-total').textContent    = fmt(totalRepay);
  document.getElementById('m-interest').textContent = fmt(totalInterest);
  document.getElementById('m-ltv').textContent      = (ltv * 100).toFixed(1) + '%';

  const warn = document.getElementById('m-warning');
  if (ltv > maxLTV) {
    warn.style.display = 'block';
    warn.textContent = `⚠️ LTV of ${(ltv * 100).toFixed(1)}% exceeds the max ${maxLTV * 100}% for ${resident} buyers. Min down payment = ${fmt(val * (1 - maxLTV))}`;
  } else {
    warn.style.display = 'none';
  }
}

// ── APPRECIATION CALCULATOR ───────────────────
function calcAppreciation() {
  const price    = +document.getElementById('ca-price').value;
  const rate     = +document.getElementById('ca-area').value / 100;
  const yrs      = +document.getElementById('ca-years').value;
  const annRent  = +document.getElementById('ca-rent').value;

  const future      = price * Math.pow(1 + rate, yrs);
  const gain        = future - price;
  const totalRent   = annRent * yrs;
  const totalReturn = gain + totalRent;
  const roi         = (totalReturn / price) * 100;

  document.getElementById('ca-buy').textContent         = fmt(price);
  document.getElementById('ca-future').textContent      = fmt(future);
  document.getElementById('ca-gain').textContent        = fmt(gain);
  document.getElementById('ca-totalrent').textContent   = fmt(totalRent);
  document.getElementById('ca-totalreturn').textContent = fmt(totalReturn);
  document.getElementById('ca-roi').textContent         = roi.toFixed(1) + '%';

  // Timeline
  let tl = '<div style="font-size:.75rem;color:var(--muted);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.5px;">Projection Timeline</div>';
  [1, 2, 3, 5, 7, yrs]
    .filter((v, i, a) => a.indexOf(v) === i && v <= yrs)
    .forEach(y => {
      const fv   = price * Math.pow(1 + rate, y);
      const pctG = ((fv - price) / price * 100).toFixed(1);
      tl += `<div style="display:flex;justify-content:space-between;padding:.3rem 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.82rem;">
        <span style="color:var(--muted)">Year ${y}</span>
        <span style="color:var(--gold)">${fmt(fv)}</span>
        <span style="color:#4ade80">+${pctG}%</span>
      </div>`;
    });
  document.getElementById('ca-timeline').innerHTML = tl;
}

// ── DLD FEE CALCULATOR ────────────────────────
function calcDLD() {
  const price    = +document.getElementById('dld-price').value;
  const city     = document.getElementById('dld-city').value;
  const agentPct = +document.getElementById('dld-agent').value / 100;

  const transfer = price * 0.04;
  const admin    = city === 'dubai' ? 4200 : 3000;
  const title    = city === 'dubai' ? 580 : 500;
  const agent    = price * agentPct;
  const total    = price + transfer + admin + title + agent;
  const extraPct = ((total - price) / price * 100).toFixed(2);

  document.getElementById('dld-r-price').textContent    = fmt(price);
  document.getElementById('dld-r-transfer').textContent = fmt(transfer);
  document.getElementById('dld-r-admin').textContent    = fmt(admin) + (city === 'dubai' ? ' (Trustee Office)' : ' (ADM)');
  document.getElementById('dld-r-title').textContent    = fmt(title);
  document.getElementById('dld-r-agent').textContent    = agentPct > 0 ? fmt(agent) : 'Waived';
  document.getElementById('dld-r-total').textContent    = fmt(total);
  document.getElementById('dld-r-pct').textContent      = extraPct + '%';
}

// ── PROJECTS DATA ─────────────────────────────
const projects = [
  { name:'Emaar Beach Vista',             dev:'Emaar Properties',     loc:'Emaar Beachfront, Dubai',          city:'dubai',    emoji:'🏖️', bg:'#0d1f2d', badge:'Ready Q1 2025',  roi:'6.8%', price:'From AED 2.1M', plan:'20/80',      handover:'Q1 2025', type:'Apartment' },
  { name:'DAMAC Lagoons',                 dev:'DAMAC Properties',     loc:'Dubailand, Dubai',                 city:'dubai',    emoji:'💧', bg:'#1a0d2d', badge:'Off-Plan',        roi:'7.2%', price:'From AED 1.4M', plan:'1% Monthly', handover:'Q4 2026', type:'Villa / Townhouse' },
  { name:'Aldar Yas Acres',               dev:'Aldar Properties',     loc:'Yas Island, Abu Dhabi',            city:'abudhabi', emoji:'🌴', bg:'#0d2d1a', badge:'Off-Plan',        roi:'6.5%', price:'From AED 3.2M', plan:'40/60',      handover:'Q2 2027', type:'Villa' },
  { name:'Sobha Hartland II',             dev:'Sobha Realty',         loc:'Mohammed Bin Rashid City, Dubai',  city:'dubai',    emoji:'🌿', bg:'#1a2d0d', badge:'Off-Plan',        roi:'7.5%', price:'From AED 1.8M', plan:'30/70',      handover:'Q3 2026', type:'Apartment' },
  { name:'Nakheel Rixos Hotel Residences',dev:'Nakheel',              loc:'Palm Jumeirah, Dubai',             city:'dubai',    emoji:'🌴', bg:'#2d1a0d', badge:'New Launch',      roi:'8.1%', price:'From AED 4.5M', plan:'50/50',      handover:'Q1 2027', type:'Branded Residences' },
  { name:'Aldar Saadiyat Grove',          dev:'Aldar Properties',     loc:'Saadiyat Island, Abu Dhabi',       city:'abudhabi', emoji:'🎨', bg:'#2d0d1a', badge:'Off-Plan',        roi:'7.0%', price:'From AED 2.8M', plan:'40/60',      handover:'Q4 2027', type:'Apartment' },
  { name:'Emaar Golf Gate',               dev:'Emaar Properties',     loc:'Dubai Hills Estate, Dubai',        city:'dubai',    emoji:'⛳', bg:'#0d2d2d', badge:'Off-Plan',        roi:'6.9%', price:'From AED 1.6M', plan:'30/70',      handover:'Q2 2027', type:'Apartment' },
  { name:'Masdar City Residences',        dev:'Masdar',               loc:'Masdar City, Abu Dhabi',           city:'abudhabi', emoji:'♻️', bg:'#1a2d2d', badge:'Ready',          roi:'6.2%', price:'From AED 900K', plan:'Mortgage Ready', handover:'Ready', type:'Apartment' },
  { name:'Binghatti Venus',               dev:'Binghatti Developers', loc:'JVC, Dubai',                       city:'dubai',    emoji:'🌟', bg:'#2d2d0d', badge:'Off-Plan',        roi:'7.8%', price:'From AED 750K', plan:'50/50',      handover:'Q3 2025', type:'Apartment' },
];

function renderProjects(filter) {
  const grid     = document.getElementById('projects-grid');
  const filtered = filter === 'all' ? projects : projects.filter(p => p.city === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="project-card">
      <div class="proj-img" style="background:${p.bg};">
        <span>${p.emoji}</span>
        <div class="proj-badge">${p.badge}</div>
        <div class="proj-city-badge">${p.city === 'dubai' ? '🏙️ Dubai' : '🕌 Abu Dhabi'}</div>
      </div>
      <div class="proj-body">
        <div class="proj-dev">${p.dev}</div>
        <div class="proj-name">${p.name}</div>
        <div class="proj-loc">📍 ${p.loc}</div>
        <div class="proj-stats">
          <div class="proj-stat"><div class="proj-stat-val">${p.roi}</div><div class="proj-stat-label">Est. ROI</div></div>
          <div class="proj-stat"><div class="proj-stat-val" style="font-size:.85rem">${p.price}</div><div class="proj-stat-label">Starting Price</div></div>
        </div>
        <div class="proj-plan">🗓 Payment Plan: <span>${p.plan}</span> &nbsp;|&nbsp; 🏠 <span>${p.handover}</span></div>
        <div class="proj-plan" style="margin-top:.3rem;">🏗 Type: <span>${p.type}</span></div>
      </div>
    </div>`).join('');
}

function filterProjects(f, btn) {
  document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProjects(f);
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProjects('all');
  calcROI();
  calcDLD();
});