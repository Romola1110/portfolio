/* 内地访问：GitHub Pages 慢/被墙时，图片与静态资源走 jsDelivr 镜像（main 分支） */
(function () {
  const REPO = 'Romola1110/portfolio';
  const BRANCH = 'main';
  const CDN_HOSTS = [
    'https://fastly.jsdelivr.net/gh',
    'https://gcore.jsdelivr.net/gh',
    'https://cdn.jsdelivr.net/gh',
    'https://jsd.onmicrosoft.cn/gh'
  ];
  const STALL_MS = 4500;
  const STALL_MS_MAINLAND = 2200;

  function isMainland() {
    const lang = (navigator.language || '').toLowerCase();
    if (/^zh(-cn|-hans)?$/i.test(lang) || lang === 'zh') return true;
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Shanghai';
    } catch (_) {
      return false;
    }
  }

  const mainland = isMainland();
  window.SITE_USE_CDN = mainland;

  function normalizePath(src) {
    if (!src || src.startsWith('data:')) return '';
    if (src.includes('jsdelivr.net') || src.includes('onmicrosoft.cn')) return '';
    let path = src;
    if (/^https?:\/\//i.test(path)) {
      path = path.replace(/^https?:\/\/[^/]+\//, '');
    }
    path = path.replace(/^\//, '');
    if (/^(assets\/|yuwei|yuweifanti|1\.(jpg|png)|2\.png|3\.png)/i.test(path)) return path;
    if (/\.(jpg|jpeg|png|webp|gif|woff2|ttf|pdf)$/i.test(path)) return path;
    return '';
  }

  function cdnUrl(path, hostIndex) {
    const host = CDN_HOSTS[hostIndex || 0];
    return `${host}/${REPO}@${BRANCH}/${path}`;
  }

  function siteAssetUrl(src) {
    const path = normalizePath(src);
    return path ? cdnUrl(path, 0) : src;
  }

  window.siteAssetUrl = siteAssetUrl;
  window.sitePhotoCdnUrl = (season, file) => cdnUrl(`assets/photos/${season}/${file}`, 0);
  window.SITE_PHOTO_CDN = cdnUrl('assets/photos', 0);

  function nextCdn(src) {
    const path = normalizePath(src);
    if (!path) return '';
    for (let i = 0; i < CDN_HOSTS.length; i++) {
      const url = cdnUrl(path, i);
      if (src !== url) return url;
    }
    return '';
  }

  function pickSrc(localSrc) {
    if (!mainland) return localSrc;
    const cdn = siteAssetUrl(localSrc);
    return cdn || localSrc;
  }

  window.sitePickAssetSrc = pickSrc;

  function retryImg(img) {
    if (!img || img.dataset.gaveUp === '1') return;
    const current = img.getAttribute('src') || '';
    const next = nextCdn(current);
    if (next && current !== next) {
      img.dataset.cdnRetry = String((Number(img.dataset.cdnRetry) || 0) + 1);
      img.src = next;
      return;
    }
    const path = normalizePath(current);
    if (path && mainland && !current.includes('github.io')) {
      const local = path;
      if (current !== local) {
        img.src = local;
        return;
      }
    }
    img.dataset.gaveUp = '1';
  }

  function applyImg(img) {
    if (!img || img.tagName !== 'IMG' || img.dataset.cdnWatch === '1') return;
    img.dataset.cdnWatch = '1';
    const raw = img.getAttribute('src') || '';
    if (mainland && raw && !raw.includes('jsdelivr.net')) {
      const preferred = pickSrc(raw);
      if (preferred && preferred !== raw) img.src = preferred;
    }
    img.addEventListener('error', () => retryImg(img));
    const stall = mainland ? STALL_MS_MAINLAND : STALL_MS;
    setTimeout(() => {
      if (!img.complete || img.naturalWidth === 0) retryImg(img);
    }, stall);
  }

  document.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') retryImg(e.target);
  }, true);

  function scan(root) {
    (root.querySelectorAll ? root : document).querySelectorAll('img').forEach(applyImg);
  }

  scan(document);
  new MutationObserver((muts) => {
    muts.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      if (n.tagName === 'IMG') applyImg(n);
      else scan(n);
    }));
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
