/* 字体：优先 Google Fonts；内地加载失败时切换镜像 */
(function () {
  const QUERY = 'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Italiana&family=Noto+Serif+SC:wght@200;300;400;500;600;700;900&family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&family=LXGW+WenKai:wght@300;400;700&family=ZCOOL+XiaoWei&display=swap';
  const GOOGLE = `https://fonts.googleapis.com/css2?${QUERY}`;
  const MIRROR = `https://fonts.loli.net/css2?${QUERY}`;

  function inject(id, href) {
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function fontsReady() {
    try {
      return document.fonts && document.fonts.check('16px "Noto Serif SC"');
    } catch (_) {
      return false;
    }
  }

  inject('site-fonts-google', GOOGLE);

  let done = false;
  const useMirror = () => {
    if (done) return;
    done = true;
    if (!fontsReady()) inject('site-fonts-mirror', MIRROR);
  };

  const google = document.getElementById('site-fonts-google');
  if (google) {
    google.addEventListener('load', () => { done = true; });
    google.addEventListener('error', useMirror);
  }
  setTimeout(useMirror, 2800);
})();
