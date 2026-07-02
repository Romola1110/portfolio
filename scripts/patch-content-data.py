#!/usr/bin/env python3
"""恢复文以载心栏目顺序，仅交换第2/4/5项封面图。"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / 'index (1).html'
ORDER = ['novel', 'thesis', 'comparative', 'classical', 'editorial', 'translation']


def extract_entries(block: str) -> dict[str, str]:
    pat = re.compile(r"(\n  \{\n    id: '([^']+)',.*?\n  \})", re.DOTALL)
    return {eid: body for body, eid in pat.findall(block)}


def extract_cover(body: str) -> str | None:
    m = re.search(r"cover: '(data:image/[^']+)'", body)
    return m.group(1) if m else None


def set_cover(body: str, cover: str) -> str:
    return re.sub(r"cover: 'data:image/[^']+'", f"cover: '{cover}'", body, count=1)


def main() -> None:
    text = INDEX.read_text(encoding='utf-8')
    start = text.index('const contentData = [')
    end = text.index('\nconst stackData = [', start)
    block = text[start:end]
    entries = extract_entries(block)

    # 从合并前版本取原始封面（按 id）
    old_html = subprocess.check_output(['git', 'show', '5908892:index (1).html']).decode('utf-8')
    os = old_html.index('const contentData = [')
    oe = old_html.index('\nconst stackData = [', os)
    old_entries = extract_entries(old_html[os:oe])
    covers = {eid: extract_cover(old_entries[eid]) for eid in ORDER}

    # 仅交换 2/4/5 的封面：thesis↔classical↔editorial 循环
    t, c, e = covers['thesis'], covers['classical'], covers['editorial']
    covers['thesis'] = c
    covers['classical'] = e
    covers['editorial'] = t

    rebuilt = []
    for eid in ORDER:
        body = entries.get(eid) or old_entries[eid]
        if covers.get(eid):
            body = set_cover(body, covers[eid])
        rebuilt.append(body)

    new_block = 'const contentData = [' + ',\n'.join(rebuilt) + '\n];'
    text = text[:start] + new_block + text[end:]
    INDEX.write_text(text, encoding='utf-8')
    print('contentData order restored; covers swapped for thesis/classical/editorial')


if __name__ == '__main__':
    main()
