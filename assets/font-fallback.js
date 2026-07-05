/* 字体：优先国内镜像（loli / geekzu），海外可回退 Google Fonts */
(function () {
  const QUERY = 'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Italiana&family=Noto+Serif+SC:wght@200;300;400;500;600;700;900&family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&family=LXGW+WenKai:wght@300;400;700&family=ZCOOL+XiaoWei&display=swap';
  const CN_MIRRORS = [
    `https://fonts.loli.net/css2?${QUERY}`,
    `https://fonts.geekzu.org/css2?${QUERY}`
  ];
  const GOOGLE = `https://fonts.googleapis.com/css2?${QUERY}`;

  function inject(id, href) {
    if (document.getElementById(id)) return null;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return link;
  }

  function fontsReady() {
    try {
      return document.fonts && document.fonts.check('16px "Noto Serif SC"');
    } catch (_) {
      return false;
    }
  }

  let idx = 0;
  let done = false;

  function tryNext() {
    if (done) return;
    if (idx < CN_MIRRORS.length) {
      const link = inject(`site-fonts-cn-${idx}`, CN_MIRRORS[idx]);
      idx += 1;
      if (!link) return;
      link.addEventListener('load', () => { if (fontsReady()) done = true; });
      link.addEventListener('error', tryNext);
      return;
    }
    const google = inject('site-fonts-google', GOOGLE);
    if (google) {
      google.addEventListener('load', () => { done = true; });
      google.addEventListener('error', () => { done = true; });
    }
  }

  tryNext();
  setTimeout(() => { if (!fontsReady()) tryNext(); }, 2800);
})();
