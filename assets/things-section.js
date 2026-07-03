/**
 * 匣中签 · 物有灵犀
 * v3: 主站 #things.things-v3（签筒）
 * v4: Demo #things-demo.things-v4（信封直抽）
 */
const THINGS_DATA = [
  { id: 'c1', name: '秋风归舟笺', signLabel: '秋风签', signature: '—— 雪琪手书', note: '长条行草，墨势如风。', story: '纸上是“怎耐秋风凄凉”的旧句，笔锋起落像船过江心。它不是悲声，更像把心事写给晚风。', verse: '秋声落纸，归意满舟。', blessing: '愿君逢风不惊，归途自明。', ph: 'ph-calligraphy', glyph: '秋', image: 'assets/things/ui/processed/original/01-045cb3d0cec8f28e23eb81e01be066de.jpg' },
  { id: 'c2', name: '和光同尘双签', signLabel: '和光签', signature: '—— 枕书人', note: '双流苏书签，字在水彩上开花。', story: '左签写“和光同尘”，右签落“腹有诗书”，像把温柔与锋芒并排系在书页里。', verse: '心有诗书，步履生光。', blessing: '愿君藏锋而不藏志，温润亦有锋芒。', ph: 'ph-calligraphy', glyph: '和', image: 'assets/things/ui/processed/original/02-07ace9576db66c0b16db23c12fe3ee4e.jpg' },
  { id: 'd1', name: '金龙红福笺', signLabel: '金福签', signature: '—— 染香斋', note: '朱红底上金字与龙纹相映。', story: '“逢”字落在正中，像把热烈的新年气压进纸纤维，抬眼就有喜气扑面。', verse: '一纸金红，万事逢春。', blessing: '愿君所逢皆吉，所愿皆成。', ph: 'ph-dye', glyph: '福', image: 'assets/things/ui/processed/original/03-228ca3a499cf924d100e4a3bec82abc7.jpg' },
  { id: 'd2', name: '港城迎新明信片', signLabel: '港城签', signature: '—— 听潮客', note: '手写 welcome 与贴纸并置，像旅程起点。', story: '“下一站，CUHK!!”写得很大，像一口气把勇气写满卡片，寄给还未抵达的自己。', verse: '山海未远，前路可期。', blessing: '愿君远行有光，初见即欢。', ph: 'ph-dye', glyph: '港', image: 'assets/things/ui/processed/original/04-2568c6df2a6c63cd721067ee7102ff70.jpg' },
  { id: 'b1', name: '月吻花笺', signLabel: '花吻签', signature: '—— 拾叶人', note: '粉色半透便笺，英诗与花贴重叠。', story: '“sunlight、moonbeams、sea breeze”三句被剪贴在一起，像把轻柔的爱意分行收藏。', verse: '月色轻吻，花影成诗。', blessing: '愿君被温柔轻轻环抱，被爱悄悄应答。', ph: 'ph-bookmark', glyph: '月', image: 'assets/things/ui/processed/original/05-2743242f6133414515bbe88127c9f880.jpg' },
  { id: 'b2', name: '蓝夜万圣小卡', signLabel: '夜蓝签', signature: '—— 手作人', note: '幽蓝底色与小幽灵，节日气息轻灵。', story: '“圣诞还没开始，月光先把季节照亮”，一张卡把万圣夜写成温柔的夜航。', verse: '月光微寒，心火仍暖。', blessing: '愿君夜行有灯，怪可爱而梦不惊。', ph: 'ph-bookmark', glyph: '夜', image: 'assets/things/ui/processed/original/06-2a0ff0f29195957ed52d1ccd86a95189.jpg' },
  { id: 'p1', name: '愿愿兼得双签', signLabel: '愿成签', signature: '—— 雪琪', note: '两枚手作书签并列，粉紫晕染。', story: '“绝对幸运”与“愿愿兼得”并排，像是给生活的双重注脚：既盼好运，也盼心愿落地。', verse: '愿望有声，幸运有形。', blessing: '愿君所念皆有回响，所愿皆能兼得。', ph: 'ph-paper', glyph: '愿', image: 'assets/things/ui/processed/original/07-3342d23334b32db5fc096dc62d3e79da.jpg' },
  { id: 'p2', name: '樱桃芭蕉笺', signLabel: '樱蕉签', signature: '—— 远行人', note: '纯白长签，墨字简净。', story: '“念了樱桃红，芭蕉浅”这句写得克制，像春夏交界时一口很轻的叹息。', verse: '樱红初醒，蕉影微凉。', blessing: '愿君心中常有四时，眼底常有新色。', ph: 'ph-paper', glyph: '樱', image: 'assets/things/ui/processed/original/08-382474fe42c4d93735d4dd0675de3d18.jpg' },
  { id: 'p3', name: '晨铃粉珠签', signLabel: '晨铃签', signature: '—— 雪琪', note: '横向签纸与粉珠手链相映。', story: '“晨钟催鸿门”旁缀一圈粉珠，像在利落笔触外，多加了一层柔软的回音。', verse: '铃声一动，晨意先来。', blessing: '愿君清晨有好消息，黄昏有好心情。', ph: 'ph-paper', glyph: '铃', image: 'assets/things/ui/processed/original/09-39e3893ea792f14056d35ef163eaefef.jpg' },
  { id: 'c3', name: '蓝雾情书碎片', signLabel: '夜语签', signature: '—— 雪琪', note: '撕边蓝纸，白墨英文像雾。', story: '“The night is moist...”被写在一片蓝雾里，右上角纸鹤像一封尚未寄出的晚安。', verse: '夜色微湿，情话无声。', blessing: '愿君有人可念，有夜可安。', ph: 'ph-calligraphy', glyph: '爱', image: 'assets/things/ui/processed/original/10-4a204e9a96f5a80f4c7c2570a668e837.jpg' },
  { id: 'd3', name: '逢考必过红笺', signLabel: '必过签', signature: '—— 染秋人', note: '红底金字，手持拍摄更显热烈。', story: '“逢考必过!!”写得直白又可爱，是把焦虑化成祝福的最有效咒语。', verse: '金字一落，心定笔稳。', blessing: '愿君落笔生花，逢考必过。', ph: 'ph-dye', glyph: '考', image: 'assets/things/ui/processed/original/11-594b42125f596fc8a1fdf642929c210f.jpg' },
  { id: 'b3', name: '绝对幸运流苏签', signLabel: '幸运签', signature: '—— 雪琪', note: '红流苏与珐琅耳饰，吉意明亮。', story: '“绝对幸运”落在粉绿晕染中央，像把好运具体地系在指尖，一看就想带走。', verse: '流苏轻摆，福意自来。', blessing: '愿君今日有小确幸，明日有大如愿。', ph: 'ph-bookmark', glyph: '运', image: 'assets/things/ui/processed/original/12-649013fd915f7db5f073405b1d623abd.jpg' }
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

const THREAD_POSITIONS = [6, 17, 29, 44, 58, 73, 88];

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

/** 每根垂线：千纸鹤/风铃/签交错悬挂，间距与景深不一（参照垂帘效果图） */
const THREAD_DECOR_LAYOUT = [
  [
    { kind: 'crane', spriteId: 'crane-1', y: 8, scale: 0.92, rot: -8, z: 4, blur: 0 },
    { kind: 'chime', spriteId: 'chime-2', y: 58, scale: 0.7, rot: 6, z: 2, blur: 0.6 },
    { kind: 'crane', spriteId: 'crane-3', y: 118, scale: 0.58, rot: 5, z: 1, blur: 1.4 }
  ],
  [
    { kind: 'chime', spriteId: 'chime-1', y: 22, scale: 0.78, rot: -5, z: 3, blur: 0.3 },
    { kind: 'crane', spriteId: 'crane-2', y: 88, scale: 0.66, rot: 7, z: 2, blur: 0.8 },
    { kind: 'chime', spriteId: 'chime-4', y: 156, scale: 0.52, rot: -3, z: 1, blur: 1.6 }
  ],
  [
    { kind: 'crane', spriteId: 'crane-4', y: 14, scale: 0.84, rot: 6, z: 4, blur: 0 },
    { kind: 'chime', spriteId: 'chime-3', y: 72, scale: 0.74, rot: -6, z: 2, blur: 0.5 },
    { kind: 'crane', spriteId: 'crane-5', y: 142, scale: 0.5, rot: -4, z: 1, blur: 1.8 }
  ],
  [
    { kind: 'chime', spriteId: 'chime-5', y: 10, scale: 0.8, rot: 4, z: 3, blur: 0.2 },
    { kind: 'crane', spriteId: 'crane-6', y: 64, scale: 0.72, rot: -7, z: 2, blur: 0.7 },
    { kind: 'chime', spriteId: 'chime-2', y: 128, scale: 0.56, rot: 5, z: 1, blur: 1.5 }
  ],
  [
    { kind: 'crane', spriteId: 'crane-2', y: 18, scale: 0.88, rot: -5, z: 4, blur: 0 },
    { kind: 'chime', spriteId: 'chime-1', y: 96, scale: 0.68, rot: 8, z: 2, blur: 0.9 },
    { kind: 'crane', spriteId: 'crane-1', y: 168, scale: 0.48, rot: 3, z: 1, blur: 2 }
  ],
  [
    { kind: 'chime', spriteId: 'chime-3', y: 26, scale: 0.76, rot: -4, z: 3, blur: 0.4 },
    { kind: 'crane', spriteId: 'crane-3', y: 78, scale: 0.64, rot: 6, z: 2, blur: 0.8 },
    { kind: 'chime', spriteId: 'chime-4', y: 148, scale: 0.54, rot: -2, z: 1, blur: 1.7 }
  ],
  [
    { kind: 'crane', spriteId: 'crane-5', y: 12, scale: 0.86, rot: 7, z: 4, blur: 0 },
    { kind: 'chime', spriteId: 'chime-2', y: 68, scale: 0.72, rot: -5, z: 2, blur: 0.6 },
    { kind: 'crane', spriteId: 'crane-4', y: 134, scale: 0.55, rot: -6, z: 1, blur: 1.6 }
  ]
];

/** 每根线上的签牌悬挂高度（与装饰交错，非等距） */
const THREAD_TAG_OFFSETS = [
  [132, 248],
  [168, 286],
  [118, 224],
  [152, 262],
  [142, 238],
  [176, 294],
  [126, 256]
];

function renderThreadDecor(threadIndex) {
  const layout = THREAD_DECOR_LAYOUT[threadIndex % THREAD_DECOR_LAYOUT.length];
  return layout.map((slot, si) => {
    const sprite = pickSprite(slot.kind, threadIndex + si, slot.spriteId);
    const w = Math.round((sprite?.w || 48) * slot.scale);
    const delay = ((threadIndex * 0.32 + si * 0.18) % 2.4).toFixed(2);
    const blur = slot.blur || 0;
    const z = slot.z || 1;
    const opacity = blur > 1 ? 0.55 : blur > 0.5 ? 0.72 : 0.94;
    return (
      `<img class="thread-sprite thread-sprite--${slot.kind}" src="${sprite.file}" alt="" aria-hidden="true" ` +
      `style="--sprite-y:${slot.y}px;--sprite-w:${w}px;--sprite-rot:${slot.rot}deg;--sprite-delay:${delay}s;` +
      `--sprite-z:${z};--sprite-blur:${blur}px;opacity:${opacity}">`
    );
  }).join('');
}

let _chimeCtx = null;
let _chimeLast = 0;
function playChime() {
  const now = Date.now();
  if (now - _chimeLast < 700) return;
  _chimeLast = now;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!_chimeCtx) _chimeCtx = new Ctx();
    if (_chimeCtx.state === 'suspended') _chimeCtx.resume();
    const t = _chimeCtx.currentTime;
    [1046, 1318, 1568].forEach((freq, i) => {
      const o = _chimeCtx.createOscillator();
      const g = _chimeCtx.createGain();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.055 - i * 0.012, t + 0.015 + i * 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45 + i * 0.06);
      o.connect(g).connect(_chimeCtx.destination);
      o.start(t + i * 0.02);
      o.stop(t + 0.65);
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

  function renderCurtainTag(item, hangTop, delay, zLayer) {
    const drawn = drawnIds.has(item.id);
    return `
      <button type="button" class="curtain-tag${drawn ? ' is-drawn' : ''}" data-id="${item.id}"
        style="--hang-top:${hangTop}px;--swing-delay:${delay}s;--tag-z:${zLayer}" ${drawn ? 'disabled' : ''}>
        <span class="curtain-clip" aria-hidden="true"></span>
        <span class="curtain-card">
          <span class="curtain-glyph">${item.glyph}</span>
          <span class="curtain-name">${item.name}</span>
        </span>
      </button>`;
  }

  function renderCurtain() {
    if (!curtainThreads) return;
    const buckets = Array.from({ length: THREAD_COUNT }, () => []);
    THINGS_DATA.forEach((item, i) => buckets[i % THREAD_COUNT].push(item));
    curtainThreads.innerHTML = buckets.map((items, ti) => {
      const tx = THREAD_POSITIONS[ti];
      const tagOffsets = THREAD_TAG_OFFSETS[ti % THREAD_TAG_OFFSETS.length];
      const hangs = items.map((item, hi) => {
        const hangTop = tagOffsets[hi % tagOffsets.length] + (hi > 1 ? (hi - 1) * 38 : 0);
        const delay = (ti * 0.41 + hi * 0.27 + (hangTop % 17) * 0.01) % 2.8;
        const zLayer = hi % 2 === 0 ? 3 : 2;
        return renderCurtainTag(item, hangTop, delay, zLayer);
      }).join('');
      return `
        <div class="curtain-thread" style="--tx:${tx}%">
          <span class="thread-line" aria-hidden="true"></span>
          <div class="thread-decor">${renderThreadDecor(ti)}</div>
          <div class="thread-hangs">${hangs}</div>
        </div>`;
    }).join('');
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
    let pool = THINGS_DATA.filter(t => !drawnIds.has(t.id));
    if (!pool.length) {
      drawnIds.clear();
      renderCurtain();
      pool = [...THINGS_DATA];
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
          ${item.signature ? `<p class="letter-signature">${item.signature}</p>` : ''}
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
        playChime();
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
    playChime();
    const item = THINGS_DATA.find(t => t.id === tag.dataset.id);
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
