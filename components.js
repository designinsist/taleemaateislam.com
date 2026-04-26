/**
 * components.js - Taleemaat-e-Islam
 * Loads shared header.partial and footer.partial into every page,
 * then initialises: active nav link, mobile hamburger,
 * live date/time bar, and the copyright year.
 */

var SITE_SEARCH_INDEX = [
  { title: 'Home', label: 'Home', url: 'index.html', desc: 'Authentic Quranic commentary, free Islamic books, and Sunni guidance.', tags: 'taleemaat islam books quran guidance khuda mojood hai yaqeen ka safar islamic education free' },
  { title: 'Dars-e-Quran', label: 'Quran', url: 'dars-e-quran.html', desc: 'Ayah-by-ayah Quran tafseer by Mufti Shahid Mushtaq - Surah Al-Isra, Baqarah, Yunus, Yousuf, Maidah, Al-Anam, Al-Anfal, Al-Araf, Al-Hijr, An-Nahal, Ar-Raad, At-Tauba, Hud, Ibrahim and more.', tags: 'dars quran tafseer mufti shahid mushtaq audio lecture ayah bani israel isra baqarah yunus yousuf maidah anam anfal araf hijr nahal raad tauba hud ibrahim explanation urdu' },
  { title: 'Hajj 2026 Q&A', label: 'Hajj', url: 'hajj-2026.html', desc: 'Practical Hajj 2026 guidance and Q&A by Mufti Muhammad Tahir Masood.', tags: 'hajj 2026 pilgrimage mufti tahir masood ihram tawaf arafat mina umrah miqat jamarat muzdalifah qurbani wuqoof' },
  { title: 'Hajj ke Fazaail aur Aadab', label: 'Hajj', url: 'hajj-2026-mufti-ahmed-ali.html', desc: 'Virtues and etiquettes of Hajj by Mufti Ahmed Ali, graduate of Jamia Ashrafia Lahore.', tags: 'hajj fazaail aadab virtues etiquettes mufti ahmed ali jamia ashrafia lahore ikhlas sabr dhikr tawadu ihram tawaf arafat adab 2026' },
  { title: 'Connect with Allah - Free Islamic Books', label: 'Books', url: 'connect-with-allah.html', desc: '16 free Islamic books in Urdu and English - Khuda Mojood Hai, Yaqeen Ka Safar, Manzil Dua, and more.', tags: 'khuda mojood hai meet god islam science namaz al-hizb ul-azam munajat maqbool manzil dua istikhara fallacy evolution yaqeen ka safar hayat muslimeen polygamy tasawwuf allah sharam books free urdu english duas spirituality connect allah' },
  { title: 'Syed-ul-Bashar - Prophet & Companions', label: 'Seerah', url: 'syed-ul-bashar.html', desc: '10 free books on Prophet Muhammad, Seerah, Sahaba and Islamic legacy.', tags: 'prophet muhammad pbuh seerah seerat mustafa sarwar konain jadeed nabi dalail nubuwwah asbat risalat khutbat asma zariya wusool durood salawat ahl al-bayt companions sahaba' },
  { title: 'Islamic Tools - Namaz Timings & Qibla', label: 'Tools', url: 'islamic-tools.html', desc: 'Namaz timings for Pakistan cities, Hijri calendar 2026, and Qibla direction.', tags: 'namaz prayer times timings qibla hijri calendar pakistan lahore karachi fajr zuhr asr maghrib isha salah' },
  { title: 'Qasas Ul Anbiya - Stories of Prophets', label: 'Prophets', url: 'qasas-ul-anbiya.html', desc: 'Classic Urdu collection of stories of the Prophets for spiritual education.', tags: 'qasas ul anbiya prophets stories islamic urdu adam nuh ibrahim musa isa yusuf' },
  { title: 'Quranic Stories', label: 'Quran', url: 'quranic-stories.html', desc: 'Timeless Quranic stories of Yusuf, Musa, Ibrahim, Maryam, Ashab al-Kahf, Yunus, Ayyub, and Adam.', tags: 'quranic stories yusuf musa ibrahim maryam ashab kahf yunus ayyub adam quran lessons' },
  { title: 'Al-Salihin - Lives of the Righteous', label: 'Biographies', url: 'al-salihin.html', desc: "Biographies of righteous Companions, Tabi'een, and scholars - Umar, Imam Ghazali, Maulana Rumi and more.", tags: 'al salihin umar ibn khattab saad muadh umar abdul aziz imam ghazali junayd baghdadi ibrahim ibn adham maulana rumi fihi ma fihi zubaidah scholars companions biographies' }
];

(function () {
  'use strict';

  /* ── Map: page filename → which desktop nav item is "active" ── */
  const NAV_MAP = {
    'index.html'                  : 'index.html',
    ''                            : 'index.html',   // root path
    'dars-e-quran.html'           : 'quran-section',
    'quranic-stories.html'        : 'quran-section',
    'connect-with-allah.html'     : 'connect-with-allah.html',
    'hajj-2026.html'              : 'hajj-section',
    'hajj-2026-mufti-ahmed-ali.html' : 'hajj-section',
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

    /* On mobile (≤768px) always start closed - never persist open state */
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

    /* Re-evaluate on resize - close if switching to mobile while open */
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

    /* ── Gregorian date & clock - runs every second, no API needed ── */
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
     * device and browser - no more "October BC" on Android.
     *
     * Fallback : if the API is unreachable (offline / slow network)
     * the Kuwaiti algorithmic calculation runs instantly in JS and
     * gives the correct date to within 1 day with zero dependencies.
     * ────────────────────────────────────────────────────────────── */
    if (!hijriEl) return;

    /* Kuwaiti algorithm - pure JS, works offline on every device */
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

    /* Fetch Hijri date from Aladhan - called once on load, then
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
          /* Network error or offline - use instant JS fallback */
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

  /* ── Google Translate language switcher ── */
  function initGoogleTranslate() {
    var btnUr = document.getElementById('langBtnUr');
    var btnEn = document.getElementById('langBtnEn');
    if (!btnUr || !btnEn) return;

    var STORAGE_KEY = 'taleemaatLang';

    /* Enhancement #1: protect all Arabic elements from being translated */
    document.querySelectorAll('[lang="ar"]').forEach(function (el) {
      el.classList.add('notranslate');
      el.setAttribute('translate', 'no');
    });

    /* Create hidden widget container and inject Google Translate script */
    var container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.display = 'none';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ur',
        autoDisplay: false
      }, 'google_translate_element');
    };

    var gtScript = document.createElement('script');
    gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(gtScript);

    function getCombo() {
      return document.querySelector('.goog-te-combo');
    }

    /* Enhancement #2: read googtrans cookie for reliable initial state */
    function getInitialLang() {
      var match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
      if (match && decodeURIComponent(match[1]).indexOf('/ur') !== -1) return 'ur';
      try { var stored = localStorage.getItem(STORAGE_KEY); if (stored) return stored; } catch (e) {}
      return 'en';
    }

    /* Update <html lang> for accessibility/screen readers */
    function setActiveBtn(lang) {
      btnUr.classList.toggle('is-active', lang === 'ur');
      btnEn.classList.toggle('is-active', lang === 'en');
      document.documentElement.lang = (lang === 'ur') ? 'ur' : 'en';
      /* sync drawer buttons if present */
      var dUr = document.getElementById('drawerLangBtnUr');
      var dEn = document.getElementById('drawerLangBtnEn');
      if (dUr) dUr.classList.toggle('is-active', lang === 'ur');
      if (dEn) dEn.classList.toggle('is-active', lang === 'en');
    }

    /* Enhancement #4: loading state on the clicked flag */
    function setLoading(btn, on) {
      btn.disabled = on;
      btn.classList.toggle('is-loading', on);
    }

    function clearGoogTransCookie() {
      var expired = '; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
      document.cookie = 'googtrans=' + expired;
      document.cookie = 'googtrans=' + expired + '; domain=' + window.location.hostname;
      document.cookie = 'googtrans=' + expired + '; domain=.' + window.location.hostname;
    }

    function applyLang(lang, withLoading) {
      var combo = getCombo();
      if (!combo) return false;
      var activeBtn = (lang === 'ur') ? btnUr : btnEn;
      if (withLoading) setLoading(activeBtn, true);
      if (lang !== 'ur') clearGoogTransCookie();
      combo.value = (lang === 'ur') ? 'ur' : '';
      combo.dispatchEvent(new Event('change'));
      setActiveBtn(lang);
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
      if (withLoading) setTimeout(function () { setLoading(activeBtn, false); }, 900);
      return true;
    }

    /* Set correct button highlight immediately on load (before widget is ready) */
    setActiveBtn(getInitialLang());

    /* Restore translation if Urdu was previously chosen */
    function restoreLang() {
      if (getInitialLang() === 'ur') {
        var attempts = 0;
        var poll = setInterval(function () {
          attempts++;
          if (applyLang('ur', false) || attempts > 40) clearInterval(poll);
        }, 250);
      }
    }

    var readyPoll = setInterval(function () {
      if (getCombo()) { clearInterval(readyPoll); restoreLang(); }
    }, 200);
    setTimeout(function () { clearInterval(readyPoll); }, 12000);

    btnUr.addEventListener('click', function () { applyLang('ur', true); });
    btnEn.addEventListener('click', function () { applyLang('en', true); });

    /* Enhancement #5: wire up drawer buttons (added after header loads) */
    var drawerUr = document.getElementById('drawerLangBtnUr');
    var drawerEn = document.getElementById('drawerLangBtnEn');
    if (drawerUr) drawerUr.addEventListener('click', function () { applyLang('ur', true); });
    if (drawerEn) drawerEn.addEventListener('click', function () { applyLang('en', true); });
  }

  /* ── Copyright year ── */
  function initCopyrightYear() {
    var el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── Site-wide page loader ── */
  function initPageLoader() {
    try {
      if (sessionStorage.getItem('taleemaat_loaded')) return;
    } catch (e) {}

    var style = document.createElement('style');
    style.textContent =
      '#site-loader{position:fixed;inset:0;z-index:99999;background:#0d2818;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;transition:opacity 0.5s ease,visibility 0.5s ease;}' +
      '#site-loader.is-hidden{opacity:0;visibility:hidden;pointer-events:none;}' +
      '.sl-brand{color:#c9963a;font-family:"Amiri",serif;font-size:1.6rem;letter-spacing:0.04em;text-align:center;}' +
      '.sl-sub{color:rgba(255,255,255,0.45);font-family:"Nunito",sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;margin-top:-14px;}' +
      '.sl-dots{display:flex;gap:9px;margin-top:4px;}' +
      '.sl-dot{width:10px;height:10px;border-radius:50%;background:#c9963a;animation:slBounce 1.2s infinite ease-in-out;}' +
      '.sl-dot:nth-child(2){animation-delay:0.2s;}' +
      '.sl-dot:nth-child(3){animation-delay:0.4s;}' +
      '@keyframes slBounce{0%,80%,100%{transform:scale(0.55);opacity:0.35;}40%{transform:scale(1);opacity:1;}}' +
      '.sl-msg{color:rgba(255,255,255,0.55);font-family:"Nunito",sans-serif;font-size:0.8rem;text-align:center;max-width:260px;min-height:1.2em;transition:opacity 0.3s ease;}' +
      '.sl-retry{display:none;background:#c9963a;color:#0d2818;border:none;padding:10px 28px;border-radius:25px;cursor:pointer;font-family:"Nunito",sans-serif;font-weight:700;font-size:0.82rem;text-transform:uppercase;letter-spacing:0.05em;margin-top:4px;}' +
      '.sl-retry:hover{background:#e8b84b;}';
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.id = 'site-loader';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('aria-label', 'Page loading');
    overlay.innerHTML =
      '<div class="sl-brand">Taleemaat-e-Islam</div>' +
      '<div class="sl-sub">Loading</div>' +
      '<div class="sl-dots"><div class="sl-dot"></div><div class="sl-dot"></div><div class="sl-dot"></div></div>' +
      '<div class="sl-msg" id="sl-msg"></div>' +
      '<button class="sl-retry" id="sl-retry" onclick="window.location.reload()">Try Again</button>';
    document.body.insertBefore(overlay, document.body.firstChild);

    var msgEl   = document.getElementById('sl-msg');
    var retryEl = document.getElementById('sl-retry');

    var dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      try { sessionStorage.setItem('taleemaat_loaded', '1'); } catch (e) {}
      clearTimeout(slowTimer);
      clearTimeout(errorTimer);
      clearTimeout(forceTimer);
      overlay.classList.add('is-hidden');
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 520);
    }

    var slowTimer  = setTimeout(function () {
      if (msgEl) msgEl.textContent = 'Still loading, please wait\u2026';
    }, 3000);

    var errorTimer = setTimeout(function () {
      if (msgEl) msgEl.textContent = 'Taking longer than usual \u2014 check your connection.';
      if (retryEl) retryEl.style.display = 'block';
    }, 6000);

    var forceTimer = setTimeout(dismiss, 8000);

    // Dismiss when own fonts are ready - does NOT wait for third-party iframes like YouTube
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { setTimeout(dismiss, 250); });
    }
    // Fallback: window.load (covers browsers without fonts API)
    window.addEventListener('load', dismiss, { once: true });
    // Fast-path: already loaded before this script ran
    if (document.readyState === 'complete') { dismiss(); }
  }

  /* ── Search modal ── */
  function initSearch() {
    var toggleBtn = document.getElementById('searchToggle');
    var modal     = document.getElementById('searchModal');
    var closeBtn  = document.getElementById('searchClose');
    var backdrop  = document.getElementById('searchBackdrop');
    if (!toggleBtn || !modal) return;

    var searchInput  = document.getElementById('siteSearchInput');
    var resultsBox   = document.getElementById('siteSearchResults');

    function renderResults(q) {
      if (!resultsBox) return;
      q = q.trim().toLowerCase();
      if (q.length < 2) {
        resultsBox.innerHTML = '<p class="search-prompt">Type to search pages, books, topics…</p>';
        return;
      }
      var words = q.split(/\s+/);
      var matches = SITE_SEARCH_INDEX.filter(function (page) {
        var hay = (page.title + ' ' + page.desc + ' ' + page.tags).toLowerCase();
        return words.every(function (w) { return hay.indexOf(w) !== -1; });
      });
      if (!matches.length) {
        resultsBox.innerHTML = '<p class="search-no-results">No results for <strong>"' + q + '"</strong> - try a different keyword.</p>';
        return;
      }
      resultsBox.innerHTML = matches.map(function (page) {
        return '<a href="' + page.url + '" class="search-result-item" role="option">' +
          '<span class="search-result-label">' + page.label + '</span>' +
          '<span class="search-result-title">' + page.title + '</span>' +
          '<span class="search-result-desc">' + page.desc + '</span>' +
          '</a>';
      }).join('');
    }

    function openSearch() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      renderResults('');
      setTimeout(function () {
        if (searchInput) searchInput.focus();
      }, 200);
    }

    function closeSearch() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (searchInput) searchInput.value = '';
      if (resultsBox) resultsBox.innerHTML = '';
      toggleBtn.focus();
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () { renderResults(this.value); });
    }

    var drawerSearchBtn = document.getElementById('drawerSearchBtn');
    if (drawerSearchBtn) {
      drawerSearchBtn.addEventListener('click', function () {
        var drawer = document.getElementById('navDrawer');
        var hamburger = document.getElementById('hamburger');
        if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
        if (hamburger) { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
        document.body.style.overflow = '';
        openSearch();
      });
    }

    toggleBtn.addEventListener('click', openSearch);
    closeBtn.addEventListener('click', closeSearch);
    modal.addEventListener('click', function (e) {
      if (!e.target.closest('.search-modal-inner')) closeSearch();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeSearch();
    });
  }

  /* ── Bootstrap: load both partials, then initialise ── */
  function init() {
    initPageLoader();
    initBookSharing();

    var headerPromise = loadFragment('site-header', 'header.partial');
    var footerPromise = loadFragment('site-footer', 'footer.partial');

    headerPromise.then(function () {
      setActiveNav();
      initDesktopDropdown();
      initHamburger();
      initScrollToTop();
      initDateTime();
      initSearch();
      initGoogleTranslate();
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