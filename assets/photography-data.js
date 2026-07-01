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
};

const PHOTO_ASPECTS = [0.72, 0.85, 1.0, 1.15, 1.28, 0.78, 0.92, 1.08, 1.22, 0.88];

function padPhotoId(n) {
  return String(n).padStart(2, '0');
}

function photoLocalSrc(season, id) {
  return `assets/photos/${season}/${padPhotoId(id)}.jpg`;
}

function photoFallbackSrc(season, id, aspect) {
  const h = Math.round(600 * aspect);
  return `https://picsum.photos/seed/${season}-${id}/600/${h}`;
}

function buildPhotoItems(season) {
  const titles = PHOTO_TITLES[season] || [];
  return titles.map((title, i) => {
    const id = i + 1;
    const aspect = PHOTO_ASPECTS[i % PHOTO_ASPECTS.length];
    return {
      id,
      season,
      title,
      caption: PHOTO_CAPTIONS[i % PHOTO_CAPTIONS.length],
      aspect,
      src: photoLocalSrc(season, id),
      fallback: photoFallbackSrc(season, id, aspect)
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
