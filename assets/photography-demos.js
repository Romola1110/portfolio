/* 摄影 Demo 交互 · drift / tide / magnetic / ripple */

const PD_SIZES = ['sz-s', 'sz-m', 'sz-m', 'sz-s', 'sz-l', 'sz-s', 'sz-m', 'sz-l'];

function pdCardHtml(item, index, seasonKey) {
  const orient = item.orient === 'portrait' ? 'portrait' : 'landscape';
  const size = PD_SIZES[index % PD_SIZES.length];
  const rot = ((index * 7) % 11 - 5) * 0.35;
  const indexLabel = `${PHOTO_SEASONS[seasonKey]?.label || ''} · ${String(item.id).padStart(2, '0')}`;
  return `
    <article class="pd-card is-${orient} ${size}"
      data-id="${item.id}" data-season="${seasonKey}"
      data-title="${item.title}" data-caption="${item.caption}"
      data-index-label="${indexLabel}"
      data-src="${item.src}" data-fallback="${item.fallback}"
      style="--rot:${rot.toFixed(2)}deg">
      <div class="pd-film">
        <div class="pd-perf" aria-hidden="true"></div>
        <div class="pd-body">
          <div class="pd-img"><img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async"></div>
          <span class="pd-tag">${item.title}</span>
        </div>
        <div class="pd-perf" aria-hidden="true"></div>
      </div>
    </article>`;
}

function pdBindImages(root, items) {
  root.querySelectorAll('.pd-img img').forEach((img, i) => {
    const fb = items[i % items.length]?.fallback;
    if (!fb) return;
    img.addEventListener('error', () => {
      if (img.dataset.fb) return;
      img.dataset.fb = '1';
      img.src = fb;
    }, { once: true });
  });
}

function pdSeasonNav(root, season, onPick) {
  const nav = root.querySelector('.pd-seasons');
  if (!nav) return;
  nav.innerHTML = Object.values(PHOTO_SEASONS).map(s => `
    <button type="button" data-season="${s.key}" class="${s.key === season ? 'is-active' : ''}">${s.label}</button>
  `).join('');
  nav.onclick = e => {
    const btn = e.target.closest('button[data-season]');
    if (!btn) return;
    nav.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === btn));
    onPick(btn.dataset.season);
  };
}

function pdLightbox() {
  let el = document.getElementById('pdLightbox');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'pdLightbox';
  el.className = 'pd-lightbox';
  el.innerHTML = `
    <button type="button" class="pd-lightbox-close" aria-label="关闭">×</button>
    <div>
      <img src="" alt="">
      <div class="pd-lightbox-meta">
        <p class="lb-title"></p>
        <p class="lb-caption"></p>
      </div>
    </div>`;
  document.body.appendChild(el);
  el.addEventListener('click', e => {
    if (e.target === el || e.target.closest('.pd-lightbox-close')) pdCloseLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') pdCloseLightbox();
  });
  return el;
}

function pdOpenLightbox(card, onPause) {
  const lb = pdLightbox();
  const img = lb.querySelector('img');
  const src = card.querySelector('img')?.dataset.fb === '1' ? card.dataset.fallback : card.dataset.src;
  img.src = src;
  img.alt = card.dataset.title || '';
  lb.querySelector('.lb-title').textContent = card.dataset.title || '';
  lb.querySelector('.lb-caption').textContent = card.dataset.caption || '';
  lb.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  onPause?.(true);
}

function pdCloseLightbox() {
  const lb = document.getElementById('pdLightbox');
  if (!lb) return;
  lb.classList.remove('is-open');
  document.body.style.overflow = '';
  document.querySelectorAll('.pd-root').forEach(r => { r.classList.remove('pd-paused'); });
}

function pdWireClicks(root, onPause) {
  root.addEventListener('click', e => {
    const card = e.target.closest('.pd-card');
    if (card) {
      onPause?.(true);
      pdOpenLightbox(card, () => root.classList.add('pd-paused'));
    }
  });
}

function pdDupMosaic(html) {
  return `<div class="pd-track"><div class="pd-mosaic">${html}</div><div class="pd-mosaic pd-clone" aria-hidden="true">${html}</div></div>`;
}

/* —— A 墨流上浮 —— */
function initPhotoDemoDrift(root) {
  root.classList.add('pd-mode-drift');
  const stage = root.querySelector('.pd-stage');
  let season = 'spring';

  function render() {
    const items = PHOTO_GALLERY_DATA[season] || [];
    const html = items.map((it, i) => pdCardHtml(it, i, season)).join('');
    stage.innerHTML = `<div class="pd-viewport">${pdDupMosaic(html)}</div><p class="pd-hint">移入缓停 · 鼠标牵引景深 · 点击展卷</p>`;
    pdBindImages(root, items);
    const mosaic = stage.querySelector('.pd-mosaic');
    const h = () => {
      const track = stage.querySelector('.pd-track');
      if (!mosaic || !track) return;
      track.style.setProperty('--pd-dur', `${Math.max(28, Math.min(55, mosaic.offsetHeight / 55))}s`);
    };
    requestAnimationFrame(() => requestAnimationFrame(h));
    mosaic?.querySelectorAll('img').forEach(img => {
      if (!img.complete) img.addEventListener('load', h, { once: true });
    });
  }

  const viewport = () => stage.querySelector('.pd-viewport');
  stage.addEventListener('mouseenter', () => root.classList.add('pd-paused'));
  stage.addEventListener('mouseleave', () => {
    if (!document.getElementById('pdLightbox')?.classList.contains('is-open')) {
      root.classList.remove('pd-paused');
    }
  });
  root.addEventListener('mousemove', e => {
    const vp = viewport();
    if (!vp) return;
    const r = vp.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    vp.style.setProperty('--pvy', `${nx * 4}deg`);
    vp.style.setProperty('--pvx', `${-ny * 3}deg`);
    vp.querySelectorAll('.pd-card').forEach((card, i) => {
      const depth = 1 + (i % 5) * 0.08;
      card.style.setProperty('--tx', `${nx * 14 * depth}px`);
      card.style.setProperty('--ty', `${ny * 10 * depth}px`);
    });
  });

  pdSeasonNav(root, season, s => { season = s; render(); });
  pdWireClicks(root, () => root.classList.add('pd-paused'));
  render();
}

/* —— B 双潮对涌 —— */
function initPhotoDemoTide(root) {
  root.classList.add('pd-mode-tide');
  const stage = root.querySelector('.pd-stage');
  let season = 'spring';
  const cols = 4;

  function render() {
    const items = PHOTO_GALLERY_DATA[season] || [];
    const buckets = Array.from({ length: cols }, () => []);
    items.forEach((it, i) => buckets[i % cols].push(pdCardHtml(it, i, season)));
    const colHtml = buckets.map((cards, ci) => {
      const chunk = cards.join('');
      return `<div class="pd-tide-col" style="--pd-dur:${36 + ci * 10}s">${chunk}${chunk}</div>`;
    }).join('');
    stage.innerHTML = `<div class="pd-viewport"><div class="pd-tide">${colHtml}</div></div><p class="pd-hint">四列潮涌 · 奇列上浮偶列下沉 · 悬停缓停</p>`;
    pdBindImages(root, items);
  }

  stage.addEventListener('mouseenter', () => root.classList.add('pd-paused'));
  stage.addEventListener('mouseleave', () => {
    if (!document.getElementById('pdLightbox')?.classList.contains('is-open')) root.classList.remove('pd-paused');
  });
  pdSeasonNav(root, season, s => { season = s; render(); });
  pdWireClicks(root, () => root.classList.add('pd-paused'));
  render();
}

/* —— C 磁力参差 —— */
function initPhotoDemoMagnetic(root) {
  root.classList.add('pd-mode-magnetic');
  const stage = root.querySelector('.pd-stage');
  let season = 'spring';
  let cards = [];
  let raf = 0;
  let mx = 0;
  let my = 0;

  function layout(items) {
    const field = stage.querySelector('.pd-magnetic-field');
    if (!field) return;
    const w = field.clientWidth;
    const h = field.clientHeight;
    cards = [...field.querySelectorAll('.pd-card')];
    const n = cards.length;
    const cols = Math.ceil(Math.sqrt(n * 1.4));
    cards.forEach((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cw = w / cols;
      const ch = h / Math.ceil(n / cols);
      const jitterX = ((i * 17) % 9 - 4) * 2;
      const jitterY = ((i * 13) % 7 - 3) * 3;
      const rot = ((i * 11) % 13 - 6) * 0.35;
      const cardW = Math.min(108, Math.max(76, cw * 0.82));
      card.style.left = `${col * cw + (cw - cardW) / 2 + jitterX}px`;
      card.style.top = `${row * ch + jitterY}px`;
      card.style.width = `${cardW}px`;
      card.dataset.bx = String(col * cw + cw / 2);
      card.dataset.by = String(row * ch + ch / 2);
      card.style.setProperty('--rot', `${rot}deg`);
      card._homeX = jitterX;
      card._homeY = jitterY;
    });
  }

  function tick() {
    cards.forEach(card => {
      const bx = parseFloat(card.dataset.bx) + (card._homeX || 0);
      const by = parseFloat(card.dataset.by) + (card._homeY || 0);
      const dx = mx - bx;
      const dy = my - by;
      const dist = Math.hypot(dx, dy);
      const pull = Math.max(0, 1 - dist / 220);
      const tx = (card._homeX || 0) + dx * pull * 0.22;
      const ty = (card._homeY || 0) + dy * pull * 0.22;
      const sc = 1 + pull * 0.08;
      card.style.setProperty('--tx', `${tx}px`);
      card.style.setProperty('--ty', `${ty}px`);
      card.style.setProperty('--sc', sc.toFixed(3));
      card.classList.toggle('is-near', pull > 0.35);
    });
    raf = requestAnimationFrame(tick);
  }

  function render() {
    const items = PHOTO_GALLERY_DATA[season] || [];
    const html = items.map((it, i) => pdCardHtml(it, i, season)).join('');
    stage.innerHTML = `<div class="pd-viewport"><div class="pd-magnetic-field">${html}</div></div><p class="pd-hint">光标牵引邻近胶片 · 近者浮起 · 点击展卷</p>`;
    pdBindImages(root, items);
    requestAnimationFrame(() => layout(items));
    window.addEventListener('resize', () => layout(items));
  }

  stage.addEventListener('mousemove', e => {
    const field = stage.querySelector('.pd-magnetic-field');
    if (!field) return;
    const r = field.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });

  pdSeasonNav(root, season, s => { season = s; render(); });
  pdWireClicks(root);
  render();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(tick);
}

/* —— D 涟漪显影 —— */
function initPhotoDemoRipple(root) {
  root.classList.add('pd-mode-ripple');
  const stage = root.querySelector('.pd-stage');
  let season = 'spring';

  function updateRipple() {
    const vp = stage.querySelector('.pd-viewport');
    if (!vp) return;
    const mid = vp.getBoundingClientRect().top + vp.clientHeight / 2;
    vp.querySelectorAll('.pd-card').forEach(card => {
      const cr = card.getBoundingClientRect();
      const cy = cr.top + cr.height / 2;
      const d = Math.abs(cy - mid);
      const t = Math.max(0, 1 - d / (vp.clientHeight * 0.42));
      card.style.setProperty('--rb', `${(1 - t) * 8}px`);
      card.style.setProperty('--rs', `${0.35 + t * 0.75}`);
      card.style.setProperty('--ro', `${0.45 + t * 0.55}`);
      card.style.setProperty('--sc', `${0.94 + t * 0.08}`);
    });
    requestAnimationFrame(updateRipple);
  }

  function render() {
    const items = PHOTO_GALLERY_DATA[season] || [];
    const html = items.map((it, i) => pdCardHtml(it, i, season)).join('');
    stage.innerHTML = `<div class="pd-viewport">${pdDupMosaic(html)}</div><p class="pd-hint">中央涟漪显影 · 两侧沉入墨雾 · 悬停缓停</p>`;
    pdBindImages(root, items);
    const mosaic = stage.querySelector('.pd-mosaic');
    const track = stage.querySelector('.pd-track');
    if (track && mosaic) {
      track.style.setProperty('--pd-dur', `${Math.max(32, Math.min(60, mosaic.offsetHeight / 48))}s`);
    }
  }

  stage.addEventListener('mouseenter', () => root.classList.add('pd-paused'));
  stage.addEventListener('mouseleave', () => {
    if (!document.getElementById('pdLightbox')?.classList.contains('is-open')) root.classList.remove('pd-paused');
  });
  pdSeasonNav(root, season, s => { season = s; render(); });
  pdWireClicks(root, () => root.classList.add('pd-paused'));
  render();
  updateRipple();
}

function initPhotoDemo(rootId, mode) {
  const root = document.getElementById(rootId);
  if (!root || typeof PHOTO_GALLERY_DATA === 'undefined') return;
  const map = {
    drift: initPhotoDemoDrift,
    tide: initPhotoDemoTide,
    magnetic: initPhotoDemoMagnetic,
    ripple: initPhotoDemoRipple
  };
  map[mode]?.(root);
}

if (typeof window !== 'undefined') {
  window.initPhotoDemo = initPhotoDemo;
}
