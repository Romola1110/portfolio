#!/usr/bin/env python3
"""Resize/compress sign images for GitHub Pages (keeps filenames)."""

from __future__ import annotations

import io
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
ITEMS = ROOT / 'assets/things/ui/items'
MAX_SIDE = 900
JPEG_QUALITY = 78


def optimize_file(path: Path) -> tuple[int, int]:
    before = path.stat().st_size
    img = ImageOps.exif_transpose(Image.open(path))
    img.load()

    w, h = img.size
    scale = min(1.0, MAX_SIDE / max(w, h))
    if scale < 1.0:
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

    ext = path.suffix.lower()
    buf = io.BytesIO()
    if ext in {'.jpg', '.jpeg'}:
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img.save(buf, 'JPEG', quality=JPEG_QUALITY, optimize=True)
    else:
        if img.mode not in {'RGBA', 'LA'}:
            img = img.convert('RGBA')
        img.save(buf, 'PNG', optimize=True)

    data = buf.getvalue()
    if len(data) < before:
        path.write_bytes(data)
    return before, path.stat().st_size


def main() -> None:
    files = sorted(
        p for p in ITEMS.glob('[0-9][0-9]-*')
        if p.is_file() and '-soft' not in p.name
    )
    if not files:
        raise SystemExit('no item images found')

    saved = 0
    for path in files:
        before, after = optimize_file(path)
        saved += max(0, before - after)
        print(f'{path.name}: {before // 1024}KB -> {after // 1024}KB')

    print(f'optimized {len(files)} files, saved {saved // 1024 // 1024}MB')


if __name__ == '__main__':
    main()
