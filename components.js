/**
 * components.js — Taleemaat-e-Islam
 * Loads shared header.partial and footer.partial into every page,
 * then initialises: active nav link, mobile hamburger,
 * live date/time bar, and the copyright year.
 */

(function () {
  'use strict';

  /* ── Map: page filename → which desktop nav item is "active" ── */
  const NAV_MAP = {
    'index.html'                  : 'index.html',
    ''                            : 'index.html',   // root path
    'dars-e-quran.html'           : 'quran-section',
    'quranic-stories.html'        : 'quran-section',
    'connect-with-allah.html'     : 'connect-with-allah.html',
    'syed-ul-bashar.html'         : 'syed-ul-bashar.html',
    'islamic-tools.html'          : 'islamic-tools.html',
    'qasas-ul-anbiya.html'        : 'qasas-ul-anbiya.html',
    'al-salihin.html'             : 'al-salihin.html',
  };

  /* ── Read fragment text with fetch first, XHR fallback for local file usage ── */
  function readFragmentText(path) {
    return fetch(path)
      .then(function (res) {
        if (!res.ok) throw new Error('Could not load ' + path);
        return res.text();
      })
      .catch(function () {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', path, true);
          xhr.onload = function () {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
              resolve(xhr.responseText);
              return;
            }
            reject(new Error('Could not load ' + path));
          };
          xhr.onerror = function () {
            reject(new Error('Could not load ' + path));
          };
          xhr.send();
        });
      });
  }

  /* ── Fetch a HTML fragment and replace the placeholder element ── */
  function loadFragment(containerId, filePath) {
    var candidates = [filePath, './' + filePath];

    function tryPath(idx) {
      if (idx >= candidates.length) {
        throw new Error('Could not load any candidate for ' + filePath);
      }

      return readFragmentText(candidates[idx]).catch(function () {
        return tryPath(idx + 1);
      });
    }

    return tryPath(0).then(function (html) {
      var el = document.getElementById(containerId);
      if (el) el.innerHTML = html;
    });
  }

  /* ── Set active class on the matching desktop nav link ── */
  function setActiveNav() {
    var page = window.location.pathname.split('/').pop();
    var activeKey = NAV_MAP[page] || '';
    if (!activeKey) return;

    var links = document.querySelectorAll('.nav-menu .nav-link[data-page]');
    links.forEach(function (link) {
      if (link.getAttribute('data-page') === activeKey) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ── Mobile hamburger drawer ── */
  function initHamburger() {
    var hamburger = document.getElementById('hamburger');
    var navDrawer  = document.getElementById('navDrawer');
    if (!hamburger || !navDrawer) return;

    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      navDrawer.classList.toggle('open', isOpen);
      navDrawer.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close drawer when a link inside it is clicked */
    navDrawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        navDrawer.classList.remove('open');
        navDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Live date / Hijri date / clock in the top bar ── */
  function initDateTime() {
    var gregEl  = document.getElementById('gregorian-date');
    var hijriEl = document.getElementById('hijri-date');
    var timeEl  = document.getElementById('live-time');
    if (!gregEl && !hijriEl && !timeEl) return;

    var hijriFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    function tick() {
      var now = new Date();

      if (gregEl) {
        gregEl.textContent = now.toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
      }
      if (hijriEl) {
        hijriEl.textContent = hijriFormatter.format(now);
      }
      if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
      }
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ── Copyright year ── */
  function initCopyrightYear() {
    var el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── Bootstrap: load both partials, then initialise ── */
  function init() {
    var headerPromise = loadFragment('site-header', 'header.partial');
    var footerPromise = loadFragment('site-footer', 'footer.partial');

    headerPromise.then(function () {
      setActiveNav();
      initHamburger();
      initDateTime();
    }).catch(function (err) {
      console.error('Header load failed:', err);
    });

    footerPromise.then(function () {
      initCopyrightYear();
    }).catch(function (err) {
      console.error('Footer load failed:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
