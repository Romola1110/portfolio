#!/usr/bin/env python3
"""Scan assets/photos (strict per-folder) and generate photography-manifest.generated.js"""

import json
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    raise SystemExit('Pillow required')

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / 'assets' / 'photos'
CONTENT = ROOT / 'assets' / 'photo-content-analyzed.json'
OUT = ROOT / 'assets' / 'photography-manifest.generated.js'
SEASONS = ('spring', 'summer', 'autumn', 'winter')


def load_content():
    if not CONTENT.exists():
        return {}
    data = json.loads(CONTENT.read_text(encoding='utf-8'))
    out = {}
    for season in SEASONS:
        out[season] = {e['file']: e for e in data.get(season, [])}
    return out


def image_meta(path: Path):
    with Image.open(path) as im:
        w, h = im.size
    orient = 'portrait' if h > w * 1.08 else 'landscape'
    return orient, w, h


def list_folder_images(folder: Path):
    files = []
    for ext in ('*.jpg', '*.jpeg', '*.JPG', '*.png'):
        files.extend(f.name for f in folder.glob(ext))
    seen = set()
    unique = []
    for f in sorted(files):
        if f not in seen and not f.startswith('.'):
            seen.add(f)
            unique.append(f)
    return unique


def build_season(season: str, content_map: dict):
    folder = PHOTOS / season
    items = []
    for i, file in enumerate(list_folder_images(folder)):
        path = folder / file
        if not path.exists():
            continue
        orient, w, h = image_meta(path)
        meta = content_map.get(season, {}).get(file, {})
        items.append({
            'file': file,
            'title': meta.get('title', '光影'),
            'orient': orient,
            'caption': meta.get('caption', '风过处，光影留了半句未说完。'),
            'diary': meta.get('diary', meta.get('caption', '')),
            'exif': f'{w}×{h}',
        })
    return items


def main():
    content_map = load_content()
    manifest = {s: build_season(s, content_map) for s in SEASONS}
    total = sum(len(v) for v in manifest.values())
    js = '/* AUTO-GENERATED — run scripts/build-photo-manifest.py */\n'
    js += f'const PHOTO_MANIFEST_GENERATED = {json.dumps(manifest, ensure_ascii=False, indent=2)};\n'
    OUT.write_text(js, encoding='utf-8')
    for k, v in manifest.items():
        print(f'  {k}: {len(v)}')
    print(f'total: {total} -> {OUT}')


if __name__ == '__main__':
    main()
