#!/usr/bin/env python3
"""Extract inline base64 文以载心 covers to asset files; shrink index (1).html."""
import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / 'index (1).html'
OUT_DIR = ROOT / 'assets' / 'previews' / 'words'

def main():
    text = HTML.read_text(encoding='utf-8')
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    cover_re = re.compile(r"cover:\s*'(data:image/[^']+)'")
    id_re = re.compile(r"id:\s*'([^']+)'")

    out = []
    last = 0
    count = 0
    for m in cover_re.finditer(text):
        prefix = text[last:m.start()]
        chunk = text[max(0, m.start() - 4000):m.start()]
        ids = id_re.findall(chunk)
        if not ids:
            raise SystemExit(f'No id found before cover at {m.start()}')
        item_id = ids[-1]
        data_url = m.group(1)
        header, b64 = data_url.split(',', 1)
        ext = 'png' if 'png' in header else 'jpg'
        rel = f'assets/previews/words/{item_id}.{ext}'
        (OUT_DIR / f'{item_id}.{ext}').write_bytes(base64.b64decode(b64))
        out.append(text[last:m.start()])
        out.append(f"cover: '{rel}'")
        last = m.end()
        count += 1

    out.append(text[last:])
    new_text = ''.join(out)
    HTML.write_text(new_text, encoding='utf-8')
    print(f'Extracted {count} covers to {OUT_DIR}')
    print(f'HTML size: {len(text)/1024/1024:.1f}MB -> {len(new_text)/1024/1024:.1f}MB')

if __name__ == '__main__':
    main()
