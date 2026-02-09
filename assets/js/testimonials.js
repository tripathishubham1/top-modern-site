/**
 * Testimonials Module
 * Handles Swiper carousels and testimonial filtering
 */

(function() {
  'use strict';

  let heroSwiper = null;
  let testimonialsSwiper = null;

  /**
   * Initialize testimonials functionality
   */
  function init() {
    // Wait for Swiper to load
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper not loaded. Carousels disabled.');
      return;
    }

    setupHeroCarousel();
    setupTestimonialsCarousel();
    setupFilterTabs();
    setupVideoModal();
  }

  /**
   * Hero carousel with testimonials
   */
  function setupHeroCarousel() {
    const heroCarouselEl = document.getElementById('heroCarousel');
    if (!heroCarouselEl) return;

    heroSwiper = new Swiper(heroCarouselEl, {
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      speed: 800,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      grabCursor: true,
      a11y: {
        prevSlideMessage: 'Previous testimonial',
        nextSlideMessage: 'Next testimonial',
        paginationBulletMessage: 'Go to testimonial {{index}}'
      }
    });
  }

  /**
   * Testimonials section carousel
   */
  function setupTestimonialsCarousel() {
    const carouselEl = document.getElementById('testimonialsCarousel');
    if (!carouselEl) return;

    testimonialsSwiper = new Swiper(carouselEl, {
      slidesPerView: 1,
      spaceBetween: 24,
      speed: 600,
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
      },
      breakpoints: {
        640: {
          slidesPerView: 1.5,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24
        },
        1024: {
          slidesPerView: 2.5,
          spaceBetween: 32
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 32
        }
      },
      a11y: {
        prevSlideMessage: 'Previous testimonial',
        nextSlideMessage: 'Next testimonial'
      }
    });
  }

  /**
   * Testimonial filter tabs (GMAT/GRE)
   */
  function setupFilterTabs() {
    const tabs = document.querySelectorAll('.testimonials-tabs .tab');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    if (!tabs.length || !testimonialCards.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const filter = tab.dataset.filter;

        // Filter testimonials
        testimonialCards.forEach(card => {
          const slide = card.closest('.swiper-slide');
          if (!slide) return;

          const cardType = card.dataset.type;

          if (filter === 'all' || cardType === filter) {
            slide.style.display = '';
            slide.classList.remove('hidden');
          } else {
            slide.style.display = 'none';
            slide.classList.add('hidden');
          }
        });

        // Update Swiper after filtering
        if (testimonialsSwiper) {
          testimonialsSwiper.update();
          testimonialsSwiper.slideTo(0);
        }
      });
    });
  }

  /**
   * Video modal for video testimonials
   */
  function setupVideoModal() {
    const videoCards = document.querySelectorAll('.video-card');
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('closeVideoModal');
    const videoFrame = document.getElementById('videoFrame');

    if (!videoCards.length || !modal) return;

    // Video URLs mapping (placeholder - replace with actual video IDs)
    const videoUrls = {
      video1: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      video2: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      video3: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    };

    videoCards.forEach(card => {
      card.addEventListener('click', () => {
        const videoId = card.dataset.videoId;
        const videoUrl = videoUrls[videoId] || '';

        if (videoFrame && videoUrl) {
          videoFrame.src = videoUrl + '?autoplay=1';
        }

        openModal(modal);
      });

      // Keyboard accessibility
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Play video testimonial');

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Close modal
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closeModal(modal);
        if (videoFrame) videoFrame.src = '';
      });
    }

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
        if (videoFrame) videoFrame.src = '';
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal(modal);
        if (videoFrame) videoFrame.src = '';
      }
    });
  }

  /**
   * Modal helpers
   */
  function openModal(modal) {
    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');
    modal.setAttribute('aria-hidden', 'false');

    // Focus trap
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length) {
      focusableElements[0].focus();
    }
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    modal.setAttribute('aria-hidden', 'true');
  }

  /**
   * Destroy swipers (for cleanup)
   */
  function destroy() {
    if (heroSwiper) heroSwiper.destroy(true, true);
    if (testimonialsSwiper) testimonialsSwiper.destroy(true, true);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.Testimonials = {
    init,
    destroy,
    getHeroSwiper: () => heroSwiper,
    getTestimonialsSwiper: () => testimonialsSwiper
  };

})();
