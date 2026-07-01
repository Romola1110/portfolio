#!/usr/bin/env python3
"""批量处理三类上传素材：抠图 / 美化背景 / 原样优化。"""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = {
    'cutout': ROOT / 'assets/uploads/1-cutout-src',
    'bg_beauty': ROOT / 'assets/uploads/2-bg-beauty-src',
    'as_is': ROOT / 'assets/uploads/3-as-is-src',
}
OUT = {
    'cutout': ROOT / 'assets/things/ui/processed/cutout',
    'bg_beauty': ROOT / 'assets/things/ui/processed/bg-beauty',
    'as_is': ROOT / 'assets/things/ui/processed/as-is',
}
MANIFEST = ROOT / 'assets/uploads/processed-manifest.json'
PREVIEW = ROOT / 'demo_assets_preview.html'

IMG_EXT = {'.jpg', '.jpeg', '.png', '.webp'}


def slug(name: str) -> str:
    name = Path(name).stem
    name = unicodedata.normalize('NFKD', name)
    name = re.sub(r'[^\w\u4e00-\u9fff-]+', '-', name).strip('-')
    return name[:48] or 'asset'


def iter_images(folder: Path):
    for p in sorted(folder.rglob('*')):
        if p.suffix.lower() in IMG_EXT and '__MACOSX' not in p.parts and p.name != '.DS_Store':
            yield p


def has_alpha(img: Image.Image) -> bool:
    if img.mode in ('RGBA', 'LA'):
        a = img.split()[-1]
        return a.getextrema()[0] < 250
    return False


def rembg_cutout(img: Image.Image) -> Image.Image:
    try:
        from rembg import remove
        out = remove(img.convert('RGB'))
        return out.convert('RGBA')
    except Exception:
        return pil_cutout(img)


def pil_cutout(img: Image.Image) -> Image.Image:
    img = img.convert('RGBA')
    arr = np.array(img)
    rgb = arr[:, :, :3].astype(np.float32)
    white_dist = np.sqrt(((255 - rgb) ** 2).sum(axis=2))
    alpha = np.clip((255 - white_dist) * 1.8, 0, 255).astype(np.uint8)
    arr[:, :, 3] = np.minimum(arr[:, :, 3], alpha) if has_alpha(img) else alpha
    return Image.fromarray(arr)


def add_white_fringe(img: Image.Image, blur: float = 2.8, strength: float = 0.82) -> Image.Image:
    img = img.convert('RGBA')
    edge = img.split()[-1].filter(ImageFilter.GaussianBlur(blur))
    edge_arr = np.array(edge)
    fringe = np.zeros((*edge_arr.shape, 4), dtype=np.uint8)
    fringe[:, :, :3] = 255
    fringe[:, :, 3] = np.clip(edge_arr.astype(float) * strength, 0, 255).astype(np.uint8)
    canvas = Image.new('RGBA', img.size, (0, 0, 0, 0))
    canvas = Image.alpha_composite(canvas, Image.fromarray(fringe))
    return Image.alpha_composite(canvas, img)


def trim_transparent(img: Image.Image, pad: int = 8) -> Image.Image:
    img = img.convert('RGBA')
    bbox = img.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(img.width, x1 + pad)
    y1 = min(img.height, y1 + pad)
    return img.crop((x0, y0, x1, y1))


def resize_longest(img: Image.Image, max_px: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_px:
        return img
    scale = max_px / max(w, h)
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def paper_texture(size):
    w, h = size
    base = Image.new('RGB', size, (248, 242, 232))
    noise = Image.effect_noise((w, h), 12).convert('L')
    noise = ImageEnhance.Brightness(noise).enhance(0.35)
    tint = Image.new('RGBA', size, (255, 252, 246, 255))
    paper = Image.composite(tint, base.convert('RGBA'), noise)
    draw = ImageDraw.Draw(paper)
    for y in range(0, h, 28):
        draw.line([(0, y), (w, y)], fill=(220, 205, 185, 18), width=1)
    return paper.convert('RGBA')


def beautify_background(img: Image.Image) -> Image.Image:
    img = resize_longest(img.convert('RGB'), 1400)
    w, h = img.size
    bg = paper_texture((w + 80, h + 80))
    photo = ImageOps.exif_transpose(img)
    photo = ImageEnhance.Color(photo).enhance(0.92)
    photo = ImageEnhance.Contrast(photo).enhance(1.04)
    photo = ImageEnhance.Brightness(photo).enhance(1.03)
    shadow = Image.new('RGBA', (photo.width + 24, photo.height + 24), (0, 0, 0, 0))
    sh = Image.new('RGBA', photo.size, (60, 45, 30, 55))
    shadow.paste(sh, (12, 14))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    canvas = bg.copy()
    ox, oy = 40, 36
    canvas.alpha_composite(shadow, (ox - 6, oy - 4))
    canvas.alpha_composite(photo.convert('RGBA'), (ox, oy))
    vignette = Image.new('L', canvas.size, 0)
    draw = ImageDraw.Draw(vignette)
    draw.ellipse((-40, -40, w + 120, h + 120), fill=210)
    vignette = vignette.filter(ImageFilter.GaussianBlur(30))
    dark = Image.new('RGBA', canvas.size, (40, 30, 20, 255))
    canvas = Image.composite(canvas, dark, vignette)
    return canvas.convert('RGB')


def optimize_as_is(img: Image.Image) -> Image.Image:
    img = ImageOps.exif_transpose(img)
    img = resize_longest(img, 1600)
    if img.mode == 'RGBA':
        return img
    img = ImageEnhance.Sharpness(img).enhance(1.08)
    img = ImageEnhance.Contrast(img.convert('RGB')).enhance(1.02)
    return img


def process_cutout(src: Path, out: Path) -> None:
    img = Image.open(src)
    if has_alpha(img):
        cut = img.convert('RGBA')
    else:
        cut = rembg_cutout(img)
    cut = trim_transparent(cut)
    cut = add_white_fringe(cut)
    cut = resize_longest(cut, 1200)
    out.parent.mkdir(parents=True, exist_ok=True)
    cut.save(out, 'PNG', optimize=True)


def process_bg_beauty(src: Path, out: Path) -> None:
    img = beautify_background(Image.open(src))
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, 'JPEG', quality=88, optimize=True)


def process_as_is(src: Path, out: Path) -> None:
    img = optimize_as_is(Image.open(src))
    out.parent.mkdir(parents=True, exist_ok=True)
    ext = src.suffix.lower()
    if ext in ('.png', '.webp') or img.mode == 'RGBA':
        out = out.with_suffix('.png')
        img.save(out, 'PNG', optimize=True)
    else:
        out = out.with_suffix('.jpg')
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img.save(out, 'JPEG', quality=90, optimize=True)


def write_preview(manifest: list[dict]) -> None:
    sections = {
        'cutout': ('① 直接抠图（透明 PNG + 毛边白边）', []),
        'bg_beauty': ('② 美化背景（纸质衬底，不抠图）', []),
        'as_is': ('③ 原样优化（压缩/锐化）', []),
    }
    for item in manifest:
        sections[item['category']][1].append(item)

    html_parts = ['<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="UTF-8">',
                '<meta name="viewport" content="width=device-width,initial-scale=1">',
                '<title>素材批处理预览</title>',
                '<style>',
                'body{font-family:system-ui,sans-serif;background:#f8f4ec;color:#2c241b;margin:0;padding:2rem;}',
                'h1{text-align:center;letter-spacing:.12em;font-weight:500;}',
                'h2{margin:2.5rem 0 1rem;font-size:1.1rem;letter-spacing:.1em;}',
                '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.25rem;}',
                '.card{background:#fff;border-radius:12px;padding:.75rem;box-shadow:0 4px 18px rgba(0,0,0,.06);}',
                '.thumb{width:100%;aspect-ratio:1;object-fit:contain;background:repeating-conic-gradient(#eee 0% 25%,#f8f8f8 0% 50%) 50%/20px 20px;border-radius:8px;}',
                '.name{font-size:.72rem;margin:.5rem 0 0;color:#666;word-break:break-all;}',
                '.orig{font-size:.65rem;color:#999;}',
                '</style></head><body>',
                '<h1>素材批处理预览</h1>',
                '<p style="text-align:center;color:#888">共处理 ', str(len(manifest)), ' 张</p>']

    for key, (title, items) in sections.items():
        html_parts.append(f'<h2>{title}（{len(items)} 张）</h2><div class="grid">')
        for it in items:
            rel = it['output'].replace(str(ROOT) + '/', '')
            html_parts.append(
                f'<div class="card"><img class="thumb" src="{rel}" alt="">'
                f'<p class="name">{it["name"]}</p>'
                f'<p class="orig">原文件：{it["source"]}</p></div>'
            )
        html_parts.append('</div>')

    html_parts.append('</body></html>')
    PREVIEW.write_text(''.join(html_parts), encoding='utf-8')


def main() -> None:
    manifest: list[dict] = []
    counters = {'cutout': 0, 'bg_beauty': 0, 'as_is': 0}

    for src_path in iter_images(SRC['cutout']):
        counters['cutout'] += 1
        name = f"{counters['cutout']:02d}-{slug(src_path.name)}.png"
        out_path = OUT['cutout'] / name
        print(f'[cutout] {src_path.name}')
        process_cutout(src_path, out_path)
        manifest.append({
            'category': 'cutout',
            'name': name,
            'source': str(src_path.relative_to(ROOT)),
            'output': str(out_path),
        })

    for src_path in iter_images(SRC['bg_beauty']):
        counters['bg_beauty'] += 1
        name = f"{counters['bg_beauty']:02d}-{slug(src_path.name)}.jpg"
        out_path = OUT['bg_beauty'] / name
        print(f'[bg-beauty] {src_path.name}')
        process_bg_beauty(src_path, out_path)
        manifest.append({
            'category': 'bg_beauty',
            'name': name,
            'source': str(src_path.relative_to(ROOT)),
            'output': str(out_path),
        })

    for src_path in iter_images(SRC['as_is']):
        counters['as_is'] += 1
        base = f"{counters['as_is']:02d}-{slug(src_path.name)}"
        out_path = OUT['as_is'] / base
        print(f'[as-is] {src_path.name}')
        process_as_is(src_path, out_path)
        out_file = next(OUT['as_is'].glob(base + '.*'))
        manifest.append({
            'category': 'as_is',
            'name': out_file.name,
            'source': str(src_path.relative_to(ROOT)),
            'output': str(out_file),
        })

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    write_preview(manifest)
    print(f'\nDone: cutout={counters["cutout"]}, bg_beauty={counters["bg_beauty"]}, as_is={counters["as_is"]}')
    print(f'Manifest: {MANIFEST}')
    print(f'Preview:  {PREVIEW}')


if __name__ == '__main__':
    main()
