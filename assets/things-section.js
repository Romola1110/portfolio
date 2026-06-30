/**
 * 寄情于物 — 抽签 + 展匣
 * 作用域: #things-demo 或 #things.things-v2
 */
const THINGS_DATA = [
  {
    id: 'c1',
    category: 'calligraphy',
    categoryLabel: '书法',
    name: '隶意残帖',
    nameEn: 'Fragment in Clerical Script',
    note: '临帖未完，余墨先走。',
    story: '那一笔拖得太长，像一句没说完的话。留着，反而比写完更真。',
    fortune: '墨停处，心绪已落款。',
    shape: 'wide',
    ph: 'ph-calligraphy',
    glyph: '墨',
    image: null
  },
  {
    id: 'c2',
    category: 'calligraphy',
    categoryLabel: '书法',
    name: '雨夜小楷',
    nameEn: 'Small Regular in Rain',
    note: '窗玻璃上的水痕，成了字间的行距。',
    story: '写给小楷的时间，总是比白天慢半拍。',
    fortune: '字小处，见耐心。',
    shape: '',
    ph: 'ph-calligraphy',
    glyph: '雨',
    image: null
  },
  {
    id: 'd1',
    category: 'dye',
    categoryLabel: '染卡',
    name: '暮春试色',
    nameEn: 'Late Spring Color Test',
    note: '颜料在纸上晕开，像情绪找到形状。',
    story: '本来只想试一个色，结果整张卡都成了春天的底稿。',
    fortune: '色落纸时，春已深一层。',
    shape: '',
    ph: 'ph-dye',
    glyph: '染',
    image: null
  },
  {
    id: 'd2',
    category: 'dye',
    categoryLabel: '染卡',
    name: '海盐蓝调',
    nameEn: 'Sea-salt Blues',
    note: '冷色里藏着一点暖，像冬天的回信。',
    story: '染到第三层才觉得对——急不得。',
    fortune: '深浅之间，自有分寸。',
    shape: 'wide',
    ph: 'ph-dye',
    glyph: '蓝',
    image: null
  },
  {
    id: 'b1',
    category: 'bookmark',
    categoryLabel: '书签',
    name: '银杏叶签',
    nameEn: 'Ginkgo Leaf Mark',
    note: '夹在《都柏林人》第 47 页。',
    story: '那一页讲的是一个没送出去的礼物。签子替我记得。',
    fortune: '页码深处，有人等你翻回来。',
    shape: 'tall',
    ph: 'ph-bookmark',
    glyph: '叶',
    image: null
  },
  {
    id: 'b2',
    category: 'bookmark',
    categoryLabel: '书签',
    name: '绳结纸签',
    nameEn: 'Knotted Paper Slip',
    note: '棉线绕了三圈，刚好系住思绪。',
    story: '绳结松了可以重系，有些句子不行。',
    fortune: '系紧一点，别弄丢正在读的自己。',
    shape: 'tall',
    ph: 'ph-bookmark',
    glyph: '签',
    image: null
  },
  {
    id: 'p1',
    category: 'paper',
    categoryLabel: '纸艺',
    name: '折扇小稿',
    nameEn: 'Fan Sketch',
    note: '扇骨还没上，画意先满。',
    story: '折扇合拢时，画藏在时间里；展开时，才肯给人看。',
    fortune: '收合之间，皆是风景。',
    shape: 'wide',
    ph: 'ph-paper',
    glyph: '扇',
    image: null
  },
  {
    id: 'p2',
    category: 'paper',
    categoryLabel: '纸艺',
    name: '港城明信片',
    nameEn: 'Harbour Postcard',
    note: '写了一半地址，停笔，寄给自己。',
    story: '明信片最动人的，常常是还没贴邮票的那一面。',
    fortune: '未寄出的，最懂远方。',
    shape: '',
    ph: 'ph-paper',
    glyph: '城',
    image: null
  },
  {
    id: 'p3',
    category: 'paper',
    categoryLabel: '纸艺',
    name: '手撕纸边集',
    nameEn: 'Torn-edge Collage',
    note: '毛边比直线诚实。',
    story: '撕纸那一下，往往比剪刀更听手的话。',
    fortune: '不整齐处，最像手作。',
    shape: 'wide',
    ph: 'ph-paper',
    glyph: '纸',
    image: null
  },
  {
    id: 'c3',
    category: 'calligraphy',
    categoryLabel: '书法',
    name: '信笺草稿',
    nameEn: 'Letter Draft',
    note: '写给未来的自己，字迹比语气温柔。',
    story: '删了又写，写了又删，最后留下一行：别急着长大。',
    fortune: '草稿里，住着真话。',
    shape: 'tall',
    ph: 'ph-calligraphy',
    glyph: '信',
    image: null
  },
  {
    id: 'd3',
    category: 'dye',
    categoryLabel: '染卡',
    name: '枫叶渐层',
    nameEn: 'Maple Gradient',
    note: '秋意在纸上慢慢渗透。',
    story: '这一张染了整整一个下午，窗外真的起了风。',
    fortune: '等色定，心也定。',
    shape: '',
    ph: 'ph-dye',
    glyph: '枫',
    image: null
  },
  {
    id: 'b3',
    category: 'bookmark',
    categoryLabel: '书签',
    name: '烫金细签',
    nameEn: 'Gold-foil Slip',
    note: '光落在字上，像给句子加了标点。',
    story: '烫金会脱，但某一刻的亮是真的。',
    fortune: '微光处，值得停留。',
    shape: 'tall',
    ph: 'ph-bookmark',
    glyph: '金',
    image: null
  }
];

const THINGS_FILTERS = [
  { id: 'all', label: '全部 · All' },
  { id: 'calligraphy', label: '书法' },
  { id: 'dye', label: '染卡' },
  { id: 'bookmark', label: '书签' },
  { id: 'paper', label: '纸艺' }
];

function initThingsSection(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const gallery = root.querySelector('.things-gallery');
  const filterBar = root.querySelector('.things-filter');
  const drawBtn = root.querySelector('.lottery-btn');
  const tube = root.querySelector('.lottery-tube');
  const drawCard = root.querySelector('.draw-card');
  const modal = root.querySelector('.thing-modal');

  if (!gallery) return;

  let activeFilter = 'all';
  let lastDrawId = null;

  function renderMat(item, small) {
    const innerClass = ['thing-mat-inner', item.shape].filter(Boolean).join(' ');
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
    const items = activeFilter === 'all'
      ? THINGS_DATA
      : THINGS_DATA.filter(t => t.category === activeFilter);
    gallery.innerHTML = items.map(item => `
      <div class="thing-cell" data-id="${item.id}" data-category="${item.category}">
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

  function drawLot() {
    if (!drawBtn || !drawCard) return;
    drawBtn.disabled = true;
    tube?.classList.add('shaking');

    setTimeout(() => {
      tube?.classList.remove('shaking');
      let pool = [...THINGS_DATA];
      if (pool.length > 1 && lastDrawId) {
        pool = pool.filter(t => t.id !== lastDrawId);
      }
      const item = pool[Math.floor(Math.random() * pool.length)];
      lastDrawId = item.id;

      drawCard.innerHTML = `
        ${renderMat(item, true)}
        <p class="draw-fortune">「${item.fortune}」</p>
        <p class="draw-name">${item.name} · ${item.nameEn}</p>
        <div class="draw-actions">
          <button type="button" data-action="again">再求一签</button>
          <button type="button" data-action="collect">收入展匣</button>
        </div>`;
      drawCard.classList.add('show');
      drawBtn.disabled = false;
    }, 560);
  }

  function openModal(item) {
    if (!modal) return;
    modal.innerHTML = `
      <div class="thing-modal-box">
        <button type="button" class="thing-modal-close" aria-label="关闭">×</button>
        ${renderMat(item)}
        <p class="draw-fortune" style="margin-top:0.8rem">「${item.fortune}」</p>
        <p class="modal-story">${item.story}</p>
      </div>`;
    modal.classList.add('open');
    modal.querySelector('.thing-modal-close')?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }

  function closeModal() {
    modal?.classList.remove('open');
  }

  function highlightInGallery(id) {
    gallery.querySelectorAll('.thing-cell').forEach(cell => {
      cell.classList.toggle('highlight', cell.dataset.id === id);
    });
    const el = gallery.querySelector(`[data-id="${id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  renderFilters();
  renderGallery();

  filterBar?.addEventListener('click', e => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    renderFilters();
    renderGallery();
  });

  drawBtn?.addEventListener('click', drawLot);

  drawCard?.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.action === 'again') drawLot();
    if (btn.dataset.action === 'collect' && lastDrawId) highlightInGallery(lastDrawId);
  });

  gallery.addEventListener('click', e => {
    const cell = e.target.closest('.thing-cell');
    if (!cell) return;
    const item = THINGS_DATA.find(t => t.id === cell.dataset.id);
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
