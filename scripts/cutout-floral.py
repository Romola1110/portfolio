#!/usr/bin/env python3
"""抠图 + 灰黑调色 + 毛边白边，用于网站素材批处理。

用法:
  python3 scripts/cutout-floral.py input.png -o assets/photo/floral-vine.png
  python3 scripts/cutout-floral.py assets/uploads/*.png -o assets/things/ui/
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageFilter
import numpy as np


def cutout_gray_white_edge(src: Path, out: Path, *, gray_strength: float = 0.42) -> None:
    img = Image.open(src).convert('RGBA')
    arr = np.array(img)
    rgb = arr[:, :, :3].astype(np.float32)
    white_dist = np.sqrt(((255 - rgb) ** 2).sum(axis=2))
    alpha = np.clip((255 - white_dist) * 2.2, 0, 255).astype(np.uint8)
    gray = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]).astype(np.uint8)
    tint = np.stack([
        (gray * gray_strength).astype(np.uint8),
        (gray * (gray_strength - 0.02)).astype(np.uint8),
        (gray * (gray_strength - 0.04)).astype(np.uint8),
    ], axis=2)
    arr[:, :, :3] = tint
    arr[:, :, 3] = alpha
    cut = Image.fromarray(arr)
    edge = cut.split()[-1].filter(ImageFilter.GaussianBlur(2.5))
    edge_arr = np.array(edge)
    fringe = np.zeros_like(arr)
    fringe[:, :, :3] = 255
    fringe[:, :, 3] = np.clip(edge_arr.astype(float) * 0.85, 0, 255).astype(np.uint8)
    canvas = Image.new('RGBA', cut.size, (0, 0, 0, 0))
    canvas = Image.alpha_composite(canvas, Image.fromarray(fringe))
    canvas = Image.alpha_composite(canvas, cut)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out)
    print(f'wrote {out} ({canvas.size[0]}x{canvas.size[1]})')


def main() -> None:
    parser = argparse.ArgumentParser(description='抠图并加灰黑毛边白边')
    parser.add_argument('inputs', nargs='+', type=Path)
    parser.add_argument('-o', '--output', type=Path, required=True)
    args = parser.parse_args()
    out = args.output
    if len(args.inputs) == 1 and out.suffix:
        cutout_gray_white_edge(args.inputs[0], out)
        return
    out.mkdir(parents=True, exist_ok=True)
    for src in args.inputs:
        cutout_gray_white_edge(src, out / f'{src.stem}-cutout.png')


if __name__ == '__main__':
    main()
