/**
 * Quiz Module
 * Interactive GMAT readiness quiz with lead capture
 */

(function() {
  'use strict';

  // Quiz State
  let currentQuestion = 0;
  let answers = [];
  let quizStarted = false;

  // Quiz Questions
  const questions = [
    {
      id: 1,
      question: "What's your target GMAT score?",
      options: [
        { text: "700+", value: 5 },
        { text: "650-700", value: 4 },
        { text: "600-650", value: 3 },
        { text: "Below 600", value: 2 },
        { text: "Not sure yet", value: 1 }
      ]
    },
    {
      id: 2,
      question: "How would you rate your current math skills?",
      options: [
        { text: "Excellent - I love math!", value: 5 },
        { text: "Good - Comfortable with basics", value: 4 },
        { text: "Average - Need some brushing up", value: 3 },
        { text: "Weak - Math is challenging for me", value: 2 },
        { text: "Haven't done math in years", value: 1 }
      ]
    },
    {
      id: 3,
      question: "How would you rate your English verbal skills?",
      options: [
        { text: "Native/Near-native proficiency", value: 5 },
        { text: "Fluent - Read extensively", value: 4 },
        { text: "Good - Comfortable with most texts", value: 3 },
        { text: "Average - Some comprehension issues", value: 2 },
        { text: "Need significant improvement", value: 1 }
      ]
    },
    {
      id: 4,
      question: "How much time can you dedicate to GMAT prep weekly?",
      options: [
        { text: "20+ hours (Full-time prep)", value: 5 },
        { text: "15-20 hours", value: 4 },
        { text: "10-15 hours", value: 3 },
        { text: "5-10 hours", value: 2 },
        { text: "Less than 5 hours", value: 1 }
      ]
    },
    {
      id: 5,
      question: "When do you plan to take the GMAT?",
      options: [
        { text: "Within 1 month", value: 5 },
        { text: "1-3 months", value: 4 },
        { text: "3-6 months", value: 3 },
        { text: "6+ months", value: 2 },
        { text: "Just exploring options", value: 1 }
      ]
    }
  ];

  // DOM Elements
  let quizBody, progressFill, questionCounter, prevBtn, nextBtn;

  /**
   * Initialize quiz
   */
  function init() {
    quizBody = document.getElementById('quizBody');
    progressFill = document.querySelector('.quiz-progress__fill');
    questionCounter = document.getElementById('currentQuestion');
    prevBtn = document.getElementById('quizPrev');
    nextBtn = document.getElementById('quizNext');

    if (!quizBody) return;

    // Set up event listeners
    if (prevBtn) prevBtn.addEventListener('click', goToPrevious);
    if (nextBtn) nextBtn.addEventListener('click', goToNext);

    // Render first question
    renderQuestion();
  }

  /**
   * Render current question
   */
  function renderQuestion() {
    const question = questions[currentQuestion];

    const optionsHtml = question.options.map((option, index) => `
      <button class="quiz-option ${answers[currentQuestion] === index ? 'selected' : ''}"
              data-index="${index}"
              type="button">
        ${option.text}
      </button>
    `).join('');

    quizBody.innerHTML = `
      <h3 class="quiz-question">${question.question}</h3>
      <div class="quiz-options">
        ${optionsHtml}
      </div>
    `;

    // Add click listeners to options
    const optionBtns = quizBody.querySelectorAll('.quiz-option');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => selectOption(parseInt(btn.dataset.index)));
    });

    updateProgress();
    updateButtons();
  }

  /**
   * Select an option
   */
  function selectOption(index) {
    answers[currentQuestion] = index;

    // Update UI
    const options = quizBody.querySelectorAll('.quiz-option');
    options.forEach((opt, i) => {
      opt.classList.toggle('selected', i === index);
    });

    // Enable next button
    if (nextBtn) nextBtn.disabled = false;

    // Auto-advance after short delay for better UX
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        goToNext();
      }
    }, 300);
  }

  /**
   * Go to previous question
   */
  function goToPrevious() {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
    }
  }

  /**
   * Go to next question or show results
   */
  function goToNext() {
    // Validate answer
    if (answers[currentQuestion] === undefined) {
      showError('Please select an answer to continue.');
      return;
    }

    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      showResults();
    }
  }

  /**
   * Update progress bar
   */
  function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (questionCounter) questionCounter.textContent = currentQuestion + 1;
  }

  /**
   * Update navigation buttons
   */
  function updateButtons() {
    if (prevBtn) {
      prevBtn.disabled = currentQuestion === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = answers[currentQuestion] === undefined;

      if (currentQuestion === questions.length - 1) {
        nextBtn.innerHTML = 'See Results <i class="fas fa-arrow-right"></i>';
      } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
      }
    }
  }

  /**
   * Calculate score and show results
   */
  function showResults() {
    // Calculate total score
    let totalScore = 0;
    answers.forEach((answerIndex, questionIndex) => {
      totalScore += questions[questionIndex].options[answerIndex].value;
    });

    const maxScore = questions.length * 5;
    const percentage = Math.round((totalScore / maxScore) * 100);

    // Determine level and message
    let level, message, color;

    if (percentage >= 80) {
      level = 'High Achiever';
      message = "You're well-prepared! With the right guidance, a 750+ score is within reach.";
      color = '#10B981';
    } else if (percentage >= 60) {
      level = 'Strong Foundation';
      message = "Good start! With focused preparation, you can aim for 700+.";
      color = '#014AB9';
    } else if (percentage >= 40) {
      level = 'Growth Potential';
      message = "There's room to improve. Our structured program can help you reach your goals.";
      color = '#F59E0B';
    } else {
      level = 'Beginner';
      message = "No worries! Everyone starts somewhere. Let's build your foundation together.";
      color = '#E10013';
    }

    // Hide progress and footer
    const progress = document.querySelector('.quiz-progress');
    const footer = document.querySelector('.quiz-footer');
    if (progress) progress.style.display = 'none';
    if (footer) footer.style.display = 'none';

    // Show results with lead capture form
    quizBody.innerHTML = `
      <div class="quiz-results">
        <div class="quiz-results__score" style="color: ${color}">${percentage}%</div>
        <h3 class="quiz-results__level">${level}</h3>
        <p class="quiz-results__message">${message}</p>

        <div class="quiz-results__form mt-8">
          <p class="text-small text-muted mb-4">Get your personalized study plan:</p>
          <form id="quizLeadForm" class="quiz-lead-form">
            <div class="form-group">
              <input type="text" class="form-input" id="quizName" placeholder="Your Name" required>
            </div>
            <div class="form-group">
              <input type="email" class="form-input" id="quizEmail" placeholder="Email Address" required>
            </div>
            <div class="form-group">
              <input type="tel" class="form-input" id="quizPhone" placeholder="Phone Number" required>
            </div>
            <button type="submit" class="btn btn-gradient w-full">
              Get My Study Plan
              <i class="fas fa-arrow-right"></i>
            </button>
          </form>
        </div>

        <div class="quiz-results__cta mt-6">
          <a href="#book-demo" class="btn btn-secondary w-full">
            <i class="fas fa-calendar-check"></i>
            Book Free Demo Class
          </a>
        </div>
      </div>
    `;

    // Add form submission handler
    const form = document.getElementById('quizLeadForm');
    if (form) {
      form.addEventListener('submit', handleLeadSubmission);
    }
  }

  /**
   * Handle lead form submission
   */
  function handleLeadSubmission(e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('quizName').value,
      email: document.getElementById('quizEmail').value,
      phone: document.getElementById('quizPhone').value,
      score: calculateFinalScore(),
      answers: answers.map((a, i) => ({
        question: questions[i].question,
        answer: questions[i].options[a].text
      }))
    };

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    // Simulate API call (replace with actual API endpoint)
    setTimeout(() => {
      console.log('Lead data:', formData);

      // Show success message
      e.target.innerHTML = `
        <div class="text-center">
          <i class="fas fa-check-circle text-success" style="font-size: 48px; color: #10B981;"></i>
          <p class="mt-4 font-semibold">Thank you, ${formData.name}!</p>
          <p class="text-muted">We'll send your personalized study plan shortly.</p>
        </div>
      `;

      // Track conversion (if analytics is set up)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'quiz_completion', {
          event_category: 'lead_generation',
          event_label: 'gmat_readiness_quiz'
        });
      }
    }, 1500);
  }

  /**
   * Calculate final score
   */
  function calculateFinalScore() {
    let totalScore = 0;
    answers.forEach((answerIndex, questionIndex) => {
      totalScore += questions[questionIndex].options[answerIndex].value;
    });
    return totalScore;
  }

  /**
   * Show error message
   */
  function showError(message) {
    const existing = quizBody.querySelector('.quiz-error');
    if (existing) existing.remove();

    const error = document.createElement('p');
    error.className = 'quiz-error text-accent text-small mt-2 text-center';
    error.textContent = message;
    quizBody.appendChild(error);

    setTimeout(() => error.remove(), 3000);
  }

  /**
   * Reset quiz
   */
  function reset() {
    currentQuestion = 0;
    answers = [];
    quizStarted = false;

    // Show progress and footer again
    const progress = document.querySelector('.quiz-progress');
    const footer = document.querySelector('.quiz-footer');
    if (progress) progress.style.display = '';
    if (footer) footer.style.display = '';

    renderQuestion();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.Quiz = {
    init,
    reset,
    getCurrentQuestion: () => currentQuestion,
    getAnswers: () => answers
  };

})();
