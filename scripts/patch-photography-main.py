#!/usr/bin/env python3
"""Patch index (1).html photography section with breeze gallery."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / 'index (1).html'

CSS_LINKS = '''<link rel="stylesheet" href="assets/photography-breeze.css?v=7">
<link rel="stylesheet" href="assets/photography-main.css?v=1">'''

OLD_PHOTO_BLOCK = '''  <div class="open-section" data-delay="100" id="photography">
    <h2 class="section-title">四时·流转之境</h2>
    <p class="section-en">Seasons through the Lens</p>
    <p class="section-desc">一些被定格的光影。关于校园的角落，关于四季的更迭。时间在镜头里，有了具象的形状。</p>
    <div class="photo-waterfall">
      <div class="photo-card">
        <div class="photo-placeholder">春 · 花信</div>
        <div class="photo-caption">繁花枝头</div>
      </div>
      <div class="photo-card">
        <div class="photo-placeholder">夏 · 长风</div>
        <div class="photo-caption">夏日绿荫</div>
      </div>
      <div class="photo-card">
        <div class="photo-placeholder">秋 · 落木</div>
        <div class="photo-caption">秋叶静美</div>
      </div>
      <div class="photo-card">
        <div class="photo-placeholder">冬 · 藏雪</div>
        <div class="photo-caption">岁月留白</div>
      </div>
    </div>
  </div>'''

NEW_PHOTO_BLOCK = '''  <div class="open-section" data-delay="100" id="photography">
    <h2 class="section-title">四时·流转之境</h2>
    <p class="section-en">Seasons through the Lens</p>
    <p class="section-desc">春苔生，夏影长，秋叶落，冬窗寂。光在四季里留下脚印，我替它一一拾起。<br>镜头所及，皆是光阴的具象。四时之景不同，而光影亦无穷也。</p>
    <div class="pb-wrap" id="pbRoot">
      <div class="pb-clothesline" aria-hidden="true"></div>
      <nav class="pb-seasons" aria-label="四季摄影"></nav>
      <div class="pb-gallery" aria-live="polite"></div>
      <p class="pb-hint">悬停轻拨 · 点击展卷 · ← → 切换</p>
    </div>
  </div>'''

PHOTO_SCRIPTS = '''<script src="assets/photography-manifest.generated.js?v=3"></script>
<script src="assets/photography-data.js?v=10"></script>
<script src="assets/photography-breeze.js?v=5"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const photoRoot = document.getElementById('pbRoot');
    if (!photoRoot || typeof initPhotoBreeze !== 'function') return;
    const photoObs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      initPhotoBreeze('pbRoot');
      photoObs.disconnect();
    }, { rootMargin: '240px' });
    photoObs.observe(photoRoot);
  });
</script>'''


def main():
    text = INDEX.read_text(encoding='utf-8')
    if OLD_PHOTO_BLOCK not in text:
        raise SystemExit('photography block not found — already patched?')
    text = text.replace(OLD_PHOTO_BLOCK, NEW_PHOTO_BLOCK, 1)

    anchor = '<link rel="stylesheet" href="assets/things-section.css?v=8">'
    if CSS_LINKS not in text:
        text = text.replace(anchor, anchor + '\n' + CSS_LINKS, 1)

    if 'initPhotoBreeze' not in text:
        insert_before = '<div class="image-lightbox" id="lightbox"'
        text = text.replace(insert_before, PHOTO_SCRIPTS + '\n\n' + insert_before, 1)

    if not text.rstrip().endswith('</html>'):
        raise SystemExit('index truncated or missing </html>')
    INDEX.write_text(text, encoding='utf-8')
    print(f'patched {INDEX} ({len(text.splitlines())} lines)')


if __name__ == '__main__':
    main()
