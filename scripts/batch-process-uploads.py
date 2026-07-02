#!/usr/bin/env python3
"""批量处理上传素材：原图导出 / 原样保留。"""

from __future__ import annotations

import json
import re
import shutil
import unicodedata
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC_ORIGINAL = [
    ROOT / 'assets/uploads/1-cutout-src',
    ROOT / 'assets/uploads/2-bg-beauty-src',
]
SRC_AS_IS = ROOT / 'assets/uploads/3-as-is-src'
OUT_ORIGINAL = ROOT / 'assets/things/ui/processed/original'
OUT_AS_IS = ROOT / 'assets/things/ui/processed/as-is'
MANIFEST = ROOT / 'assets/uploads/processed-manifest.json'
PREVIEW = ROOT / 'demo_assets_preview.html'

IMG_EXT = {'.jpg', '.jpeg', '.png', '.webp'}
MAX_PX = 2000


def slug(name: str) -> str:
    name = Path(name).stem
    name = unicodedata.normalize('NFKD', name)
    name = re.sub(r'[^\w\u4e00-\u9fff-]+', '-', name).strip('-')
    return name[:48] or 'asset'


def iter_images(folder: Path):
    for p in sorted(folder.rglob('*')):
        if p.suffix.lower() in IMG_EXT and '__MACOSX' not in p.parts and p.name != '.DS_Store':
            yield p


def resize_longest(img: Image.Image, max_px: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_px:
        return img
    scale = max_px / max(w, h)
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def export_original(src: Path, out: Path) -> None:
    """仅校正方向与尺寸上限，不做色调/氛围处理。"""
    img = ImageOps.exif_transpose(Image.open(src))
    img = resize_longest(img, MAX_PX)
    out.parent.mkdir(parents=True, exist_ok=True)

    ext = src.suffix.lower()
    if ext in ('.png', '.webp') or img.mode == 'RGBA':
        out = out.with_suffix('.png')
        img.save(out, 'PNG', optimize=True)
    else:
        out = out.with_suffix('.jpg')
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img.save(out, 'JPEG', quality=92, optimize=True)


def write_preview(manifest: list[dict]) -> None:
    sections = {
        'original': ('① 原图（抠图+美化合并，未调色）', []),
        'as_is': ('② 原样保留（不需要抠图）', []),
    }
    for item in manifest:
        sections[item['category']][1].append(item)

    html_parts = [
        '<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1">',
        '<title>素材批处理预览</title>',
        '<style>',
        'body{font-family:system-ui,sans-serif;background:#f8f4ec;color:#2c241b;margin:0;padding:2rem;}',
        'h1{text-align:center;letter-spacing:.12em;font-weight:500;}',
        'h2{margin:2.5rem 0 1rem;font-size:1.1rem;letter-spacing:.1em;}',
        '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.25rem;}',
        '.card{background:#fff;border-radius:12px;padding:.75rem;box-shadow:0 4px 18px rgba(0,0,0,.06);}',
        '.thumb{width:100%;aspect-ratio:1;object-fit:contain;background:#f5f0e8;border-radius:8px;}',
        '.name{font-size:.72rem;margin:.5rem 0 0;color:#666;word-break:break-all;}',
        '.orig{font-size:.65rem;color:#999;}',
        '</style></head><body>',
        '<h1>素材批处理预览</h1>',
        f'<p style="text-align:center;color:#888">共 {len(manifest)} 张</p>',
    ]

    for _key, (title, items) in sections.items():
        if not items:
            continue
        html_parts.append(f'<h2>{title}（{len(items)} 张）</h2><div class="grid">')
        for it in items:
            rel = it['output'].replace(str(ROOT) + '/', '')
            html_parts.append(
                f'<div class="card"><img class="thumb" src="{rel}" alt="">'
                f'<p class="name">{it["name"]}</p>'
                f'<p class="orig">原：{it["source"]}</p></div>'
            )
        html_parts.append('</div>')

    html_parts.append('</body></html>')
    PREVIEW.write_text(''.join(html_parts), encoding='utf-8')


def main() -> None:
    manifest: list[dict] = []
    counter = 0

    if OUT_ORIGINAL.exists():
        shutil.rmtree(OUT_ORIGINAL)
    OUT_ORIGINAL.mkdir(parents=True)

    for folder in SRC_ORIGINAL:
        for src_path in iter_images(folder):
            counter += 1
            base = slug(src_path.name)
            ext = '.png' if src_path.suffix.lower() in ('.png', '.webp') else '.jpg'
            name = f'{counter:02d}-{base}{ext}'
            out_path = OUT_ORIGINAL / name
            print(f'[original] {src_path.name}')
            export_original(src_path, out_path)
            manifest.append({
                'category': 'original',
                'name': out_path.name,
                'source': str(src_path.relative_to(ROOT)),
                'output': str(out_path),
            })

    if OUT_AS_IS.exists():
        for src_path in iter_images(SRC_AS_IS):
            base = slug(src_path.name)
            existing = list(OUT_AS_IS.glob(f'*{base}*'))
            if not existing:
                continue
            out_file = existing[0]
            manifest.append({
                'category': 'as_is',
                'name': out_file.name,
                'source': str(src_path.relative_to(ROOT)),
                'output': str(out_file),
            })

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    write_preview(manifest)
    orig = sum(1 for m in manifest if m['category'] == 'original')
    asis = sum(1 for m in manifest if m['category'] == 'as_is')
    print(f'\nDone: original={orig}, as_is={asis} (unchanged)')
    print(f'Manifest: {MANIFEST}')
    print(f'Preview:  {PREVIEW}')


if __name__ == '__main__':
    main()
