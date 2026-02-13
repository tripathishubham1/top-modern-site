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
          '<span class="demo-modal__badge"><i class="fas fa-calendar-check"></i> Book a Demo</span>' +
          '<h2 class="demo-modal__title">Start Your 99%ile Journey</h2>' +
          '<p class="demo-modal__desc">Fill in your details and we\'ll schedule a personalised demo session with you.</p>' +
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
            '<i class="fas fa-paper-plane"></i> Submit Details' +
          '</button>' +
        '</form>' +
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

  // Match all demo links: #book-demo, index.html#book-demo, ../index.html#book-demo, etc.
  function isDemoLink(el) {
    if (el.hasAttribute('data-open-demo')) return true;
    var href = el.getAttribute('href');
    if (!href) return false;
    return /^(\.\.\/)?index\.html#book-demo$/.test(href) || href === '#book-demo';
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
})();
