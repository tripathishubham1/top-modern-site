/**
 * Demo Modal - Shared across all pages
 * Injects modal HTML, intercepts demo links, handles open/close/submit
 */
(function() {
  'use strict';

  var MODAL_HTML =
    '<div class="demo-modal" id="demoModal">' +
      '<div class="demo-modal__overlay" id="demoModalOverlay"></div>' +
      '<div class="demo-modal__container">' +
        '<button class="demo-modal__close" id="demoModalClose" aria-label="Close">' +
          '<i class="fas fa-times"></i>' +
        '</button>' +
        '<div class="demo-modal__header">' +
          '<span class="demo-modal__badge"><i class="fas fa-calendar-check"></i> Request a Personal Demo</span>' +
          '<h2 class="demo-modal__title">Book Your Personalised Demo &amp; Strategy Call</h2>' +
          '<p class="demo-modal__desc">Get a one-on-one strategy call with our experts. We\'ll map out your path to a 99th percentile score.</p>' +
        '</div>' +
        '<div class="demo-modal__features">' +
          '<div class="demo-modal__feature"><i class="fas fa-check-circle"></i> Complimentary Profile Assessment</div>' +
          '<div class="demo-modal__feature"><i class="fas fa-check-circle"></i> Free Diagnostic Mock</div>' +
          '<div class="demo-modal__feature"><i class="fas fa-check-circle"></i> Realistic Score Forecast</div>' +
        '</div>' +
        '<form id="demoModalForm" class="demo-modal__form">' +
          '<div class="demo-modal__form-row">' +
            '<div class="form-group">' +
              '<label class="form-label form-label--required" for="demo-name">Name</label>' +
              '<input type="text" id="demo-name" name="name" class="form-input" placeholder="Your full name" required>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label form-label--required" for="demo-email">Email</label>' +
              '<input type="email" id="demo-email" name="email" class="form-input" placeholder="your@email.com" required>' +
            '</div>' +
          '</div>' +
          '<div class="demo-modal__form-row">' +
            '<div class="form-group">' +
              '<label class="form-label form-label--required" for="demo-phone">Phone</label>' +
              '<input type="tel" id="demo-phone" name="phone" class="form-input" placeholder="+91 97395-61394" required>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label form-label--required" for="demo-course">Course</label>' +
              '<select id="demo-course" name="course" class="form-input form-select" required>' +
                '<option value="">Select a course</option>' +
                '<option value="gmat-live">GMAT Live Online</option>' +
                '<option value="gmat-selfpaced">GMAT Self-Paced</option>' +
                '<option value="gre-online">GRE Online</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
          '<button type="submit" class="btn btn-gradient btn-lg demo-modal__submit">' +
            '<i class="fas fa-calendar-check"></i> Request a Personal Demo' +
          '</button>' +
        '</form>' +
        '<p class="demo-modal__urgency"><i class="fas fa-clock"></i> Contact to know when the next batch starts. Seats filling fast</p>' +
      '</div>' +
    '</div>';

  // Inject modal into page
  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  var modal = document.getElementById('demoModal');
  var overlay = document.getElementById('demoModalOverlay');
  var closeBtn = document.getElementById('demoModalClose');
  var form = document.getElementById('demoModalForm');

  function openModal(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Match all CTA links that should open the demo modal
  function isDemoLink(el) {
    if (el.hasAttribute('data-open-demo')) return true;
    var href = el.getAttribute('href');
    if (!href) return false;
    var isFormHref = /^(\.\.\/)?index\.html#book-demo$/.test(href) ||
                     href === '#book-demo' ||
                     href === '#contact-form' ||
                     href === '#get-in-touch' ||
                     /^(\.\.\/)?contact\.html$/.test(href);
    // Only intercept CTA buttons (with .btn class or .floating-cta), not nav/footer links
    return isFormHref && (el.classList.contains('btn') || el.classList.contains('floating-cta'));
  }

  // Intercept clicks globally via delegation (works even for dynamically added elements)
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a, button');
    if (link && isDemoLink(link)) {
      openModal(e);
    }
  }, true); // useCapture = true to run before other handlers

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalHTML = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate API call (replace with real endpoint)
    setTimeout(function() {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
      submitBtn.style.background = '#10b981';

      setTimeout(function() {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        form.reset();
        closeModal();
      }, 2000);
    }, 1500);
  });

  // ── Webinar Gate Modal ──────────────────────────────────────────────
  var pendingWebinarUrl = '';

  var WEBINAR_MODAL_HTML =
    '<div class="demo-modal" id="webinarModal">' +
      '<div class="demo-modal__overlay" id="webinarModalOverlay"></div>' +
      '<div class="demo-modal__container">' +
        '<button class="demo-modal__close" id="webinarModalClose" aria-label="Close">' +
          '<i class="fas fa-times"></i>' +
        '</button>' +
        '<div class="demo-modal__header">' +
          '<span class="demo-modal__badge"><i class="fas fa-video"></i> Watch Webinar</span>' +
          '<h2 class="demo-modal__title">Enter Your Details to Watch</h2>' +
          '<p class="demo-modal__desc">Fill in your details below and you\'ll be taken straight to the webinar.</p>' +
        '</div>' +
        '<form id="webinarModalForm" class="demo-modal__form">' +
          '<div class="demo-modal__form-row">' +
            '<div class="form-group">' +
              '<label class="form-label form-label--required" for="webinar-name">Name</label>' +
              '<input type="text" id="webinar-name" name="name" class="form-input" placeholder="Your full name" required>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label form-label--required" for="webinar-email">Email</label>' +
              '<input type="email" id="webinar-email" name="email" class="form-input" placeholder="your@email.com" required>' +
            '</div>' +
          '</div>' +
          '<div class="demo-modal__form-row">' +
            '<div class="form-group">' +
              '<label class="form-label form-label--required" for="webinar-phone">Phone</label>' +
              '<input type="tel" id="webinar-phone" name="phone" class="form-input" placeholder="+91 97395-61394" required>' +
            '</div>' +
          '</div>' +
          '<button type="submit" class="btn btn-gradient btn-lg demo-modal__submit">' +
            '<i class="fas fa-play"></i> Watch Now' +
          '</button>' +
        '</form>' +
      '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', WEBINAR_MODAL_HTML);

  var webinarModal = document.getElementById('webinarModal');
  var webinarOverlay = document.getElementById('webinarModalOverlay');
  var webinarCloseBtn = document.getElementById('webinarModalClose');
  var webinarForm = document.getElementById('webinarModalForm');

  function openWebinarModal(url) {
    pendingWebinarUrl = url;
    webinarModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeWebinarModal() {
    webinarModal.classList.remove('is-open');
    document.body.style.overflow = '';
    pendingWebinarUrl = '';
  }

  // Intercept webinar button clicks
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-webinar-url]');
    if (btn) {
      e.preventDefault();
      openWebinarModal(btn.getAttribute('data-webinar-url'));
    }
  });

  webinarOverlay.addEventListener('click', closeWebinarModal);
  webinarCloseBtn.addEventListener('click', closeWebinarModal);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && webinarModal.classList.contains('is-open')) closeWebinarModal();
  });

  // Webinar form submission → redirect to webinar
  webinarForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var submitBtn = webinarForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    var redirectUrl = pendingWebinarUrl;

    // Simulate API call (replace with real endpoint)
    setTimeout(function() {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Redirecting...';
      submitBtn.style.background = '#10b981';

      setTimeout(function() {
        webinarForm.reset();
        submitBtn.innerHTML = '<i class="fas fa-play"></i> Watch Now';
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        closeWebinarModal();
        window.open(redirectUrl, '_blank');
      }, 1000);
    }, 1500);
  });
})();
