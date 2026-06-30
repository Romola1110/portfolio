/**
 * 匣中签 · 物有灵犀 v3 — 签筒 · 信封 · 许愿树展匣
 */
const THINGS_DATA = [
  {
    id: 'c1',
    name: '隶意残帖', nameEn: 'A Fragment in Clerical Ink',
    signLabel: '墨痕签',
    note: '临帖未完，余墨先走。',
    story: '那一笔拖得太长，像一句没说完的话。我留着它，像留一扇半掩的门。',
    verse: '墨停处，风也轻了半寸。',
    ph: 'ph-calligraphy', glyph: '墨',
    image: null, matStyle: 'cutout'
  },
  {
    id: 'c2',
    name: '雨夜小楷', nameEn: 'Small Script, Rainy Night',
    signLabel: '夜雨签',
    note: '窗上的水痕，成了字距。',
    story: '小楷要慢。那晚窗外有雨，我便写得更慢。',
    verse: '字越小，心越静。',
    ph: 'ph-calligraphy', glyph: '雨', image: null, matStyle: 'cutout'
  },
  {
    id: 'd1',
    name: '暮春试色', nameEn: 'Late Spring, First Wash',
    signLabel: '春意签',
    note: '颜料晕开，像情绪找到形状。',
    story: '本想试一抹色，整张卡却先绿了起来。',
    verse: '春色不必满纸，一点就够。',
    ph: 'ph-dye', glyph: '染', image: null, matStyle: 'soft'
  },
  {
    id: 'd2',
    name: '海盐蓝调', nameEn: 'Sea-salt Blues',
    signLabel: '海色签',
    note: '冷色里藏着一点暖。',
    story: '染到第三遍，才觉得像海边的风。',
    verse: '深浅之间，自有分寸。',
    ph: 'ph-dye', glyph: '蓝', image: null, matStyle: 'soft'
  },
  {
    id: 'b1',
    name: '银杏叶签', nameEn: 'Ginkgo Leaf Mark',
    signLabel: '叶脉签',
    note: '夹在书页之间，替思绪留住页码。',
    story: '那片叶子是在校园里捡的。书翻到哪一页，它就在哪一页等我。',
    verse: '翻页时，请轻一点。',
    ph: 'ph-bookmark', glyph: '叶', image: null, matStyle: 'cutout'
  },
  {
    id: 'b2',
    name: '绳结纸签', nameEn: 'Knotted Paper Slip',
    signLabel: '绳结签',
    note: '棉线绕了三圈。',
    story: '绳结可以重系，有些句子却不能。',
    verse: '系紧一点，别弄丢正在读的自己。',
    ph: 'ph-bookmark', glyph: '签', image: null, matStyle: 'cutout'
  },
  {
    id: 'p1',
    name: '折扇小稿', nameEn: 'Fan Sketch',
    signLabel: '折扇签',
    note: '扇骨未上，画意先满。',
    story: '折扇合拢时，画藏在时间里；展开时，才肯给人看。',
    verse: '收合之间，皆是风景。',
    ph: 'ph-paper', glyph: '扇', image: null, matStyle: 'cutout'
  },
  {
    id: 'p2',
    name: '港城明信片', nameEn: 'Harbour Postcard',
    signLabel: '邮笺签',
    note: '写了一半地址，寄给自己。',
    story: '最动人的明信片，常常是还没贴邮票的那一面。',
    verse: '未寄出的，最懂远方。',
    ph: 'ph-paper', glyph: '城', image: null, matStyle: 'soft'
  },
  {
    id: 'p3',
    name: '手撕纸边集', nameEn: 'Torn-edge Collage',
    signLabel: '毛边签',
    note: '毛边比直线诚实。',
    story: '撕纸那一下，往往比剪刀更听手的话。',
    verse: '不整齐处，最像手作。',
    ph: 'ph-paper', glyph: '纸', image: null, matStyle: 'soft'
  },
  {
    id: 'c3',
    name: '信笺草稿', nameEn: 'Letter Draft',
    signLabel: '笺墨签',
    note: '写给未来的自己。',
    story: '删了又写，最后留下一行：别急着长大。',
    verse: '草稿里，住着真话。',
    ph: 'ph-calligraphy', glyph: '信', image: null, matStyle: 'cutout'
  },
  {
    id: 'd3',
    name: '枫叶渐层', nameEn: 'Maple Gradient',
    signLabel: '秋晕签',
    note: '秋意在纸上慢慢渗透。',
    story: '这一张染了一个下午，窗外真的起了风。',
    verse: '等色定，心也定。',
    ph: 'ph-dye', glyph: '枫', image: null, matStyle: 'soft'
  },
  {
    id: 'b3',
    name: '烫金细签', nameEn: 'Gold-foil Slip',
    signLabel: '微光签',
    note: '光落在字上，像加了标点。',
    story: '烫金会脱，但某一瞬的亮是真的。',
    verse: '微光处，值得停留。',
    ph: 'ph-bookmark', glyph: '金', image: null, matStyle: 'cutout'
  }
];

/** 许愿树吊牌位 — x/y 为百分比，rot 微旋，str 绳长 */
const TREE_SLOTS = [
  { x: 78, y: 10, rot: -4, str: 34, delay: '0s' },
  { x: 62, y: 18, rot: 6, str: 40, delay: '0.4s' },
  { x: 48, y: 24, rot: -8, str: 36, delay: '0.8s' },
  { x: 32, y: 30, rot: 5, str: 42, delay: '1.1s' },
  { x: 18, y: 36, rot: -3, str: 38, delay: '0.2s' },
  { x: 70, y: 32, rot: 7, str: 44, delay: '1.4s' },
  { x: 55, y: 40, rot: -6, str: 36, delay: '0.6s' },
  { x: 40, y: 46, rot: 4, str: 40, delay: '1.8s' },
  { x: 25, y: 52, rot: -5, str: 34, delay: '0.9s' },
  { x: 82, y: 48, rot: 3, str: 38, delay: '1.2s' },
  { x: 65, y: 56, rot: -7, str: 42, delay: '0.3s' },
  { x: 50, y: 62, rot: 6, str: 36, delay: '1.6s' }
];

function initThingsSection(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const vessel = root.querySelector('.lot-vessel');
  const drawBtn = root.querySelector('.draw-btn');
  const drawPanel = root.querySelector('.draw-panel');
  const envelopeStage = root.querySelector('.envelope-stage');
  const envelopeWrap = root.querySelector('.envelope-wrap');
  const letterSheet = root.querySelector('.letter-sheet');
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

  function renderThumb(item, cls) {
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
    treeTags.innerHTML = THINGS_DATA.map((item, i) => {
      const slot = TREE_SLOTS[i % TREE_SLOTS.length];
      return renderTreeTag(item, slot, i);
    }).join('');
  }

  function pickItem() {
    let pool = [...THINGS_DATA];
    if (pool.length > 1 && lastDrawId) {
      pool = pool.filter(t => t.id !== lastDrawId);
    }
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
    vessel?.classList.remove('hidden', 'shaking');
    if (drawPanel) drawPanel.style.opacity = '';
    if (drawPanel) drawPanel.style.pointerEvents = '';
    drawing = false;
    if (drawBtn) {
      drawBtn.disabled = false;
      drawBtn.textContent = '摇一枝签';
    }
  }

  function drawLot() {
    if (drawing) return;
    drawing = true;
    if (drawBtn) {
      drawBtn.disabled = true;
      drawBtn.textContent = '签落…';
    }

    vessel?.classList.add('shaking');
    const item = pickItem();
    fillLetter(item);

    setTimeout(() => {
      vessel?.classList.remove('shaking');
      vessel?.classList.add('hidden');
      if (drawPanel) {
        drawPanel.style.opacity = '0';
        drawPanel.style.pointerEvents = 'none';
      }

      envelopeStage?.classList.add('active');
      envelopeStage?.setAttribute('aria-hidden', 'false');

      setTimeout(() => envelopeWrap?.classList.add('open'), 350);
      setTimeout(() => {
        envelopeWrap?.classList.add('pull');
        if (drawBtn) drawBtn.textContent = '已得签';
      }, 950);
    }, 520);
  }

  function openTreeAndFind(id) {
    treeOpen = true;
    wishTreeWrap?.classList.add('is-open');
    if (galleryToggle) galleryToggle.textContent = '收起展匣';
    if (!treeTags?.children.length) renderWishTree();

    setTimeout(() => {
      treeTags?.querySelectorAll('.tree-tag').forEach(el => el.classList.remove('highlight'));
      const el = treeTags?.querySelector(`[data-id="${id}"]`);
      el?.classList.add('highlight');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
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

  function closeModal() {
    modal?.classList.remove('open');
  }

  drawBtn?.addEventListener('click', drawLot);
  vessel?.addEventListener('click', drawLot);
  vessel?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      drawLot();
    }
  });

  letterActions?.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.action === 'again') {
      resetEnvelope();
      setTimeout(drawLot, 280);
    }
    if (btn.dataset.action === 'find' && lastDrawId) {
      openTreeAndFind(lastDrawId);
    }
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

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

if (typeof window !== 'undefined') {
  window.initThingsSection = initThingsSection;
  window.THINGS_DATA = THINGS_DATA;
}
