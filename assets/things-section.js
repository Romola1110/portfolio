/**
 * 寄情于物 v2 — 驻足门厅 · 赠礼 · 展匣
 */
const THINGS_DATA = [
  {
    id: 'c1', category: 'calligraphy', categoryLabel: '书法',
    name: '隶意残帖', nameEn: 'A Fragment in Clerical Ink',
    note: '临帖未完，余墨先走。',
    story: '那一笔拖得太长，像一句没说完的话。我留着它，像留一扇半掩的门。',
    verse: '墨停处，风也轻了半寸。',
    shape: 'wide', ph: 'ph-calligraphy', glyph: '墨',
    image: null, matStyle: 'cutout'
  },
  {
    id: 'c2', category: 'calligraphy', categoryLabel: '书法',
    name: '雨夜小楷', nameEn: 'Small Script, Rainy Night',
    note: '窗上的水痕，成了字距。',
    story: '小楷要慢。那晚窗外有雨，我便写得更慢。',
    verse: '字越小，心越静。',
    ph: 'ph-calligraphy', glyph: '雨', image: null, matStyle: 'cutout'
  },
  {
    id: 'd1', category: 'dye', categoryLabel: '染卡',
    name: '暮春试色', nameEn: 'Late Spring, First Wash',
    note: '颜料晕开，像情绪找到形状。',
    story: '本想试一抹色，整张卡却先绿了起来。',
    verse: '春色不必满纸，一点就够。',
    ph: 'ph-dye', glyph: '染', image: null, matStyle: 'soft'
  },
  {
    id: 'd2', category: 'dye', categoryLabel: '染卡',
    name: '海盐蓝调', nameEn: 'Sea-salt Blues',
    note: '冷色里藏着一点暖。',
    story: '染到第三遍，才觉得像海边的风。',
    verse: '深浅之间，自有分寸。',
    shape: 'wide', ph: 'ph-dye', glyph: '蓝', image: null, matStyle: 'soft'
  },
  {
    id: 'b1', category: 'bookmark', categoryLabel: '书签',
    name: '银杏叶签', nameEn: 'Ginkgo Leaf Mark',
    note: '夹在书页之间，替思绪留住页码。',
    story: '那片叶子是在校园里捡的。书翻到哪一页，它就在哪一页等我。',
    verse: '翻页时，请轻一点。',
    shape: 'tall', ph: 'ph-bookmark', glyph: '叶', image: null, matStyle: 'cutout'
  },
  {
    id: 'b2', category: 'bookmark', categoryLabel: '书签',
    name: '绳结纸签', nameEn: 'Knotted Paper Slip',
    note: '棉线绕了三圈。',
    story: '绳结可以重系，有些句子却不能。',
    verse: '系紧一点，别弄丢正在读的自己。',
    shape: 'tall', ph: 'ph-bookmark', glyph: '签', image: null, matStyle: 'cutout'
  },
  {
    id: 'p1', category: 'paper', categoryLabel: '纸艺',
    name: '折扇小稿', nameEn: 'Fan Sketch',
    note: '扇骨未上，画意先满。',
    story: '折扇合拢时，画藏在时间里；展开时，才肯给人看。',
    verse: '收合之间，皆是风景。',
    shape: 'wide', ph: 'ph-paper', glyph: '扇', image: null, matStyle: 'cutout'
  },
  {
    id: 'p2', category: 'paper', categoryLabel: '纸艺',
    name: '港城明信片', nameEn: 'Harbour Postcard',
    note: '写了一半地址，寄给自己。',
    story: '最动人的明信片，常常是还没贴邮票的那一面。',
    verse: '未寄出的，最懂远方。',
    ph: 'ph-paper', glyph: '城', image: null, matStyle: 'soft'
  },
  {
    id: 'p3', category: 'paper', categoryLabel: '纸艺',
    name: '手撕纸边集', nameEn: 'Torn-edge Collage',
    note: '毛边比直线诚实。',
    story: '撕纸那一下，往往比剪刀更听手的话。',
    verse: '不整齐处，最像手作。',
    shape: 'wide', ph: 'ph-paper', glyph: '纸', image: null, matStyle: 'soft'
  },
  {
    id: 'c3', category: 'calligraphy', categoryLabel: '书法',
    name: '信笺草稿', nameEn: 'Letter Draft',
    note: '写给未来的自己。',
    story: '删了又写，最后留下一行：别急着长大。',
    verse: '草稿里，住着真话。',
    shape: 'tall', ph: 'ph-calligraphy', glyph: '信', image: null, matStyle: 'cutout'
  },
  {
    id: 'd3', category: 'dye', categoryLabel: '染卡',
    name: '枫叶渐层', nameEn: 'Maple Gradient',
    note: '秋意在纸上慢慢渗透。',
    story: '这一张染了一个下午，窗外真的起了风。',
    verse: '等色定，心也定。',
    ph: 'ph-dye', glyph: '枫', image: null, matStyle: 'soft'
  },
  {
    id: 'b3', category: 'bookmark', categoryLabel: '书签',
    name: '烫金细签', nameEn: 'Gold-foil Slip',
    note: '光落在字上，像加了标点。',
    story: '烫金会脱，但某一瞬的亮是真的。',
    verse: '微光处，值得停留。',
    shape: 'tall', ph: 'ph-bookmark', glyph: '金', image: null, matStyle: 'cutout'
  }
];

const THINGS_FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'calligraphy', label: '书法' },
  { id: 'dye', label: '染卡' },
  { id: 'bookmark', label: '书签' },
  { id: 'paper', label: '纸艺' }
];

function initThingsSection(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const enterBtn = root.querySelector('.things-enter-btn');
  const inner = root.querySelector('.things-inner');
  const galleryWrap = root.querySelector('.things-gallery-wrap');
  const galleryToggle = root.querySelector('.gallery-toggle-btn');
  const gallery = root.querySelector('.things-gallery');
  const filterBar = root.querySelector('.things-filter');
  const giftBox = root.querySelector('.gift-box-wrap');
  const giftOpenBtn = root.querySelector('.gift-open-btn');
  const giftReveal = root.querySelector('.gift-reveal');
  const modal = root.querySelector('.thing-modal');

  let activeFilter = 'all';
  let lastGiftId = null;
  let galleryOpen = false;

  function renderMat(item) {
    const innerClass = ['thing-mat-inner', item.shape, item.matStyle === 'cutout' ? 'mat-cutout' : item.matStyle === 'soft' ? 'mat-soft' : ''].filter(Boolean).join(' ');
    const imgHtml = item.image
      ? `<img src="${item.image}" alt="${item.name}" loading="lazy">`
      : `<div class="thing-placeholder ${item.ph}">${item.glyph}</div>`;
    return `
      <div class="thing-mat" data-id="${item.id}">
        <div class="${innerClass}">
          <span class="thing-mat-tag">${item.categoryLabel}</span>
          ${imgHtml}
        </div>
        <div class="thing-mat-foot">
          <div class="name">${item.name}</div>
          <div class="note">${item.note}</div>
        </div>
      </div>`;
  }

  function renderGallery() {
    if (!gallery) return;
    const items = activeFilter === 'all' ? THINGS_DATA : THINGS_DATA.filter(t => t.category === activeFilter);
    gallery.innerHTML = items.map(item => `
      <div class="thing-cell" data-id="${item.id}">
        ${renderMat(item)}
      </div>
    `).join('');
  }

  function renderFilters() {
    if (!filterBar) return;
    filterBar.innerHTML = THINGS_FILTERS.map(f => `
      <button type="button" class="filter-chip${f.id === activeFilter ? ' active' : ''}" data-filter="${f.id}">${f.label}</button>
    `).join('');
  }

  function unwrapGift() {
    if (!giftReveal) return;
    giftBox?.classList.add('unwrapping');
    if (giftOpenBtn) giftOpenBtn.disabled = true;

    setTimeout(() => {
      let pool = [...THINGS_DATA];
      if (pool.length > 1 && lastGiftId) pool = pool.filter(t => t.id !== lastGiftId);
      const item = pool[Math.floor(Math.random() * pool.length)];
      lastGiftId = item.id;

      giftReveal.innerHTML = `
        ${renderMat(item)}
        <p class="gift-verse">「${item.verse}」</p>
        <p class="gift-item-name">${item.name}</p>
        <div class="gift-actions">
          <button type="button" data-action="another">换一份赠礼</button>
          <button type="button" data-action="find">在展匣中寻它</button>
        </div>`;
      giftReveal.classList.add('show');
      if (giftOpenBtn) {
        giftOpenBtn.textContent = '已拆开';
        giftOpenBtn.disabled = false;
      }
      giftBox?.classList.remove('unwrapping');
    }, 680);
  }

  function resetGiftBox() {
    giftBox?.classList.remove('unwrapping');
    giftReveal?.classList.remove('show');
    if (giftOpenBtn) giftOpenBtn.textContent = '轻轻拆开';
  }

  function openGalleryAndFind(id) {
    if (!galleryWrap) return;
    galleryOpen = true;
    galleryWrap.classList.add('is-open');
    if (galleryToggle) galleryToggle.textContent = '收起展匣';
    renderGallery();
    setTimeout(() => {
      const el = gallery?.querySelector(`[data-id="${id}"]`);
      el?.classList.add('highlight');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  function openModal(item) {
    if (!modal) return;
    modal.innerHTML = `
      <div class="thing-modal-box">
        <button type="button" class="thing-modal-close" aria-label="关闭">×</button>
        ${renderMat(item)}
        <p class="gift-verse">「${item.verse}」</p>
        <p class="modal-story">${item.story}</p>
      </div>`;
    modal.classList.add('open');
    modal.querySelector('.thing-modal-close')?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }

  function closeModal() { modal?.classList.remove('open'); }

  enterBtn?.addEventListener('click', () => {
    inner?.classList.add('is-open');
    enterBtn.style.display = 'none';
    root.querySelector('.things-enter-hint')?.style.setProperty('display', 'none');
  });

  galleryToggle?.addEventListener('click', () => {
    galleryOpen = !galleryOpen;
    galleryWrap?.classList.toggle('is-open', galleryOpen);
    galleryToggle.textContent = galleryOpen ? '收起展匣' : '展开展匣，慢慢翻阅';
    if (galleryOpen) {
      renderFilters();
      renderGallery();
    }
  });

  giftOpenBtn?.addEventListener('click', () => {
    if (giftReveal?.classList.contains('show')) resetGiftBox();
    else unwrapGift();
  });

  giftBox?.addEventListener('click', () => {
    if (!giftReveal?.classList.contains('show')) unwrapGift();
  });

  giftReveal?.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.action === 'another') {
      resetGiftBox();
      setTimeout(unwrapGift, 200);
    }
    if (btn.dataset.action === 'find' && lastGiftId) openGalleryAndFind(lastGiftId);
  });

  filterBar?.addEventListener('click', e => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    renderFilters();
    renderGallery();
  });

  gallery?.addEventListener('click', e => {
    const cell = e.target.closest('.thing-cell');
    if (!cell) return;
    const item = THINGS_DATA.find(t => t.id === cell.dataset.id);
    if (item) openModal(item);
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

if (typeof window !== 'undefined') {
  window.initThingsSection = initThingsSection;
  window.THINGS_DATA = THINGS_DATA;
}
