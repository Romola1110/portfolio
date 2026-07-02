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
SRC_PATTERN_COMPOSED = ROOT / '加入暗纹背景效果.png'
SRC_PATTERN_ADV = ROOT / '进阶版.png'
SRC_CURTAIN = ROOT / '垂帘参考 加千纸鹤和风铃.png'
PATTERN_MAX = 520


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


def alpha_from_paper(img: Image.Image, *, white_thresh: float = 238.0) -> Image.Image:
    """把纸白背景抠成透明，保留暗纹/鹤/风铃等墨色线条。"""
    arr = np.array(img.convert('RGBA')).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    sat = np.sqrt(((arr[:, :, :3] - arr[:, :, :3].mean(axis=2, keepdims=True)) ** 2).sum(axis=2))
    # 纸白 → 透明；淡墨/彩线 → 保留
    alpha = np.clip((white_thresh - lum) / 42.0, 0, 1)
    alpha *= np.clip(sat / 18.0, 0.35, 1.0)
    alpha = np.clip(alpha, 0, 1)
    arr[:, :, 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(arr.astype(np.uint8))


def trim_alpha(img: Image.Image, pad: int = 4) -> Image.Image:
    a = img.split()[-1]
    bbox = a.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), x1 + pad, y1 + pad))


def process_bucket() -> None:
    img = Image.open(SRC_BUCKET).convert('RGBA')
    cut = remove(img)
    if isinstance(cut, bytes):
        cut = Image.open(BytesIO(cut)).convert('RGBA')
    cut = trim_alpha(cut)
    save_png(cut, OUT / 'lot-bucket-2.png')


def process_patterns() -> None:
    """从进阶版/合成效果图提取透明暗纹，避免纸白网格渗出。"""
    composed = resize_longest(Image.open(SRC_PATTERN_COMPOSED).convert('RGBA'), PATTERN_MAX)
    adv = resize_longest(Image.open(SRC_PATTERN_ADV).convert('RGBA'), PATTERN_MAX)
    cw, ch = composed.size
    aw, ah = adv.size

    center = alpha_from_paper(composed.crop((cw // 4, 0, 3 * cw // 4, ch)))
    center = trim_alpha(center)
    save_png(center, OUT / 'dark-pattern.png')

    left_src = alpha_from_paper(adv.crop((0, 0, aw // 2, ah)))
    right_src = alpha_from_paper(adv.crop((aw // 2, 0, aw, ah)))
    save_png(trim_alpha(left_src), OUT / 'dark-pattern-half-left.png')
    save_png(trim_alpha(right_src), OUT / 'dark-pattern-half-right.png')


def classify_blob(bw: int, bh: int, area: int) -> str | None:
    aspect = bw / max(bh, 1)
    if area < 180 or bw < 12 or bh < 12:
        return None
    # 排除横排文字、垂帘竖线
    if aspect > 3.2 and bh < 72:
        return None
    if aspect < 0.22 and bh > 100:
        return None
    if area > 180000 or bw > 520 or bh > 160:
        return None
    if aspect < 0.38 and 40 <= bh <= 100:
        return 'chime'
    if 0.45 <= aspect <= 3.0 and 280 <= area <= 42000:
        return 'crane'
    if aspect < 0.55 and bh > bw and 400 <= area <= 8000:
        return 'chime'
    return None


def curtain_foreground_mask(img: Image.Image) -> np.ndarray:
    arr = np.array(img).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    sat = np.abs(r - g) + np.abs(g - b) + np.abs(r - b)
    fg = (lum < 235) & (lum > 42) & (sat > 12)
    return fg


def extract_curtain_sprites() -> list[dict]:
    ref = ImageOps.exif_transpose(Image.open(SRC_CURTAIN).convert('RGBA'))
    rw, rh = ref.size
    work_w = 1600
    scale = work_w / rw
    img = ref.resize((work_w, int(rh * scale)), Image.Resampling.LANCZOS)
    fg = curtain_foreground_mask(img)
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
            pad = 10
            crop = img.crop((max(0, minx - pad), max(0, miny - pad), min(w, maxx + pad), min(h, maxy + pad)))
            # 用 mask 把背景清掉
            ca = np.array(crop)
            cm = curtain_foreground_mask(crop)
            ca[:, :, 3] = np.where(cm, ca[:, :, 3], 0)
            crop = Image.fromarray(ca)
            alpha = np.array(crop.split()[-1])
            ys, xs = np.where(alpha > 40)
            if len(xs) == 0:
                continue
            crop = crop.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
            blobs.append({'kind': kind, 'area': count, 'image': crop, 'cx': (minx + maxx) / 2})

    cranes = sorted([b for b in blobs if b['kind'] == 'crane'], key=lambda b: b['cx'])
    chimes = sorted([b for b in blobs if b['kind'] == 'chime'], key=lambda b: -b['area'])
    selected = cranes[:9] + chimes[:4]
    if len(selected) < 6:
        selected = sorted(blobs, key=lambda b: -b['area'])[:10]

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
        meta.append({
            'file': f'assets/things/ui/curtain/{name}',
            'kind': kind,
            'w': blob['image'].size[0],
            'h': blob['image'].size[1],
        })

    (OUT / 'curtain-sprites.json').write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding='utf-8')
    return meta


def main() -> None:
    process_bucket()
    process_patterns()
    sprites = extract_curtain_sprites()
    print(f'curtain sprites: {len(sprites)}')


if __name__ == '__main__':
    main()
