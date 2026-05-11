(function ($) {
  'use strict';

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
