/* 手机端性能：减动效、关藤蔓，不影响桌面 */
(function () {
  const MQ = window.matchMedia('(max-width: 768px)');
  window.SITE_IS_MOBILE = MQ.matches;

  function applyMobilePerf() {
    document.documentElement.classList.toggle('is-mobile', MQ.matches);
    if (MQ.matches) {
      document.body.classList.add('mobile-lite');
    } else {
      document.body.classList.remove('mobile-lite');
    }
  }

  applyMobilePerf();
  MQ.addEventListener('change', applyMobilePerf);
})();
