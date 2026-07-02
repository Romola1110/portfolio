#!/usr/bin/env python3
"""Patch main site for vine fix, butterflies, bucket, curtain polish."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / 'index (1).html'

html = INDEX.read_text(encoding='utf-8')

# Bump cache versions
html = html.replace('things-section.css?v=9', 'things-section.css?v=10')
html = html.replace('things-section.js?v=9', 'things-section.js?v=10')
html = html.replace('photography-main.css?v=6', 'photography-main.css?v=7')

# Photo butterflies
html = html.replace(
    '<img class="photo-floral photo-floral--left" src="assets/photo/floral-vine.png" alt="" aria-hidden="true">',
    '<img class="photo-butterflies photo-butterflies--left" src="assets/photo/butterflies-left.png" alt="" aria-hidden="true">',
)
html = html.replace(
    '<img class="photo-floral photo-floral--right" src="assets/photo/floral-vine.png" alt="" aria-hidden="true">',
    '<img class="photo-butterflies photo-butterflies--right" src="assets/photo/butterflies-right.png" alt="" aria-hidden="true">',
)

# Things title row with stars + em dash
old_title = '''    <div class="things-title-row">
      <h2 class="section-title">物有灵犀</h2>
      <p class="section-en things-title-en">Welcome to my creative world!!</p>
    </div>'''

new_title = '''    <div class="things-title-row">
      <div class="things-title-main">
        <h2 class="section-title">物有灵犀</h2>
        <span class="things-title-stars" aria-hidden="true">
          <i class="t-star s1"></i><i class="t-star s2"></i><i class="t-star s3"></i>
          <i class="t-star s4"></i><i class="t-star s5"></i>
        </span>
      </div>
      <p class="section-en things-title-en">— Welcome to my creative world!!</p>
    </div>'''
html = html.replace(old_title, new_title)

# Lot bucket image
old_bucket = '''        <div class="lot-bucket" role="button" tabindex="0" aria-label="签筒">
          <svg class="bucket-art" viewBox="0 0 120 140" aria-hidden="true">
            <defs>
              <linearGradient id="bucketGrad" x1="60" y1="52" x2="60" y2="128" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#dcc8a4"/>
                <stop offset="100%" stop-color="#a08060"/>
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="130" rx="36" ry="7" fill="rgba(70,55,38,0.1)"/>
            <rect x="40" y="10" width="3.5" height="40" rx="1.2" fill="#e0d0b0" transform="rotate(-10 41.75 50)"/>
            <rect x="50" y="6" width="4" height="44" rx="1.2" fill="#ebe0cc" transform="rotate(-2 52 50)"/>
            <rect x="61" y="8" width="3.8" height="42" rx="1.2" fill="#d4c0a0" transform="rotate(6 62.9 50)"/>
            <rect x="72" y="14" width="3.2" height="36" rx="1.2" fill="#c8b490" transform="rotate(12 73.6 50)"/>
            <path d="M26 54 Q24 92 30 124 Q60 134 90 124 Q96 92 94 54 Z" fill="url(#bucketGrad)" stroke="#7a6248" stroke-width="1.3"/>
            <ellipse cx="60" cy="54" rx="34" ry="10" fill="#c8ae88" stroke="#7a6248" stroke-width="1.1"/>
            <path d="M36 62 Q34 95 38 118" stroke="rgba(90,70,50,0.22)" fill="none" stroke-width="0.8"/>
            <path d="M60 60 L60 120" stroke="rgba(90,70,50,0.14)" fill="none" stroke-width="0.7"/>
            <path d="M84 62 Q86 95 82 118" stroke="rgba(90,70,50,0.22)" fill="none" stroke-width="0.8"/>
          </svg>
        </div>'''

new_bucket = '''        <div class="lot-bucket" role="button" tabindex="0" aria-label="签筒">
          <img class="bucket-art" src="assets/things/ui/lot-bucket.png" alt="" aria-hidden="true" width="260" height="420">
        </div>'''
html = html.replace(old_bucket, new_bucket)

# Curtain decor layer
html = html.replace(
    '''      <div class="curtain-stage">
        <div class="curtain-bar" aria-hidden="true"></div>
        <div class="curtain-threads"></div>
      </div>''',
    '''      <div class="curtain-stage">
        <div class="curtain-bar" aria-hidden="true"></div>
        <div class="curtain-decor" aria-hidden="true"></div>
        <div class="curtain-threads"></div>
      </div>''',
)

# Vine: use scrollHeight + store canvas height
html = html.replace(
    '  const w = mainRect.width;\n  const h = mainRect.height;',
    '  const w = mainRect.width;\n  const h = Math.max(mainEl.scrollHeight, mainRect.height, 1);',
)
html = html.replace(
    '  window._vineGuideStartY = trunkStartY;\n  window._vineGuideEndY = bottomLimit;',
    '  window._vineGuideStartY = trunkStartY;\n  window._vineGuideEndY = bottomLimit;\n  window._vineCanvasH = h;',
)

# updateScrollReveal clip uses canvas height
html = html.replace(
    '''  const mainHeight = Math.max(main.offsetHeight, 1);

  // 藤蔓前沿随滚动 1:1 延伸，停留在视口约 70% 高度
  const tipY = scrollY + viewH * 0.70 - mainTop;
  const visibleH = Math.max(0, Math.min(mainHeight, tipY));
  vineClip.style.clipPath = `inset(0 0 ${mainHeight - visibleH}px 0)`;''',
    '''  const mainHeight = Math.max(main.offsetHeight, 1);
  const canvasH = window._vineCanvasH || mainHeight;

  // 藤蔓前沿随滚动 1:1 延伸，停留在视口约 70% 高度
  const tipY = scrollY + viewH * 0.70 - mainTop;
  const visibleH = Math.max(0, Math.min(canvasH, tipY));
  vineClip.style.clipPath = `inset(0 0 ${canvasH - visibleH}px 0)`;''',
)

# Export scheduleDrawVineTree + ResizeObserver
html = html.replace(
    'window.addEventListener(\'resize\', scheduleDrawVineTree);',
    '''window.scheduleDrawVineTree = scheduleDrawVineTree;
window.addEventListener('resize', scheduleDrawVineTree);
if (typeof ResizeObserver !== 'undefined') {
  const mainForVine = document.getElementById('main');
  if (mainForVine && !window._vineResizeObs) {
    window._vineResizeObs = new ResizeObserver(() => scheduleDrawVineTree());
    window._vineResizeObs.observe(mainForVine);
  }
}''',
)

INDEX.write_text(html, encoding='utf-8')
print('Patched', INDEX)
