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
      window.location.reload();
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
        { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });
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

    if (!$items.length || !$title.length || !$sub.length || !$textInner.length) {
      return;
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
    });
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
        var shouldStick = window.scrollY >= triggerY;
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


  $('#logo-1').slick({
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




  $(function () {
    initLocaleToggle();
    initHeroCategorySwitch();
    initServiceSlider();
    initBlogSlider();
    initServiceNewsSlider();
    initAboutDiffSlider();
    initProjectsCasesSlider();
    initProjectDetailRelatedSlider();
    initNewsPage();
    initHeroStickyHeader();
  });


  
})(jQuery);
