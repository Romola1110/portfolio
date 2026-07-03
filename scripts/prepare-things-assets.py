#!/usr/bin/env python3
"""从上传原图/矢量图生成物有灵犀主站素材。"""

from __future__ import annotations

import json
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps
from rembg import remove

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets/things/ui'
ITEM_OUT = OUT / 'items'
CURTAIN_OUT = OUT / 'curtain'

SRC_BUCKET = ROOT / '签筒2.png'
SRC_PATTERN = ROOT / '暗纹素材新.png'
SRC_PATTERN_REF = ROOT / '加入暗纹背景效果.png'
SRC_CRANE = ROOT / '千纸鹤.png'
SRC_CHIME1 = ROOT / '风铃1.png'
SRC_CHIME2 = ROOT / '风铃2.png'
PHOTO_DIR = ROOT / 'assets/things/ui/processed/original'
PATTERN_MAX = 560


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


def trim_alpha(img: Image.Image, pad: int = 2) -> Image.Image:
    a = img.split()[-1]
    bbox = a.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), x1 + pad, y1 + pad))


def alpha_from_paper(img: Image.Image, white_thresh: float = 236.0) -> Image.Image:
    arr = np.array(img.convert('RGBA')).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    sat = np.sqrt(((arr[:, :, :3] - arr[:, :, :3].mean(axis=2, keepdims=True)) ** 2).sum(axis=2))
    alpha = np.clip((white_thresh - lum) / 48.0, 0, 1)
    alpha *= np.clip(sat / 16.0, 0.3, 1.0)
    alpha = np.clip(alpha, 0, 1)
    arr[:, :, 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(arr.astype(np.uint8))


def fade_half(img: Image.Image, side: str) -> Image.Image:
    arr = np.array(img).astype(np.float32)
    ww = arr.shape[1]
    for x in range(ww):
        t = x / max(ww - 1, 1)
        fade = t if side == 'left' else (1 - t)
        fade = np.clip(fade ** 0.42, 0, 1)
        arr[:, x, 3] *= fade
    return Image.fromarray(arr.astype(np.uint8))


def cutout_soft(img: Image.Image, feather: int = 6) -> Image.Image:
    cut = remove(img)
    if isinstance(cut, bytes):
        cut = Image.open(BytesIO(cut)).convert('RGBA')
    cut = trim_alpha(cut)
    a = cut.split()[-1]
    a = a.filter(ImageFilter.GaussianBlur(feather))
    cut.putalpha(a)
    return cut


def process_bucket() -> None:
    cut = cutout_soft(Image.open(SRC_BUCKET).convert('RGBA'), feather=4)
    save_png(cut, OUT / 'lot-bucket-2.png')


def process_patterns() -> None:
    ref = resize_longest(Image.open(SRC_PATTERN_REF).convert('RGBA'), PATTERN_MAX)
    pat = resize_longest(Image.open(SRC_PATTERN).convert('RGBA'), PATTERN_MAX)
    center = alpha_from_paper(ref, white_thresh=232.0)
    save_png(center, OUT / 'dark-pattern.png')

    p = alpha_from_paper(pat, white_thresh=234.0)
    w, h = p.size
    left = p.crop((0, 0, w // 2, h))
    right = p.crop((w // 2, 0, w, h))
    save_png(fade_half(left, 'left'), OUT / 'dark-pattern-half-left.png')
    save_png(fade_half(right, 'right'), OUT / 'dark-pattern-half-right.png')


def process_vector_sprite(src: Path, out: Path, max_px: int = 220) -> dict:
    img = ImageOps.exif_transpose(Image.open(src).convert('RGBA'))
    cut = remove(img)
    if isinstance(cut, bytes):
        cut = Image.open(BytesIO(cut)).convert('RGBA')
    cut = trim_alpha(cut, pad=4)
    cut = resize_longest(cut, max_px)
    save_png(cut, out)
    return {'file': str(out.relative_to(ROOT)).replace('\\', '/'), 'w': cut.size[0], 'h': cut.size[1]}


def process_curtain_vectors() -> list[dict]:
    CURTAIN_OUT.mkdir(parents=True, exist_ok=True)
    for p in CURTAIN_OUT.glob('*.png'):
        p.unlink()
    meta: list[dict] = []
    for i in range(1, 7):
        src = ROOT / f'千纸鹤{i}.png'
        if not src.exists():
            continue
        crane = process_vector_sprite(src, CURTAIN_OUT / f'crane-{i:02d}.png', 128)
        crane['kind'] = 'crane'
        crane['id'] = f'crane-{i}'
        meta.append(crane)
    if not any(m.get('kind') == 'crane' for m in meta) and SRC_CRANE.exists():
        crane = process_vector_sprite(SRC_CRANE, CURTAIN_OUT / 'crane-01.png', 128)
        crane['kind'] = 'crane'
        crane['id'] = 'crane-1'
        meta.append(crane)
    for i in range(1, 6):
        src = ROOT / f'风铃{i}.png'
        if not src.exists():
            continue
        ch = process_vector_sprite(src, CURTAIN_OUT / f'chime-{i:02d}.png', 80)
        ch['kind'] = 'chime'
        ch['id'] = f'chime-{i}'
        meta.append(ch)
    for i, src in enumerate([SRC_CHIME1, SRC_CHIME2], 1):
        if any(m.get('id') == f'chime-{i}' for m in meta):
            continue
        if not src.exists():
            continue
        ch = process_vector_sprite(src, CURTAIN_OUT / f'chime-{i:02d}.png', 80)
        ch['kind'] = 'chime'
        ch['id'] = f'chime-{i}'
        meta.append(ch)
    (OUT / 'curtain-sprites.json').write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding='utf-8')
    return meta


def soft_edge_photo(src: Path, out: Path) -> None:
    img = Image.open(src).convert('RGBA')
    cut = cutout_soft(img, feather=8)
    save_png(cut, out)


def process_item_photos() -> list[str]:
    ITEM_OUT.mkdir(parents=True, exist_ok=True)
    files = sorted(PHOTO_DIR.glob('*.jpg'))[:12]
    paths = []
    for i, src in enumerate(files, 1):
        out = ITEM_OUT / f'{i:02d}-soft.png'
        soft_edge_photo(src, out)
        paths.append(str(out.relative_to(ROOT)).replace('\\', '/'))
    return paths


def main() -> None:
    process_bucket()
    process_patterns()
    sprites = process_curtain_vectors()
    print(f'curtain sprites: {len(sprites)}')


if __name__ == '__main__':
    main()
