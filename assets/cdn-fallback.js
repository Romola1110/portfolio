/* 内地访问：GitHub Pages 较慢时，图片回退到 jsDelivr 镜像 */
(function () {
  const CDN = 'https://cdn.jsdelivr.net/gh/Romola1110/portfolio@main';

  function cdnUrl(src) {
    if (!src || src.startsWith('data:') || src.includes('cdn.jsdelivr.net')) return '';
    const path = src.replace(/^https?:\/\/[^/]+\//, '').replace(/^\//, '');
    if (!path.startsWith('assets/') && !path.match(/\.(jpg|jpeg|png|webp|woff2)$/i)) return '';
    return `${CDN}/${path}`;
  }

  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    const src = img.getAttribute('src') || '';
    if (img.dataset.cdnRetry === '1') return;
    const next = cdnUrl(src);
    if (!next) return;
    img.dataset.cdnRetry = '1';
    img.src = next;
  }, true);

  window.SITE_PHOTO_CDN = CDN;
  window.sitePhotoCdnUrl = (season, file) => `${CDN}/assets/photos/${season}/${file}`;
})();
