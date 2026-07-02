#!/usr/bin/env python3
"""从 GitHub 上传原图生成物有灵犀精确素材。"""

from __future__ import annotations

import json
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps
from rembg import remove

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets/things/ui'
CURTAIN_OUT = OUT / 'curtain'

SRC_BUCKET = ROOT / '签筒2.png'
SRC_PATTERN = ROOT / '暗纹素材.png'
SRC_CURTAIN = ROOT / '垂帘参考 加千纸鹤和风铃.png'
PATTERN_MAX = 640


def save_png(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    img.save(path, 'PNG', optimize=True)
    print(f'wrote {path.relative_to(ROOT)} ({img.size[0]}x{img.size[1]})')


def resize_longest(img: Image.Image, max_px: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_px:
        return img
    s = max_px / max(w, h)
    return img.resize((int(w * s), int(h * s)), Image.Resampling.LANCZOS)


def paper_grid_patch(w: int, h: int) -> Image.Image:
    tile = Image.new('RGBA', (w, h), (246, 238, 224, 255))
    draw = ImageDraw.Draw(tile)
    step = 6
    col = (205, 190, 165, 110)
    for x in range(0, w, step):
        draw.line([(x, 0), (x, h)], fill=col, width=1)
    for y in range(0, h, step):
        draw.line([(0, y), (w, y)], fill=col, width=1)
    draw.ellipse((w * 0.3, h * 0.08, w * 0.7, h * 0.32), fill=(232, 185, 170, 45))
    return tile.filter(ImageFilter.GaussianBlur(0.4))


def process_bucket() -> None:
    img = Image.open(SRC_BUCKET).convert('RGBA')
    w, h = img.size
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    # 签筒2：左右两支「花签」字区
    for box in [(0.17, 0.34, 0.30, 0.58), (0.70, 0.34, 0.83, 0.58)]:
        x0, y0 = int(w * box[0]), int(h * box[1])
        x1, y1 = int(w * box[2]), int(h * box[3])
        patch = paper_grid_patch(x1 - x0, y1 - y0)
        overlay.paste(patch, (x0, y0), patch)
    composed = Image.alpha_composite(img, overlay)
    cut = remove(composed)
    if isinstance(cut, bytes):
        cut = Image.open(BytesIO(cut)).convert('RGBA')
    bbox = cut.split()[-1].getbbox()
    if bbox:
        cut = cut.crop(bbox)
    save_png(cut, OUT / 'lot-bucket-2.png')


def fade_half(img: Image.Image, side: str) -> Image.Image:
    arr = np.array(img).astype(np.float32)
    ww = arr.shape[1]
    for x in range(ww):
        t = x / max(ww - 1, 1)
        fade = t if side == 'left' else (1 - t)
        fade = np.clip(fade ** 0.48, 0, 1)
        arr[:, x, 3] *= fade
    return Image.fromarray(arr.astype(np.uint8))


def process_patterns() -> None:
    pat = resize_longest(Image.open(SRC_PATTERN).convert('RGBA'), PATTERN_MAX)
    w, h = pat.size
    cx = w // 2
    save_png(pat, OUT / 'dark-pattern.png')
    save_png(fade_half(pat.crop((0, 0, cx, h)), 'left'), OUT / 'dark-pattern-half-left.png')
    save_png(fade_half(pat.crop((cx, 0, w, h)), 'right'), OUT / 'dark-pattern-half-right.png')


def classify_blob(bw: int, bh: int, area: int) -> str | None:
    aspect = bw / max(bh, 1)
    if area < 220 or bw < 14 or bh < 14:
        return None
    if area > 120000 or bw > 400:
        return None
    if aspect < 0.42 and bh > 55:
        return 'chime'
    if 0.55 <= aspect <= 2.8 and 350 <= area <= 25000:
        return 'crane'
    if aspect < 0.55 and bh > bw and area < 8000:
        return 'chime'
    return None


def extract_curtain_sprites() -> list[dict]:
    ref = ImageOps.exif_transpose(Image.open(SRC_CURTAIN).convert('RGBA'))
    rw, rh = ref.size
    work_w = 1400
    scale = work_w / rw
    img = ref.resize((work_w, int(rh * scale)), Image.Resampling.LANCZOS)
    arr = np.array(img).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    sat = np.sqrt(((arr[:, :, :3] - arr[:, :, :3].mean(axis=2, keepdims=True)) ** 2).sum(axis=2))
    fg = (lum > 226) & (sat < 32) & (g < r + 14)
    mask = (fg.astype(np.uint8) * 255)
    mask = Image.fromarray(mask).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    m = np.array(mask)
    h, w = m.shape
    visited = np.zeros_like(m, dtype=bool)
    blobs: list[dict] = []

    for y in range(h):
        for x in range(w):
            if not m[y, x] or visited[y, x]:
                continue
            stack = [(x, y)]
            minx = maxx = x
            miny = maxy = y
            count = 0
            while stack:
                cx, cy = stack.pop()
                if cx < 0 or cy < 0 or cx >= w or cy >= h:
                    continue
                if visited[cy, cx] or not m[cy, cx]:
                    continue
                visited[cy, cx] = True
                count += 1
                minx, miny = min(minx, cx), min(miny, cy)
                maxx, maxy = max(maxx, cx), max(maxy, cy)
                stack.extend([(cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)])
            bw, bh = maxx - minx + 1, maxy - miny + 1
            kind = classify_blob(bw, bh, count)
            if not kind:
                continue
            pad = 8
            crop = img.crop((max(0, minx - pad), max(0, miny - pad), min(w, maxx + pad), min(h, maxy + pad)))
            alpha = np.array(crop.split()[-1])
            ys, xs = np.where(alpha > 40)
            if len(xs) == 0:
                continue
            crop = crop.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
            blobs.append({'kind': kind, 'area': count, 'image': crop})

    cranes = sorted([b for b in blobs if b['kind'] == 'crane'], key=lambda b: -b['area'])
    chimes = sorted([b for b in blobs if b['kind'] == 'chime'], key=lambda b: -b['area'])
    selected = cranes[:9] + chimes[:6]
    if len(selected) < 8:
        selected = sorted(blobs, key=lambda b: -b['area'])[:12]

    CURTAIN_OUT.mkdir(parents=True, exist_ok=True)
    for p in CURTAIN_OUT.glob('*.png'):
        if not p.name.startswith('_'):
            p.unlink()

    meta = []
    counters = {'crane': 0, 'chime': 0}
    for blob in selected:
        kind = blob['kind']
        counters[kind] += 1
        name = f'{kind}-{counters[kind]:02d}.png'
        save_png(blob['image'], CURTAIN_OUT / name)
        meta.append({'file': f'assets/things/ui/curtain/{name}', 'kind': kind, 'w': blob['image'].size[0], 'h': blob['image'].size[1]})

    (OUT / 'curtain-sprites.json').write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding='utf-8')
    return meta


def main() -> None:
    process_bucket()
    process_patterns()
    sprites = extract_curtain_sprites()
    print(f'curtain sprites: {len(sprites)}')


if __name__ == '__main__':
    main()
