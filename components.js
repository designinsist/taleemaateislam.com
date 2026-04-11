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

    var drawerLinks = document.querySelectorAll('.nav-drawer .drawer-link[data-page]');
    drawerLinks.forEach(function (link) {
      if (link.getAttribute('data-page') === activeKey) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ── Accessible desktop submenu toggle ── */
  function initDesktopDropdown() {
    var toggles = document.querySelectorAll('.nav-menu .nav-menu-toggle');
    if (!toggles.length) return;

    function closeAll() {
      toggles.forEach(function (btn) {
        var parent = btn.closest('.nav-item');
        if (parent) parent.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    }

    toggles.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var parent = btn.closest('.nav-item');
        var willOpen = !(parent && parent.classList.contains('is-open'));
        closeAll();
        if (parent && willOpen) {
          parent.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });

      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeAll();
          btn.blur();
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-menu')) {
        closeAll();
      }
    });
  }

  /* ── Mobile hamburger drawer ── */
  function initHamburger() {
    var hamburger = document.getElementById('hamburger');
    var navDrawer  = document.getElementById('navDrawer');
    var drawerClose = document.getElementById('drawerClose');
    if (!hamburger || !navDrawer) return;

    function openDrawer() {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      navDrawer.classList.add('open');
      navDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var firstLink = navDrawer.querySelector('.drawer-link');
      if (firstLink) firstLink.focus();
    }

    function closeDrawer() {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navDrawer.classList.remove('open');
      navDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      hamburger.focus();
    }

    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (drawerClose) {
      drawerClose.addEventListener('click', closeDrawer);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
        closeDrawer();
        return;
      }

      if (e.key === 'Tab' && navDrawer.classList.contains('open')) {
        var focusables = navDrawer.querySelectorAll('a[href], button:not([disabled])');
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    /* Close drawer when a link inside it is clicked */
    navDrawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        closeDrawer();
      });
    });
  }

  /* ── Scroll to top button ── */
  function initScrollToTop() {
    var existingButton = document.getElementById('scrollTopButton');
    if (!existingButton) {
      existingButton = document.createElement('button');
      existingButton.type = 'button';
      existingButton.id = 'scrollTopButton';
      existingButton.className = 'scroll-top-btn';
      existingButton.setAttribute('aria-label', 'Scroll to top');
      existingButton.setAttribute('title', 'Scroll to top');
      existingButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l-8 8 1.41 1.41L11 8.83V20h2V8.83l5.59 5.58L20 13z"/></svg>';
      document.body.appendChild(existingButton);
    }

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function updateVisibility() {
      var show = window.scrollY > 500;
      existingButton.classList.toggle('is-visible', show);
    }

    existingButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
  }

  /* ── Live date / Hijri date / clock in the top bar ── */
  function initDateTime() {
    var gregEl  = document.getElementById('gregorian-date');
    var hijriEl = document.getElementById('hijri-date');
    var timeEl  = document.getElementById('live-time');
    if (!gregEl && !hijriEl && !timeEl) return;

    /* ── Gregorian date & clock — runs every second, no API needed ── */
    function tick() {
      var now = new Date();
      if (gregEl) {
        gregEl.textContent = now.toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
      }
      if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
      }
    }
    tick();
    setInterval(tick, 1000);

    /* ── Hijri date via Aladhan API ──────────────────────────────────
     * Endpoint : GET https://api.aladhan.com/v1/gToH/DD-MM-YYYY
     * Response : res.data.hijri.{ day, month.en, year }
     * This is the same trusted API powering prayer times on the site,
     * so the Hijri date is always accurate and identical on every
     * device and browser — no more "October BC" on Android.
     *
     * Fallback : if the API is unreachable (offline / slow network)
     * the Kuwaiti algorithmic calculation runs instantly in JS and
     * gives the correct date to within 1 day with zero dependencies.
     * ────────────────────────────────────────────────────────────── */
    if (!hijriEl) return;

    /* Kuwaiti algorithm — pure JS, works offline on every device */
    function hijriFallback(date) {
      var MONTHS = [
        'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
        'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', "Sha'ban",
        'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
      ];
      var jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
      var l  = jd - 1948440 + 10632;
      var n  = Math.floor((l - 1) / 10631);
      l      = l - 10631 * n + 354;
      var j  = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719)
             + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
      l      = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
             - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
      var month = Math.floor((24 * l) / 709);
      var day   = l - Math.floor((709 * month) / 24);
      var year  = 30 * n + j - 30;
      return day + ' ' + MONTHS[month - 1] + ' ' + year + ' AH';
    }

    /* Fetch Hijri date from Aladhan — called once on load, then
       again automatically at midnight if the page stays open */
    function fetchHijriDate() {
      var now  = new Date();
      var dd   = now.getDate();
      var mm   = now.getMonth() + 1;
      var yyyy = now.getFullYear();

      fetch('https://api.aladhan.com/v1/gToH/' + dd + '-' + mm + '-' + yyyy)
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.code === 200 && res.data && res.data.hijri) {
            var h = res.data.hijri;
            hijriEl.textContent = h.day + ' ' + h.month.en + ' ' + h.year + ' AH';
          } else {
            /* API responded but data was unexpected */
            hijriEl.textContent = hijriFallback(now);
          }
        })
        .catch(function () {
          /* Network error or offline — use instant JS fallback */
          hijriEl.textContent = hijriFallback(now);
        });
    }

    /* Run immediately on page load */
    fetchHijriDate();

    /* Schedule a refresh at the next midnight so the date updates
       correctly if the page is left open overnight */
    function scheduleNextMidnight() {
      var now  = new Date();
      var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      var msUntilMidnight = next - now;
      setTimeout(function () {
        fetchHijriDate();
        setInterval(fetchHijriDate, 86400000); /* then every 24 h */
      }, msUntilMidnight);
    }
    scheduleNextMidnight();
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
      initDesktopDropdown();
      initHamburger();
      initScrollToTop();
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