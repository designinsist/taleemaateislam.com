(function () {
  'use strict';

  /*
   * Add new YouTube video IDs here.
   * The page will rotate through this list one video per UTC day.
   */
  var DAILY_SHORTS = [
    'M8DZqaM4-q8',
    'CTniDtcXyvg',
    'B4Ng9uI49pI',
    'drjILoGSSb8'
  ];

  function getUtcDayIndex(length) {
    var now = new Date();
    var utcDay = Math.floor(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    ) / 86400000);

    return utcDay % length;
  }

  function buildEmbedUrl(videoId) {
    return 'https://www.youtube-nocookie.com/embed/' +
      encodeURIComponent(videoId) +
      '?rel=0&modestbranding=1&playsinline=1';
  }

  function updateHeroShort() {
    var wrap = document.querySelector('.hero-short-wrap');
    var frame = wrap && wrap.querySelector('iframe');
    if (!wrap || !frame || !DAILY_SHORTS.length) return;

    var videoId = DAILY_SHORTS[getUtcDayIndex(DAILY_SHORTS.length)];
    var title = 'Dars-e-Quran — Taleemaat-e-Islam';

    frame.src = buildEmbedUrl(videoId);
    frame.title = title;
    wrap.setAttribute('aria-label', title);

    var label = wrap.querySelector('.hero-short-label');
    if (label) label.textContent = '▶ Today\'s Dars-e-Quran';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHeroShort);
  } else {
    updateHeroShort();
  }
})();