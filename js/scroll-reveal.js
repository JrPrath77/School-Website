// ===== Scroll Reveal System =====
// Uses IntersectionObserver for performant scroll-triggered animations
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Auto-add scroll-reveal to common elements
    autoAddScrollReveal();

    // Initialize observer
    initScrollReveal();
  });

  function autoAddScrollReveal() {
    // Sections headers
    document.querySelectorAll('.section-header').forEach(function (el) {
      if (!el.classList.contains('scroll-reveal')) {
        el.classList.add('scroll-reveal');
      }
    });

    // Cards (stagger within their parent grid)
    const cardGrids = document.querySelectorAll('.news-grid, .programs-grid, .staff-grid');
    cardGrids.forEach(function (grid) {
      grid.classList.add('stagger-grid');
      grid.querySelectorAll('.news-card, .program-card, .staff-card').forEach(function (card) {
        if (!card.classList.contains('scroll-reveal')) {
          card.classList.add('scroll-reveal');
        }
      });
    });

    // Other elements worth animating
    var selectors = [
      '.about-content',
      '.about-image',
      '.testimonials .container',
      '.staff-hero-banner',
      '.hero-stats',
      '.footer-content',
      '.contact-form-container',
      '.gallery-container',
      '.video-container'
    ];

    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (!el.classList.contains('scroll-reveal')) {
          el.classList.add('scroll-reveal');
        }
      });
    });
  }

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length === 0) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully in view
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }
})();
