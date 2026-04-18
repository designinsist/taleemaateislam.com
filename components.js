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

  /* ── Sticky social rail ── */
  function initSocialStickyBar() {
    var rail     = document.getElementById('socialStickyRail');
    var toggle   = document.getElementById('socialStickyToggle');
    var panel    = document.getElementById('socialStickyPanel');
    var closeBtn = document.getElementById('socialStickyClose');
    var backdrop = document.getElementById('socialStickyBackdrop');
    if (!rail || !toggle || !panel) return;

    /* On mobile (≤768px) always start closed — never persist open state */
    var isMobile = function () { return window.innerWidth <= 768; };

    var storageKey = 'taleemaatSocialRailState';
    var hasStorage = false;
    try { hasStorage = !!window.localStorage; } catch (e) { hasStorage = false; }

    function getSavedState() {
      if (!hasStorage || isMobile()) return null;
      try { return window.localStorage.getItem(storageKey); } catch (e) { return null; }
    }

    function saveState(isOpen) {
      if (!hasStorage || isMobile()) return;
      try { window.localStorage.setItem(storageKey, isOpen ? 'open' : 'closed'); } catch (e) {}
    }

    function applyState(isOpen, shouldSave) {
      rail.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close social media links' : 'Open social media links');
      panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

      /* Backdrop: show on mobile when open, prevent body scroll */
      if (backdrop) {
        backdrop.classList.toggle('is-visible', isOpen && isMobile());
        backdrop.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = (isOpen && isMobile()) ? 'hidden' : '';

      if (shouldSave) saveState(isOpen);
    }

    /* Restore saved state on desktop only */
    applyState(getSavedState() === 'open', false);

    function closeRail() {
      if (!rail.classList.contains('is-open')) return;
      applyState(false, true);
      toggle.focus();
    }

    /* Toggle button */
    toggle.addEventListener('click', function () {
      var isOpen = rail.classList.contains('is-open');
      applyState(!isOpen, true);
      if (!isOpen) {
        var firstLink = panel.querySelector('a[href]');
        if (firstLink) setTimeout(function () { firstLink.focus(); }, 50);
      }
    });

    /* Close button inside panel */
    if (closeBtn) {
      closeBtn.addEventListener('click', closeRail);
    }

    /* Backdrop tap closes panel */
    if (backdrop) {
      backdrop.addEventListener('click', closeRail);
    }

    /* Clicking a social link closes panel on mobile */
    panel.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (isMobile()) applyState(false, true);
      });
    });

    /* Outside click closes panel on desktop */
    document.addEventListener('click', function (e) {
      if (
        rail.classList.contains('is-open') &&
        !rail.contains(e.target) &&
        (!backdrop || !backdrop.contains(e.target))
      ) {
        closeRail();
      }
    });

    /* Escape key always closes */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && rail.classList.contains('is-open')) {
        closeRail();
      }
    });

    /* Re-evaluate on resize — close if switching to mobile while open */
    window.addEventListener('resize', function () {
      if (isMobile() && rail.classList.contains('is-open')) {
        applyState(false, false);
      }
    }, { passive: true });
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

  /* ── Book sharing (all pages with .book-card except connect-with-allah) ── */
  function initBookSharing() {
    var pageName = window.location.pathname.split('/').pop() || 'index.html';
    if (pageName === 'connect-with-allah.html') return;

    var entries = document.querySelectorAll('.book-card, .dalail-vol');
    if (!entries.length) return;

    var toastTimer = null;

    function ensureStyles() {
      if (document.getElementById('book-share-style')) return;
      var style = document.createElement('style');
      style.id = 'book-share-style';
      style.textContent =
        '.btn-share-global{background:transparent;cursor:pointer;}' +
        '.btn-share-global.is-copied{background:rgba(30,92,56,0.12);border-color:rgba(30,92,56,0.45);color:#1e5c38;}' +
        '.book-share-highlight{border-color:rgba(201,150,58,0.78)!important;box-shadow:0 12px 34px rgba(201,150,58,0.22),0 8px 28px rgba(13,40,24,0.12)!important;animation:bookSharePulse 1.3s ease;}' +
        '@keyframes bookSharePulse{0%{transform:translateY(0);box-shadow:0 0 0 rgba(201,150,58,0)}35%{transform:translateY(-2px);box-shadow:0 0 0 8px rgba(201,150,58,0.14)}100%{transform:translateY(0);box-shadow:0 0 0 rgba(201,150,58,0)}}' +
        '.book-share-toast{position:fixed;left:50%;bottom:18px;transform:translate(-50%,12px);background:#112f1d;color:#fff;border:1px solid rgba(201,150,58,0.45);border-radius:999px;padding:8px 14px;font-size:0.76rem;letter-spacing:0.06em;text-transform:uppercase;opacity:0;visibility:hidden;transition:all 0.24s ease;z-index:1200;pointer-events:none;}' +
        '.book-share-toast.is-visible{opacity:1;visibility:visible;transform:translate(-50%,0);}';
      document.head.appendChild(style);
    }

    function slugify(text) {
      return String(text || '')
        .toLowerCase()
        .replace(/[\"'.,()!?/\\&]/g, ' ')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    function getBookTitle(card) {
      var titleNode =
        card.querySelector('.book-title-eng') ||
        card.querySelector('.book-title-urdu') ||
        card.querySelector('.vol-name') ||
        card.querySelector('h3') ||
        card.querySelector('h4');
      return titleNode ? titleNode.textContent : '';
    }

    function getBookNumber(card, fallbackIndex) {
      var numNode = card.querySelector('.book-num');
      if (!numNode) numNode = card.querySelector('.vol-num');
      if (!numNode) return fallbackIndex + 1;
      var m = (numNode.textContent || '').match(/\d+/);
      return m ? m[0] : fallbackIndex + 1;
    }

    function ensureToast() {
      var toast = document.getElementById('bookShareToast');
      if (toast) return toast;
      toast = document.createElement('div');
      toast.id = 'bookShareToast';
      toast.className = 'book-share-toast';
      toast.setAttribute('aria-live', 'polite');
      toast.setAttribute('aria-atomic', 'true');
      document.body.appendChild(toast);
      return toast;
    }

    function showToast(message) {
      var toast = ensureToast();
      toast.textContent = message;
      toast.classList.add('is-visible');
      if (toastTimer) window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(function () {
        toast.classList.remove('is-visible');
      }, 1600);
    }

    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }

      return new Promise(function (resolve, reject) {
        try {
          var area = document.createElement('textarea');
          area.value = text;
          area.setAttribute('readonly', '');
          area.style.position = 'absolute';
          area.style.left = '-9999px';
          document.body.appendChild(area);
          area.select();
          var ok = document.execCommand('copy');
          document.body.removeChild(area);
          if (ok) resolve(); else reject(new Error('copy failed'));
        } catch (err) {
          reject(err);
        }
      });
    }

    function ensureCardIdsAndButtons() {
      var usedIds = new Set();
      document.querySelectorAll('.book-card[id]').forEach(function (card) {
        usedIds.add(card.id);
      });

      entries.forEach(function (card, idx) {
        if (!card.id) {
          var bookNumber = getBookNumber(card, idx);
          var baseTitle = slugify(getBookTitle(card)) || 'book';
          var baseId = 'book-' + String(bookNumber).padStart(2, '0') + '-' + baseTitle;
          var finalId = baseId;
          var suffix = 2;
          while (usedIds.has(finalId)) {
            finalId = baseId + '-' + suffix;
            suffix += 1;
          }
          card.id = finalId;
          usedIds.add(finalId);
        }

        var actions = card.querySelector('.book-actions') || card.querySelector('.vol-actions');
        if (!actions || actions.querySelector('.btn-share-global, .btn-share')) return;

        var shareBtn = document.createElement('button');
        shareBtn.type = 'button';
        shareBtn.className = 'btn-dl btn-share-global';
        shareBtn.setAttribute('aria-label', 'Share this book');
        shareBtn.textContent = 'Share Book';
        shareBtn.addEventListener('click', function () {
          var link = window.location.origin + window.location.pathname + '#' + card.id;
          copyText(link).then(function () {
            shareBtn.classList.add('is-copied');
            shareBtn.textContent = 'Copied!';
            showToast('Link copied');
            window.setTimeout(function () {
              shareBtn.classList.remove('is-copied');
              shareBtn.textContent = 'Share Book';
            }, 1600);
          }).catch(function () {
            showToast('Copy failed');
          });
        });
        actions.appendChild(shareBtn);
      });
    }

    function revealTarget(card) {
      var panel = card.closest('.panel');
      if (panel && panel.id) {
        var tabBtn = document.querySelector('.tab-btn[data-panel="' + panel.id + '"]');
        if (tabBtn) tabBtn.click();
      }

      if (window.innerWidth <= 768) {
        var outerAcc = card.closest('.acc-unit');
        if (outerAcc) {
          var outerHdr = outerAcc.querySelector('.acc-hdr');
          if (outerHdr && !outerHdr.classList.contains('is-open')) outerHdr.click();
        }

        var seerahBody = card.closest('.seerah-acc-body');
        if (seerahBody && !seerahBody.classList.contains('is-open') && seerahBody.id) {
          var seerahHdr = document.querySelector('.seerah-acc-hdr[data-seerah-acc="' + seerahBody.id + '"]');
          if (seerahHdr && !seerahHdr.classList.contains('is-open')) seerahHdr.click();
        }
      }
    }

    function focusHashBook() {
      if (!window.location.hash) return;
      var id = window.location.hash.slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      if (!target.classList.contains('book-card') && !target.classList.contains('dalail-vol')) return;

      revealTarget(target);

      window.setTimeout(function () {
        document.querySelectorAll('.book-share-highlight').forEach(function (el) {
          el.classList.remove('book-share-highlight');
        });
        target.classList.add('book-share-highlight');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.setTimeout(function () {
          target.classList.remove('book-share-highlight');
        }, 2400);
      }, 180);
    }

    ensureStyles();
    ensureCardIdsAndButtons();
    focusHashBook();
    window.addEventListener('hashchange', focusHashBook);
  }

  /* ── Copyright year ── */
  function initCopyrightYear() {
    var el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── Bootstrap: load both partials, then initialise ── */
  function init() {
    initBookSharing();

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
      initSocialStickyBar();
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