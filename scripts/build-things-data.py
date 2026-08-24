#!/usr/bin/env python3
"""从 incoming 图片 + THINGS_COPY_DRAFT.md 生成 things-data.js（按草稿文件字段精确匹配）"""

from __future__ import annotations

import hashlib
import importlib.util
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
_SCRIPTS = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location('optimize_things_items', _SCRIPTS / 'optimize-things-items.py')
_mod = importlib.util.module_from_spec(_spec)
assert _spec and _spec.loader
_spec.loader.exec_module(_mod)
_optimize_item_image = _mod.optimize_file
INCOMING = ROOT / 'assets/things/incoming'
DRAFT = ROOT / 'assets/things/THINGS_COPY_DRAFT.md'
OUT_ITEMS = ROOT / 'assets/things/ui/items'
OUT_JS = ROOT / 'assets/things/things-data.js'

PH_CATEGORIES = ['ph-calligraphy', 'ph-bookmark', 'ph-paper', 'ph-dye']


def _norm_name(name: str) -> str:
    return re.sub(r'[\s_]+', '', name.lower())


def _index_incoming() -> dict[str, list[Path]]:
    idx: dict[str, list[Path]] = {}
    for p in INCOMING.rglob('*'):
        if not p.is_file():
            continue
        if '__MACOSX' in p.parts or p.name.startswith('.'):
            continue
        if p.suffix.lower() not in {'.png', '.jpg', '.jpeg'}:
            continue
        idx.setdefault(_norm_name(p.name), []).append(p)
    return idx


def resolve_image(file_hint: str, incoming_idx: dict[str, list[Path]]) -> Path:
    hint = file_hint.strip().strip('`')
    if not hint:
        raise ValueError('empty file hint')
    basename = Path(hint).name
    key = _norm_name(basename)
    hits = incoming_idx.get(key, [])
    if len(hits) == 1:
        return hits[0]
    if not hits:
        hits = [
            p for k, paths in incoming_idx.items()
            for p in paths
            if key in k or k in key
        ]
    if len(hits) == 1:
        return hits[0]
    if not hits:
        raise FileNotFoundError(f'no incoming file for {basename!r}')
    raise ValueError(f'ambiguous match for {basename!r}: {[p.name for p in hits]}')


def parse_draft() -> list[dict]:
    text = DRAFT.read_text(encoding='utf-8')
    blocks = re.split(r'\n---\n', text)
    items: list[dict] = []
    for block in blocks:
        m = re.match(r'##\s+(\d+)\s+·\s+(.+)', block.strip())
        if not m:
            continue
        num, _title = m.group(1), m.group(2).strip()

        def field(key: str) -> str:
            fm = re.search(rf'- \*\*{key}\*\*：(.+)', block)
            return fm.group(1).strip() if fm else ''

        items.append({
            'num': int(num),
            'name': field('name'),
            'signLabel': field('signLabel'),
            'glyph': field('glyph') or '签',
            'note': field('note'),
            'story': field('story'),
            'verse': field('verse'),
            'blessing': field('blessing'),
            'file_hint': field('文件').strip('`'),
        })
    return sorted(items, key=lambda x: x['num'])


def guess_ph(name: str, note: str) -> str:
    s = name + note
    if any(k in s for k in ('扇', '团扇', '折扇')):
        return 'ph-calligraphy'
    if any(k in s for k in ('明信片', '卡', '帖')):
        return 'ph-paper'
    if any(k in s for k in ('红', '福', '喜', '金')):
        return 'ph-dye'
    if any(k in s for k in ('签', '书签', '流苏')):
        return 'ph-bookmark'
    return PH_CATEGORIES[int(hashlib.md5(s.encode()).hexdigest(), 16) % len(PH_CATEGORIES)]


def main() -> None:
    incoming_idx = _index_incoming()
    meta = parse_draft()
    OUT_ITEMS.mkdir(parents=True, exist_ok=True)
    data: list[dict] = []

    for entry in meta:
        i = entry['num']
        img = resolve_image(entry['file_hint'], incoming_idx)
        ext = img.suffix.lower()
        if ext == '.jpeg':
            ext = '.jpg'
        digest = hashlib.md5(img.read_bytes()).hexdigest()[:12]
        out_name = f'{i:02d}-{digest}{ext}'
        dest = OUT_ITEMS / out_name
        shutil.copy2(img, dest)
        _optimize_item_image(dest)

        rel = str(dest.relative_to(ROOT)).replace('\\', '/')
        data.append({
            'id': f'n{i:02d}',
            'name': entry['name'] or f'签 {i:02d}',
            'signLabel': entry['signLabel'] or entry['name'],
            'note': entry['note'],
            'story': entry['story'],
            'verse': entry['verse'],
            'blessing': entry['blessing'],
            'ph': guess_ph(entry['name'], entry['note']),
            'glyph': (entry['glyph'] or '签')[:1],
            'image': rel,
        })

    js = '// Auto-generated from incoming + THINGS_COPY_DRAFT.md\n'
    js += 'window.THINGS_DATA = '
    js += json.dumps(data, ensure_ascii=False, indent=2)
    js += ';\n'
    OUT_JS.write_text(js, encoding='utf-8')
    print(f'wrote {OUT_JS.relative_to(ROOT)} ({len(data)} items)')


if __name__ == '__main__':
    main()
