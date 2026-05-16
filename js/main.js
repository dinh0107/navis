(function ($) {
  'use strict';

  function getGoogTransCookie() {
    var m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function isEnglishTranslationActive() {
    var v = getGoogTransCookie();
    if (!v) {
      return false;
    }
    return /\/en(\/|$)/.test(v);
  }

  function setGoogTransViToEn() {
    document.cookie = 'googtrans=/vi/en;path=/';
  }

  function clearTranslationCookies() {
    var exp = 'Thu, 01 Jan 1970 00:00:01 GMT';
    var host = window.location.hostname;
    var names = ['googtrans', 'googtransopt'];
    names.forEach(function (name) {
      document.cookie = name + '=;expires=' + exp + ';path=/';
      if (host) {
        document.cookie = name + '=;expires=' + exp + ';path=/;domain=' + host;
        document.cookie = name + '=;expires=' + exp + ';path=/;domain=.' + host;
      }
    });
  }

  function syncLocaleToggleUi() {
    var en = isEnglishTranslationActive();
    var flagVi = './assets/vn.svg';
    var flagEn = './assets/gb.svg';
    $('.site-header__locale').each(function () {
      var $btn = $(this);
      $btn.toggleClass('site-header__locale--en', en);
      $btn.attr('aria-checked', en ? 'true' : 'false');
      $btn.attr(
        'aria-label',
        en ? 'Chuyển về tiếng Việt (tắt Google Dịch)' : 'Chuyển sang tiếng Anh bằng Google Dịch'
      );
      var $img = $btn.find('.site-header__locale-flag');
      if ($img.length) {
        $img.attr('src', en ? flagEn : flagVi);
      }
      $btn.find('.site-header__locale-code').text(en ? 'EN' : 'VN');
    });
  }

  var googleTranslateLoadStarted = false;

  function initGoogleTranslateForToggle() {
    if (googleTranslateLoadStarted) {
      return;
    }
    googleTranslateLoadStarted = true;

    window.navisGoogleTranslateElementInit = function () {
      var mount = document.getElementById('google_translate_element');
      if (!mount) {
        mount = document.createElement('div');
        mount.id = 'google_translate_element';
        mount.setAttribute('aria-hidden', 'true');
        document.body.appendChild(mount);
      }
      try {
        if (window.google && google.translate && google.translate.TranslateElement) {
          var layout =
            google.translate.TranslateElement.InlineLayout != null
              ? google.translate.TranslateElement.InlineLayout.SIMPLE
              : 0;
          new google.translate.TranslateElement(
            {
              pageLanguage: 'vi',
              includedLanguages: 'en,vi',
              layout: layout
            },
            'google_translate_element'
          );
        }
      } catch (e) {
        /* Google Translate không khả dụng (mạng, chặn quảng cáo, v.v.) */
      }
      syncLocaleToggleUi();
    };

    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      window.navisGoogleTranslateElementInit();
      return;
    }

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://translate.google.com/translate_a/element.js?cb=navisGoogleTranslateElementInit';
    s.onerror = function () {
      googleTranslateLoadStarted = false;
    };
    document.head.appendChild(s);
  }

  function initLocaleToggle() {
    if (!$('.site-header__locale').length) {
      return;
    }
    syncLocaleToggleUi();
    initGoogleTranslateForToggle();

    $(document).on('click', '.site-header__locale', function () {
      var goingEn = !isEnglishTranslationActive();
      var flagVi = './assets/vn.svg';
      var flagEn = './assets/gb.svg';
      var $btn = $(this);
      $btn.toggleClass('site-header__locale--en', goingEn);
      $btn.attr('aria-checked', goingEn ? 'true' : 'false');
      $btn.attr(
        'aria-label',
        goingEn ? 'Chuyển về tiếng Việt (tắt Google Dịch)' : 'Chuyển sang tiếng Anh bằng Google Dịch'
      );
      $btn.find('.site-header__locale-flag').attr('src', goingEn ? flagEn : flagVi);
      $btn.find('.site-header__locale-code').text(goingEn ? 'EN' : 'VN');
      if (goingEn) {
        setGoogTransViToEn();
      } else {
        clearTranslationCookies();
      }
      // window.location.reload();
    });
  }

  function initServiceSlider() {
    var $el = $('#services-slider');
    if (!$el.length || typeof $.fn.slick !== 'function' || $el.hasClass('slick-initialized')) {
      return;
    }
    $el.slick({
      dots: false,
      arrows: true,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      prevArrow:
        "<button type='button' aria-label='Trước' class='slick-prev'><i class='fa-sharp fa-light fa-arrow-left' aria-hidden='true'></i></button>",
      nextArrow:
        "<button type='button' aria-label='Sau' class='slick-next'><i class='fa-sharp fa-light fa-arrow-right' aria-hidden='true'></i></button>",
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1, arrows: true, dots: false } },
        { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: true, dots: false } },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true
          }
        }
      ]
    });
  }

  function initServiceSolutionsGridSlider() {
    var $g = $('.service-solutions__grid');
    if (!$g.length || typeof $.fn.slick !== 'function') {
      return;
    }

    var mq = window.matchMedia('(max-width: 991.98px)');

    function apply() {
      if (mq.matches) {
        if (!$g.hasClass('slick-initialized')) {
          $g.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true,
            infinite: true,
            adaptiveHeight: true,
            speed: 300,
            cssEase: 'ease-out'
          });
        }
      } else if ($g.hasClass('slick-initialized')) {
        $g.slick('unslick');
      }
    }

    apply();

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply);
    } else {
      $(window).on('resize.serviceSolutionsGrid', apply);
    }
  }

  function initServicePartnersLogosSlider() {
    var $blocks = $('.service-partners__logos');
    if (!$blocks.length || typeof $.fn.slick !== 'function') {
      return;
    }

    var mq = window.matchMedia('(max-width: 991.98px)');

    function apply() {
      $blocks.each(function () {
        var $el = $(this);
        if (mq.matches) {
          if (!$el.hasClass('slick-initialized')) {
            $el.slick({
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              arrows: false,
              dots: false,
              speed: 300,
              cssEase: 'ease-out',
              swipe: true
            });
          }
        } else if ($el.hasClass('slick-initialized')) {
          $el.slick('unslick');
        }
      });
    }

    apply();

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply);
    } else {
      $(window).on('resize.servicePartnersLogos', apply);
    }
  }

  function initBlogSlider() {
    var $el = $('#blog-slider');
    if (!$el.length || typeof $.fn.slick !== 'function' || $el.hasClass('slick-initialized')) {
      return;
    }
    $el.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: true,
      dots: true,
      arrows: false,
      speed: 400,
      cssEase: 'ease-out',
      adaptiveHeight: true,
      responsive: [
        { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });
  }

  function initServiceNewsSlider() {
    var $el = $('#service-news-slider');
    if (!$el.length || typeof $.fn.slick !== 'function' || $el.hasClass('slick-initialized')) {
      return;
    }
    $el.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: true,
      dots: false,
      arrows: false,
      speed: 400,
      cssEase: 'ease-out',
      adaptiveHeight: true,
      responsive: [
        { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });

    var $news = $el.closest('.service-news');
    $news.find('.service-news__arrow--prev').on('click', function () {
      $el.slick('slickPrev');
    });
    $news.find('.service-news__arrow--next').on('click', function () {
      $el.slick('slickNext');
    });
  }

  function initAboutDiffSlider() {
    var $el = $('.about-diff-slider');
    if (!$el.length || typeof $.fn.slick !== 'function' || $el.hasClass('slick-initialized')) {
      return;
    }
    $el.slick({
      dots: false,
      arrows: false,
      infinite: true,
      speed: 400,
      slidesToShow: 4,
      slidesToScroll: 1,
      cssEase: 'ease-out',
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });
  }


  function initProjectsCasesSlider() {
    var $section = $('.projects-cases');
    if (!$section.length) {
      return;
    }

    var $tabs = $section.find('.projects-cases__tab');
    $tabs.on('click', function () {
      var $btn = $(this);
      $tabs.removeClass('projects-cases__tab--active').attr('aria-selected', 'false');
      $btn.addClass('projects-cases__tab--active').attr('aria-selected', 'true');
    });

    var $el = $('#projects-cases-slider');
    if (!$el.length || typeof $.fn.slick !== 'function' || $el.hasClass('slick-initialized')) {
      return;
    }

    $el.slick({
      dots: true,
      arrows: false,
      infinite: true,
      speed: 400,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      swipe: true,
      cssEase: 'ease-out',
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            dots: false
          }
        }
      ]
    });

    $section.find('.projects-cases__arrow--prev').on('click', function () {
      $el.slick('slickPrev');
    });
    $section.find('.projects-cases__arrow--next').on('click', function () {
      $el.slick('slickNext');
    });
  }

  function initProjectDetailRelatedSlider() {
    var $section = $('.project-detail-related');
    if (!$section.length) {
      return;
    }

    var $el = $('#project-detail-related-slider');
    if (!$el.length || typeof $.fn.slick !== 'function' || $el.hasClass('slick-initialized')) {
      return;
    }

    $el.slick({
      dots: false,
      arrows: false,
      infinite: true,
      speed: 400,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      swipe: true,
      cssEase: 'ease-out'
    });

    $section.find('.project-detail-related__arrow--prev').on('click', function () {
      $el.slick('slickPrev');
    });
    $section.find('.project-detail-related__arrow--next').on('click', function () {
      $el.slick('slickNext');
    });
  }

  function initNewsDetailRelatedSlider() {
    var $section = $('.news-detail-related');
    if (!$section.length) {
      return;
    }

    var $el = $('#news-detail-related-slider');
    if (!$el.length || typeof $.fn.slick !== 'function' || $el.hasClass('slick-initialized')) {
      return;
    }

    $el.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: true,
      dots: false,
      arrows: false,
      speed: 400,
      cssEase: 'ease-out',
      adaptiveHeight: true,
      responsive: [
        { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });

    $section.find('.news-detail-related__arrow--prev').on('click', function () {
      $el.slick('slickPrev');
    });
    $section.find('.news-detail-related__arrow--next').on('click', function () {
      $el.slick('slickNext');
    });
  }

  function initNewsPage() {
    var $root = $('.page-news');
    if (!$root.length) {
      return;
    }

    var $tabNav = $root.find('.news-tabs');
    if ($tabNav.length) {
      var $tabLinks = $tabNav.find('.news-tabs__link');
      var allowed = ['xu-huong', 'ota', 'marketing', 'case-study'];
      var q = new URLSearchParams(window.location.search).get('loai');
      var key = allowed.indexOf(q) !== -1 ? q : 'xu-huong';
      $tabLinks.removeClass('news-tabs__link--active').removeAttr('aria-current');
      var $active = $tabLinks.filter('[data-loai="' + key + '"]');
      if ($active.length) {
        $active.addClass('news-tabs__link--active').attr('aria-current', 'page');
      } else {
        $tabLinks.first().addClass('news-tabs__link--active').attr('aria-current', 'page');
      }
    }

    var $pagination = $root.find('.news-pagination');
    $pagination.on('click', '.news-pagination__page', function (e) {
      e.preventDefault();
      var $btn = $(this);
      var $pages = $pagination.find('.news-pagination__page');
      if ($btn.hasClass('news-pagination__page--active')) {
        return;
      }
      $pages.removeClass('news-pagination__page--active').removeAttr('aria-current');
      $btn.addClass('news-pagination__page--active').attr('aria-current', 'page');
    });
    $pagination.on('click', '.news-pagination__arrow', function (e) {
      e.preventDefault();
    });
  }

  function initHeroCategorySwitch() {
    var $hero = $('.page-home .site-hero.hero');
    if (!$hero.length) {
      return;
    }

    var $items = $hero.find('.hero-categories__item');
    var $bgLayers = $hero.find('.hero__bg-layer');
    var $title = $hero.find('#hero-panel-title');
    var $sub = $hero.find('#hero-panel-sub');
    var $textInner = $hero.find('.hero-content__text-inner');
    var storageKey = 'navisHeroCategoryIdx';
    var hasLayers = $bgLayers.length >= 2;
    var textSwapTimer;
    var autoRotateTimer;
    var AUTO_ROTATE_MS = 5000;

    if (!$items.length || !$title.length || !$sub.length || !$textInner.length) {
      return;
    }

    function stopAutoRotate() {
      if (autoRotateTimer) {
        window.clearInterval(autoRotateTimer);
        autoRotateTimer = null;
      }
    }

    function startAutoRotate() {
      if ($items.length < 2) {
        return;
      }
      stopAutoRotate();
      autoRotateTimer = window.setInterval(function () {
        var $active = $items.filter('.hero-categories__item--active').first();
        var current = $active.length ? $items.index($active) : 0;
        var next = (current + 1) % $items.length;
        activateItem($items.eq(next));
      }, AUTO_ROTATE_MS);
    }

    function resetAutoRotate() {
      startAutoRotate();
    }

    function subHtmlFromData(raw) {
      if (!raw) {
        return '';
      }
      var parts = String(raw).split('|');
      var esc = function (s) {
        return String(s)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
      return parts.map(esc).join('<br />');
    }

    function crossfadeToBg(nextSrc, instant) {
      if (!nextSrc) {
        return;
      }
      if (!hasLayers) {
        var $legacy = $hero.find('.hero__bg img');
        if ($legacy.length) {
          $legacy.attr('src', nextSrc);
        }
        return;
      }

      if (instant) {
        $bgLayers.find('img').attr('src', nextSrc);
        $bgLayers.removeClass('hero__bg-layer--visible');
        $bgLayers.first().addClass('hero__bg-layer--visible');
        return;
      }

      var $visible = $bgLayers.filter('.hero__bg-layer--visible');
      var $hidden = $bgLayers.not('.hero__bg-layer--visible');
      var $img = $hidden.find('img');
      var cur = $visible.find('img').attr('src');
      if (cur === nextSrc) {
        return;
      }

      var imgEl = $img.get(0);
      function reveal() {
        $visible.removeClass('hero__bg-layer--visible');
        $hidden.addClass('hero__bg-layer--visible');
      }

      if (!imgEl) {
        reveal();
        return;
      }

      var done = function () {
        imgEl.removeEventListener('load', done);
        imgEl.removeEventListener('error', done);
        reveal();
      };

      window.requestAnimationFrame(function () {
        imgEl.addEventListener('load', done);
        imgEl.addEventListener('error', done);
        $img.attr('src', nextSrc);
        if (imgEl.complete && imgEl.naturalWidth) {
          imgEl.removeEventListener('load', done);
          imgEl.removeEventListener('error', done);
          reveal();
        }
      });
    }

    function updateText(title, subRaw, instant) {
      var subHtml = subHtmlFromData(subRaw);
      if (textSwapTimer) {
        window.clearTimeout(textSwapTimer);
        textSwapTimer = null;
      }
      if (instant) {
        if (title) {
          $title.text(title);
        }
        $sub.html(subHtml);
        $textInner.removeClass('is-dim');
        return;
      }

      $textInner.removeClass('is-dim');
      if ($textInner.get(0)) {
        void $textInner.get(0).offsetWidth;
      }
      $textInner.addClass('is-dim');
      textSwapTimer = window.setTimeout(function () {
        textSwapTimer = null;
        if (title) {
          $title.text(title);
        }
        $sub.html(subHtml);
        window.requestAnimationFrame(function () {
          $textInner.removeClass('is-dim');
        });
      }, 320);
    }

    function applyFromItem($item, instant) {
      var bg = $item.attr('data-hero-bg');
      var title = $item.attr('data-hero-title');
      var subRaw = $item.attr('data-hero-sub');
      crossfadeToBg(bg, instant);
      updateText(title, subRaw, instant);
    }

    function activateItem($item, opts) {
      opts = opts || {};
      var instant = !!opts.instant;
      if (!instant && $item.hasClass('hero-categories__item--active')) {
        return;
      }
      $items.removeClass('hero-categories__item--active');
      $item.addClass('hero-categories__item--active');
      applyFromItem($item, instant);
      var idx = $item.attr('data-hero-idx');
      if (idx !== undefined && idx !== '') {
        try {
          window.sessionStorage.setItem(storageKey, idx);
        } catch (e) {
          /* ignore */
        }
      }
    }

    var savedIdx = null;
    try {
      savedIdx = window.sessionStorage.getItem(storageKey);
    } catch (e) {
      savedIdx = null;
    }
    if (savedIdx !== null && savedIdx !== '') {
      var $saved = $items.filter('[data-hero-idx="' + savedIdx + '"]');
      if ($saved.length) {
        activateItem($saved.first(), { instant: true });
      }
    }

    $items.on('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.which === 2) {
        return;
      }
      e.preventDefault();
      activateItem($(this));
      resetAutoRotate();
    });

    $items.on('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') {
        return;
      }
      if (e.metaKey || e.ctrlKey) {
        return;
      }
      e.preventDefault();
      activateItem($(this));
      resetAutoRotate();
    });

    startAutoRotate();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAutoRotate();
      } else {
        startAutoRotate();
      }
    });
  }

  function initServiceStatsCounter() {
    var $section = $('.service-stats');
    if (!$section.length) {
      return;
    }

    var $counters = $section.find('[data-count-to]');
    if (!$counters.length) {
      return;
    }

    var animated = false;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function animateCounter(el, duration) {
      var $el = $(el);
      var target = parseFloat($el.attr('data-count-to'), 10);
      if (isNaN(target)) {
        return;
      }

      var suffix = $el.attr('data-suffix') || '';
      var prefix = $el.attr('data-prefix') || '';
      var decimals = parseInt($el.attr('data-decimals'), 10);
      if (isNaN(decimals)) {
        decimals = 0;
      }

      var startTime = null;

      function step(timestamp) {
        if (!startTime) {
          startTime = timestamp;
        }
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var value = target * easeOutQuart(progress);
        $el.text(prefix + value.toFixed(decimals) + suffix);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          $el.text(prefix + target.toFixed(decimals) + suffix);
        }
      }

      window.requestAnimationFrame(step);
    }

    function runCounters() {
      if (animated) {
        return;
      }
      animated = true;
      $counters.each(function (_, el) {
        animateCounter(el, 2000);
      });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounters();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.35 }
      );
      observer.observe($section[0]);
    } else {
      runCounters();
    }
  }

  function initHeroScrollHide() {
    var $scrolls = $('.hero-scroll');
    if (!$scrolls.length) {
      return;
    }

    var ticking = false;
    var threshold = 200;

    function updateHeroScroll() {
      ticking = false;
      var hidden = window.scrollY >= threshold;
      $scrolls.toggleClass('hero-scroll--hidden', hidden);
    }

    function onScroll() {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(updateHeroScroll);
    }

    $(window).on('scroll resize orientationchange', onScroll);
    updateHeroScroll();
  }

  function initHeroStickyHeader() {
    var $headers = $('.site-header');
    if (!$headers.length) {
      return;
    }

    var ticking = false;

    function updateHeaderState() {
      ticking = false;
      $headers.each(function () {
        var $header = $(this);
        var $hero = $header.closest('.site-hero');
        if (!$hero.length) {
          return;
        }

        var triggerY = Math.max(0, $hero.offset().top + $hero.outerHeight() - $header.outerHeight());
        var shouldStick = window.scrollY >= 100;
        $header.toggleClass('site-header--scrolled', shouldStick);
      });
    }

    function onScroll() {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(updateHeaderState);
    }

    $(window).on('scroll resize orientationchange', onScroll);
    updateHeaderState();
  }


  function initPartnersLogoRowSlider() {
    var $logo1 = $('#logo-1');
    if (!$logo1.length || typeof $.fn.slick !== 'function' || $logo1.hasClass('slick-initialized')) {
      return;
    }
    $logo1.slick({
      dots: false,
      arrows: false,
      infinite: true,
      speed: 400,
      slidesToShow: 6,
      slidesToScroll: 1,
      variableWidth: false,
      swipe: true,
      cssEase: 'ease-out',
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        }
      ]
    });
  }

  function initMobileDrawer() {
    var mq = window.matchMedia('(max-width: 991.98px)');
    var menuToggleEl = null;

    function closeDrawer() {
      $('body').removeClass('site-nav-open');
      $('.site-header__menu-toggle').attr('aria-expanded', 'false');
      $('.site-header__drawer').attr('aria-hidden', 'true');
      $('.site-header__drawer-backdrop').attr('aria-hidden', 'true');
      $(document).off('keydown.siteNavDrawer');
      if (menuToggleEl && document.body.contains(menuToggleEl)) {
        menuToggleEl.focus();
      }
      menuToggleEl = null;
    }

    function openDrawer($toggle) {
      var $header = $toggle.closest('.site-header');
      var $drawer = $header.find('#site-nav-drawer');
      if (!$drawer.length) {
        return;
      }
      menuToggleEl = $toggle.get(0);
      $('body').addClass('site-nav-open');
      $toggle.attr('aria-expanded', 'true');
      $drawer.attr('aria-hidden', 'false');
      $header.find('.site-header__drawer-backdrop').attr('aria-hidden', 'false');
      $header.find('.site-header__drawer-close').trigger('focus');
      $(document).on('keydown.siteNavDrawer', function (e) {
        if (e.key === 'Escape') {
          closeDrawer();
        }
      });
    }

    $('.site-header').each(function () {
      var $header = $(this);
      var $mobileLogo = $header.find('.site-header__logo--mobile-bar');
      var $deskLogo = $header.find('.site-header__desktop-row .site-header__logo').first();
      if ($deskLogo.length && !$mobileLogo.children().length) {
        var href = $deskLogo.attr('href');
        if (href) {
          $mobileLogo.attr('href', href);
        }
        var $img = $deskLogo.find('img').first().clone();
        $img.removeAttr('id');
        $mobileLogo.append($img);
      }
    });

    $(document).on('click', '.site-header__menu-toggle', function (e) {
      if (!mq.matches) {
        return;
      }
      e.preventDefault();
      var $btn = $(this);
      if ($btn.attr('aria-expanded') === 'true') {
        closeDrawer();
      } else {
        openDrawer($btn);
      }
    });

    $(document).on('click', '.site-header__drawer-close, .site-header__drawer-backdrop', function () {
      closeDrawer();
    });

    $(document).on('click', '.site-header__drawer-link, .site-header__drawer-sub a', function () {
      closeDrawer();
    });

    $(window).on('resize', function () {
      if (!mq.matches) {
        closeDrawer();
      }
    });
  }

  $(function () {
    initLocaleToggle();
    initMobileDrawer();
    initHeroCategorySwitch();
    initServiceSlider();
    initServiceSolutionsGridSlider();
    initServicePartnersLogosSlider();
    initPartnersLogoRowSlider();
    initBlogSlider();
    initServiceNewsSlider();
    initAboutDiffSlider();
    initProjectsCasesSlider();
    initProjectDetailRelatedSlider();
    initNewsDetailRelatedSlider();
    initNewsPage();
    initServiceStatsCounter();
    //initHeroScrollHide();
    // initHeroStickyHeader();
  });


  
})(jQuery);
