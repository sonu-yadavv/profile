/* =========================================================================
   Sonu Yadav — portfolio
   No dependencies. Everything here degrades: with JavaScript off you still get
   the full page, working navigation and a contact form that submits normally.
   ========================================================================= */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------------------------- theme ----------------------------------- */

  var root = document.documentElement;
  var themeBtn = $('#theme-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    });
  }
  applyTheme(root.getAttribute('data-theme') || 'dark');

  /* Follow the system if the visitor has never chosen explicitly. */
  var mq = window.matchMedia('(prefers-color-scheme: light)');
  var onSystemChange = function (e) {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
    if (!stored) applyTheme(e.matches ? 'light' : 'dark');
  };
  if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
  else if (mq.addListener) mq.addListener(onSystemChange);

  /* --------------------------- mobile nav ------------------------------- */

  var nav = $('#nav');
  var navToggle = $('#nav-toggle');
  var navScrim = $('#nav-scrim');

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (navScrim) navScrim.hidden = !open;
    document.body.classList.toggle('is-locked', open);
  }

  var closeNav = function () { setNav(false); };

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });

    /* Tapping a link, the dimmed page, or Escape all close it — an open menu
       with no way out but the button you came from is a trap on a phone. */
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
    if (navScrim) navScrim.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    /* Rotating to landscape can cross the breakpoint, which leaves the menu
       "open" while the desktop nav is what is actually on screen — and the
       scroll lock stuck on with it. */
    window.addEventListener('resize', function () {
      if (nav.classList.contains('is-open') && window.innerWidth > 760) closeNav();
    });
  }

  /* ------------------- header shadow + scroll spy ----------------------- */

  var header = $('.site-header');
  var toTop = $('#to-top');
  var navLinks = $$('.nav a[href^="#"]');
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY;
      if (header) header.classList.toggle('is-stuck', y > 4);

      /* Visible once you are well down the page, and gone again at the very
         bottom — the footer has its own "Back to top" link, and the two sitting
         beside each other just reads as a duplicate control. */
      if (toTop) {
        var nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - 140;
        toTop.classList.toggle('is-visible', y > 600 && !nearBottom);
      }

      /* Whichever section owns the line just below the sticky header. */
      var mark = y + (header ? header.offsetHeight : 0) + 24;
      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= mark) current = sections[i].id;
      }
      navLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
      });

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------- galleries -------------------------------- */

  var GALLERIES = {
    result: {
      title: 'Result Analysis, June 2024',
      shots: [
        ['result-analysis/dashboard.webp', 'Interactive results dashboard'],
        ['result-analysis/cleaned.webp', 'The dataset after cleaning'],
        ['result-analysis/raw.webp', 'Raw data before analysis']
      ]
    },
    sales: {
      title: 'Sales Analysis Dashboard',
      shots: [
        ['sales-analysis/Sales-dashboard.webp', 'Sales performance dashboard'],
        ['sales-analysis/sales-tableRelation.webp', 'Table relationships behind the model']
      ]
    },
    ads: {
      title: 'Facebook Ad Campaign Analysis',
      shots: [
        ['ad-analysis/Picture1.webp', 'Campaign analysis deck'],
        ['ad-analysis/Picture2.webp', 'Campaign analysis deck'],
        ['ad-analysis/Picture3.webp', 'Campaign analysis deck'],
        ['ad-analysis/Picture4.webp', 'Campaign analysis deck'],
        ['ad-analysis/Picture5.webp', 'Campaign analysis deck'],
        ['ad-analysis/Picture7.webp', 'Campaign analysis deck'],
        ['ad-analysis/Picture8.webp', 'Campaign analysis deck'],
        ['ad-analysis/Picture9.webp', 'Campaign analysis deck']
      ]
    },
    blocker: {
      title: 'Website Access Blocker — Chrome extension',
      shots: [
        ['blocker-chrome/main-page.webp', 'Extension home'],
        ['blocker-chrome/blocked-page.webp', 'A blocked site'],
        ['blocker-chrome/home.webp', 'Pop-up'],
        ['blocker-chrome/home2.webp', 'Pop-up'],
        ['blocker-chrome/home3.webp', 'Pop-up'],
        ['blocker-chrome/settings-page.webp', 'Settings'],
        ['blocker-chrome/stats.webp', 'Usage statistics'],
        ['blocker-chrome/premium.webp', 'Premium tier'],
        ['blocker-chrome/support.webp', 'Support']
      ]
    },
    amazon: {
      title: 'Amazon Clone',
      shots: [
        ['amazon-clone/home.webp', 'Home page'],
        ['amazon-clone/login.webp', 'Sign in'],
        ['amazon-clone/checkout.webp', 'Checkout']
      ]
    },
    mes: {
      title: 'MES System',
      shots: [
        ['mes-system/dashboard.webp', 'Dashboard'],
        ['mes-system/productionTracking.webp', 'Production tracking'],
        ['mes-system/inspection.webp', 'Inspection'],
        ['mes-system/inspectionList.webp', 'Inspection list']
      ]
    },
    approval: {
      title: 'Email Approval System',
      shots: [
        ['approval-system/email_approval.webp', 'Approval notification email'],
        ['approval-system/approval_page.webp', 'Approval page'],
        ['approval-system/approved_status.webp', 'Approval status']
      ]
    },
    resumebank: {
      title: 'Resume Bank',
      shots: [
        ['resumebank/resume_dashboard.webp', 'Résumé dashboard'],
        ['resumebank/detailed_positions.webp', 'Detailed view of positions']
      ]
    }
  };

  var lb = $('#lightbox');
  var lbImg = $('#lb-img');
  var lbTitle = $('#lb-title');
  var lbCaption = $('#lb-caption');
  var lbPrev = $('#lb-prev');
  var lbNext = $('#lb-next');
  var lbClose = $('#lb-close');

  var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  var shots = [];
  var index = 0;
  var opener = null;

  function show(i) {
    if (!shots.length) return;
    index = (i + shots.length) % shots.length;
    lbImg.src = shots[index][0];
    lbImg.alt = shots[index][1];
    lbCaption.textContent = shots[index][1] + '  ·  ' + (index + 1) + ' of ' + shots.length;
    var single = shots.length < 2;
    lbPrev.hidden = single;
    lbNext.hidden = single;
    /* Warm the next one so arrowing through does not flash. */
    if (!single) { new Image().src = shots[(index + 1) % shots.length][0]; }
  }

  function openGallery(key, trigger) {
    var g = GALLERIES[key];
    if (!g || !lb) return;
    shots = g.shots;
    opener = trigger;
    lbTitle.textContent = g.title;
    show(0);
    lb.hidden = false;
    document.body.classList.add('is-locked');
    lbClose.focus();
  }

  function closeGallery() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    /* Back to the placeholder rather than removing the attribute — a src-less
       img is invalid and paints a broken-image icon. */
    lbImg.src = BLANK;
    lbImg.alt = '';
    document.body.classList.remove('is-locked');
    if (opener) { opener.focus(); opener = null; }
  }

  $$('[data-gallery]').forEach(function (btn) {
    btn.addEventListener('click', function () { openGallery(btn.getAttribute('data-gallery'), btn); });
  });

  if (lb) {
    lbClose.addEventListener('click', closeGallery);
    lbPrev.addEventListener('click', function () { show(index - 1); });
    lbNext.addEventListener('click', function () { show(index + 1); });

    /* Click the backdrop, not the panel. */
    lb.addEventListener('mousedown', function (e) { if (e.target === lb) closeGallery(); });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') { closeGallery(); return; }
      if (e.key === 'ArrowLeft') { show(index - 1); return; }
      if (e.key === 'ArrowRight') { show(index + 1); return; }

      /* Keep Tab inside the dialog — a modal you can tab out of behind is not
         modal, and a screen-reader user ends up lost on the page underneath. */
      if (e.key !== 'Tab') return;
      var focusables = $$('button:not([hidden])', lb);
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* --------------------------- contact form ------------------------------ */

  var form = $('#contact-form');
  var note = $('#form-note');

  if (form && window.fetch) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var original = btn.textContent;

      note.classList.remove('is-error');
      note.textContent = '';
      btn.disabled = true;
      btn.textContent = 'Sending…';

      /* The AJAX endpoint answers with CORS, so the visitor never leaves the
         page. Without JavaScript the plain form action still posts normally. */
      fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); })
        .then(function () {
          form.reset();
          note.textContent = 'Thanks — your message is on its way. I will reply to the address you gave.';
        })
        .catch(function () {
          note.classList.add('is-error');
          note.innerHTML = 'That did not send. Please email me directly at '
            + '<a href="mailto:sonu.yadavv.work@gmail.com">sonu.yadavv.work@gmail.com</a>.';
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = original;
        });
    });
  }

  /* ------------------------------ footer -------------------------------- */

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
