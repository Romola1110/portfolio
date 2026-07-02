#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / 'index (1).html'
html = INDEX.read_text(encoding='utf-8')

html = html.replace('things-section.css?v=10', 'things-section.css?v=11')
html = html.replace('things-section.js?v=10', 'things-section.js?v=11')
html = html.replace('photography-main.css?v=7', 'photography-main.css?v=8')

# 四时：去掉两侧图片
html = html.replace(
    '''      <div class="photo-title-row">
        <img class="photo-butterflies photo-butterflies--left" src="assets/photo/butterflies-left.png" alt="" aria-hidden="true">
        <div class="photo-title-center">
          <h2 class="section-title">四时·流转之境</h2>
          <p class="section-en">Seasons through the Lens</p>
        </div>
        <img class="photo-butterflies photo-butterflies--right" src="assets/photo/butterflies-right.png" alt="" aria-hidden="true">
      </div>''',
    '''      <div class="photo-title-row photo-title-row--plain">
        <div class="photo-title-center">
          <h2 class="section-title">四时·流转之境</h2>
          <p class="section-en">Seasons through the Lens</p>
        </div>
      </div>''',
)

old_draw = '''      <div class="draw-zone" id="thingsDrawZone">
        <div class="lot-bucket" role="button" tabindex="0" aria-label="签筒">
          <img class="bucket-art" src="assets/things/ui/lot-bucket.png" alt="" aria-hidden="true" width="260" height="420">
        </div>
        <div class="stick-flyout" aria-hidden="true"></div>'''

new_draw = '''      <div class="draw-zone" id="thingsDrawZone">
        <div class="pattern-side pattern-side--left" aria-hidden="true">
          <img src="assets/things/ui/dark-pattern-half-left.png" alt="">
        </div>
        <div class="pattern-side pattern-side--right" aria-hidden="true">
          <img src="assets/things/ui/dark-pattern-half-right.png" alt="">
        </div>
        <div class="lot-scene">
          <div class="pattern-center" aria-hidden="true">
            <img src="assets/things/ui/dark-pattern.png" alt="">
          </div>
          <div class="lot-bucket" role="button" tabindex="0" aria-label="签筒">
            <img class="bucket-art" src="assets/things/ui/lot-bucket-2.png" alt="" aria-hidden="true" width="219" height="297">
          </div>
        </div>
        <div class="stick-flyout" aria-hidden="true"></div>'''

html = html.replace(old_draw, new_draw)
INDEX.write_text(html, encoding='utf-8')
print('patched index')
