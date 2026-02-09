/**
 * Forms Module
 * Form validation, submission handling, and UI feedback
 */

(function() {
  'use strict';

  /**
   * Initialize forms functionality
   */
  function init() {
    setupFormValidation();
    setupContactForm();
    setupNewsletterForms();
  }

  /**
   * Setup real-time form validation
   */
  function setupFormValidation() {
    // Add validation to all forms with data-validate attribute
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');

      inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => validateField(input));

        // Clear error on input
        input.addEventListener('input', () => clearFieldError(input));
      });

      // Validate on submit
      form.addEventListener('submit', (e) => {
        let isValid = true;

        inputs.forEach(input => {
          if (!validateField(input)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
          // Focus first invalid field
          const firstError = form.querySelector('.form-input--error');
          if (firstError) firstError.focus();
        }
      });
    });
  }

  /**
   * Validate a single field
   * @param {HTMLElement} field - Input element
   * @returns {boolean} Whether field is valid
   */
  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name || field.id;
    let isValid = true;
    let errorMessage = '';

    // Required check
    if (field.required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Phone validation
    else if (type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    // Min length
    else if (field.minLength && value.length < field.minLength) {
      isValid = false;
      errorMessage = `Must be at least ${field.minLength} characters`;
    }

    // Pattern validation
    else if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        isValid = false;
        errorMessage = field.dataset.patternError || 'Invalid format';
      }
    }

    // Show/hide error
    if (!isValid) {
      showFieldError(field, errorMessage);
    } else {
      clearFieldError(field);
    }

    return isValid;
  }

  /**
   * Show error message for a field
   */
  function showFieldError(field, message) {
    field.classList.add('form-input--error');

    // Remove existing error
    const existingError = field.parentElement.querySelector('.form-error');
    if (existingError) existingError.remove();

    // Add error message
    const error = document.createElement('span');
    error.className = 'form-error';
    error.textContent = message;
    field.parentElement.appendChild(error);

    // Add shake animation
    field.classList.add('animate-shake');
    setTimeout(() => field.classList.remove('animate-shake'), 600);
  }

  /**
   * Clear error from field
   */
  function clearFieldError(field) {
    field.classList.remove('form-input--error');
    const error = field.parentElement.querySelector('.form-error');
    if (error) error.remove();
  }

  /**
   * Setup contact form
   */
  function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Simulate API call (replace with actual endpoint)
        await simulateAPICall(data);

        // Show success
        showFormSuccess(contactForm, 'Thank you! We\'ll get back to you within 24 hours.');

        // Reset form
        contactForm.reset();

        // Track conversion
        trackEvent('contact_form_submit', { category: 'engagement' });

      } catch (error) {
        showFormError(contactForm, 'Something went wrong. Please try again or call us directly.');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /**
   * Setup newsletter subscription forms
   */
  function setupNewsletterForms() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!emailInput || !submitBtn) return;

        const email = emailInput.value.trim();
        const originalText = submitBtn.innerHTML;

        // Validate email
        if (!validateEmail(email)) {
          showFieldError(emailInput, 'Please enter a valid email');
          return;
        }

        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        try {
          await simulateAPICall({ email });

          // Show success
          form.innerHTML = `
            <div class="text-center p-4">
              <i class="fas fa-check-circle" style="font-size: 32px; color: #10B981;"></i>
              <p class="mt-2">You're subscribed!</p>
            </div>
          `;

          trackEvent('newsletter_subscribe', { category: 'engagement' });

        } catch (error) {
          showFieldError(emailInput, 'Subscription failed. Please try again.');
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      });
    });
  }

  /**
   * Show form success message
   */
  function showFormSuccess(form, message) {
    // Remove existing messages
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    const successMsg = document.createElement('div');
    successMsg.className = 'form-message form-message--success p-4 rounded-lg bg-success text-white mb-4';
    successMsg.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
    form.prepend(successMsg);

    // Auto-remove after 5 seconds
    setTimeout(() => successMsg.remove(), 5000);
  }

  /**
   * Show form error message
   */
  function showFormError(form, message) {
    // Remove existing messages
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    const errorMsg = document.createElement('div');
    errorMsg.className = 'form-message form-message--error p-4 rounded-lg bg-accent text-white mb-4';
    errorMsg.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
    form.prepend(errorMsg);

    // Auto-remove after 5 seconds
    setTimeout(() => errorMsg.remove(), 5000);
  }

  /**
   * Validate email format
   */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Simulate API call
   */
  function simulateAPICall(data) {
    return new Promise((resolve, reject) => {
      console.log('Form submission:', data);
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error('API Error'));
        }
      }, 1500);
    });
  }

  /**
   * Track event (if analytics available)
   */
  function trackEvent(event, params = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', event, params);
    }
    console.log('Track:', event, params);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.Forms = {
    init,
    validateField,
    showFormSuccess,
    showFormError
  };

})();
