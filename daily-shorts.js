(function () {
  'use strict';

  /*
   * Add new YouTube video IDs here in chronological order.
   * The last ID you add is treated as the latest short.
   */
  var DAILY_SHORTS = [
    'M8DZqaM4-q8',
    'CTniDtcXyvg',
    'B4Ng9uI49pI',
    'drjILoGSSb8',
    'q-YFZTSYlIU',
    'Ma9KGG9tOGA',
    'o1Jk3ldq2AQ',
    'F59Wu6udQ6o',
    '5r68tVuCqz4',
    'iioQf-IJfn8',
    'KZ2w6cpbRkU',
    'I7xi57XYYAk',
    'S1nUSi-_fEw',
    'XFRB7AQy-NE',
    '8N9eQl6Vns8',
    'VGgmL9SQ_ls',
    'u5X2Pdvx88k',
    'zimpZAbHp44',
    '0VcxvuTC-7k',
    'BkjBUJynaHU',
  ];

  function buildEmbedUrl(videoId) {
    return 'https://www.youtube-nocookie.com/embed/' +
      encodeURIComponent(videoId) +
      '?rel=0&modestbranding=1&playsinline=1';
  }

  function buildTitle(index, total) {
    return 'Dars-e-Quran Short ' + (index + 1) + ' of ' + total;
  }

  function buildStatus(index, total) {
    return 'Short ' + (index + 1) + ' / ' + total;
  }

  function updateHeroShort() {
    var wrap = document.querySelector('.hero-short-wrap');
    var frame = wrap && wrap.querySelector('iframe');
    var prevButton = wrap && wrap.querySelector('[data-short-prev]');
    var nextButton = wrap && wrap.querySelector('[data-short-next]');
    var status = wrap && wrap.querySelector('[data-short-status]');
    if (!wrap || !frame || !DAILY_SHORTS.length) return;

    var orderedShorts = DAILY_SHORTS.slice().reverse();
    var activeIndex = 0;
    var total = orderedShorts.length;

    function setActive(index) {
      activeIndex = (index + total) % total;

      var videoId = orderedShorts[activeIndex];
      var title = buildTitle(activeIndex, total);

      frame.src = buildEmbedUrl(videoId);
      frame.title = title;
      wrap.setAttribute('aria-label', title);

      if (status) status.textContent = buildStatus(activeIndex, total);
      if (prevButton) prevButton.disabled = total <= 1;
      if (nextButton) nextButton.disabled = total <= 1;
    }

    if (prevButton && !prevButton.dataset.bound) {
      prevButton.dataset.bound = 'true';
      prevButton.addEventListener('click', function () { setActive(activeIndex - 1); });
    }

    if (nextButton && !nextButton.dataset.bound) {
      nextButton.dataset.bound = 'true';
      nextButton.addEventListener('click', function () { setActive(activeIndex + 1); });
    }

    setActive(activeIndex);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHeroShort);
  } else {
    updateHeroShort();
  }
})();