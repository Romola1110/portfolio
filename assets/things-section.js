/**
 * 匣中签 · 物有灵犀
 * v3: 主站 #things.things-v3（签筒）
 * v4: Demo #things-demo.things-v4（信封直抽）
 */
const THINGS_DATA = [
  { id: 'c1', name: '隶意残帖', signLabel: '墨痕签', note: '临帖未完，余墨先走。', story: '那一笔拖得太长，像一句没说完的话。我留着它，像留一扇半掩的门。', verse: '墨停处，风也轻了半寸。', ph: 'ph-calligraphy', glyph: '墨', image: null },
  { id: 'c2', name: '雨夜小楷', signLabel: '夜雨签', note: '窗上的水痕，成了字距。', story: '小楷要慢。那晚窗外有雨，我便写得更慢。', verse: '字越小，心越静。', ph: 'ph-calligraphy', glyph: '雨', image: null },
  { id: 'd1', name: '暮春试色', signLabel: '春意签', note: '颜料晕开，像情绪找到形状。', story: '本想试一抹色，整张卡却先绿了起来。', verse: '春色不必满纸，一点就够。', ph: 'ph-dye', glyph: '染', image: null },
  { id: 'd2', name: '海盐蓝调', signLabel: '海色签', note: '冷色里藏着一点暖。', story: '染到第三遍，才觉得像海边的风。', verse: '深浅之间，自有分寸。', ph: 'ph-dye', glyph: '蓝', image: null },
  { id: 'b1', name: '银杏叶签', signLabel: '叶脉签', note: '夹在书页之间，替思绪留住页码。', story: '那片叶子是在校园里捡的。书翻到哪一页，它就在哪一页等我。', verse: '翻页时，请轻一点。', ph: 'ph-bookmark', glyph: '叶', image: null },
  { id: 'b2', name: '绳结纸签', signLabel: '绳结签', note: '棉线绕了三圈。', story: '绳结可以重系，有些句子却不能。', verse: '系紧一点，别弄丢正在读的自己。', ph: 'ph-bookmark', glyph: '签', image: null },
  { id: 'p1', name: '折扇小稿', signLabel: '折扇签', note: '扇骨未上，画意先满。', story: '折扇合拢时，画藏在时间里；展开时，才肯给人看。', verse: '收合之间，皆是风景。', ph: 'ph-paper', glyph: '扇', image: null },
  { id: 'p2', name: '港城明信片', signLabel: '邮笺签', note: '写了一半地址，寄给自己。', story: '最动人的明信片，常常是还没贴邮票的那一面。', verse: '未寄出的，最懂远方。', ph: 'ph-paper', glyph: '城', image: null },
  { id: 'p3', name: '手撕纸边集', signLabel: '毛边签', note: '毛边比直线诚实。', story: '撕纸那一下，往往比剪刀更听手的话。', verse: '不整齐处，最像手作。', ph: 'ph-paper', glyph: '纸', image: null },
  { id: 'c3', name: '信笺草稿', signLabel: '笺墨签', note: '写给未来的自己。', story: '删了又写，最后留下一行：别急着长大。', verse: '草稿里，住着真话。', ph: 'ph-calligraphy', glyph: '信', image: null },
  { id: 'd3', name: '枫叶渐层', signLabel: '秋晕签', note: '秋意在纸上慢慢渗透。', story: '这一张染了一个下午，窗外真的起了风。', verse: '等色定，心也定。', ph: 'ph-dye', glyph: '枫', image: null },
  { id: 'b3', name: '烫金细签', signLabel: '微光签', note: '光落在字上，像加了标点。', story: '烫金会脱，但某一瞬的亮是真的。', verse: '微光处，值得停留。', ph: 'ph-bookmark', glyph: '金', image: null }
];

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
    treeTags.innerHTML = THINGS_DATA.map((item, i) =>
      renderTreeTag(item, TREE_SLOTS[i % TREE_SLOTS.length], i)
    ).join('');
  }

  function pickItem() {
    let pool = [...THINGS_DATA];
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
    const item = THINGS_DATA.find(t => t.id === tag.dataset.id);
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
    treeTags.innerHTML = THINGS_DATA.map((item, i) =>
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
    let pool = [...THINGS_DATA];
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
    const item = THINGS_DATA.find(t => t.id === id);
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
    const item = THINGS_DATA.find(t => t.id === tag.dataset.id);
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
    treeTags.innerHTML = THINGS_DATA.map((item, i) =>
      renderTreeTag(item, TREE_SLOTS[i % TREE_SLOTS.length], i)
    ).join('');
  }

  function pickItem() {
    let pool = [...THINGS_DATA];
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
    const item = THINGS_DATA.find(t => t.id === tag.dataset.id);
    if (item) openModal(item);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

if (typeof window !== 'undefined') {
  window.initThingsSection = initThingsSection;
  window.THINGS_DATA = THINGS_DATA;
}
