/* 内地访问：GitHub Pages 慢/失败时，资源回退 jsDelivr 镜像 */
(function () {
  const CDN = 'https://cdn.jsdelivr.net/gh/Romola1110/portfolio@main';
  const STALL_MS = 7500;

  function assetPath(src) {
    if (!src || src.startsWith('data:') || src.includes('cdn.jsdelivr.net')) return '';
    const path = src.replace(/^https?:\/\/[^/]+\//, '').replace(/^\//, '');
    if (/^(assets\/|yuwei|yuweifanti)/i.test(path)) return path;
    if (/\.(jpg|jpeg|png|webp|gif|woff2|ttf)$/i.test(path)) return path;
    return '';
  }

  function cdnUrl(src) {
    const path = assetPath(src);
    return path ? `${CDN}/${path}` : '';
  }

  function retryImg(img) {
    if (!img || img.dataset.cdnRetry === '1' || img.dataset.gaveUp === '1') return;
    const next = cdnUrl(img.getAttribute('src') || '');
    if (!next || img.getAttribute('src') === next) {
      img.dataset.gaveUp = '1';
      return;
    }
    img.dataset.cdnRetry = '1';
    img.src = next;
  }

  function watchImg(img) {
    if (!img || img.tagName !== 'IMG' || img.dataset.cdnWatch === '1') return;
    img.dataset.cdnWatch = '1';
    img.addEventListener('error', () => retryImg(img));
    setTimeout(() => {
      if (!img.complete || img.naturalWidth === 0) retryImg(img);
    }, STALL_MS);
  }

  document.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') retryImg(e.target);
  }, true);

  function scan(root) {
    (root.querySelectorAll ? root : document).querySelectorAll('img').forEach(watchImg);
  }

  scan(document);
  new MutationObserver((muts) => {
    muts.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      if (n.tagName === 'IMG') watchImg(n);
      else scan(n);
    }));
  }).observe(document.documentElement, { childList: true, subtree: true });

  window.SITE_PHOTO_CDN = CDN;
  window.sitePhotoCdnUrl = (season, file) => `${CDN}/assets/photos/${season}/${file}`;
})();
