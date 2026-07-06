/* 手机端触摸：卡片/画廊直接绑定，兼容百度等浏览器 */
(function () {
  const MQ = window.matchMedia('(max-width: 768px)');

  function isMobile() {
    return MQ.matches || document.documentElement.classList.contains('is-mobile');
  }

  function unlockSections() {
    if (!isMobile()) return;
    document.querySelectorAll('.open-section').forEach((el) => {
      el.classList.add('visible');
      el.style.pointerEvents = 'auto';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  function bindWordCard(card, bookId) {
    if (!card || card.dataset.tapBound === '1') return;
    card.dataset.tapBound = '1';
    let last = 0;
    const open = () => {
      const now = Date.now();
      if (now - last < 420) return;
      last = now;
      if (typeof openBook === 'function') openBook(bookId);
    };
    card.addEventListener('touchend', (e) => {
      e.preventDefault();
      open();
    }, { passive: false });
    card.addEventListener('click', open);
  }

  function bindTheaterGallery(el) {
    if (!el || el.dataset.tapBound === '1') return;
    const cat = el.dataset.theater;
    if (!cat) return;
    el.dataset.tapBound = '1';
    let last = 0;
    const open = () => {
      const now = Date.now();
      if (now - last < 420) return;
      last = now;
      if (typeof openTheater === 'function') openTheater(cat);
    };
    el.addEventListener('touchend', (e) => {
      e.preventDefault();
      open();
    }, { passive: false });
    el.addEventListener('click', open);
  }

  window.bindMobileWordCard = bindWordCard;
  window.bindMobileTheaterGalleries = function () {
    if (!isMobile()) return;
    document.querySelectorAll('.album-photos[data-theater]').forEach(bindTheaterGallery);
  };

  function boot() {
    if (!isMobile()) return;
    unlockSections();
    document.querySelectorAll('.word-card[data-book-id]').forEach((card) => {
      bindWordCard(card, card.dataset.bookId);
    });
    window.bindMobileTheaterGalleries();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('load', () => {
    boot();
    setTimeout(boot, 150);
    setTimeout(boot, 600);
  });
  MQ.addEventListener('change', () => {
    if (MQ.matches) boot();
  });
})();
