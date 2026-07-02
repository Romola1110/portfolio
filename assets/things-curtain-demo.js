/**
 * 垂帘 Demo — 简洁版：SVG 纸鹤/风铃 + 垂线签纸，不依赖自动抠图 PNG
 */
(function () {
  const THREAD_X = [8, 22, 36, 50, 64, 78, 92];
  const HANG_OFFSETS = [0, 14, 28, 8, 22, 36, 12, 26, 40, 10, 24, 38];

  const CRANE_SVG = `<svg class="demo-crane" viewBox="0 0 48 40" aria-hidden="true"><path fill="currentColor" d="M24 2 L8 18 L14 20 L6 32 L18 26 L24 38 L30 26 L42 32 L34 20 L40 18 Z" opacity="0.88"/></svg>`;
  const CHIME_SVG = `<svg class="demo-chime" viewBox="0 0 16 28" aria-hidden="true"><line x1="8" y1="0" x2="8" y2="10" stroke="currentColor" stroke-width="1"/><ellipse cx="8" cy="18" rx="5" ry="7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`;

  function renderThumb(item) {
    if (item.image) return `<img src="${item.image}" alt="${item.name}" loading="lazy">`;
    return `<div class="ph ${item.ph}">${item.glyph}</div>`;
  }

  function buildThreads(root, data, drawnIds) {
    const stage = root.querySelector('.curtain-threads');
    if (!stage) return;
    const buckets = THREAD_X.map(() => []);
    data.forEach((item, i) => buckets[i % THREAD_X.length].push(item));

    stage.innerHTML = buckets.map((items, ti) => {
      const tx = THREAD_X[ti];
      const tags = items.map((item, hi) => {
        const globalIdx = ti + hi * THREAD_X.length;
        const top = 72 + HANG_OFFSETS[globalIdx % HANG_OFFSETS.length] + hi * 96;
        const drawn = drawnIds.has(item.id);
        return `
          <button type="button" class="demo-tag${drawn ? ' is-drawn' : ''}" data-id="${item.id}"
            style="--top:${top}px" ${drawn ? 'disabled' : ''}>
            <span class="demo-tag-line"></span>
            <span class="demo-tag-card">
              <span class="demo-tag-glyph">${item.glyph}</span>
              <span class="demo-tag-name">${item.name}</span>
            </span>
          </button>`;
      }).join('');

      return `
        <div class="demo-thread" style="--tx:${tx}%">
          <span class="demo-thread-rope"></span>
          <div class="demo-thread-decor">${ti % 2 === 0 ? CRANE_SVG : CHIME_SVG}</div>
          <div class="demo-thread-tags">${tags}</div>
        </div>`;
    }).join('');
  }

  function openModal(root, item, onAgain) {
    const modal = root.querySelector('.thing-modal');
    if (!modal) return;
    modal.innerHTML = `
      <div class="thing-modal-box modal-bookmark-only">
        <div class="bookmark-sheet bookmark-sheet--modal">
          <p class="letter-sign-label">${item.signLabel}</p>
          <div class="modal-visual modal-visual-tall">${renderThumb(item)}</div>
          <p class="letter-item-name">${item.name}</p>
          <p class="letter-note">${item.note}</p>
          <p class="letter-verse">「${item.verse}」</p>
          <p class="modal-story">${item.story}</p>
          <div class="bookmark-modal-actions">
            <button type="button" class="bm-btn bm-fold">收起</button>
            <button type="button" class="bm-btn bm-again">再摇一支</button>
          </div>
        </div>
      </div>`;
    modal.classList.add('open');
    modal.querySelector('.bm-fold')?.addEventListener('click', () => modal.classList.remove('open'));
    modal.querySelector('.bm-again')?.addEventListener('click', () => {
      modal.classList.remove('open');
      onAgain?.();
    });
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('open'); };
  }

  function initCurtainDemo(rootId) {
    const root = document.getElementById(rootId);
    const data = window.THINGS_DATA || [];
    if (!root || !data.length) return;

    const bucket = root.querySelector('.lot-bucket');
    const drawBtn = root.querySelector('.draw-btn');
    const drawZone = root.querySelector('.draw-zone');
    const drawnIds = new Set();
    let drawing = false;
    let lastId = null;

    function refresh() { buildThreads(root, data, drawnIds); }

    function pick() {
      let pool = data.filter((t) => !drawnIds.has(t.id));
      if (!pool.length) { drawnIds.clear(); pool = [...data]; refresh(); }
      if (pool.length > 1 && lastId) pool = pool.filter((t) => t.id !== lastId);
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function reveal(item) {
      lastId = item.id;
      drawnIds.add(item.id);
      refresh();
      openModal(root, item, drawLot);
    }

    function drawLot() {
      if (drawing) return;
      drawing = true;
      drawZone?.classList.add('is-drawing');
      bucket?.classList.add('shaking');
      const item = pick();
      setTimeout(() => {
        bucket?.classList.remove('shaking');
        reveal(item);
        drawing = false;
        setTimeout(() => drawZone?.classList.remove('is-drawing'), 2400);
      }, 560);
    }

    drawBtn?.addEventListener('click', drawLot);
    bucket?.addEventListener('click', drawLot);
    root.querySelector('.curtain-threads')?.addEventListener('click', (e) => {
      const tag = e.target.closest('.demo-tag:not(.is-drawn)');
      if (!tag || drawing) return;
      const item = data.find((t) => t.id === tag.dataset.id);
      if (item) reveal(item);
    });

    refresh();
  }

  window.initCurtainDemo = initCurtainDemo;
})();
