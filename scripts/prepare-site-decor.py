#!/usr/bin/env python3
"""Prepare site decoration assets: butterfly cutouts + lot bucket."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageOps
from rembg import remove

ROOT = Path(__file__).resolve().parent.parent
BUTTERFLY_SRC = ROOT / 'assets/decor-src-butterflies.jpg'
BUCKET_SRC = ROOT / 'assets/decor-src-lot-bucket.png'
OUT_PHOTO_L = ROOT / 'assets/photo/butterflies-left.png'
OUT_PHOTO_R = ROOT / 'assets/photo/butterflies-right.png'
OUT_BUCKET = ROOT / 'assets/things/ui/lot-bucket.png'


def extract_butterflies(src: Path, out: Path, *, flip: bool = False) -> None:
    img = ImageOps.exif_transpose(Image.open(src).convert('RGBA'))
    w, h = img.size
    arr = np.array(img).astype(np.float32)

    # Keep bright / white butterfly pixels; remove green-yellow background
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    greenish = (g > r * 0.92) & (g > b * 0.85)
    whiteish = lum > 175
    alpha = np.clip((lum - 95) / 90, 0, 1)
    alpha = np.where(greenish & ~whiteish, alpha * 0.15, alpha)
    alpha = np.where(whiteish, np.maximum(alpha, 0.55), alpha)
    alpha = np.clip(alpha ** 0.85, 0, 1)

    # Soft feather for glow blend
    a = Image.fromarray((alpha * 255).astype(np.uint8), 'L')
    a = a.filter(ImageFilter.GaussianBlur(1.8))
    arr[:, :, 3] = np.array(a)

    cut = Image.fromarray(arr.astype(np.uint8))
    cut = ImageEnhance.Brightness(cut).enhance(1.06)

    # Crop to butterfly cluster region (upper 75%)
    bbox = cut.split()[-1].getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        pad = 24
        x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
        x1, y1 = min(w, x1 + pad), min(h, y1 + pad)
        cut = cut.crop((x0, y0, x1, y1))

    if flip:
        cut = ImageOps.mirror(cut)

    # Resize for title flanking
    cut = cut.resize((int(cut.width * 520 / max(cut.width, 1)), int(cut.height * 520 / max(cut.width, 1))), Image.Resampling.LANCZOS)
    out.parent.mkdir(parents=True, exist_ok=True)
    cut.save(out, 'PNG', optimize=True)
    print(f'wrote {out} ({cut.size[0]}x{cut.size[1]})')


def process_bucket(src: Path, out: Path) -> None:
    raw = Image.open(src)
    cut = remove(raw)
    if isinstance(cut, bytes):
        from io import BytesIO
        cut = Image.open(BytesIO(cut)).convert('RGBA')
    else:
        cut = cut.convert('RGBA')

    # Trim whitespace
    bbox = cut.split()[-1].getbbox()
    if bbox:
        cut = cut.crop(bbox)

    # Soft edge for fusion
    a = cut.split()[-1].filter(ImageFilter.GaussianBlur(0.6))
    cut.putalpha(a)

    max_h = 420
    if cut.height > max_h:
        scale = max_h / cut.height
        cut = cut.resize((int(cut.width * scale), max_h), Image.Resampling.LANCZOS)

    out.parent.mkdir(parents=True, exist_ok=True)
    cut.save(out, 'PNG', optimize=True)
    print(f'wrote {out} ({cut.size[0]}x{cut.size[1]})')


def main() -> None:
    if BUTTERFLY_SRC.exists():
        extract_butterflies(BUTTERFLY_SRC, OUT_PHOTO_L, flip=False)
        extract_butterflies(BUTTERFLY_SRC, OUT_PHOTO_R, flip=True)
    if BUCKET_SRC.exists():
        process_bucket(BUCKET_SRC, OUT_BUCKET)


if __name__ == '__main__':
    main()
