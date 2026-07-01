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
        return {}, {}
    data = json.loads(CONTENT.read_text(encoding='utf-8'))
    by_file = {}
    order = {}
    for season in SEASONS:
        entries = data.get(season, [])
        by_file[season] = {e['file']: e for e in entries}
        order[season] = [e['file'] for e in entries]
    return by_file, order


def image_meta(path: Path):
    with Image.open(path) as im:
        w, h = im.size
    orient = 'portrait' if h > w * 1.08 else 'landscape'
    return orient, w, h


def list_folder_images(folder: Path, preferred_order: list):
    on_disk = set()
    for ext in ('*.jpg', '*.jpeg', '*.JPG', '*.png'):
        on_disk.update(f.name for f in folder.glob(ext) if not f.name.startswith('.'))
    ordered = [f for f in preferred_order if f in on_disk]
    for f in sorted(on_disk):
        if f not in ordered:
            ordered.append(f)
    return ordered


def build_season(season: str, content_map: dict, content_order: dict):
    folder = PHOTOS / season
    items = []
    for file in list_folder_images(folder, content_order.get(season, [])):
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
    content_map, content_order = load_content()
    manifest = {s: build_season(s, content_map, content_order) for s in SEASONS}
    total = sum(len(v) for v in manifest.values())
    js = '/* AUTO-GENERATED — run scripts/build-photo-manifest.py */\n'
    js += f'const PHOTO_MANIFEST_GENERATED = {json.dumps(manifest, ensure_ascii=False, indent=2)};\n'
    OUT.write_text(js, encoding='utf-8')
    for k, v in manifest.items():
        print(f'  {k}: {len(v)}')
    print(f'total: {total} -> {OUT}')


if __name__ == '__main__':
    main()
