/* 四时摄影画廊 · 交互逻辑 */

const PHOTO_ENTER_MODES = ['enter-left', 'enter-right', 'enter-top', 'enter-bottom'];
const PHOTO_ACTIVE_TILT = new Set();
const PHOTO_MAX_TILT = 8;

function initPhotographyGallery(root, options = {}) {
  if (!root || typeof PHOTO_GALLERY_DATA === 'undefined') return;

  const mode = options.mode || 'flow';
  const seasonNav = root.querySelector('.photo-season-nav');
  let masonry = root.querySelector('.photo-masonry');
  const lightbox = document.getElementById('photoLightbox');
  let flowClone = null;
  let flowStage = null;
  let flowTrack = null;
  let currentSeason = options.season || 'spring';
  let revealObserver = null;
  let tiltObserver = null;

  root.classList.toggle('mode-darkroom', mode === 'darkroom');
  root.classList.toggle('mode-scroll', mode === 'scroll');
  root.classList.toggle('mode-flow', mode === 'flow');

  function bindImageFallback(img, fallback) {
    if (!img || !fallback) return;
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === '1') return;
      img.dataset.fallbackApplied = '1';
      img.src = fallback;
    }, { once: true });
  }

  function bindAllImages(items) {
    root.querySelectorAll('.photo-masonry img').forEach((img, i) => {
      const idx = i % items.length;
      bindImageFallback(img, items[idx]?.fallback);
      if (!img.complete) {
        img.addEventListener('load', () => setupFlowDuration(), { once: true });
      }
    });
  }

  function getEnterClass(index) {
    if (index === 0) return 'enter-left';
    if (index === 1) return 'enter-right';
    return PHOTO_ENTER_MODES[2 + (index % 2)];
  }

  function getEnterRotate(index) {
    if (index === 0) return '-3deg';
    if (index === 1) return '4deg';
    return `${(Math.random() * 6 - 3).toFixed(1)}deg`;
  }

  function renderPolaroid(item, index, seasonKey) {
    const indexLabel = `${PHOTO_SEASONS[seasonKey]?.label || ''} · ${String(item.id).padStart(2, '0')}`;
    const rot = mode === 'flow'
      ? `${((index % 5) - 2) * 1.2}deg`
      : getEnterRotate(index);
    const flowClass = mode === 'flow' ? ' is-visible flow-card' : '';
    const enterClass = mode === 'flow' ? '' : ` ${getEnterClass(index)}`;
    const delay = mode === 'flow' ? '0s' : `${(Math.random() * 0.4).toFixed(2)}s`;

    return `
      <article class="photo-polaroid${flowClass}${enterClass}"
        data-id="${item.id}"
        data-season="${seasonKey}"
        data-title="${item.title}"
        data-caption="${item.caption}"
        data-index-label="${indexLabel}"
        data-src="${item.src}"
        data-fallback="${item.fallback}"
        style="--enter-rot:${rot}; transition-delay:${delay}s">
        <div class="polaroid-tilt">
          <div class="polaroid-frame">
            <div class="polaroid-img-wrap" style="aspect-ratio:1/${item.aspect}">
              <img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async">
            </div>
            <p class="polaroid-label">${item.title}</p>
          </div>
        </div>
      </article>`;
  }

  function setupFlowShell() {
    if (mode !== 'flow' || !masonry || flowStage) return;
    flowStage = document.createElement('div');
    flowStage.className = 'photo-flow-stage';
    const viewport = document.createElement('div');
    viewport.className = 'photo-flow-viewport';
    flowTrack = document.createElement('div');
    flowTrack.className = 'photo-flow-track';
    flowClone = document.createElement('div');
    flowClone.className = 'photo-masonry photo-masonry-clone';
    flowClone.setAttribute('aria-hidden', 'true');

    masonry.parentNode.insertBefore(flowStage, masonry);
    flowStage.appendChild(viewport);
    viewport.appendChild(flowTrack);
    flowTrack.appendChild(masonry);
    flowTrack.appendChild(flowClone);

    const hint = document.createElement('p');
    hint.className = 'photo-flow-hint';
    hint.textContent = '悬停可暂停 · 点击展卷';
    flowStage.appendChild(hint);
  }

  function setupFlowDuration() {
    if (mode !== 'flow' || !flowTrack || !masonry) return;
    const h = masonry.offsetHeight;
    if (!h) return;
    const pxPerSec = options.flowSpeed || 26;
    const duration = Math.max(48, Math.min(140, h / pxPerSec));
    flowTrack.style.setProperty('--flow-duration', `${duration}s`);
  }

  function setFlowPaused(paused) {
    flowStage?.classList.toggle('is-paused', !!paused);
  }

  function renderSeason(seasonKey) {
    if (!masonry) return;
    currentSeason = seasonKey;
    const items = PHOTO_GALLERY_DATA[seasonKey] || [];
    const html = items.map((item, i) => renderPolaroid(item, i, seasonKey)).join('');
    masonry.innerHTML = html;
    if (flowClone) flowClone.innerHTML = html;
    bindAllImages(items);
    seasonNav?.querySelectorAll('.season-pill').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.season === seasonKey);
      const meta = PHOTO_SEASONS[seasonKey];
      if (btn.dataset.season === seasonKey && meta) {
        btn.style.setProperty('--season-hue', meta.hue);
      }
    });
    requestAnimationFrame(() => {
      setupFlowDuration();
      requestAnimationFrame(setupFlowDuration);
    });
  }

  function setupRevealObserver() {
    if (mode === 'flow') return;
    revealObserver?.disconnect();
    const cards = masonry?.querySelectorAll('.photo-polaroid') || [];
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { root: null, rootMargin: '0px 0px -5% 0px', threshold: 0.08 });
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        card.classList.add('is-visible');
        return;
      }
      revealObserver.observe(card);
    });
  }

  function handleTiltMove(e) {
    const card = e.currentTarget;
    if (!card.classList.contains('is-hovering')) return;
    const tilt = card.querySelector('.polaroid-tilt');
    if (!tilt) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotY = (px * PHOTO_MAX_TILT * 2).toFixed(2);
    const rotX = (-py * PHOTO_MAX_TILT * 2).toFixed(2);
    tilt.style.transform = `translateY(-15px) scale(1.05) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  function resetTilt(card) {
    const tilt = card.querySelector('.polaroid-tilt');
    if (!tilt) return;
    tilt.style.transform = '';
    card.classList.remove('is-hovering', 'is-developing');
  }

  function enableTilt(card) {
    if (card._tiltBound) return;
    card._tiltBound = true;
    card._onEnter = () => card.classList.add('is-hovering');
    card._onLeave = () => resetTilt(card);
    card._onMove = handleTiltMove;
    card.addEventListener('mouseenter', card._onEnter);
    card.addEventListener('mouseleave', card._onLeave);
    card.addEventListener('mousemove', card._onMove);
  }

  function disableTilt(card) {
    if (!card._tiltBound) return;
    card.removeEventListener('mouseenter', card._onEnter);
    card.removeEventListener('mouseleave', card._onLeave);
    card.removeEventListener('mousemove', card._onMove);
    card._tiltBound = false;
    resetTilt(card);
  }

  function setupTiltObserver() {
    if (mode === 'flow' || mode === 'darkroom') {
      if (mode !== 'darkroom') return;
      tiltObserver?.disconnect();
      const cards = masonry?.querySelectorAll('.photo-polaroid') || [];
      tiltObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          entry.target.classList.toggle('is-developing', entry.isIntersecting);
        });
      }, { threshold: 0.35 });
      cards.forEach(card => tiltObserver.observe(card));
      return;
    }

    if (mode !== 'parallax') return;

    tiltObserver?.disconnect();
    const cards = masonry?.querySelectorAll('.photo-polaroid') || [];
    tiltObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const card = entry.target;
        if (entry.isIntersecting) {
          if (PHOTO_ACTIVE_TILT.size >= 6 && !PHOTO_ACTIVE_TILT.has(card)) return;
          PHOTO_ACTIVE_TILT.add(card);
          enableTilt(card);
        } else {
          PHOTO_ACTIVE_TILT.delete(card);
          disableTilt(card);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach(card => tiltObserver.observe(card));
  }

  function setupScrollCenter() {
    if (mode !== 'scroll') return;
    const track = root.querySelector('.photo-scroll-track');
    if (!track) return;

    const updateCenter = () => {
      const cards = [...track.querySelectorAll('.photo-polaroid')];
      const mid = track.scrollLeft + track.clientWidth / 2;
      let closest = null;
      let minDist = Infinity;
      cards.forEach(card => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        card.classList.toggle('is-center', false);
        if (dist < minDist) {
          minDist = dist;
          closest = card;
        }
      });
      closest?.classList.add('is-center');
    };

    track.addEventListener('scroll', () => requestAnimationFrame(updateCenter), { passive: true });
    updateCenter();
  }

  function openLightbox(card) {
    if (!lightbox) return;
    setFlowPaused(true);
    const img = lightbox.querySelector('.photo-lightbox-img');
    const indexEl = lightbox.querySelector('.lb-index');
    const titleEl = lightbox.querySelector('.lb-title');
    const captionEl = lightbox.querySelector('.lb-caption');
    const src = card.dataset.fallback && card.querySelector('img')?.dataset.fallbackApplied === '1'
      ? card.dataset.fallback
      : card.dataset.src;

    if (img) {
      img.src = src;
      img.alt = card.dataset.title || '';
    }
    if (indexEl) indexEl.textContent = card.dataset.indexLabel || '';
    if (titleEl) titleEl.textContent = card.dataset.title || '';
    if (captionEl) captionEl.textContent = card.dataset.caption || '';

    lightbox.classList.remove('is-closing');
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox?.classList.contains('is-open')) return;
    lightbox.classList.add('is-closing');
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setFlowPaused(false);
    setTimeout(() => lightbox.classList.remove('is-closing'), 400);
  }

  function bindEvents() {
    seasonNav?.addEventListener('click', e => {
      const btn = e.target.closest('.season-pill');
      if (!btn || btn.dataset.season === currentSeason) return;
      const meta = PHOTO_SEASONS[btn.dataset.season];
      if (meta) btn.style.setProperty('--season-hue', meta.hue);
      renderSeason(btn.dataset.season);
      setupRevealObserver();
      setupTiltObserver();
      setupScrollCenter();
    });

    const clickHost = flowStage || masonry;
    clickHost?.addEventListener('click', e => {
      const card = e.target.closest('.photo-polaroid');
      if (card) openLightbox(card);
    });

    flowStage?.addEventListener('mouseenter', () => setFlowPaused(true));
    flowStage?.addEventListener('mouseleave', () => {
      if (!lightbox?.classList.contains('is-open')) setFlowPaused(false);
    });

    lightbox?.addEventListener('click', e => {
      if (e.target === lightbox || e.target.closest('.photo-lightbox-close')) closeLightbox();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  function initSeasonNav() {
    if (!seasonNav) return;
    seasonNav.innerHTML = Object.values(PHOTO_SEASONS).map(s => `
      <button type="button" class="season-pill${s.key === currentSeason ? ' is-active' : ''}"
        data-season="${s.key}" style="--season-hue:${s.hue}">
        <span>${s.label}</span>
      </button>`).join('');
  }

  if (mode === 'scroll' && masonry) {
    const stage = document.createElement('div');
    stage.className = 'photo-scroll-stage';
    const track = document.createElement('div');
    track.className = 'photo-scroll-track';
    masonry.parentNode.insertBefore(stage, masonry);
    stage.appendChild(track);
    track.appendChild(masonry);
    masonry.style.columnCount = 'unset';
  }

  setupFlowShell();
  initSeasonNav();
  renderSeason(currentSeason);
  bindEvents();
  setupRevealObserver();
  setupTiltObserver();
  setupScrollCenter();
}

function initPhotographySection(sectionId = 'photography', options) {
  const root = document.getElementById(sectionId);
  if (!root) return;
  initPhotographyGallery(root, options);
}

if (typeof window !== 'undefined') {
  window.initPhotographyGallery = initPhotographyGallery;
  window.initPhotographySection = initPhotographySection;
}
