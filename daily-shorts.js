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

  function createDotButton(index, total) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'hero-short-dot';
    button.setAttribute('data-short-index', String(index));
    button.setAttribute('aria-label', 'Go to short ' + (index + 1) + ' of ' + total);
    button.setAttribute('aria-pressed', 'false');
    return button;
  }

  function updateHeroShort() {
    var wrap = document.querySelector('.hero-short-wrap');
    var frame = wrap && wrap.querySelector('iframe');
    var dots = wrap && wrap.querySelector('[data-short-dots]');
    var prevButton = wrap && wrap.querySelector('[data-short-prev]');
    var nextButton = wrap && wrap.querySelector('[data-short-next]');
    var status = wrap && wrap.querySelector('[data-short-status]');
    if (!wrap || !frame || !DAILY_SHORTS.length) return;

    var orderedShorts = DAILY_SHORTS.slice().reverse();

    var activeIndex = 0;
    var total = orderedShorts.length;

    if (dots && !dots.children.length) {
      for (var i = 0; i < total; i += 1) {
        dots.appendChild(createDotButton(i, total));
      }
    }

    function setActive(index) {
      activeIndex = (index + total) % total;

      var videoId = orderedShorts[activeIndex];
      var title = buildTitle(activeIndex, total);

      frame.src = buildEmbedUrl(videoId);
      frame.title = title;
      wrap.setAttribute('aria-label', title);

      if (status) {
        status.textContent = buildStatus(activeIndex, total);
      }

      if (prevButton) {
        prevButton.disabled = total <= 1;
      }

      if (nextButton) {
        nextButton.disabled = total <= 1;
      }

      if (dots) {
        var dotButtons = dots.querySelectorAll('.hero-short-dot');
        dotButtons.forEach(function (button, buttonIndex) {
          var isActive = buttonIndex === activeIndex;
          button.classList.toggle('is-active', isActive);
          button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      }
    }

    if (prevButton && !prevButton.dataset.bound) {
      prevButton.dataset.bound = 'true';
      prevButton.addEventListener('click', function () {
        setActive(activeIndex - 1);
      });
    }

    if (nextButton && !nextButton.dataset.bound) {
      nextButton.dataset.bound = 'true';
      nextButton.addEventListener('click', function () {
        setActive(activeIndex + 1);
      });
    }

    if (dots) {
      dots.querySelectorAll('.hero-short-dot').forEach(function (button) {
        if (button.dataset.bound) return;
        button.dataset.bound = 'true';
        button.addEventListener('click', function () {
          var index = parseInt(button.getAttribute('data-short-index'), 10);
          if (!isNaN(index)) setActive(index);
        });
      });
    }

    setActive(activeIndex);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHeroShort);
  } else {
    updateHeroShort();
  }
})();