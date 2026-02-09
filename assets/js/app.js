/**
 * Main App - Top One Percent
 */

(function() {
  'use strict';

  // Testimonial tab switching
  function initTestimonialTabs() {
    const tabs = document.querySelectorAll('.testimonials__tab');
    const grid = document.getElementById('testimonialGrid');

    if (!tabs.length || !grid) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        // Add visual feedback
        grid.style.opacity = '0.5';
        setTimeout(() => {
          grid.style.opacity = '1';
        }, 300);
      });
    });
  }

  // FAQ accordion
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close all
        faqItems.forEach(i => i.classList.remove('is-open'));

        // Open clicked if it was closed
        if (!isOpen) {
          item.classList.add('is-open');
        }
      });
    });
  }

  // Form handling
  function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log('Form submitted:', data);

        // Show success message
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
        btn.style.background = '#10b981';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          form.reset();
        }, 3000);
      });
    });
  }

  // Video card click
  function initVideoCards() {
    document.querySelectorAll('.lite-yt').forEach(function(el) {
      el.addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        if (!id) return;
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        iframe.setAttribute('allowfullscreen', '');
        this.innerHTML = '';
        this.appendChild(iframe);
      });
    });
  }

  // Sticky bottom CTA visibility
  function initStickyBottomCTA() {
    const stickyCTA = document.querySelector('.sticky-bottom-cta');
    const bookDemoSection = document.getElementById('book-demo');

    if (!stickyCTA) return;

    let lastScrollY = window.scrollY;

    function updateStickyVisibility() {
      const currentScrollY = window.scrollY;

      // Hide when near bottom or near book-demo section
      if (bookDemoSection) {
        const rect = bookDemoSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          stickyCTA.style.transform = 'translateY(100%)';
          return;
        }
      }

      // Show after scrolling down a bit
      if (currentScrollY > 400) {
        stickyCTA.style.transform = 'translateY(0)';
      } else {
        stickyCTA.style.transform = 'translateY(100%)';
      }

      lastScrollY = currentScrollY;
    }

    // Set initial state
    stickyCTA.style.transition = 'transform 0.3s ease';
    stickyCTA.style.transform = 'translateY(100%)';

    window.addEventListener('scroll', updateStickyVisibility, { passive: true });
    updateStickyVisibility();
  }

  // Floating CTA visibility
  function initFloatingCTA() {
    const floatingCTA = document.querySelector('.floating-cta');

    if (!floatingCTA) return;

    function updateFloatingVisibility() {
      if (window.scrollY > 600) {
        floatingCTA.style.opacity = '1';
        floatingCTA.style.pointerEvents = 'auto';
      } else {
        floatingCTA.style.opacity = '0';
        floatingCTA.style.pointerEvents = 'none';
      }
    }

    // Set initial state
    floatingCTA.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    floatingCTA.style.opacity = '0';
    floatingCTA.style.pointerEvents = 'none';

    window.addEventListener('scroll', updateFloatingVisibility, { passive: true });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();

          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Add hover effects to cards
  function initCardEffects() {
    const cards = document.querySelectorAll('.card, .course-card, .testimonial-card');

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    });
  }

  // Parallax effect for hero section
  function initParallax() {
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero__visual');

    if (!hero || !heroVisual) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    }, { passive: true });
  }

  // Initialize all
  function init() {
    initTestimonialTabs();
    initFAQ();
    initForms();
    initVideoCards();
    initStickyBottomCTA();
    initFloatingCTA();
    initSmoothScroll();
    initCardEffects();
    initParallax();

    console.log('Top One Percent - Ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
