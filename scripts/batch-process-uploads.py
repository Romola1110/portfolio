#!/usr/bin/env python3
"""批量处理上传素材：氛围背景 / 原样优化。"""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC_ATMOSPHERE = [
    ROOT / 'assets/uploads/1-cutout-src',
    ROOT / 'assets/uploads/2-bg-beauty-src',
]
SRC_AS_IS = ROOT / 'assets/uploads/3-as-is-src'
OUT_ATMOSPHERE = ROOT / 'assets/things/ui/processed/atmosphere'
OUT_AS_IS = ROOT / 'assets/things/ui/processed/as-is'
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


def resize_longest(img: Image.Image, max_px: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_px:
        return img
    scale = max_px / max(w, h)
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def analyze_atmosphere(img: Image.Image) -> dict:
    img = ImageOps.exif_transpose(img.convert('RGB'))
    small = img.resize((128, 128))
    arr = np.array(small).astype(np.float32)
    lum = float(arr.mean())
    r, g, b = arr[:, :, 0].mean(), arr[:, :, 1].mean(), arr[:, :, 2].mean()
    warmth = float(r - b)
    sat = float(np.sqrt(((arr - arr.mean(axis=(0, 1))) ** 2).mean()))

    h, w = arr.shape[:2]
    cy, cx = h / 2, w / 2
    y, x = np.ogrid[:h, :w]
    weight = np.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (0.38 * min(h, w)) ** 2)
    weighted = arr * weight[:, :, None]
    dom = (weighted.sum(axis=(0, 1)) / weight.sum()).astype(int).clip(0, 255)

    if lum < 118:
        profile = 'moody'
    elif warmth > 16 and lum > 142:
        profile = 'warm_light'
    elif warmth < -10 or b > r + 12:
        profile = 'cool'
    elif sat > 42:
        profile = 'chromatic'
    else:
        profile = 'neutral'

    return {
        'profile': profile,
        'dominant': tuple(int(v) for v in dom),
        'lum': lum,
        'warmth': warmth,
        'sat': sat,
    }


def paper_texture(size: tuple[int, int], base_rgb: tuple[int, int, int]) -> Image.Image:
    w, h = size
    base = Image.new('RGB', size, base_rgb)
    noise = Image.effect_noise((w, h), 11).convert('L')
    noise = ImageEnhance.Brightness(noise).enhance(0.32)
    tint = Image.new('RGBA', size, (*base_rgb, 255))
    paper = Image.composite(tint, base.convert('RGBA'), noise)
    draw = ImageDraw.Draw(paper)
    line = tuple(max(0, c - 28) for c in base_rgb)
    for y in range(0, h, 26):
        draw.line([(0, y), (w, y)], fill=(*line, 16), width=1)
    return paper.convert('RGBA')


def radial_layer(size: tuple[int, int], center: tuple[float, float], radius: float,
                 color: tuple[int, int, int, int]) -> Image.Image:
    w, h = size
    y, x = np.ogrid[:h, :w]
    cx, cy = center
    dist = np.sqrt(((x - cx) / radius) ** 2 + ((y - cy) / radius) ** 2)
    alpha = np.clip(1 - dist, 0, 1) ** 1.6
    layer = np.zeros((h, w, 4), dtype=np.uint8)
    layer[:, :, 0] = color[0]
    layer[:, :, 1] = color[1]
    layer[:, :, 2] = color[2]
    layer[:, :, 3] = (alpha * color[3]).astype(np.uint8)
    return Image.fromarray(layer, 'RGBA')


def soften_busy_edges(photo: Image.Image, strength: float = 0.28) -> Image.Image:
    w, h = photo.size
    y, x = np.ogrid[:h, :w]
    cx, cy = w / 2, h / 2
    dist = np.sqrt(((x - cx) / (w * 0.52)) ** 2 + ((y - cy) / (h * 0.52)) ** 2)
    mask = 1.0 - strength * np.clip((dist - 0.42) / 0.58, 0, 1)
    arr = np.array(photo.convert('RGB')).astype(np.float32)
    arr *= mask[:, :, None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def atmosphere_background(img: Image.Image, meta: dict | None = None) -> Image.Image:
    img = ImageOps.exif_transpose(img.convert('RGB'))
    meta = meta or analyze_atmosphere(img)
    profile = meta['profile']
    dom = meta['dominant']

    photo = resize_longest(img, 1400)
    photo = soften_busy_edges(photo, strength=0.24 if profile != 'moody' else 0.18)
    photo = ImageEnhance.Color(photo).enhance(0.94 if profile == 'chromatic' else 0.9)
    photo = ImageEnhance.Contrast(photo).enhance(1.05)
    photo = ImageEnhance.Brightness(photo).enhance(1.02 if profile != 'moody' else 0.98)

    w, h = photo.size
    pad = 72
    cw, ch = w + pad * 2, h + pad * 2

    palettes = {
        'warm_light': ((252, 246, 236), (255, 248, 238, 150), (255, 240, 220, 90)),
        'cool': ((242, 246, 250), (235, 242, 255, 140), (210, 225, 245, 70)),
        'moody': ((232, 226, 216), (255, 250, 242, 120), (35, 28, 22, 110)),
        'chromatic': ((248, 244, 238), (*dom, 95), (*dom, 45)),
        'neutral': ((248, 242, 232), (255, 252, 246, 130), (180, 165, 145, 55)),
    }
    paper_rgb, halo_a, halo_b = palettes[profile]
    canvas = paper_texture((cw, ch), paper_rgb)

    cx, cy = cw / 2, ch / 2 - 8
    canvas = Image.alpha_composite(canvas, radial_layer((cw, ch), (cx, cy), min(cw, ch) * 0.62, halo_a))
    if profile in ('moody', 'chromatic', 'warm_light'):
        canvas = Image.alpha_composite(canvas, radial_layer((cw, ch), (cx, cy), min(cw, ch) * 0.95, halo_b))

    shadow = Image.new('RGBA', (photo.width + 28, photo.height + 28), (0, 0, 0, 0))
    sh_color = (45, 35, 25, 48) if profile != 'moody' else (20, 16, 12, 65)
    shadow.paste(Image.new('RGBA', photo.size, sh_color), (14, 16))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))

    ox, oy = pad, pad - 6
    canvas.alpha_composite(shadow, (ox - 8, oy - 6))
    canvas.alpha_composite(photo.convert('RGBA'), (ox, oy))

    # 外缘晕：白晕 / 暗晕 / 彩色晕
    if profile == 'moody':
        edge = radial_layer((cw, ch), (cx, cy), min(cw, ch) * 0.78, (25, 20, 16, 130))
    elif profile == 'cool':
        edge = radial_layer((cw, ch), (cx, cy), min(cw, ch) * 0.82, (200, 215, 235, 75))
    elif profile == 'chromatic':
        edge = radial_layer((cw, ch), (cx, cy), min(cw, ch) * 0.85, (*dom, 60))
    else:
        edge = radial_layer((cw, ch), (cx, cy), min(cw, ch) * 0.8, (255, 252, 245, 85))
    canvas = Image.alpha_composite(canvas, edge)

    return canvas.convert('RGB')


def optimize_as_is(img: Image.Image) -> Image.Image:
    img = ImageOps.exif_transpose(img)
    img = resize_longest(img, 1600)
    if img.mode == 'RGBA':
        return img
    img = ImageEnhance.Sharpness(img).enhance(1.08)
    img = ImageEnhance.Contrast(img.convert('RGB')).enhance(1.02)
    return img


def process_atmosphere(src: Path, out: Path) -> dict:
    img = Image.open(src)
    meta = analyze_atmosphere(img)
    result = atmosphere_background(img, meta)
    out.parent.mkdir(parents=True, exist_ok=True)
    result.save(out, 'JPEG', quality=90, optimize=True)
    return meta


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
        'atmosphere': ('① 氛围背景（抠图+美化合并，按色调加晕）', []),
        'as_is': ('② 原样优化（未改动）', []),
    }
    for item in manifest:
        sections[item['category']][1].append(item)

    html_parts = [
        '<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1">',
        '<title>素材批处理预览 v2</title>',
        '<style>',
        'body{font-family:system-ui,sans-serif;background:#f8f4ec;color:#2c241b;margin:0;padding:2rem;}',
        'h1{text-align:center;letter-spacing:.12em;font-weight:500;}',
        'h2{margin:2.5rem 0 1rem;font-size:1.1rem;letter-spacing:.1em;}',
        '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.25rem;}',
        '.card{background:#fff;border-radius:12px;padding:.75rem;box-shadow:0 4px 18px rgba(0,0,0,.06);}',
        '.thumb{width:100%;aspect-ratio:1;object-fit:contain;background:#f5f0e8;border-radius:8px;}',
        '.name{font-size:.72rem;margin:.5rem 0 0;color:#666;word-break:break-all;}',
        '.orig{font-size:.65rem;color:#999;}',
        '.tag{font-size:.62rem;color:#b6afa4;margin-top:.2rem;}',
        '</style></head><body>',
        '<h1>素材批处理预览 v2</h1>',
        f'<p style="text-align:center;color:#888">共 {len(manifest)} 张</p>',
    ]

    for key, (title, items) in sections.items():
        if not items:
            continue
        html_parts.append(f'<h2>{title}（{len(items)} 张）</h2><div class="grid">')
        for it in items:
            rel = it['output'].replace(str(ROOT) + '/', '')
            tag = it.get('profile', '')
            html_parts.append(
                f'<div class="card"><img class="thumb" src="{rel}" alt="">'
                f'<p class="name">{it["name"]}</p>'
                f'<p class="orig">原：{it["source"]}</p>'
                f'{f"<p class=tag>氛围：{tag}</p>" if tag else ""}'
                f'</div>'
            )
        html_parts.append('</div>')

    html_parts.append('</body></html>')
    PREVIEW.write_text(''.join(html_parts), encoding='utf-8')


def main() -> None:
    manifest: list[dict] = []
    counter = 0

    for folder in SRC_ATMOSPHERE:
        for src_path in iter_images(folder):
            counter += 1
            name = f"{counter:02d}-{slug(src_path.name)}.jpg"
            out_path = OUT_ATMOSPHERE / name
            print(f'[atmosphere] {src_path.name}')
            meta = process_atmosphere(src_path, out_path)
            manifest.append({
                'category': 'atmosphere',
                'name': name,
                'source': str(src_path.relative_to(ROOT)),
                'output': str(out_path),
                'profile': meta['profile'],
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
    atm = sum(1 for m in manifest if m['category'] == 'atmosphere')
    asis = sum(1 for m in manifest if m['category'] == 'as_is')
    print(f'\nDone: atmosphere={atm}, as_is={asis} (unchanged)')
    print(f'Manifest: {MANIFEST}')
    print(f'Preview:  {PREVIEW}')


if __name__ == '__main__':
    main()
