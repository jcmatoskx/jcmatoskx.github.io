/* ==========================================================================
   Porto Climbing - Main JavaScript
   ========================================================================== */

(function () {
  'use strict';

  // ---- DOM References ----
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const heroCarousel = document.getElementById('heroCarousel');
  const heroDots = document.getElementById('heroDots');

  // ---- Mobile Navigation ----
  let overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeNav);
  }

  function openNav() {
    nav.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    if (!overlay) createOverlay();
    // Force reflow before adding active class for transition
    void overlay.offsetWidth;
    overlay.classList.add('active');
  }

  function closeNav() {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    if (overlay) overlay.classList.remove('active');
  }

  function toggleNav() {
    if (nav.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  }

  hamburger.addEventListener('click', toggleNav);

  // Close nav on link click (mobile)
  document.querySelectorAll('.header__nav-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // Close nav on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeNav();
    }
  });

  // ---- Sticky Header Scroll Effect ----
  let lastScrollY = 0;

  function handleHeaderScroll() {
    var scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ---- Hero Carousel ----
  var slides = heroCarousel.querySelectorAll('.hero__slide');
  var dots = heroDots.querySelectorAll('.hero__dot');
  var currentSlide = 0;
  var totalSlides = slides.length;
  var carouselInterval = null;
  var SLIDE_DURATION = 4000;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (index + totalSlides) % totalSlides;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startCarousel() {
    stopCarousel();
    carouselInterval = setInterval(nextSlide, SLIDE_DURATION);
  }

  function stopCarousel() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
  }

  // Dot navigation
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var slideIndex = parseInt(this.getAttribute('data-slide'), 10);
      goToSlide(slideIndex);
      startCarousel(); // Reset timer after manual navigation
    });
  });

  // Pause on hover (desktop)
  heroCarousel.addEventListener('mouseenter', stopCarousel);
  heroCarousel.addEventListener('mouseleave', startCarousel);

  // Touch swipe support
  var touchStartX = 0;
  var touchEndX = 0;

  heroCarousel.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    stopCarousel();
  }, { passive: true });

  heroCarousel.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    }

    startCarousel();
  }, { passive: true });

  // Start carousel
  startCarousel();

  // ---- FAQ Accordion ----
  var faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq__question');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var headerHeight = header.offsetHeight;
        var targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Intersection Observer for Fade-in Animations ----
  var fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---- Gallery Lightbox ----
  var galleryItems = document.querySelectorAll('.gallery__item');
  var lightbox = null;
  var lightboxImg = null;

  function createLightbox() {
    lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');

    var closeBtn = document.createElement('button');
    closeBtn.classList.add('lightbox__close');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close lightbox');

    lightboxImg = document.createElement('img');
    lightboxImg.alt = '';

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  function openLightbox(src, alt) {
    if (!lightbox) createLightbox();
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var img = this.querySelector('img');
      if (img) {
        openLightbox(img.src, img.alt);
      }
    });
  });

  // ---- Scroll to Top Button ----
  var scrollTopBtn = document.createElement('button');
  scrollTopBtn.classList.add('scroll-top');
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  document.body.appendChild(scrollTopBtn);

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function handleScrollTopVisibility() {
    var scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 600) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });

  // ---- Active Nav Link Highlighting ----
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.header__nav-link');

  function highlightActiveSection() {
    var scrollY = window.scrollY || window.pageYOffset;
    var headerHeight = header.offsetHeight;

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop - headerHeight - 100;
      var sectionBottom = sectionTop + section.offsetHeight;
      var sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveSection, { passive: true });

  // ---- Stagger fade-in for grouped elements ----
  function staggerFadeIns() {
    var groups = [
      '.services__grid .fade-in',
      '.gallery__grid .fade-in',
      '.locations__grid .fade-in',
      '.social__grid .fade-in',
      '.faq__list .fade-in'
    ];

    groups.forEach(function (selector) {
      var items = document.querySelectorAll(selector);
      items.forEach(function (item, index) {
        item.style.transitionDelay = (index * 0.08) + 's';
      });
    });
  }

  staggerFadeIns();

  // ---- Preload first hero image ----
  if (slides.length > 0) {
    var firstImg = slides[0].querySelector('img');
    if (firstImg && firstImg.src) {
      var preload = new Image();
      preload.src = firstImg.src;
    }
  }

})();
