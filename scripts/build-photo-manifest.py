#!/usr/bin/env python3
"""Scan assets/photos and generate photography-manifest.generated.js"""

import json
import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    raise SystemExit('Pillow required')

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / 'assets' / 'photos'
OUT = ROOT / 'assets' / 'photography-manifest.generated.js'

TITLE_POOL = {
    'spring': '花信 晨光 归途 檐角 浅绿 云隙 小径 蝶影 溪声 纸鸢 苔痕 风铃 初绽 霁色 远钟 游园 杏雨 新枝 雨幕 溪桥 岸柳 桃瓣 竹影 莺声 暮归 浅汀 飞花 弄影 寻幽 朝露'.split(),
    'summer': '荷影 午阴 蝉鸣 江流 骤雨 夕照 竹露 莲塘 云涛 渡口 萤火 麦浪 疏星 晚舟 水镜 浓绿 潮声 夜泳 长风 炎光 树影 流云 晚风 烟波 汀洲 霁野 听澜 望海 疏钟'.split(),
    'autumn': '落木 霜枝 归雁 柿红 石径 晚钟 篱菊 远山 桂香 残荷 牧笛 枫桥 薄雾 晒场 故园 西风 茶烟 黄叶 静水 雁字 秋声 枯藤 晚照 山行 樵歌 柿熟 月白 雁归 霜降 篱落'.split(),
    'winter': '藏雪 寒枝 炉边 素影 冰河 晨霜 孤灯 雪径 暮鸦 窗雪 冷月 腊梅 空庭 薄暝 归人 岁暮 雪意 静听 远山 炊烟 呵气 纸窗 寒夜 炉暖 素心 归途 听雪 留白 疏星 晚灯'.split(),
}

CAPTION_POOL = [
    '风过处，光影留了半句未说完。',
    '不必惊动，这一刻刚好经过。',
    '镜头很轻，心事很重。',
    '四时流转，都在这一帧里。',
    '像晾着的字笺，等一个人来读。',
    '光落檐角，梦醒时分。',
    '山河不远，近处也有诗意。',
    '片刻凝驻，长久回响。',
    '墨色渐散，景致自明。',
    '行到水穷，坐看云起。',
    '人间烟火，亦是风景。',
    '浅照浮生，深留一念。',
    '风起时，画面有了呼吸。',
    '此间风物，皆可入画。',
    '岁月未竟，光影尚存。',
]

DIARY_POOL = [
    '那日有风，帘角微动，便按下快门。',
    '雨停之后，路面映出碎金般的天光。',
    '在旧巷口徘徊许久，只为等这一束斜照。',
    '薄暮将至，色彩忽然变得温柔。',
    '想留住风经过树叶的那一秒。',
    '远处有钟，近处是静默的影。',
    '纸窗透进半阙月色，便足矣。',
    '风起时，画面忽然有了呼吸。',
    '片刻凝驻，长久回响。',
    '此间每一道光影，皆愿与你分享。',
]


def image_meta(path: Path):
    with Image.open(path) as im:
        w, h = im.size
    orient = 'portrait' if h > w * 1.08 else 'landscape'
    return orient, w, h


def build_season(season: str):
    folder = PHOTOS / season
    files = sorted(f.name for f in folder.glob('*.jpg'))
    files += sorted(f.name for f in folder.glob('*.jpeg'))
    files += sorted(f.name for f in folder.glob('*.JPG'))
    files += sorted(f.name for f in folder.glob('*.png'))
    seen = set()
    unique = []
    for f in files:
        if f not in seen and not f.startswith('.'):
            seen.add(f)
            unique.append(f)
    titles = TITLE_POOL[season]
    items = []
    for i, file in enumerate(unique):
        path = folder / file
        if not path.exists():
            continue
        orient, w, h = image_meta(path)
        items.append({
            'file': file,
            'title': titles[i % len(titles)],
            'orient': orient,
            'caption': CAPTION_POOL[i % len(CAPTION_POOL)],
            'diary': DIARY_POOL[i % len(DIARY_POOL)],
            'exif': f'{w}×{h}',
        })
    return items


def main():
    manifest = {s: build_season(s) for s in ('spring', 'summer', 'autumn', 'winter')}
    total = sum(len(v) for v in manifest.values())
    js = '/* AUTO-GENERATED — run scripts/build-photo-manifest.py */\n'
    js += f'const PHOTO_MANIFEST_GENERATED = {json.dumps(manifest, ensure_ascii=False, indent=2)};\n'
    OUT.write_text(js, encoding='utf-8')
    for k, v in manifest.items():
        print(f'  {k}: {len(v)}')
    print(f'total: {total} -> {OUT}')


if __name__ == '__main__':
    main()
