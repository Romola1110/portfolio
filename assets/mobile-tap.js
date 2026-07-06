/* 手机端触摸点击兜底：部分移动浏览器对内联 onclick 不响应 */
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
    });
  }

  function handleTap(e) {
    if (!isMobile()) return;

    const card = e.target.closest('.word-card[data-book-id]');
    const gallery = e.target.closest('.album-photos[data-theater]');
    if (!card && !gallery) return;

    if (e.type === 'click' && Date.now() - handleTap.lastTouch < 480) return;
    if (e.type === 'touchend') handleTap.lastTouch = Date.now();

    if (card) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof openBook === 'function') openBook(card.dataset.bookId);
      return;
    }

    if (gallery) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof openTheater === 'function') openTheater(gallery.dataset.theater);
    }
  }
  handleTap.lastTouch = 0;

  function bind() {
    if (!isMobile()) return;
    unlockSections();
    document.addEventListener('touchend', handleTap, { passive: false, capture: true });
    document.addEventListener('click', handleTap, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
  window.addEventListener('load', () => {
    unlockSections();
    setTimeout(unlockSections, 120);
  });
  MQ.addEventListener('change', () => {
    if (MQ.matches) bind();
  });
})();
