/**
 * 匣中签 · 物有灵犀
 * v3: 主站 #things.things-v3（签筒）
 * v4: Demo #things-demo.things-v4（信封直抽）
 */
function getThingsData() {
  return (typeof window !== 'undefined' && Array.isArray(window.THINGS_DATA) && window.THINGS_DATA.length)
    ? window.THINGS_DATA
    : [];
}

const TREE_SLOTS = [
  { x: 76, y: 6, rot: -4, str: 36, delay: '0s' },
  { x: 62, y: 14, rot: 6, str: 42, delay: '0.4s' },
  { x: 48, y: 20, rot: -8, str: 38, delay: '0.8s' },
  { x: 34, y: 26, rot: 5, str: 44, delay: '1.1s' },
  { x: 20, y: 32, rot: -3, str: 40, delay: '0.2s' },
  { x: 68, y: 28, rot: 7, str: 46, delay: '1.4s' },
  { x: 54, y: 36, rot: -6, str: 38, delay: '0.6s' },
  { x: 40, y: 42, rot: 4, str: 42, delay: '1.8s' },
  { x: 26, y: 48, rot: -5, str: 36, delay: '0.9s' },
  { x: 80, y: 44, rot: 3, str: 40, delay: '1.2s' },
  { x: 64, y: 52, rot: -7, str: 44, delay: '0.3s' },
  { x: 50, y: 58, rot: 6, str: 38, delay: '1.6s' }
];

function initThingsSection(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;
  if (root.classList.contains('things-v6')) {
    initThingsV6(root);
    return;
  }
  if (root.classList.contains('things-v5')) {
    initThingsV5(root);
    return;
  }
  if (root.classList.contains('things-v4')) {
    initThingsV4(root);
    return;
  }
  initThingsV3(root);
}

/* ---------- v5 Demo ---------- */

const UI_ASSETS = {
  envelope: 'assets/things/ui/envelope.png',
  florals: [
    'assets/things/ui/floral-1.png',
    'assets/things/ui/floral-2.png',
    'assets/things/ui/floral-3.png',
    'assets/things/ui/floral-4.png',
    'assets/things/ui/floral-5.png',
    'assets/things/ui/floral-6.png'
  ]
};

const ENV_OFFSETS = [
  { x: -14, y: 16, r: -16, z: 1 },
  { x: 8, y: 10, r: 10, z: 2 },
  { x: -6, y: 4, r: -6, z: 3 },
  { x: 12, y: -2, r: 14, z: 4 },
  { x: -2, y: -8, r: -4, z: 5 },
  { x: 16, y: -4, r: 8, z: 6 },
  { x: 0, y: -18, r: 0, z: 7 }
];

function getModalFormat(item) {
  if (item.ph === 'ph-bookmark' || item.ph === 'ph-calligraphy') return 'bookmark';
  if (item.ph === 'ph-paper') return 'postcard';
  return 'letter';
}

function initThingsV5(root) {
  const envPile = root.querySelector('.env-pile');
  const floralBurst = root.querySelector('.floral-burst');
  const againBtn = root.querySelector('.env-again-btn');
  const findBtn = root.querySelector('.env-find-btn');
  const galleryToggle = root.querySelector('.gallery-toggle-btn');
  const wishTreeWrap = root.querySelector('.wish-tree-wrap');
  const treeTags = root.querySelector('.tree-tags');
  const modal = root.querySelector('.thing-modal');

  let lastDrawId = null;
  let treeOpen = false;
  let drawing = false;

  runTypewriter(root);
  buildEnvPile(envPile);
  setupFlorals(floralBurst);

  function renderThumb(item) {
    if (item.image) return `<img src="${item.image}" alt="${item.name}" loading="lazy">`;
    return `<div class="ph ${item.ph}">${item.glyph}</div>`;
  }

  function renderTreeTag(item, slot, i) {
    return `
      <div class="tree-tag" data-id="${item.id}"
        style="left:${slot.x}%;top:${slot.y}%;--rot:${slot.rot}deg;--str:${slot.str}px;--delay:${slot.delay || `${i * 0.15}s`}">
        <span class="tag-string"></span>
        <div class="tag-body">
          <div class="tag-hole"></div>
          <div class="tag-visual">${renderThumb(item)}</div>
          <div class="tag-name">${item.name}</div>
        </div>
      </div>`;
  }

  function renderWishTree() {
    if (!treeTags) return;
    treeTags.innerHTML = getThingsData().map((item, i) =>
      renderTreeTag(item, TREE_SLOTS[i % TREE_SLOTS.length], i)
    ).join('');
  }

  function pickItem() {
    let pool = [...getThingsData()];
    if (pool.length > 1 && lastDrawId) pool = pool.filter(t => t.id !== lastDrawId);
    const item = pool[Math.floor(Math.random() * pool.length)];
    lastDrawId = item.id;
    return item;
  }

  function openModal(item) {
    if (!modal) return;
    const fmt = getModalFormat(item);
    const visualClass = fmt === 'bookmark' ? 'modal-visual-tall' : fmt === 'postcard' ? 'modal-visual-wide' : 'modal-visual-letter';
    modal.innerHTML = `
      <div class="thing-modal-box modal-${fmt}">
        <button type="button" class="thing-modal-close" aria-label="关闭">×</button>
        <div class="modal-paper">
          <p class="letter-sign-label">${item.signLabel}</p>
          <div class="modal-visual ${visualClass}">${renderThumb(item)}</div>
          <p class="letter-item-name">${item.name}</p>
          <p class="letter-note">${item.note}</p>
          <p class="letter-verse">「${item.verse}」</p>
          <p class="modal-story">${item.story}</p>
        </div>
      </div>`;
    modal.classList.add('open');
    modal.querySelector('.thing-modal-close')?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }

  function closeModal() { modal?.classList.remove('open'); }

  function resetPile() {
    envPile?.classList.remove('shuffling');
    envPile?.querySelectorAll('.env-piece').forEach(b => {
      b.classList.remove('picked', 'opening');
    });
    floralBurst?.classList.remove('active');
    drawing = false;
  }

  function playFloralBurst() {
    if (!floralBurst) return;
    floralBurst.classList.add('active');
    setTimeout(() => floralBurst.classList.remove('active'), 1100);
  }

  function drawFromPile(btn) {
    if (drawing) return;
    drawing = true;
    const item = pickItem();
    envPile?.querySelectorAll('.env-piece').forEach(b => b.classList.remove('picked', 'opening'));
    btn?.classList.add('picked');
    envPile?.classList.add('shuffling');

    setTimeout(() => {
      envPile?.classList.remove('shuffling');
      btn?.classList.add('opening');
      playFloralBurst();
      setTimeout(() => {
        openModal(item);
        againBtn?.removeAttribute('hidden');
        findBtn?.removeAttribute('hidden');
        btn?.classList.remove('opening');
        drawing = false;
      }, 680);
    }, 420);
  }

  function openTreeAndFind(id) {
    treeOpen = true;
    wishTreeWrap?.classList.add('is-open');
    if (galleryToggle) galleryToggle.textContent = '收起展匣';
    if (!treeTags?.children.length) renderWishTree();
    setTimeout(() => {
      treeTags?.querySelectorAll('.tree-tag').forEach(el => el.classList.remove('highlight'));
      treeTags?.querySelector(`[data-id="${id}"]`)?.classList.add('highlight');
      treeTags?.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }

  envPile?.addEventListener('click', e => {
    const btn = e.target.closest('.env-piece');
    if (btn) drawFromPile(btn);
  });

  againBtn?.addEventListener('click', () => {
    resetPile();
    againBtn.setAttribute('hidden', '');
    findBtn?.setAttribute('hidden', '');
  });

  findBtn?.addEventListener('click', () => { if (lastDrawId) openTreeAndFind(lastDrawId); });

  galleryToggle?.addEventListener('click', () => {
    treeOpen = !treeOpen;
    wishTreeWrap?.classList.toggle('is-open', treeOpen);
    galleryToggle.textContent = treeOpen ? '收起展匣' : '展开展匣，慢慢翻阅';
    if (treeOpen && !treeTags?.children.length) renderWishTree();
  });

  treeTags?.addEventListener('click', e => {
    const tag = e.target.closest('.tree-tag');
    if (!tag) return;
    const item = getThingsData().find(t => t.id === tag.dataset.id);
    if (item) openModal(item);
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function buildEnvPile(container) {
  if (!container) return;
  container.innerHTML = ENV_OFFSETS.map((o, i) => `
    <button type="button" class="env-piece" data-i="${i}"
      style="--tx:${o.x}px;--ty:${o.y}px;--rot:${o.r}deg;z-index:${o.z}"
      aria-label="抽选信封">
      <img class="env-img" src="${UI_ASSETS.envelope}" alt="" loading="lazy">
      <span class="env-css-fallback" aria-hidden="true"></span>
    </button>
  `).join('');
  container.querySelectorAll('.env-img').forEach(img => {
    img.addEventListener('error', () => img.classList.add('missing'));
  });
}

function setupFlorals(container) {
  if (!container) return;
  container.innerHTML = UI_ASSETS.florals.map((src, i) =>
    `<img class="floral-piece" src="${src}" alt="" style="--fi:${i}" loading="lazy">`
  ).join('');
  container.querySelectorAll('.floral-piece').forEach(img => {
    img.addEventListener('error', () => img.remove());
  });
}

/* ---------- v4 Demo ---------- */

function initThingsV4(root) {
  const envelope = root.querySelector('.envelope-art');
  const letterCard = root.querySelector('.letter-card');
  const againBtn = root.querySelector('.env-again-btn');
  const findBtn = root.querySelector('.env-find-btn');
  const galleryToggle = root.querySelector('.gallery-toggle-btn');
  const wishTreeWrap = root.querySelector('.wish-tree-wrap');
  const treeTags = root.querySelector('.tree-tags');
  const treeLeaves = root.querySelector('.tree-leaves');
  const modal = root.querySelector('.thing-modal');

  let lastDrawId = null;
  let treeOpen = false;
  let drawing = false;
  let leavesInited = false;

  runTypewriter(root);

  function renderThumb(item) {
    if (item.image) {
      return `<img src="${item.image}" alt="${item.name}" loading="lazy">`;
    }
    return `<div class="ph ${item.ph}">${item.glyph}</div>`;
  }

  function renderTreeTag(item, slot, i) {
    return `
      <div class="tree-tag" data-id="${item.id}"
        style="left:${slot.x}%;top:${slot.y}%;--rot:${slot.rot}deg;--str:${slot.str}px;--delay:${slot.delay || `${i * 0.15}s`}">
        <span class="tag-string"></span>
        <div class="tag-body">
          <div class="tag-hole"></div>
          <div class="tag-visual">${renderThumb(item)}</div>
          <div class="tag-name">${item.name}</div>
        </div>
      </div>`;
  }

  function renderWishTree() {
    if (!treeTags) return;
    treeTags.innerHTML = getThingsData().map((item, i) =>
      renderTreeTag(item, TREE_SLOTS[i % TREE_SLOTS.length], i)
    ).join('');
  }

  function initFallingLeaves() {
    if (!treeLeaves || leavesInited) return;
    leavesInited = true;
    for (let i = 0; i < 20; i++) {
      const leaf = document.createElement('span');
      leaf.className = 'fall-leaf';
      leaf.style.left = `${8 + Math.random() * 84}%`;
      leaf.style.animationDuration = `${9 + Math.random() * 10}s`;
      leaf.style.animationDelay = `${Math.random() * 8}s`;
      leaf.style.width = `${7 + Math.random() * 6}px`;
      leaf.style.height = leaf.style.width;
      treeLeaves.appendChild(leaf);
    }
  }

  function pickItem() {
    let pool = [...getThingsData()];
    if (pool.length > 1 && lastDrawId) pool = pool.filter(t => t.id !== lastDrawId);
    const item = pool[Math.floor(Math.random() * pool.length)];
    lastDrawId = item.id;
    return item;
  }

  function fillLetter(item) {
    const sign = letterCard?.querySelector('.letter-sign-label');
    const verse = letterCard?.querySelector('.letter-verse');
    const name = letterCard?.querySelector('.letter-item-name');
    const note = letterCard?.querySelector('.letter-note');
    const thumb = letterCard?.querySelector('.letter-thumb');
    if (sign) sign.textContent = item.signLabel;
    if (verse) verse.textContent = `「${item.verse}」`;
    if (name) name.textContent = item.name;
    if (note) note.textContent = item.note;
    if (thumb) thumb.innerHTML = renderThumb(item);
    letterCard?.setAttribute('data-id', item.id);
  }

  function resetEnvelope() {
    envelope?.classList.remove('is-open', 'is-opening', 'shuffling');
    letterCard?.setAttribute('aria-hidden', 'true');
    againBtn?.setAttribute('hidden', '');
    findBtn?.setAttribute('hidden', '');
    drawing = false;
  }

  function openEnvelope() {
    if (drawing || envelope?.classList.contains('is-open')) return;
    drawing = true;
    envelope?.classList.add('shuffling');
    const item = pickItem();
    fillLetter(item);

    setTimeout(() => {
      envelope?.classList.remove('shuffling');
      envelope?.classList.add('is-opening');
      setTimeout(() => {
        envelope?.classList.add('is-open');
        letterCard?.setAttribute('aria-hidden', 'false');
        againBtn?.removeAttribute('hidden');
        findBtn?.removeAttribute('hidden');
        drawing = false;
      }, 650);
    }, 480);
  }

  function openModal(item) {
    if (!modal) return;
    modal.innerHTML = `
      <div class="thing-modal-box">
        <button type="button" class="thing-modal-close" aria-label="关闭">×</button>
        <p class="letter-sign-label">${item.signLabel}</p>
        <div class="letter-thumb" style="width:120px;height:150px;margin:0.8rem auto">${renderThumb(item)}</div>
        <p class="letter-item-name">${item.name}</p>
        <p class="letter-note">${item.note}</p>
        <p class="letter-verse">「${item.verse}」</p>
        <p class="modal-story">${item.story}</p>
      </div>`;
    modal.classList.add('open');
    modal.querySelector('.thing-modal-close')?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }

  function closeModal() { modal?.classList.remove('open'); }

  function openTreeAndFind(id) {
    treeOpen = true;
    wishTreeWrap?.classList.add('is-open');
    if (galleryToggle) galleryToggle.textContent = '收起展匣';
    if (!treeTags?.children.length) renderWishTree();
    initFallingLeaves();
    setTimeout(() => {
      treeTags?.querySelectorAll('.tree-tag').forEach(el => el.classList.remove('highlight'));
      treeTags?.querySelector(`[data-id="${id}"]`)?.classList.add('highlight');
      treeTags?.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }

  envelope?.addEventListener('click', e => {
    if (e.target.closest('.letter-card') && envelope.classList.contains('is-open')) return;
    if (!envelope.classList.contains('is-open')) openEnvelope();
  });
  envelope?.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && !envelope.classList.contains('is-open')) {
      e.preventDefault();
      openEnvelope();
    }
  });

  letterCard?.addEventListener('click', e => {
    e.stopPropagation();
    if (!envelope?.classList.contains('is-open')) return;
    const id = letterCard.getAttribute('data-id');
    const item = getThingsData().find(t => t.id === id);
    if (item) openModal(item);
  });

  againBtn?.addEventListener('click', () => { resetEnvelope(); });
  findBtn?.addEventListener('click', () => { if (lastDrawId) openTreeAndFind(lastDrawId); });

  galleryToggle?.addEventListener('click', () => {
    treeOpen = !treeOpen;
    wishTreeWrap?.classList.toggle('is-open', treeOpen);
    galleryToggle.textContent = treeOpen ? '收起展匣' : '展开展匣，慢慢翻阅';
    if (treeOpen) {
      if (!treeTags?.children.length) renderWishTree();
      initFallingLeaves();
    }
  });

  treeTags?.addEventListener('click', e => {
    const tag = e.target.closest('.tree-tag');
    if (!tag) return;
    const item = getThingsData().find(t => t.id === tag.dataset.id);
    if (item) openModal(item);
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function runTypewriter(root) {
  const lines = [...root.querySelectorAll('.intro-line[data-type]')];
  if (!lines.length) return;

  let lineIdx = 0;
  let charIdx = 0;
  let cursor = document.createElement('span');
  cursor.className = 'intro-cursor';

  function typeChar() {
    if (lineIdx >= lines.length) {
      cursor.remove();
      return;
    }
    const line = lines[lineIdx];
    const full = line.dataset.type || '';
    if (charIdx === 0) line.appendChild(cursor);

    if (charIdx < full.length) {
      cursor.before(document.createTextNode(full[charIdx]));
      charIdx++;
      setTimeout(typeChar, 55 + Math.random() * 35);
    } else {
      lineIdx++;
      charIdx = 0;
      setTimeout(typeChar, lineIdx === 3 ? 500 : 320);
    }
  }

  setTimeout(typeChar, 600);
}

/* ---------- v6 主站（窗台晾签绳 · 宣纸展台）---------- */

const ROPE_BOTTOM_MARKS = ['·', '○', '△', '•'];

function getItemSymbol(item) {
  if (item.ph === 'ph-dye') return '🖌';
  if (item.ph === 'ph-bookmark' || item.ph === 'ph-calligraphy') return '🍁';
  return '✧';
}

function buildRopeLayout(items) {
  const slots = [];
  let cursor = 48;
  const count = items.length;
  items.forEach((item, i) => {
    const progress = count > 1 ? i / (count - 1) : 0.5;
    const waveY = Math.sin(progress * Math.PI * 1.5) * 12;
    const height = 100 + Math.random() * 50;
    const width = Math.max(56, Math.min(128, item.name.length * 16 + 32));
    const randomTop = 56 + waveY + (Math.random() * 30 - 15);
    const randomRotate = Math.random() * 8 - 4;
    const randomZIndex = Math.floor(progress * 5 + Math.random() * 4) + 1;
    const left = cursor;
    cursor += width + 25 + Math.random() * 14;
    slots.push({
      x: left,
      top: randomTop,
      rotate: randomRotate,
      width,
      height,
      zIndex: randomZIndex,
      mark: ROPE_BOTTOM_MARKS[Math.floor(Math.random() * ROPE_BOTTOM_MARKS.length)],
      delay: `${(i * 0.28) % 2.2}s`
    });
  });
  return { slots, totalWidth: cursor + 56 };
}

const THREAD_POSITIONS = [3.5, 11, 19, 28, 37, 46, 55, 64, 73, 82, 91];
const THREAD_COUNT = THREAD_POSITIONS.length;
const SLOT_GAP = 96;

function slotHeight(slot) {
  if (slot.type === 'chime') return 68 * (slot.scale || 1);
  return 88 * (slot.scale || 1);
}

function threadSlotGap(threadIdx, prev, entry) {
  const stride = SLOT_GAP + ((threadIdx * 11 + (prev?.y || 0)) % 6) * 14;
  if (prev?.type === 'tag' && entry.type === 'tag') return stride + 10;
  return stride;
}

function uniformScale(threadIdx, idx) {
  return 0.94 + ((threadIdx * 5 + idx * 7) % 7) / 100;
}

function buildThreadLayout(threadIdx, items) {
  const n = items.length;
  const plan = [];
  const craneBudget = n >= 5 ? 2 : (n >= 3 ? 1 : 0);
  let cranesLeft = craneBudget;

  for (let i = 0; i < n; i++) {
    plan.push({ type: 'tag', item: items[i], tagIdx: i });
    if (cranesLeft > 0 && i < n - 1 && (i + threadIdx) % 2 === 1) {
      plan.push({ type: 'crane', craneIdx: craneBudget - cranesLeft });
      cranesLeft -= 1;
    }
  }
  plan.push({ type: 'chime', placement: 'end' });

  const slots = [];
  let y = 36 + ((threadIdx * 9) % 5) * 8;

  plan.forEach((entry, idx) => {
    if (idx > 0) {
      const prev = slots[slots.length - 1];
      y += Math.max(threadSlotGap(threadIdx, prev, entry), slotHeight(prev) * 0.5 + 30);
    }

    const scale = entry.type === 'chime'
      ? 1.04
      : uniformScale(threadIdx, idx);

    const slot = {
      type: entry.type,
      y: Math.round(y + ((threadIdx * 3 + idx * 5) % 7) - 3),
      z: entry.type === 'chime' ? 6 : entry.type === 'crane' ? 4 : 2 + (idx % 3),
      scale,
      rot: entry.type === 'chime' ? 0 : ((threadIdx * 4 + idx * 6) % 13) - 6
    };
    if (entry.item) slot.item = entry.item;
    if (entry.type === 'crane') slot.spriteId = `crane-${(threadIdx + entry.craneIdx) % 6 + 1}`;
    if (entry.type === 'chime') {
      slot.spriteId = `chime-${(threadIdx % 5) + 1}`;
    }
    slots.push(slot);
  });

  const last = slots[slots.length - 1];
  const threadH = last.type === 'chime' ? last.y + 2 : last.y + slotHeight(last) + 24;
  return { slots, threadH };
}

function renderDecorSlot(slot, threadIdx, slotIdx) {
  const sprite = pickSprite(slot.type, threadIdx + slotIdx, slot.spriteId);
  const scale = slot.scale || 1;
  const baseH = slot.type === 'chime' ? 64 : 54;
  const targetH = Math.round(baseH * (slot.type === 'chime' ? 1 : scale));
  const w = Math.round((sprite.w / Math.max(sprite.h, 1)) * targetH);
  const delay = ((threadIdx * 0.28 + slotIdx * 0.16) % 2.4).toFixed(2);
  return (
    `<img class="thread-sprite thread-sprite--${slot.type}" src="${sprite.file}" alt="" aria-hidden="true" ` +
    `style="--sprite-y:${slot.y}px;--sprite-w:${w}px;--sprite-h:${targetH}px;--sprite-rot:${slot.rot || 0}deg;--sprite-delay:${delay}s;` +
    `--sprite-z:${slot.z}">`
  );
}
const CURTAIN_SPRITES = [
  { file: 'assets/things/ui/curtain/crane-01.png', kind: 'crane', w: 120, h: 120, id: 'crane-1' },
  { file: 'assets/things/ui/curtain/chime-01.png', kind: 'chime', w: 72, h: 72, id: 'chime-1' },
  { file: 'assets/things/ui/curtain/chime-02.png', kind: 'chime', w: 72, h: 72, id: 'chime-2' },
];

function getCurtainSprites() {
  return (typeof window !== 'undefined' && window.CURTAIN_SPRITES) || CURTAIN_SPRITES;
}

function pickSprite(kind, seed, spriteId) {
  const pool = getCurtainSprites().filter(s => s.kind === kind);
  if (spriteId) {
    const hit = pool.find(s => s.id === spriteId || s.file?.includes(spriteId));
    if (hit) return hit;
  }
  return pool[seed % pool.length] || pool[0];
}

let _audioCtx = null;
let _drawAudioLast = 0;
let _tagAudioLast = 0;

function getAudioCtx() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!_audioCtx) _audioCtx = new Ctx();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function playDrawSound() {
  const now = Date.now();
  if (now - _drawAudioLast < 280) return;
  _drawAudioLast = now;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const hits = [0, 0.05, 0.11, 0.17];
    hits.forEach((off, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = i % 2 ? 'triangle' : 'sine';
      o.frequency.setValueAtTime(220 - i * 18, t + off);
      o.frequency.exponentialRampToValueAtTime(110, t + off + 0.09);
      g.gain.setValueAtTime(0.0001, t + off);
      g.gain.exponentialRampToValueAtTime(0.11 - i * 0.015, t + off + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + off + 0.14);
      o.connect(g).connect(ctx.destination);
      o.start(t + off);
      o.stop(t + off + 0.16);
    });
    const len = Math.floor(ctx.sampleRate * 0.04);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 380;
    bp.Q.value = 0.8;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.09, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    noise.connect(bp).connect(ng).connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.08);
  } catch (_) { /* optional audio */ }
}

function playTagChime() {
  const now = Date.now();
  if (now - _tagAudioLast < 320) return;
  _tagAudioLast = now;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const freqs = [1568, 1976, 2349, 2794];
    const pick = freqs[Math.floor(Math.random() * freqs.length)];
    [pick, pick * 1.5, pick * 2.01].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.045 - i * 0.01, t + 0.008 + i * 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55 + i * 0.08);
      o.connect(g).connect(ctx.destination);
      o.start(t + i * 0.018);
      o.stop(t + 0.75);
    });
  } catch (_) { /* optional audio */ }
}

function initThingsV6(root) {
  const bucket = root.querySelector('.lot-bucket');
  const drawBtn = root.querySelector('.draw-btn');
  const stickFly = root.querySelector('.stick-flyout');
  const drawZone = root.querySelector('.draw-zone');
  const curtainThreads = root.querySelector('.curtain-threads');
  const modal = root.querySelector('.thing-modal');

  let lastDrawId = null;
  let drawing = false;
  const drawnIds = new Set();
  const THREAD_COUNT = THREAD_POSITIONS.length;

  function renderThumb(item) {
    if (item.image) return `<img class="thing-photo" src="${item.image}" alt="${item.name}" loading="lazy">`;
    return `<div class="ph ${item.ph}">${item.glyph}</div>`;
  }

  function renderCurtainTag(item, hangTop, delay, zLayer, scale) {
    const drawn = drawnIds.has(item.id);
    const tagScale = scale || 1;
    return `
      <button type="button" class="curtain-tag${drawn ? ' is-drawn' : ''}" data-id="${item.id}"
        style="--hang-top:${hangTop}px;--swing-delay:${delay}s;--tag-z:${zLayer};--tag-scale:${tagScale}" ${drawn ? 'disabled' : ''}>
        <span class="curtain-clip" aria-hidden="true"></span>
        <span class="curtain-card">
          <span class="curtain-glyph">${item.glyph}</span>
          <span class="curtain-name">${item.name}</span>
        </span>
      </button>`;
  }

  function renderThreadSlot(slot, threadIdx, slotIdx) {
    const delay = (threadIdx * 0.37 + slotIdx * 0.23 + (slot.y % 13) * 0.01) % 2.8;
    if (slot.type === 'tag') {
      return renderCurtainTag(slot.item, slot.y, delay, slot.z, slot.scale);
    }
    return renderDecorSlot(slot, threadIdx, slotIdx);
  }

  function renderCurtain() {
    if (!curtainThreads) return;
    const data = getThingsData();
    if (!data.length) return;
    const buckets = Array.from({ length: THREAD_COUNT }, () => []);
    data.forEach((item, i) => buckets[i % THREAD_COUNT].push(item));
    let maxH = 520;
    const threads = buckets.map((items, ti) => {
      const { slots, threadH } = buildThreadLayout(ti, items);
      maxH = Math.max(maxH, threadH);
      const tx = THREAD_POSITIONS[ti];
      const markup = slots
        .map((s, si) => renderThreadSlot(s, ti, si))
        .join('');
      return `
        <div class="curtain-thread" style="--tx:${tx}%;--thread-h:${threadH}px">
          <span class="thread-line" aria-hidden="true"></span>
          <div class="thread-hangs">${markup}</div>
        </div>`;
    }).join('');
    curtainThreads.style.minHeight = `${maxH + 40}px`;
    curtainThreads.innerHTML = threads;
    if (window.scheduleDrawVineTree) window.scheduleDrawVineTree(true);
  }

  function markCurtainDrawn(id) {
    drawnIds.add(id);
    const tag = curtainThreads?.querySelector(`.curtain-tag[data-id="${id}"]`);
    if (tag) {
      tag.classList.add('is-drawn');
      tag.disabled = true;
    }
  }

  function pickItem() {
    let pool = getThingsData().filter(t => !drawnIds.has(t.id));
    if (!pool.length) {
      drawnIds.clear();
      renderCurtain();
      pool = [...getThingsData()];
    }
    if (pool.length > 1 && lastDrawId) pool = pool.filter(t => t.id !== lastDrawId);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function openBookmarkModal(item) {
    if (!modal) return;
    const hasPhoto = Boolean(item.image);
    modal.innerHTML = `
      <div class="thing-modal-box modal-bookmark-only${hasPhoto ? ' modal-has-photo' : ''}">
        <div class="bookmark-sheet bookmark-sheet--modal bookmark-sheet--rough">
          <div class="sheet-crease" aria-hidden="true"></div>
          <p class="letter-sign-label">${item.signLabel}</p>
          <div class="modal-visual modal-visual-tall">${renderThumb(item)}</div>
          <p class="letter-item-name">${item.name}</p>
          <p class="letter-note">${item.note}</p>
          <p class="letter-verse">「${item.verse}」</p>
          ${item.blessing ? `<p class="letter-blessing">${item.blessing}</p>` : ''}
          <p class="modal-story">${item.story}</p>
          <div class="bookmark-modal-actions">
            <button type="button" class="bm-btn bm-fold">收起</button>
            <button type="button" class="bm-btn bm-again">再摇一支</button>
          </div>
        </div>
      </div>`;
    modal.classList.add('open');
    modal.querySelector('.bm-fold')?.addEventListener('click', closeModal);
    modal.querySelector('.bm-again')?.addEventListener('click', () => {
      closeModal();
      setTimeout(drawLot, 300);
    });
    modal.onclick = e => { if (e.target === modal) closeModal(); };
  }

  function closeModal() {
    modal?.classList.remove('open');
    if (modal) modal.onclick = null;
  }

  function drawLot() {
    if (drawing) return;
    drawing = true;
    playDrawSound();
    drawZone?.classList.add('is-drawing');
    if (drawBtn) {
      drawBtn.disabled = true;
      const inner = drawBtn.querySelector('.draw-btn-inner');
      if (inner) inner.textContent = '签落…';
    }
    bucket?.classList.add('shaking');
    const item = pickItem();
    setTimeout(() => {
      bucket?.classList.remove('shaking');
      stickFly?.classList.remove('fly');
      void stickFly?.offsetWidth;
      stickFly?.classList.add('fly');
      setTimeout(() => {
        stickFly?.classList.remove('fly');
        lastDrawId = item.id;
        markCurtainDrawn(item.id);
        openBookmarkModal(item);
        if (drawBtn) {
          drawBtn.disabled = false;
          const inner = drawBtn.querySelector('.draw-btn-inner');
          if (inner) inner.textContent = '摇一支签';
        }
        drawing = false;
        setTimeout(() => drawZone?.classList.remove('is-drawing'), 2800);
      }, 620);
    }, 520);
  }

  drawBtn?.addEventListener('click', drawLot);
  bucket?.addEventListener('click', drawLot);
  bucket?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drawLot(); }
  });

  curtainThreads?.addEventListener('click', e => {
    const tag = e.target.closest('.curtain-tag:not(.is-drawn)');
    if (!tag || drawing) return;
    playTagChime();
    const item = getThingsData().find(t => t.id === tag.dataset.id);
    if (item) {
      lastDrawId = item.id;
      markCurtainDrawn(item.id);
      openBookmarkModal(item);
    }
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  renderCurtain();
}

/* ---------- v3 主站（保留签筒逻辑）---------- */

function initThingsV3(root) {
  const vessel = root.querySelector('.lot-vessel');
  const drawBtn = root.querySelector('.draw-btn');
  const drawPanel = root.querySelector('.draw-panel');
  const drawZone = root.querySelector('.draw-zone');
  const envelopeStage = root.querySelector('.envelope-stage');
  const envelopeWrap = root.querySelector('.envelope-wrap');
  const signLabel = root.querySelector('.letter-sign-label');
  const letterVerse = root.querySelector('.letter-verse');
  const letterItemName = root.querySelector('.letter-item-name');
  const letterNote = root.querySelector('.letter-note');
  const letterThumb = root.querySelector('.letter-thumb');
  const letterActions = root.querySelector('.letter-actions');
  const galleryToggle = root.querySelector('.gallery-toggle-btn');
  const wishTreeWrap = root.querySelector('.wish-tree-wrap');
  const treeTags = root.querySelector('.tree-tags');
  const modal = root.querySelector('.thing-modal');

  let lastDrawId = null;
  let treeOpen = false;
  let drawing = false;

  function renderThumb(item) {
    if (item.image) return `<img src="${item.image}" alt="${item.name}" loading="lazy">`;
    return `<div class="ph ${item.ph}">${item.glyph}</div>`;
  }

  function renderTreeTag(item, slot, i) {
    return `
      <div class="tree-tag" data-id="${item.id}"
        style="left:${slot.x}%;top:${slot.y}%;--rot:${slot.rot}deg;--str:${slot.str}px;--delay:${slot.delay || `${i * 0.15}s`}">
        <span class="tag-string"></span>
        <div class="tag-body">
          <div class="tag-hole"></div>
          <div class="tag-visual">${renderThumb(item)}</div>
          <div class="tag-name">${item.name}</div>
        </div>
      </div>`;
  }

  function renderWishTree() {
    if (!treeTags) return;
    treeTags.innerHTML = getThingsData().map((item, i) =>
      renderTreeTag(item, TREE_SLOTS[i % TREE_SLOTS.length], i)
    ).join('');
  }

  function pickItem() {
    let pool = [...getThingsData()];
    if (pool.length > 1 && lastDrawId) pool = pool.filter(t => t.id !== lastDrawId);
    const item = pool[Math.floor(Math.random() * pool.length)];
    lastDrawId = item.id;
    return item;
  }

  function fillLetter(item) {
    if (signLabel) signLabel.textContent = item.signLabel;
    if (letterVerse) letterVerse.textContent = `「${item.verse}」`;
    if (letterItemName) letterItemName.textContent = item.name;
    if (letterNote) letterNote.textContent = item.note;
    if (letterThumb) letterThumb.innerHTML = renderThumb(item);
  }

  function resetEnvelope() {
    envelopeWrap?.classList.remove('open', 'pull');
    envelopeStage?.classList.remove('active');
    envelopeStage?.setAttribute('aria-hidden', 'true');
    drawZone?.classList.remove('has-letter');
    vessel?.classList.remove('hidden', 'shaking');
    if (drawPanel) { drawPanel.style.opacity = ''; drawPanel.style.pointerEvents = ''; }
    drawing = false;
    if (drawBtn) { drawBtn.disabled = false; drawBtn.textContent = '摇一枝签'; }
  }

  function drawLot() {
    if (drawing) return;
    drawing = true;
    if (drawBtn) { drawBtn.disabled = true; drawBtn.textContent = '签落…'; }
    vessel?.classList.add('shaking');
    fillLetter(pickItem());
    setTimeout(() => {
      vessel?.classList.remove('shaking');
      vessel?.classList.add('hidden');
      if (drawPanel) { drawPanel.style.opacity = '0'; drawPanel.style.pointerEvents = 'none'; }
      envelopeStage?.classList.add('active');
      envelopeStage?.setAttribute('aria-hidden', 'false');
      drawZone?.classList.add('has-letter');
      setTimeout(() => envelopeWrap?.classList.add('open'), 350);
      setTimeout(() => {
        envelopeWrap?.classList.add('pull');
        if (drawBtn) drawBtn.textContent = '已得签';
      }, 950);
    }, 520);
  }

  function openModal(item) {
    if (!modal) return;
    modal.innerHTML = `
      <div class="thing-modal-box">
        <button type="button" class="thing-modal-close" aria-label="关闭">×</button>
        <p class="letter-sign-label">${item.signLabel}</p>
        <div class="letter-thumb" style="width:88px;height:110px;margin:0.6rem auto">${renderThumb(item)}</div>
        <p class="letter-item-name">${item.name}</p>
        <p class="letter-note">${item.note}</p>
        <p class="letter-verse">「${item.verse}」</p>
        <p class="modal-story">${item.story}</p>
      </div>`;
    modal.classList.add('open');
    modal.querySelector('.thing-modal-close')?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }

  function closeModal() { modal?.classList.remove('open'); }

  function openTreeAndFind(id) {
    treeOpen = true;
    wishTreeWrap?.classList.add('is-open');
    if (galleryToggle) galleryToggle.textContent = '收起展匣';
    if (!treeTags?.children.length) renderWishTree();
    setTimeout(() => {
      treeTags?.querySelectorAll('.tree-tag').forEach(el => el.classList.remove('highlight'));
      treeTags?.querySelector(`[data-id="${id}"]`)?.classList.add('highlight');
      treeTags?.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }

  drawBtn?.addEventListener('click', drawLot);
  vessel?.addEventListener('click', drawLot);
  vessel?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drawLot(); }
  });
  letterActions?.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.action === 'again') { resetEnvelope(); setTimeout(drawLot, 280); }
    if (btn.dataset.action === 'find' && lastDrawId) openTreeAndFind(lastDrawId);
  });
  galleryToggle?.addEventListener('click', () => {
    treeOpen = !treeOpen;
    wishTreeWrap?.classList.toggle('is-open', treeOpen);
    galleryToggle.textContent = treeOpen ? '收起展匣' : '展开展匣，慢慢翻阅';
    if (treeOpen && !treeTags?.children.length) renderWishTree();
  });
  treeTags?.addEventListener('click', e => {
    const tag = e.target.closest('.tree-tag');
    if (!tag) return;
    const item = getThingsData().find(t => t.id === tag.dataset.id);
    if (item) openModal(item);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

if (typeof window !== 'undefined') {
  window.initThingsSection = initThingsSection;
}
