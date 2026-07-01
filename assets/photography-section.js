/* 四时摄影画廊 · 交互逻辑 */

const PHOTO_ENTER_MODES = ['enter-left', 'enter-right', 'enter-top', 'enter-bottom'];
const PHOTO_ACTIVE_TILT = new Set();
const PHOTO_MAX_TILT = 8;

function initPhotographyGallery(root, options = {}) {
  if (!root || typeof PHOTO_GALLERY_DATA === 'undefined') return;

  const mode = options.mode || 'parallax';
  const seasonNav = root.querySelector('.photo-season-nav');
  const masonry = root.querySelector('.photo-masonry');
  const lightbox = document.getElementById('photoLightbox');
  let currentSeason = options.season || 'spring';
  let revealObserver = null;
  let tiltObserver = null;

  root.classList.toggle('mode-darkroom', mode === 'darkroom');
  root.classList.toggle('mode-scroll', mode === 'scroll');

  function bindImageFallback(img, fallback) {
    if (!img || !fallback) return;
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === '1') return;
      img.dataset.fallbackApplied = '1';
      img.src = fallback;
    }, { once: true });
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
    const enterClass = getEnterClass(index);
    const delay = (Math.random() * 0.4).toFixed(2);
    const rot = getEnterRotate(index);
    const aspectPct = Math.round(item.aspect * 100);
    const indexLabel = `${PHOTO_SEASONS[seasonKey]?.label || ''} · ${String(item.id).padStart(2, '0')}`;

    return `
      <article class="photo-polaroid ${enterClass}"
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

  function renderSeason(seasonKey) {
    if (!masonry) return;
    currentSeason = seasonKey;
    const items = PHOTO_GALLERY_DATA[seasonKey] || [];
    masonry.innerHTML = items.map((item, i) => renderPolaroid(item, i, seasonKey)).join('');
    masonry.querySelectorAll('img').forEach((img, i) => {
      bindImageFallback(img, items[i]?.fallback);
    });
    seasonNav?.querySelectorAll('.season-pill').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.season === seasonKey);
      const meta = PHOTO_SEASONS[seasonKey];
      if (btn.dataset.season === seasonKey && meta) {
        btn.style.setProperty('--season-hue', meta.hue);
      }
    });
  }

  function setupRevealObserver() {
    revealObserver?.disconnect();
    const cards = masonry?.querySelectorAll('.photo-polaroid') || [];
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    cards.forEach(card => revealObserver.observe(card));
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
    if (mode === 'darkroom') {
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

    masonry?.addEventListener('click', e => {
      const card = e.target.closest('.photo-polaroid');
      if (card) openLightbox(card);
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
