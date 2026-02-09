/**
 * Stats Counter Module
 * Animated number counting triggered on scroll
 */

(function() {
  'use strict';

  /**
   * Initialize stats counter
   */
  function init() {
    const counters = document.querySelectorAll('.counter');

    if (!counters.length) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Show final values immediately
      counters.forEach(counter => {
        counter.textContent = counter.dataset.target;
      });
      return;
    }

    // Use Intersection Observer to trigger animation
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
  }

  /**
   * Animate a single counter element
   * @param {HTMLElement} counter - The counter element
   */
  function animateCounter(counter) {
    const target = parseInt(counter.dataset.target, 10);
    const duration = parseInt(counter.dataset.duration, 10) || 2000;
    const startTime = performance.now();
    const startValue = 0;

    // Easing function (ease-out cubic)
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

      counter.textContent = formatNumber(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = formatNumber(target);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  /**
   * Format number with commas for thousands
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  function formatNumber(num) {
    return num.toLocaleString('en-IN');
  }

  /**
   * Animate counter with GSAP (if available)
   * More advanced animation with better control
   * @param {HTMLElement} counter - The counter element
   */
  function animateCounterGSAP(counter) {
    if (typeof gsap === 'undefined') {
      animateCounter(counter);
      return;
    }

    const target = parseInt(counter.dataset.target, 10);
    const obj = { value: 0 };

    gsap.to(obj, {
      value: target,
      duration: 2,
      ease: 'power3.out',
      onUpdate: () => {
        counter.textContent = formatNumber(Math.floor(obj.value));
      },
      onComplete: () => {
        counter.textContent = formatNumber(target);
      }
    });
  }

  /**
   * Manually trigger counter animation (useful for dynamic content)
   * @param {HTMLElement|string} element - Counter element or selector
   */
  function trigger(element) {
    const counter = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (counter && counter.classList.contains('counter')) {
      animateCounter(counter);
    }
  }

  /**
   * Reset counter to zero (for re-animation)
   * @param {HTMLElement|string} element - Counter element or selector
   */
  function reset(element) {
    const counter = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (counter && counter.classList.contains('counter')) {
      counter.textContent = '0';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.StatsCounter = {
    init,
    trigger,
    reset,
    formatNumber
  };

})();
