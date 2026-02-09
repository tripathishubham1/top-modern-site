/**
 * Animations - Simple scroll-triggered animations
 */

(function() {
  'use strict';

  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Simple scroll observer for [data-aos] elements
  function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos]');

    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('aos-animate'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-aos-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // Counter animation for stats
  function initCounters() {
    const counters = document.querySelectorAll('.stat-item__number');

    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/[\d,]+/);
    if (!match) return;

    const target = parseInt(match[0].replace(/,/g, ''));
    const suffix = text.replace(match[0], '');
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * eased);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = text;
      }
    }

    requestAnimationFrame(update);
  }

  // Hero Testimonial Card - Switcher
  function initHeroCarousel() {
    const image = document.getElementById('heroTestimonialImage');
    const scoreEl = document.getElementById('heroTestimonialScore');
    const nameEl = document.getElementById('heroTestimonialName');
    const schoolEl = document.getElementById('heroTestimonialSchool');
    const achievementEl = document.getElementById('heroTestimonialAchievement');
    const quoteEl = document.getElementById('heroTestimonialQuote');

    if (!image) return;

    const testimonials = [
      {
        image: 'https://top-one-percent.com/assets/images/hero-1.webp',
        score: '770',
        exam: 'GMAT',
        name: 'Kritika Pugalia',
        school: 'Wharton + Fuqua',
        achievement: '$188,000 Scholarship',
        quote: '"Without the tips and tricks that TOP has given, I don\'t think a top percentile would\'ve been possible."',
        isGre: false
      },
      {
        image: 'https://top-one-percent.com/assets/images/hero-2.webp',
        score: '780',
        exam: 'GMAT',
        name: 'Harshit Jain',
        school: 'Wharton - Deferred MBA',
        achievement: '99.87 Percentile',
        quote: '"I religiously followed the TOP content and then didn\'t find anything even slightly unusual on the exam."',
        isGre: false
      },
      {
        image: 'https://top-one-percent.com/assets/images/hero-3.webp',
        score: '770',
        exam: 'GMAT',
        name: 'Madhura Banerjee',
        school: 'Columbia + Yale',
        achievement: '$100,000+ Scholarship',
        quote: '"I would have been happy with 720 but Sandeep sir pushed me to 770!"',
        isGre: false
      },
      {
        image: 'https://top-one-percent.com/assets/images/hero-4.webp',
        score: '770',
        exam: 'GMAT',
        name: 'Vandita Kamath',
        school: 'Wharton',
        achievement: 'Full Scholarship',
        quote: '"The Doubt Support from TOP was one of the most important things for me during preparation."',
        isGre: false
      },
      {
        image: 'https://top-one-percent.com/assets/images/hero-9.webp',
        score: '770',
        exam: 'GMAT',
        name: 'Shloka Bhuvalka',
        school: 'Chicago Booth - Deferred',
        achievement: 'Deferred MBA Admit',
        quote: '"It\'s purely about what Sandeep sir and TOP\'s curriculum is telling you to do. Follow it religiously."',
        isGre: false
      },
      {
        image: 'https://top-one-percent.com/assets/images/hero-8.webp',
        score: '770',
        exam: 'GMAT',
        name: 'Amit Kumar',
        school: 'Hindi Medium to V45',
        achievement: 'Verbal 45 from scratch',
        quote: '"I cannot speak English; I can only read. I was scared of GMAT. In just 3 months, I scored Verbal 45."',
        isGre: false
      }
    ];

    let currentIndex = 0;
    let autoplayInterval;

    function switchTestimonial(index) {
      const data = testimonials[index];
      const overlay = document.querySelector('.testimonial-card-hero__overlay');

      // Fade out
      image.style.opacity = '0';
      if (overlay) overlay.style.opacity = '0';

      setTimeout(() => {
        // Update content
        image.src = data.image;
        image.alt = data.name;
        scoreEl.querySelector('.testimonial-card-hero__score-number').textContent = data.score;
        scoreEl.querySelector('.testimonial-card-hero__score-label').textContent = data.exam;
        scoreEl.className = data.isGre ? 'testimonial-card-hero__score testimonial-card-hero__score--gre' : 'testimonial-card-hero__score';
        nameEl.textContent = data.name;
        schoolEl.textContent = data.school;
        achievementEl.textContent = data.achievement;
        quoteEl.textContent = data.quote;

        // Fade in
        image.style.opacity = '1';
        if (overlay) overlay.style.opacity = '1';
      }, 300);

      currentIndex = index;
    }

    function nextTestimonial() {
      const next = (currentIndex + 1) % testimonials.length;
      switchTestimonial(next);
    }

    function startAutoplay() {
      stopAutoplay();
      if (!prefersReducedMotion) {
        autoplayInterval = setInterval(nextTestimonial, 5000);
      }
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    }

    // Pause on hover
    const card = document.querySelector('.testimonial-card-hero');
    if (card) {
      card.addEventListener('mouseenter', stopAutoplay);
      card.addEventListener('mouseleave', startAutoplay);
    }

    // Start autoplay
    startAutoplay();
  }

  // Hero Title Text Rotation (GMAT / GRE)
  function initHeroTextRotation() {
    const highlights = document.querySelectorAll('.hero__highlight');
    if (highlights.length < 2) return;

    let currentIndex = 0;

    function rotateText() {
      const current = highlights[currentIndex];
      const nextIndex = (currentIndex + 1) % highlights.length;
      const next = highlights[nextIndex];

      // Exit current
      current.classList.remove('hero__highlight--active');
      current.classList.add('hero__highlight--exit');

      // Enter next
      next.classList.remove('hero__highlight--exit');
      next.classList.add('hero__highlight--active');

      // Reset exit class after animation
      setTimeout(() => {
        current.classList.remove('hero__highlight--exit');
      }, 600);

      currentIndex = nextIndex;
    }

    // Rotate every 3 seconds
    if (!prefersReducedMotion) {
      setInterval(rotateText, 3000);
    }
  }

  // Stories Tabs (GMAT/GRE switching)
  function initStoriesTabs() {
    const tabs = document.querySelectorAll('.stories-tab');
    const gmatGrid = document.getElementById('gmatGrid');
    const greGrid = document.getElementById('greGrid');

    if (!tabs.length || !gmatGrid || !greGrid) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabType = tab.getAttribute('data-tab');

        // Update active tab
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        // Show/hide grids
        if (tabType === 'gmat') {
          gmatGrid.classList.add('is-active');
          greGrid.classList.remove('is-active');
        } else {
          gmatGrid.classList.remove('is-active');
          greGrid.classList.add('is-active');
        }
      });
    });
  }

  // Transformation Stories Slider
  function initTransformationSlider() {
    const track = document.querySelector('.transformation-slider__track');
    const prevBtn = document.querySelector('.transformation-slider__nav--prev');
    const nextBtn = document.querySelector('.transformation-slider__nav--next');

    if (!track || !prevBtn || !nextBtn) return;

    const cardWidth = 340 + 24; // card width + gap

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });

    // Update button visibility based on scroll position
    function updateNavButtons() {
      const scrollLeft = track.scrollLeft;
      const maxScroll = track.scrollWidth - track.clientWidth;

      prevBtn.style.opacity = scrollLeft <= 10 ? '0.3' : '1';
      prevBtn.style.pointerEvents = scrollLeft <= 10 ? 'none' : 'auto';

      nextBtn.style.opacity = scrollLeft >= maxScroll - 10 ? '0.3' : '1';
      nextBtn.style.pointerEvents = scrollLeft >= maxScroll - 10 ? 'none' : 'auto';
    }

    track.addEventListener('scroll', updateNavButtons);
    updateNavButtons();
  }

  // Initialize
  function init() {
    initScrollAnimations();
    initCounters();
    initHeroCarousel();
    initHeroTextRotation();
    initStoriesTabs();
    initTransformationSlider();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
