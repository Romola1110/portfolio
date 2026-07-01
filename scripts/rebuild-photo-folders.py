#!/usr/bin/env python3
"""Rebuild season folders strictly from original zip archives."""

import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / 'assets' / 'photos'

ZIP_MAP = [
    ('spring.zip', 'spring'),
    ('summer1.zip', 'summer'),
    ('summer2.zip', 'summer'),
    ('summer3.zip', 'summer'),
    ('autumn.zip', 'autumn'),
    ('winter.zip', 'winter'),
]


def extract_zip(zpath: Path, dest_season: str):
    with zipfile.ZipFile(zpath) as z:
        for name in z.namelist():
            if not name.lower().endswith(('.jpg', '.jpeg', '.png')):
                continue
            fname = Path(name).name
            if fname.startswith('.'):
                continue
            (PHOTOS / dest_season / fname).write_bytes(z.read(name))


def main():
    for season in ('spring', 'summer', 'autumn', 'winter'):
        folder = PHOTOS / season
        if folder.exists():
            shutil.rmtree(folder)
        folder.mkdir(parents=True)

    for zname, season in ZIP_MAP:
        zpath = ROOT / zname
        if not zpath.exists():
            raise SystemExit(f'missing zip: {zpath}')
        extract_zip(zpath, season)

    for season in ('spring', 'summer', 'autumn', 'winter'):
        print(f'  {season}: {len(list((PHOTOS / season).glob("*.jpg")))}')


if __name__ == '__main__':
    main()
