/* 风拂晾晒 · Masonry + 如风来仪 + 微风拂过 + 画卷灯箱 */

const PB_MAX_TILT = 10;
const PB_ACTIVE = new Set();
const PB_MOTIF_GAP = 6;

const PB_SHISI_FILE = '9c5bda91ad9ed1462a3c75ee06750004.jpg';
const PB_GRAD_FILE = 'ec3bd8c6af35c67431c8037f25493708.jpg';

function pbOrderItems(items) {
  const grad = items.find(i => i.file === PB_GRAD_FILE);
  if (!grad) return items;
  const rest = items.filter(i => i.file !== PB_GRAD_FILE);
  const shisiIdx = rest.findIndex(i => i.file === PB_SHISI_FILE);
  if (shisiIdx >= 0) {
    rest.splice(shisiIdx + 1, 0, grad);
    return rest;
  }
  return [...rest, grad];
}

function pbShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pbLayoutVars(index) {
  const wave = Math.sin(index * 0.7) * 2;
  return {
    rot: wave.toFixed(2),
    y: (Math.cos(index * 0.5) * 3).toFixed(0),
    delay: (Math.min(index * 0.03, 0.45)).toFixed(2)
  };
}

const PB_MOTIF_SVG = {
  spring: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="26" r="3" fill="currentColor" opacity=".7"/><ellipse cx="24" cy="14" rx="5" ry="7" fill="currentColor" opacity=".45" transform="rotate(0 24 24)"/><ellipse cx="24" cy="14" rx="5" ry="7" fill="currentColor" opacity=".45" transform="rotate(72 24 24)"/><ellipse cx="24" cy="14" rx="5" ry="7" fill="currentColor" opacity=".45" transform="rotate(144 24 24)"/><ellipse cx="24" cy="14" rx="5" ry="7" fill="currentColor" opacity=".45" transform="rotate(216 24 24)"/><ellipse cx="24" cy="14" rx="5" ry="7" fill="currentColor" opacity=".45" transform="rotate(288 24 24)"/></svg>',
  summer: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 32c8-2 12-8 16-16 4 8 8 14 16 16" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".55"/><circle cx="36" cy="14" r="5" fill="currentColor" opacity=".25"/><path d="M10 38h28" stroke="currentColor" stroke-width=".8" opacity=".35"/></svg>',
  autumn: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 8c-2 8-10 14-10 22 0 4 3 7 7 7 3 0 5-2 6-4 1 2 3 4 6 4 4 0 7-3 7-7 0-8-8-14-10-22 0 4-3 6-6 6s-6-2-6-6z" fill="currentColor" opacity=".5"/></svg>',
  winter: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6v36M6 24h36M11 11l26 26M37 11L11 37" stroke="currentColor" stroke-width="1" opacity=".4"/><circle cx="24" cy="24" r="4" fill="currentColor" opacity=".2"/></svg>',
  all: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" stroke-width=".8" opacity=".35"/><path d="M12 28c4-6 10-10 18-10" stroke="currentColor" stroke-width=".9" opacity=".4" fill="none"/></svg>'
};

function pbMotifHtml(seasonKey, variant) {
  const sk = PB_MOTIF_SVG[seasonKey] ? seasonKey : 'all';
  return `<div class="pb-motif pb-motif--${sk} pb-motif--v${variant % 3}" aria-hidden="true">${PB_MOTIF_SVG[sk]}</div>`;
}

function pbCardHtml(item, layout) {
  const orient = item.orient === 'portrait' ? 'portrait' : 'landscape';
  return `
    <article class="pb-card is-${orient}"
      data-id="${item.id}" data-season="${item.season}" data-file="${item.file}"
      data-title="${item.title}" data-caption="${item.caption || ''}"
      data-diary="${item.diary || item.caption || ''}" data-exif="${item.exif || ''}"
      data-src="${item.src}" data-fallback="${item.fallback}"
      style="--pb-rot:${layout.rot}deg;--pb-y:${layout.y}px;--pb-delay:${layout.delay}s">
      <div class="pb-tilt">
        <div class="pb-polaroid">
          <div class="pb-img"><img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async"></div>
          <p class="pb-label">${item.title}</p>
        </div>
      </div>
    </article>`;
}

function pbRenderGallery(items, displaySeason) {
  let html = '';
  let motifCount = 0;
  items.forEach((item, i) => {
    if (i > 0 && i % PB_MOTIF_GAP === 0) {
      const mKey = displaySeason === 'all' ? item.season : displaySeason;
      html += pbMotifHtml(mKey, motifCount++);
    }
    html += pbCardHtml(item, pbLayoutVars(i));
  });
  return html;
}

function pbBindImages(root) {
  root.querySelectorAll('.pb-card').forEach(card => {
    const img = card.querySelector('img');
    const fb = card.dataset.fallback;
    if (!img || !fb) return;
    img.addEventListener('error', () => {
      if (img.dataset.gaveUp === '1') return;
      if (img.dataset.cdnRetry !== '1' && typeof window.sitePhotoCdnUrl === 'function') {
        img.dataset.cdnRetry = '1';
        img.src = window.sitePhotoCdnUrl(card.dataset.season, card.dataset.file);
        return;
      }
      if (img.getAttribute('src') !== fb) {
        img.src = fb;
        return;
      }
      img.dataset.gaveUp = '1';
    });
  });
}

function pbSeasonNav(root, season, onPick) {
  const nav = root.querySelector('.pb-seasons');
  if (!nav) return;
  const order = window.PHOTO_SEASON_ORDER || Object.keys(PHOTO_SEASONS);
  nav.innerHTML = order.map(key => {
    const s = PHOTO_SEASONS[key];
    const sub = key === 'all' ? '' : (s.en || '');
    return `<button type="button" data-season="${s.key}" class="${s.key === season ? 'is-active' : ''}" style="--season-hue:${s.hue}"><span class="pb-season-text">${s.label}</span>${sub ? `<span class="pb-season-en">${sub}</span>` : ''}<span class="pb-season-glow" aria-hidden="true"></span></button>`;
  }).join('');
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
  }, { rootMargin: '0px 0px -4% 0px', threshold: 0.06 });
  root._revealObs = obs;
  cards.forEach(card => {
    const r = card.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.94) card.classList.add('is-inview');
    else obs.observe(card);
  });
}

function pbHandleTilt(e) {
  const card = e.currentTarget;
  if (!card.classList.contains('is-hovering')) return;
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
  if (root._hoverObs) root._hoverObs.disconnect();
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const card = entry.target;
      if (entry.isIntersecting) {
        if (PB_ACTIVE.size >= 10 && !PB_ACTIVE.has(card)) return;
        PB_ACTIVE.add(card);
        pbEnableHover(card);
      } else PB_ACTIVE.delete(card);
    });
  }, { threshold: 0.12 });
  root._hoverObs = obs;
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
  if (!window._pbKeyBound) {
    document.addEventListener('keydown', pbKeyLightbox);
    window._pbKeyBound = true;
  }
  return lb;
}

const pbState = { items: [], index: 0, busy: false };

function pbFindCard(item) {
  return document.querySelector(`.pb-card[data-season="${item.season}"][data-file="${item.file}"]`);
}

function pbFillLightbox(i) {
  const item = pbState.items[i];
  const card = pbFindCard(item);
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
  const i = items.findIndex(it => it.season === card.dataset.season && it.file === card.dataset.file);
  pbFillLightbox(i >= 0 ? i : 0);
  const lb = pbEnsureLightbox();
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
  let season = 'all';

  function render(s) {
    season = s;
    PB_ACTIVE.clear();
    const items = pbOrderItems(s === 'all'
      ? pbShuffle(PHOTO_GALLERY_DATA.all || [])
      : (PHOTO_GALLERY_DATA[s] || []));
    gallery.innerHTML = pbRenderGallery(items, s);
    pbBindImages(root);
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

if (typeof window !== 'undefined') window.initPhotoBreeze = initPhotoBreeze;
