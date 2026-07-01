/* 四时摄影 · 数据（manifest 由 scripts/build-photo-manifest.py 生成） */

const PHOTO_SEASON_ORDER = ['all', 'spring', 'summer', 'autumn', 'winter'];

const PHOTO_SEASONS = {
  all:    { key: 'all',    label: '全部', hue: '118, 98, 78',  motif: 'all' },
  spring: { key: 'spring', label: '春',   hue: '218, 168, 178', motif: 'spring' },
  summer: { key: 'summer', label: '夏',   hue: '98, 158, 128',  motif: 'summer' },
  autumn: { key: 'autumn', label: '秋',   hue: '198, 118, 72',  motif: 'autumn' },
  winter: { key: 'winter', label: '归藏', hue: '138, 152, 182', motif: 'winter' }
};

const PHOTO_MANIFEST = (typeof PHOTO_MANIFEST_GENERATED !== 'undefined')
  ? PHOTO_MANIFEST_GENERATED
  : { spring: [], summer: [], autumn: [], winter: [] };

const PHOTO_TITLES = {
  spring: ['雨夜', '港城', '花信', '晨光', '归途'],
  summer: ['长风', '荷影', '午阴', '蝉鸣', '江流'],
  autumn: ['落木', '霜枝', '归雁', '柿红', '石径'],
  winter: ['藏雪', '寒枝', '炉边', '素影', '冰河']
};

const PHOTO_CAPTIONS = [
  '风过处，光影留了半句未说完。', '不必惊动，这一刻刚好经过。', '镜头很轻，心事很重。',
  '四时流转，都在这一帧里。', '像晾着的字笺，等一个人来读。'
];

const PHOTO_ORIENT_PATTERN = [
  'landscape', 'landscape', 'portrait', 'landscape', 'portrait',
  'portrait', 'landscape', 'portrait', 'landscape', 'landscape'
];

const PHOTO_DIARY = [
  '那日有风，帘角微动，便按下快门。', '雨停之后，路面映出碎金般的天光。',
  '在旧巷口徘徊许久，只为等这一束斜照。', '薄暮将至，色彩忽然变得温柔。',
  '片刻凝驻，长久回响。'
];

function photoLocalSrc(season, file) {
  return `assets/photos/${season}/${file}`;
}

function photoFallbackSrc(season, seed, orient) {
  if (orient === 'portrait') return `https://picsum.photos/seed/${season}-${seed}/400/520`;
  return `https://picsum.photos/seed/${season}-${seed}/520/400`;
}

function titleFromFilename(file) {
  return file.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').slice(0, 2) || '光影';
}

function normalizeManifestEntry(entry, i, season) {
  const file = typeof entry === 'string' ? entry : entry.file;
  const orient = (typeof entry === 'object' && entry.orient)
    || PHOTO_ORIENT_PATTERN[i % PHOTO_ORIENT_PATTERN.length];
  const aspect = orient === 'portrait' ? 1.28 : 0.75;
  return {
    id: i + 1,
    season,
    file,
    title: (typeof entry === 'object' && entry.title) || titleFromFilename(file),
    caption: (typeof entry === 'object' && entry.caption) || PHOTO_CAPTIONS[i % PHOTO_CAPTIONS.length],
    diary: (typeof entry === 'object' && entry.diary) || PHOTO_DIARY[i % PHOTO_DIARY.length],
    exif: (typeof entry === 'object' && entry.exif) || '',
    orient,
    aspect,
    src: photoLocalSrc(season, file),
    fallback: photoFallbackSrc(season, `${file}-${i}`, orient)
  };
}

function buildDemoItems(season) {
  const titles = PHOTO_TITLES[season] || [];
  return titles.map((title, i) => {
    const file = `${String(i + 1).padStart(2, '0')}.jpg`;
    return normalizeManifestEntry({ file, title }, i, season);
  });
}

function buildSeasonItems(season) {
  const manifest = PHOTO_MANIFEST[season] || [];
  if (manifest.length) return manifest.map((e, i) => normalizeManifestEntry(e, i, season));
  return buildDemoItems(season);
}

function buildPhotoItems(season) {
  if (season === 'all') {
    return PHOTO_SEASON_ORDER.filter(k => k !== 'all').flatMap(buildSeasonItems);
  }
  return buildSeasonItems(season);
}

const PHOTO_GALLERY_DATA = Object.fromEntries(
  PHOTO_SEASON_ORDER.map(key => [key, buildPhotoItems(key)])
);

if (typeof window !== 'undefined') {
  window.PHOTO_SEASON_ORDER = PHOTO_SEASON_ORDER;
  window.PHOTO_SEASONS = PHOTO_SEASONS;
  window.PHOTO_MANIFEST = PHOTO_MANIFEST;
  window.PHOTO_GALLERY_DATA = PHOTO_GALLERY_DATA;
  window.buildPhotoItems = buildPhotoItems;
}
