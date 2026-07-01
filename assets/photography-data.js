/* 四时摄影 · 数据（图片路径 assets/photos/{season}/01.jpg … 20.jpg） */
const PHOTO_SEASONS = {
  spring: {
    key: 'spring',
    label: '春 · 花信',
    en: 'Spring',
    hue: '142, 168, 136'
  },
  summer: {
    key: 'summer',
    label: '夏 · 长风',
    en: 'Summer',
    hue: '72, 140, 104'
  },
  autumn: {
    key: 'autumn',
    label: '秋 · 落木',
    en: 'Autumn',
    hue: '192, 107, 42'
  },
  winter: {
    key: 'winter',
    label: '冬 · 藏雪',
    en: 'Winter',
    hue: '138, 155, 184'
  }
};

const PHOTO_TITLES = {
  spring: ['雨夜', '港城', '花信', '晨光', '归途', '檐角', '浅绿', '云隙', '小径', '蝶影', '溪声', '纸鸢', '苔痕', '风铃', '初绽', '霁色', '远钟', '游园', '杏雨', '新枝'],
  summer: ['长风', '荷影', '午阴', '蝉鸣', '江流', '骤雨', '夕照', '竹露', '莲塘', '云涛', '渡口', '萤火', '麦浪', '疏星', '晚舟', '雷前', '水镜', '浓绿', '潮声', '夜泳'],
  autumn: ['落木', '霜枝', '归雁', '柿红', '石径', '晚钟', '篱菊', '远山', '桂香', '残荷', '牧笛', '枫桥', '薄雾', '晒场', '故园', '西风', '雁字', '茶烟', '黄叶', '静水'],
  winter: ['藏雪', '寒枝', '炉边', '素影', '冰河', '晨霜', '孤灯', '雪径', '远山', '枯荷', '暮鸦', '窗雪', '冷月', '呵气', '腊梅', '空庭', '纸窗', '薄暝', '归人', '岁暮']
};

const PHOTO_CAPTIONS = [
  '岁月未竟，光影尚存',
  '风物有信，四时皆书',
  '一瞬成诗，万象无声',
  '镜头深处，有风经过',
  '光阴在帧里轻轻落脚',
  '墨色渐散，景致自明',
  '山河入镜，心事微澜',
  '静看流转，如墨入水',
  '半卷光影，满纸清寒',
  '此间风物，皆可入画',
  '行到水穷，坐看云起',
  '人间烟火，亦是风景',
  '浅照浮生，深留一念',
  '光落檐角，梦醒时分',
  '拾一片影，藏一季声',
  '镜头不语，岁月作答',
  '远意近收，都在光里',
  '风起时，画面有了呼吸',
  '片刻凝驻，长久回响',
  '四时轮转，光影为证'
];

const PHOTO_ORIENT_PATTERN = [
  'landscape', 'landscape', 'portrait', 'landscape', 'portrait',
  'portrait', 'landscape', 'portrait', 'landscape', 'landscape',
  'landscape', 'portrait', 'landscape', 'portrait', 'landscape',
  'portrait', 'landscape', 'landscape', 'portrait', 'landscape'
];

const PHOTO_DIARY = [
  '那日有风，帘角微动，便按下快门。',
  '雨停之后，路面映出碎金般的天光。',
  '在旧巷口徘徊许久，只为等这一束斜照。',
  '镜头里留着未说完的话，像晾着的字笺。',
  '光落檐角，梦醒时分，恰好路过。',
  '行到水穷，云起时按下一张。',
  '薄暮将至，色彩忽然变得温柔。',
  '想留住风经过树叶的那一秒。',
  '远处有钟，近处是静默的影。',
  '此间风物，皆出自我手与眼。',
  '冬日午后，炉边光影极淡极长。',
  '春信来时，枝头先绿了一寸。',
  '夏夜潮声远，近处只剩路灯。',
  '秋深叶落，石径上响着细碎声。',
  '港城夜雨，霓虹在水面揉碎。',
  '游园偶得，不贵重，却想分享。',
  '纸窗透进半阙月色，便足矣。',
  '苔痕上阶绿，镜头比诗更慢。',
  '风起时，画面忽然有了呼吸。',
  '片刻凝驻，长久回响。'
];

function padPhotoId(n) {
  return String(n).padStart(2, '0');
}

function photoLocalSrc(season, id) {
  return `assets/photos/${season}/${padPhotoId(id)}.jpg`;
}

function photoFallbackSrc(season, id, orient) {
  if (orient === 'portrait') {
    return `https://picsum.photos/seed/${season}-${id}/400/520`;
  }
  return `https://picsum.photos/seed/${season}-${id}/520/400`;
}

function buildPhotoItems(season) {
  const titles = PHOTO_TITLES[season] || [];
  return titles.map((title, i) => {
    const id = i + 1;
    const orient = PHOTO_ORIENT_PATTERN[i % PHOTO_ORIENT_PATTERN.length];
    const aspect = orient === 'portrait' ? 1.28 : 0.75;
    return {
      id,
      season,
      title,
      caption: PHOTO_CAPTIONS[i % PHOTO_CAPTIONS.length],
      diary: PHOTO_DIARY[i % PHOTO_DIARY.length],
      exif: `f/${(1.8 + (i % 4) * 0.7).toFixed(1)} · 1/${200 + i * 17}s · ISO ${100 + (i % 5) * 100} · ${28 + (i % 3) * 7}mm`,
      orient,
      aspect,
      src: photoLocalSrc(season, id),
      fallback: photoFallbackSrc(season, id, orient)
    };
  });
}

const PHOTO_GALLERY_DATA = Object.fromEntries(
  Object.keys(PHOTO_SEASONS).map(key => [key, buildPhotoItems(key)])
);

if (typeof window !== 'undefined') {
  window.PHOTO_SEASONS = PHOTO_SEASONS;
  window.PHOTO_GALLERY_DATA = PHOTO_GALLERY_DATA;
  window.photoFallbackSrc = photoFallbackSrc;
}
