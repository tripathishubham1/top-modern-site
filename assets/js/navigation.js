/**
 * Navigation - Clean & Simple
 */

(function() {
  'use strict';

  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  // Header scroll effect
  function handleScroll() {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  // Mobile menu toggle
  function toggleMobileMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.toggle('is-open');
    document.body.classList.toggle('no-scroll');
    if (menuToggle) {
      menuToggle.classList.toggle('is-active');
    }
  }

  // Close mobile menu on link click
  function closeMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }
    if (menuToggle) {
      menuToggle.classList.remove('is-active');
    }
  }

  // Smooth scroll for anchor links
  function handleAnchorClick(e) {
    const href = e.currentTarget.getAttribute('href');

    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        closeMobileMenu();
      }
    }
  }

  // Initialize
  function init() {
    // Scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile menu
    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close menu on mobile link click
    if (mobileMenu) {
      const mobileLinks = mobileMenu.querySelectorAll('a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }

    // Smooth scroll
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
