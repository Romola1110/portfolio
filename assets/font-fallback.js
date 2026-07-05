/* 字体：内地优先镜像；海外优先 Google Fonts */
(function () {
  const QUERY = 'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Italiana&family=Noto+Serif+SC:wght@200;300;400;500;600;700;900&family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&family=LXGW+WenKai:wght@300;400;700&family=ZCOOL+XiaoWei&display=swap';
  const GOOGLE = `https://fonts.googleapis.com/css2?${QUERY}`;
  const MIRRORS = [
    `https://fonts.loli.net/css2?${QUERY}`,
    `https://fonts.geekzu.org/css2?${QUERY}`
  ];

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
      return document.fonts && (
        document.fonts.check('16px "LXGW WenKai"') ||
        document.fonts.check('16px "Noto Serif SC"') ||
        document.fonts.check('16px "ZCOOL XiaoWei"')
      );
    } catch (_) {
      return false;
    }
  }

  let mirrorIdx = 0;
  let done = false;

  function tryNextMirror() {
    if (done || mirrorIdx >= MIRRORS.length) return;
    const link = inject(`site-fonts-mirror-${mirrorIdx}`, MIRRORS[mirrorIdx]);
    mirrorIdx += 1;
    if (!link) return;
    link.addEventListener('load', () => { if (fontsReady()) done = true; });
    link.addEventListener('error', tryNextMirror);
  }

  function tryGoogle() {
    if (done) return;
    const link = inject('site-fonts-google', GOOGLE);
    if (!link) return;
    link.addEventListener('load', () => { done = true; });
    link.addEventListener('error', tryNextMirror);
  }

  if (mainland) {
    tryNextMirror();
    setTimeout(() => { if (!fontsReady()) tryGoogle(); }, 3200);
  } else {
    tryGoogle();
    setTimeout(() => { if (!fontsReady()) tryNextMirror(); }, 2800);
  }
})();
