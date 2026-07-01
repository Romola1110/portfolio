/* 风拂晾晒 · 智能错落网格 + 如风来仪 + 微风拂过 + 画卷灯箱 */

const PB_MAX_TILT = 10;
const PB_ACTIVE = new Set();

function pbRand(min, max) {
  return min + Math.random() * (max - min);
}

function pbLayoutVars() {
  return {
    w: pbRand(180, 280).toFixed(0),
    rot: pbRand(-6, 6).toFixed(2),
    y: pbRand(-20, 20).toFixed(0),
    delay: pbRand(0, 0.5).toFixed(2)
  };
}

function pbCardHtml(item, seasonKey, layout) {
  const orient = item.orient === 'portrait' ? 'portrait' : 'landscape';
  return `
    <article class="pb-card is-${orient}"
      data-id="${item.id}" data-season="${seasonKey}"
      data-title="${item.title}" data-caption="${item.caption}"
      data-diary="${item.diary || item.caption}" data-exif="${item.exif || ''}"
      data-src="${item.src}" data-fallback="${item.fallback}"
      style="--pb-w:${layout.w}px;--pb-rot:${layout.rot}deg;--pb-y:${layout.y}px;--pb-delay:${layout.delay}s">
      <div class="pb-tilt">
        <div class="pb-polaroid">
          <div class="pb-img"><img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async"></div>
          <p class="pb-label">${item.title}</p>
        </div>
      </div>
    </article>`;
}

function pbBindImages(root, items) {
  root.querySelectorAll('.pb-img img').forEach((img, i) => {
    const fb = items[i % items.length]?.fallback;
    if (!fb) return;
    img.addEventListener('error', () => {
      if (img.dataset.fb) return;
      img.dataset.fb = '1';
      img.src = fb;
    }, { once: true });
  });
}

function pbSeasonNav(root, season, onPick) {
  const nav = root.querySelector('.pb-seasons');
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

function pbSetupReveal(root) {
  if (root._revealObs) root._revealObs.disconnect();
  const cards = root.querySelectorAll('.pb-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-inview');
      obs.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
  root._revealObs = obs;
  cards.forEach(card => {
    const r = card.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92) card.classList.add('is-inview');
    else obs.observe(card);
  });
}

function pbHandleTilt(e) {
  const card = e.currentTarget;
  if (!card.classList.contains('is-hovering')) return;
  const tilt = card.querySelector('.pb-tilt');
  if (!tilt) return;
  const rect = card.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  card.style.setProperty('--pb-rx', `${(-py * PB_MAX_TILT * 2).toFixed(2)}deg`);
  card.style.setProperty('--pb-ry', `${(px * PB_MAX_TILT * 2).toFixed(2)}deg`);
}

function pbEnableHover(card) {
  if (card._pbBound) return;
  card._pbBound = true;
  card._onIn = () => card.classList.add('is-hovering');
  card._onOut = () => {
    card.classList.remove('is-hovering');
    card.style.setProperty('--pb-rx', '0deg');
    card.style.setProperty('--pb-ry', '0deg');
  };
  card._onMove = pbHandleTilt;
  card.addEventListener('mouseenter', card._onIn);
  card.addEventListener('mouseleave', card._onOut);
  card.addEventListener('mousemove', card._onMove);
}

function pbSetupHover(root) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const card = entry.target;
      if (entry.isIntersecting) {
        if (PB_ACTIVE.size >= 8 && !PB_ACTIVE.has(card)) return;
        PB_ACTIVE.add(card);
        pbEnableHover(card);
      } else {
        PB_ACTIVE.delete(card);
      }
    });
  }, { threshold: 0.15 });
  root.querySelectorAll('.pb-card').forEach(c => obs.observe(c));
}

function pbEnsureLightbox() {
  let lb = document.getElementById('pbLightbox');
  if (lb) return lb;
  lb = document.createElement('div');
  lb.id = 'pbLightbox';
  lb.className = 'pb-lightbox';
  lb.innerHTML = `
    <button type="button" class="pb-lb-close" aria-label="关闭">×</button>
    <button type="button" class="pb-lb-nav pb-lb-prev" aria-label="上一张">‹</button>
    <button type="button" class="pb-lb-nav pb-lb-next" aria-label="下一张">›</button>
    <div class="pb-lb-stage">
      <div class="pb-lb-img-wrap"><img src="" alt=""></div>
      <div class="pb-lb-meta">
        <p class="pb-lb-title"></p>
        <p class="pb-lb-exif"></p>
        <p class="pb-lb-diary"></p>
      </div>
    </div>`;
  document.body.appendChild(lb);
  lb.querySelector('.pb-lb-close').onclick = () => pbCloseLightbox();
  lb.querySelector('.pb-lb-prev').onclick = () => pbStepLightbox(-1);
  lb.querySelector('.pb-lb-next').onclick = () => pbStepLightbox(1);
  lb.addEventListener('click', e => { if (e.target === lb) pbCloseLightbox(); });
  document.addEventListener('keydown', pbKeyLightbox);
  return lb;
}

const pbState = { items: [], index: 0, busy: false };

function pbFillLightbox(i) {
  const item = pbState.items[i];
  const card = document.querySelector(`.pb-card[data-season="${item.season}"][data-id="${item.id}"]`);
  const lb = pbEnsureLightbox();
  const img = lb.querySelector('.pb-lb-img-wrap img');
  const src = card?.querySelector('img')?.dataset.fb === '1' ? item.fallback : item.src;
  img.src = src;
  img.alt = item.title;
  lb.querySelector('.pb-lb-title').textContent = item.title;
  lb.querySelector('.pb-lb-exif').textContent = item.exif || '';
  lb.querySelector('.pb-lb-diary').textContent = item.diary || item.caption || '';
  pbState.index = i;
}

function pbOpenLightbox(card, items) {
  pbState.items = items;
  const i = items.findIndex(it => String(it.id) === card.dataset.id);
  const lb = pbEnsureLightbox();
  pbFillLightbox(i >= 0 ? i : 0);
  lb.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  const stage = lb.querySelector('.pb-lb-stage');
  stage.classList.remove('is-ready');
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('is-ready')));
}

function pbCloseLightbox() {
  const lb = document.getElementById('pbLightbox');
  if (!lb) return;
  lb.classList.remove('is-open');
  document.body.style.overflow = '';
  lb.querySelector('.pb-lb-stage')?.classList.remove('is-ready');
}

function pbStepLightbox(dir) {
  if (pbState.busy || !pbState.items.length) return;
  const n = pbState.items.length;
  const next = (pbState.index + dir + n) % n;
  if (next === pbState.index) return;
  const lb = pbEnsureLightbox();
  const wrap = lb.querySelector('.pb-lb-img-wrap');
  const outCls = dir > 0 ? 'is-wipe-out-left' : 'is-wipe-out-right';
  const inCls = dir > 0 ? 'is-wipe-in-right' : 'is-wipe-in-left';
  pbState.busy = true;
  wrap.classList.remove('is-wipe-out-left', 'is-wipe-out-right', 'is-wipe-in-left', 'is-wipe-in-right');
  void wrap.offsetWidth;
  wrap.classList.add(outCls);
  setTimeout(() => {
    pbFillLightbox(next);
    wrap.classList.remove(outCls);
    wrap.classList.add(inCls);
    setTimeout(() => {
      wrap.classList.remove(inCls);
      pbState.busy = false;
    }, 320);
  }, 280);
}

function pbKeyLightbox(e) {
  const lb = document.getElementById('pbLightbox');
  if (!lb?.classList.contains('is-open')) return;
  if (e.key === 'Escape') pbCloseLightbox();
  if (e.key === 'ArrowLeft') pbStepLightbox(-1);
  if (e.key === 'ArrowRight') pbStepLightbox(1);
}

function initPhotoBreeze(rootId = 'pbRoot') {
  const root = document.getElementById(rootId);
  if (!root || typeof PHOTO_GALLERY_DATA === 'undefined') return;
  const gallery = root.querySelector('.pb-gallery');
  let season = 'spring';

  function render(s) {
    season = s;
    PB_ACTIVE.clear();
    const items = (PHOTO_GALLERY_DATA[season] || []).map(it => ({ ...it, season }));
    gallery.innerHTML = items.map(it => pbCardHtml(it, season, pbLayoutVars())).join('');
    pbBindImages(root, items);
    pbSetupReveal(root);
    pbSetupHover(root);
    gallery.onclick = e => {
      const card = e.target.closest('.pb-card');
      if (card) pbOpenLightbox(card, items);
    };
  }

  pbSeasonNav(root, season, render);
  render(season);
}

if (typeof window !== 'undefined') {
  window.initPhotoBreeze = initPhotoBreeze;
}
