(function () {
  'use strict';

  /*
   * Add new YouTube video IDs here in chronological order.
   * The last ID you add is treated as the latest short.
   */
  var DAILY_SHORTS = [
    'M8DZqaM4-q8', 'CTniDtcXyvg', 'B4Ng9uI49pI', 'drjILoGSSb8', 'q-YFZTSYlIU',
    'Ma9KGG9tOGA', 'o1Jk3ldq2AQ', 'F59Wu6udQ6o', '5r68tVuCqz4', 'iioQf-IJfn8',
    'KZ2w6cpbRkU', 'I7xi57XYYAk', 'S1nUSi-_fEw', 'XFRB7AQy-NE', '8N9eQl6Vns8',
    'VGgmL9SQ_ls', 'u5X2Pdvx88k', 'zimpZAbHp44', '0VcxvuTC-7k', 'BkjBUJynaHU',
    'r0IRUmvxjdY', '99e7OcBJVUk', 'ylsUWuNRELw', '67nvk2u_8DA', 'V5Mr7g6umnc',
    'jDdIVzv1-J4', 'ob23nhWKIzc', 'jcGET1V0n9I', '1yx13ihY1Qo', 'AH90GnLC5a0',
    'Ph3yAW-Svxk', 'QgN8Q2mUpXU', 'ClqyncEK2YY', 'Z5IE8Jt1Mu8', 'WhTI004aPGE',
    '0LZaZolQWy4', 'W-90BrktqxM', '6Msb1kApsMk', 'PhDivJqdc_g', 'u7GHKXT8grs',
    'QyudtBM3GtU', '5RGI2wAC6Cw', 'qt--QasbnnU', '3_kwn0fKqYc', '5VRsIUjAASY',
    'MRL_yGNvq54', '6JP-Icioorw', 'skWl42otAPA', 'iFZ27xwDgYQ', 'pEciIgBHCsY',
    '-_U00xdWMKw', 'i6NfZQfkF40', 'lH69EEXjvQo', '-iC7Xw86Q-0', 'cXejsAKUvlU',
    'cAjkLSVs3jk', 'o3pMkmWEp-s', 'irAI4m_aouw', 'lTnTZI2C4GQ', '-yB_c35GHKE',
    'j2c9tXm7xVI', 'YnZqFICbF-k', 'SH2UlFUVPMs', '4-DVr9ULV_o', 'Y8_ymCB0YGw',
    '46VwptDhTsw', 'T3ANRP1cvVI', 'srBtUCd2PUw', 'JY5Qd0G0UUE', 'p-ANwOP8w_k',
    '4yxSt1fWtIg', 't73v3vI_CsY', 'rdS4gt55O5U', 'RE9-aRrzsUA', 'ulq8lSB4UzI',
    'vuqAqxI1Yds', '6lkgTDU39aw', 'CWnxvnBciao', 'hNyK6Hkb8pE', '25V_UbkpWbQ',
    'gnbmSl3aU4M', 'GlRppYl_TJs', 'LE-2Ag8L_OY', 'ZUBZAKMqfDc',
  ];

  function buildEmbedUrl(videoId) {
    return 'https://www.youtube-nocookie.com/embed/' +
      encodeURIComponent(videoId) +
      '?rel=0&modestbranding=1&playsinline=1';
  }

  function buildTitle(index, total) {
    return 'Yaqeen Ka Safar Short ' + (index + 1) + ' of ' + total;
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
