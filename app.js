/**
 * MR. LION — PORTAL DO PARCEIRO v3
 * app.js
 *
 * IMPORTANTE: Substituir WA_NUMBER pelo número real do time comercial
 */

// ── CONFIG ────────────────────────────────────────────────
const WA_NUMBER = '5531984463634'; // TODO: confirmar número real

const PRICES = {
  honey:  { completo:[104,96,88,83,80], pingente:[91,84,77,77,70], garrafa:[88,81,74,74,68] },
  capp:   { completo:[107,99,90,85,82], pingente:[95,87,81,76,73], garrafa:[93,86,80,75,72] },
  blend:  { completo:[83,76,70,70,63],  pingente:[75,72,67,63,60], garrafa:[73,69,62,62,55] },
};

const PROD_NAMES   = { honey:'Honey', capp:'Cappuccino', blend:'Blended' };
const VERSAO_NAMES = { completo:'Completo', pingente:'Pingente', garrafa:'Só Garrafa' };
const NIVEL_LABELS = ['Nível 1','Nível 2','Nível 3','Nível 4','Nível 5'];
const NIVEL_RANGES = ['até 5 cx','até 10 cx','até 20 cx','até 40 cx','40+ cx'];

function getNivel(caixas) {
  if (caixas <= 5)  return 0;
  if (caixas <= 10) return 1;
  if (caixas <= 20) return 2;
  if (caixas <= 40) return 3;
  return 4;
}

function fmtBRL(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ── PROGRESS BAR ──────────────────────────────────────────
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// ── CHAPTER DOTS ──────────────────────────────────────────
function initChapterNav() {
  const sections = document.querySelectorAll('section[data-chapter]');
  const nav      = document.querySelector('.chapter-nav');
  if (!nav) return;

  sections.forEach((sec, i) => {
    const dot = document.createElement('button');
    dot.className = 'chapter-dot';
    dot.dataset.target = '#' + sec.id;
    dot.title = sec.dataset.chapter;
    dot.addEventListener('click', () => {
      document.querySelector('#' + sec.id)?.scrollIntoView({ behavior: 'smooth' });
    });
    nav.appendChild(dot);
  });

  const dots = nav.querySelectorAll('.chapter-dot');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(sections).indexOf(entry.target);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => observer.observe(sec));
}

// ── NAV ACTIVE LINK ────────────────────────────────────────
function initNavHighlight() {
  const links    = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 80) current = s.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

// ── MOBILE HAMBURGER ──────────────────────────────────────
function initMobileNav() {
  const btn    = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('nav-mobile');
  if (!btn || !drawer) return;
  btn.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('#nav-mobile a').forEach(a => {
    a.addEventListener('click', () => drawer.classList.remove('open'));
  });
}

// ── SCROLL REVEAL ─────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── HERO PRODUCT TABS ─────────────────────────────────────
// Escala de cada produto no hero frame (cappuccino tem mais espaço branco na imagem)
const HERO_IMG_SCALE = { honey: '1', capp: '1.22', blend: '1.05' };

function initHeroTabs() {
  document.querySelectorAll('.hero-ptab').forEach(tab => {
    tab.addEventListener('click', () => {
      const prod = tab.dataset.prod;
      document.querySelectorAll('.hero-ptab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const img = document.getElementById('hero-main-img');
      if (img) {
        img.style.opacity = '0';
        setTimeout(() => {
          img.src = 'assets/' + prodFolder(prod) + '/garrafa-semfundo.webp';
          img.style.transform = 'scale(' + (HERO_IMG_SCALE[prod] || '1') + ')';
          const nameEl = document.getElementById('hero-prod-name');
          const descEl = document.getElementById('hero-prod-desc');
          if (nameEl) nameEl.textContent = 'Mr. Lion ' + PROD_NAMES[prod];
          if (descEl) descEl.textContent = heroProdDesc(prod);
          img.style.opacity = '1';
        }, 200);
      }
    });
  });
}

function prodFolder(prod) {
  return prod === 'capp' ? 'cappuccino' : prod === 'blend' ? 'blended' : 'honey';
}

function heroProdDesc(prod) {
  const descs = {
    honey: 'Licor de Whisky com Mel · 750ml · 40% Vol',
    capp:  'Licor de Whisky e Cappuccino · 750ml · 17% Vol',
    blend: 'Brazilian Blended Whisky · 750ml · 40% Vol',
  };
  return descs[prod] || '';
}

// ── PRODUTO TABS ──────────────────────────────────────────
function switchProd(id) {
  document.querySelectorAll('.prod-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('prod-' + id);
  if (panel) panel.classList.add('active');
  const tabs = document.querySelectorAll('.ptab');
  const idx  = ['honey', 'capp', 'blend'].indexOf(id);
  if (tabs[idx]) tabs[idx].classList.add('active');
}

// Escala para imagens na seção de produtos
const PROD_IMG_SCALE = { honey: '1', capp: '1.2', blend: '1.05' };

function changeImg(prod, file, btn) {
  const img = document.getElementById('img-' + prod);
  if (img) {
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = 'assets/' + prodFolder(prod) + '/' + file;
      img.style.transform = 'scale(' + (PROD_IMG_SCALE[prod] || '1') + ')';
      img.style.opacity = '1';
    }, 180);
  }
  const panel = document.getElementById('prod-' + prod);
  if (panel) {
    panel.querySelectorAll('.thumb').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

function selectVersao(el, prod, versao) {
  const panel = document.getElementById('prod-' + prod);
  if (!panel) return;
  panel.querySelectorAll('.versao-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const file = versao + '-semfundo.webp';
  const img  = document.getElementById('img-' + prod);
  if (img) {
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = 'assets/' + prodFolder(prod) + '/' + file;
      img.style.opacity = '1';
    }, 180);
  }
  const versaoOrder = ['completo', 'pingente', 'garrafa'];
  const thumbIdx = versaoOrder.indexOf(versao);
  const thumbs = panel.querySelectorAll('.thumb');
  thumbs.forEach(t => t.classList.remove('active'));
  if (thumbs[thumbIdx]) thumbs[thumbIdx].classList.add('active');
}

// ── TABELA TABS ───────────────────────────────────────────
function switchLvl(n) {
  document.querySelectorAll('.tbl-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.lvl-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('tbl-' + n);
  if (panel) panel.classList.add('active');
  const btns = document.querySelectorAll('.lvl-btn');
  if (btns[n - 1]) btns[n - 1].classList.add('active');
}

// ── FAQ ACCORDION ─────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer  = btn.nextElementSibling;
      const isOpen  = btn.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-question.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling?.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        btn.classList.add('open');
        answer?.classList.add('open');
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════
//   CALCULADORA — PEDIDO MISTO
// ═══════════════════════════════════════════════════════════

let cart = [];

function getCalcProduct() { return document.getElementById('calc-prod')?.value || ''; }
function getCalcVersao()  { return document.querySelector('input[name="calc-versao"]:checked')?.value || ''; }
function getCalcCaixas()  { return parseInt(document.getElementById('calc-caixas')?.value) || 0; }

function addToCart() {
  const prod   = getCalcProduct();
  const versao = getCalcVersao();
  const caixas = getCalcCaixas();

  if (!prod || !versao) {
    alert('Selecione o produto e a versão antes de adicionar.');
    return;
  }
  if (caixas < 1) {
    alert('Informe uma quantidade válida de caixas.');
    return;
  }

  // Check if same item already exists — merge
  const existing = cart.find(i => i.prod === prod && i.versao === versao);
  if (existing) {
    existing.caixas += caixas;
  } else {
    cart.push({ prod, versao, caixas });
  }

  renderCart();
  renderSummary();

  // Reset fields
  document.getElementById('calc-prod').value = '';
  document.getElementById('calc-caixas').value = '1';
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderCart();
  renderSummary();
}

function getTotalCaixas() {
  return cart.reduce((sum, item) => sum + item.caixas, 0);
}

function renderCart() {
  const container = document.getElementById('cart-container');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty">Nenhum item adicionado. Selecione produto e versão acima.</div>';
    return;
  }

  const totalCaixas = getTotalCaixas();
  const nivelIdx    = getNivel(totalCaixas);

  let rows = cart.map((item, idx) => {
    const preco    = PRICES[item.prod][item.versao][nivelIdx];
    const garrafas = item.caixas * 6;
    const subtotal = preco * garrafas;
    return `
      <tr>
        <td>${PROD_NAMES[item.prod]}</td>
        <td>${VERSAO_NAMES[item.versao]}</td>
        <td>${item.caixas} cx</td>
        <td>${garrafas} un</td>
        <td>${fmtBRL(preco)}</td>
        <td>${fmtBRL(subtotal)}</td>
        <td><button class="cart-remove" onclick="removeFromCart(${idx})" title="Remover">&times;</button></td>
      </tr>`;
  }).join('');

  const rawTotal = cart.reduce((sum, item) => {
    const preco    = PRICES[item.prod][item.versao][nivelIdx];
    return sum + preco * item.caixas * 6;
  }, 0);

  container.innerHTML = `
    <div class="cart-table-wrap">
      <table class="cart-tbl">
        <thead><tr>
          <th>Produto</th><th>Versão</th><th>Caixas</th>
          <th>Garrafas</th><th>Preço/un</th><th>Subtotal</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="cart-subtotal">
      <span>Nível aplicado: <strong style="color:var(--gold)">${NIVEL_LABELS[nivelIdx]} (${NIVEL_RANGES[nivelIdx]})</strong> · ${totalCaixas} caixas / ${totalCaixas*6} garrafas</span>
      <span>${fmtBRL(rawTotal)}</span>
    </div>`;
}

function renderSummary() {
  const emptyEl   = document.getElementById('cr-empty');
  const rowsEl    = document.getElementById('cr-rows');
  const totalBlock= document.getElementById('cr-total-block');
  const ctaEl     = document.getElementById('cr-cta');

  if (!emptyEl || !rowsEl || !totalBlock) return;

  if (cart.length === 0) {
    emptyEl.style.display   = 'block';
    rowsEl.style.display    = 'none';
    totalBlock.style.display= 'none';
    if (ctaEl)  ctaEl.style.display  = 'none';
    return;
  }

  emptyEl.style.display    = 'none';
  rowsEl.style.display     = 'block';
  totalBlock.style.display = 'block';
  if (ctaEl) ctaEl.style.display = 'block';

  const totalCaixas  = getTotalCaixas();
  const nivelIdx     = getNivel(totalCaixas);
  const totalGarr    = totalCaixas * 6;
  const subtotal     = cart.reduce((sum, item) => sum + PRICES[item.prod][item.versao][nivelIdx] * item.caixas * 6, 0);
  const total        = subtotal;
  const economia     = nivelIdx > 0
    ? cart.reduce((sum, item) => sum + (PRICES[item.prod][item.versao][0] - PRICES[item.prod][item.versao][nivelIdx]) * item.caixas * 6, 0)
    : 0;

  // Build rows HTML
  let html = `
    <div class="cr-row"><span class="rk">Caixas no pedido</span><span class="rv">${totalCaixas} caixas</span></div>
    <div class="cr-row"><span class="rk">Garrafas</span><span class="rv">${totalGarr} unidades</span></div>
    <div class="cr-row"><span class="rk">Nível de preço</span><span class="rv gold">${NIVEL_LABELS[nivelIdx]} · ${NIVEL_RANGES[nivelIdx]}</span></div>
    <div class="cr-row"><span class="rk">Subtotal</span><span class="rv">${fmtBRL(subtotal)}</span></div>`;

  if (economia > 0) {
    html += `<div class="cr-row"><span class="rk">Desconto vs. Nível 1</span><span class="rv green">-${fmtBRL(economia)}</span></div>`;
  }

  rowsEl.innerHTML = html;

  // Total
  const totalValEl   = document.getElementById('cr-total-val');
  const totalNoteEl  = document.getElementById('cr-total-note');
  if (totalValEl)  totalValEl.textContent  = fmtBRL(total);
  if (totalNoteEl) totalNoteEl.textContent = 'Pix ou Boleto';

  // Bonuses
  const bonus24   = document.getElementById('cr-bonus-24');
  const bonusGar  = document.getElementById('cr-bonus-garantia');
  if (bonus24)  bonus24.style.display  = totalGarr >= 24 ? 'block' : 'none';
  if (bonusGar) bonusGar.style.display = totalCaixas >= 4 ? 'block' : 'none';

  // Update WhatsApp CTA
  const waBtn = document.getElementById('btn-fechar-pedido');
  if (waBtn) waBtn.href = buildWhatsAppURL(nivelIdx, subtotal, total);
}

function buildWhatsAppURL(nivelIdx, subtotal, total) {
  const totalCaixas = getTotalCaixas();
  const nivelLabel  = NIVEL_LABELS[nivelIdx] + ' (' + NIVEL_RANGES[nivelIdx] + ')';

  let msg = 'Olá! Quero fazer um pedido pelo Portal do Parceiro Mr. Lion.\n\n';
  msg += 'ITENS DO PEDIDO:\n';

  cart.forEach(item => {
    const preco    = PRICES[item.prod][item.versao][nivelIdx];
    const garrafas = item.caixas * 6;
    const sub      = preco * garrafas;
    msg += `- ${PROD_NAMES[item.prod]} · ${VERSAO_NAMES[item.versao]} · ${item.caixas} caixas (${garrafas} garrafas) · ${fmtBRL(preco)}/un · Subtotal: ${fmtBRL(sub)}\n`;
  });

  msg += '\nRESUMO:\n';
  msg += `- Total: ${totalCaixas} caixas / ${totalCaixas * 6} garrafas\n`;
  msg += `- Nível de preço: ${nivelLabel}\n`;
  msg += `- TOTAL: ${fmtBRL(total)}\n`;
  msg += `- Pagamento: Pix ou Boleto\n`;

  msg += '\nAguardo informações sobre frete e confirmação do pedido. Obrigado!';

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initChapterNav();
  initNavHighlight();
  initMobileNav();
  initReveal();
  initHeroTabs();
  initFAQ();
});

// Expose globals needed by inline handlers
window.switchProd   = switchProd;
window.changeImg    = changeImg;
window.selectVersao = selectVersao;
window.switchLvl    = switchLvl;
window.addToCart    = addToCart;
window.removeFromCart = removeFromCart;
window.renderSummary = renderSummary;
