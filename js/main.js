/* ============================================
   BigPlanetarium - main.js
   Interactions: starfield, quiz, tabs,
   lightbox, nav toggle, scroll reveal
   ============================================ */

/* -----------------------------------------------
   1. STARFIELD CANVAS ANIMATION
   Renders twinkling stars behind the hero.
   Pauses animation when user prefers reduced motion.
----------------------------------------------- */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Resize canvas to fill its container */
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Generate stars with random positions & speeds */
  const stars = Array.from({ length: 250 }, () => ({
    x:            Math.random(),          // normalised 0–1
    y:            Math.random(),
    radius:       Math.random() * 1.4 + 0.2,
    opacity:      Math.random(),
    twinkleDir:   Math.random() > 0.5 ? 1 : -1,
    twinkleSpeed: Math.random() * 0.012 + 0.003,
  }));

  /* Draw static stars if user has reduced-motion enabled */
  if (prefersReducedMotion) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.opacity.toFixed(2)})`;
      ctx.fill();
    });
    return;
  }

  /* Animated starfield */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      /* Twinkle: fade opacity up and down */
      s.opacity += s.twinkleDir * s.twinkleSpeed;
      if (s.opacity >= 1)  { s.opacity = 1;   s.twinkleDir = -1; }
      if (s.opacity <= 0.05) { s.opacity = 0.05; s.twinkleDir =  1; }

      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.opacity.toFixed(2)})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* -----------------------------------------------
   2. MOBILE NAVIGATION TOGGLE
   Opens/closes the nav menu on small screens.
   Updates aria-expanded for screen readers.
----------------------------------------------- */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('open', !isOpen);
  });

  /* Close menu when a link is clicked (mobile UX) */
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    });
  });

  /* Close menu when clicking outside */
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    }
  });
}

/* -----------------------------------------------
   3. SCROLL REVEAL (Intersection Observer)
   Fades sections in as they enter the viewport.
   Accessible: no animation if reduced motion.
----------------------------------------------- */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  /* Skip animation for users who prefer reduced motion */
  if (prefersReducedMotion) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); /* Only animate once */
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* -----------------------------------------------
   4. SPACE QUIZ
   Renders a 5-question multiple-choice quiz.
   Uses aria-live region to announce feedback.
----------------------------------------------- */
const QUIZ_QUESTIONS = [
  {
    question: 'How many planets are in our Solar System?',
    options: ['7', '8', '9', '10'],
    answer: 1,
    explanation: 'There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.'
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
    answer: 2,
    explanation: 'Mars appears red due to iron oxide (rust) on its surface.'
  },
  {
    question: 'Approximately how far is the Earth from the Sun?',
    options: ['1 million km', '15 million km', '150 million km', '1.5 billion km'],
    answer: 2,
    explanation: 'The Earth is about 150 million kilometres (93 million miles) from the Sun — this distance is called 1 Astronomical Unit.'
  },
  {
    question: 'What is the largest planet in our Solar System?',
    options: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'],
    answer: 2,
    explanation: 'Jupiter is the largest planet — so big that all other planets could fit inside it!'
  },
  {
    question: 'What is the name of the black hole at the centre of the Milky Way?',
    options: ['Andromeda X', 'Sagittarius A*', 'Cygnus X-1', 'Centaurus A'],
    answer: 1,
    explanation: 'Sagittarius A* is a supermassive black hole with a mass about 4 million times that of our Sun.'
  }
];

function initQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    const q = QUIZ_QUESTIONS[currentQuestion];
    container.innerHTML = `
      <p class="quiz-progress">Question ${currentQuestion + 1} of ${QUIZ_QUESTIONS.length}</p>
      <p class="quiz-question" id="quiz-q-${currentQuestion}">${q.question}</p>
      <div class="quiz-options" role="group" aria-labelledby="quiz-q-${currentQuestion}">
        ${q.options.map((opt, i) => `
          <button 
            class="quiz-option" 
            data-index="${i}"
            aria-label="Option ${i + 1}: ${opt}"
          >${opt}</button>
        `).join('')}
      </div>
      <div id="quiz-feedback" class="quiz-feedback" aria-live="polite" role="status" style="display:none"></div>
      <button class="btn btn-primary" id="quiz-next" style="display:none" aria-label="Next question">
        ${currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Results'}
      </button>
    `;

    /* Attach option click handlers */
    container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', handleAnswer);
    });

    document.getElementById('quiz-next')?.addEventListener('click', () => {
      currentQuestion++;
      answered = false;
      if (currentQuestion < QUIZ_QUESTIONS.length) {
        renderQuestion();
      } else {
        renderScore();
      }
    });
  }

  function handleAnswer(e) {
    if (answered) return;
    answered = true;

    const selected = parseInt(e.currentTarget.dataset.index);
    const correct  = QUIZ_QUESTIONS[currentQuestion].answer;
    const feedback = document.getElementById('quiz-feedback');

    /* Disable all options */
    container.querySelectorAll('.quiz-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === correct)  btn.classList.add('correct');
      if (i === selected && i !== correct) btn.classList.add('incorrect');
    });

    if (selected === correct) {
      score++;
      feedback.textContent = `✓ Correct! ${QUIZ_QUESTIONS[currentQuestion].explanation}`;
      feedback.className = 'quiz-feedback correct';
    } else {
      feedback.textContent = `✗ Not quite. ${QUIZ_QUESTIONS[currentQuestion].explanation}`;
      feedback.className = 'quiz-feedback incorrect';
    }

    feedback.style.display = 'block';
    document.getElementById('quiz-next').style.display = 'inline-block';
  }

  function renderScore() {
    const percent = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    let message = 'Keep exploring the cosmos!';
    if (percent >= 80) message = 'Outstanding — a true space explorer!';
    else if (percent >= 60) message = 'Great effort! The universe has more to teach you.';

    container.innerHTML = `
      <div class="quiz-score-display" aria-live="polite">
        <span class="score-number" aria-label="${score} out of ${QUIZ_QUESTIONS.length}">${score}/${QUIZ_QUESTIONS.length}</span>
        <p>${message}</p>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">You scored ${percent}%</p>
        <button class="btn btn-outline" id="quiz-restart" style="margin-top: 1.5rem;">
          Try Again
        </button>
      </div>
    `;

    document.getElementById('quiz-restart')?.addEventListener('click', () => {
      currentQuestion = 0;
      score = 0;
      answered = false;
      renderQuestion();
    });
  }

  renderQuestion();
}

/* -----------------------------------------------
   5. TAB INTERFACE (mars.html)
   ARIA-compliant tabs with keyboard navigation.
   Supports arrow keys and home/end.
----------------------------------------------- */
function initTabs() {
  const tabLists = document.querySelectorAll('[role="tablist"]');
  if (!tabLists.length) return;

  tabLists.forEach(tabList => {
    const tabs   = Array.from(tabList.querySelectorAll('[role="tab"]'));
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));

    function activateTab(tab) {
      /* Deactivate all */
      tabs.forEach(t => {
        t.setAttribute('aria-selected', 'false');
        t.classList.remove('active');
        t.setAttribute('tabindex', '-1');
      });
      panels.forEach(p => p?.classList.remove('active'));

      /* Activate selected */
      tab.setAttribute('aria-selected', 'true');
      tab.classList.add('active');
      tab.setAttribute('tabindex', '0');
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      panel?.classList.add('active');
    }

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => activateTab(tab));

      /* Keyboard navigation: Arrow left/right, Home, End */
      tab.addEventListener('keydown', e => {
        let newIdx = idx;
        if (e.key === 'ArrowRight') newIdx = (idx + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') newIdx = (idx - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') newIdx = 0;
        else if (e.key === 'End')  newIdx = tabs.length - 1;
        else return;

        e.preventDefault();
        activateTab(tabs[newIdx]);
        tabs[newIdx].focus();
      });
    });
  });
}

/* -----------------------------------------------
   6. IMAGE LIGHTBOX (gallery on mars.html)
   Opens full-size images in an overlay.
   Closes on Escape or click outside image.
----------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  if (!lightbox) return;

  let lastFocused = null;

  function open(img) {
    lastFocused = document.activeElement;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    lightbox.removeAttribute('hidden');
    lightboxClose.focus(); /* Move focus into dialog */
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('hidden', '');
    lastFocused?.focus(); /* Return focus to trigger */
  }

  /* Attach to all gallery images */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => open(item.querySelector('img')));
    /* Keyboard: Enter / Space opens lightbox */
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(item.querySelector('img'));
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View full size: ${item.querySelector('img')?.alt || 'image'}`);
  });

  lightboxClose?.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  /* Trap focus within lightbox while open */
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

/* -----------------------------------------------
   7. SET ACTIVE NAV LINK
   Highlights the correct nav link based on current page.
----------------------------------------------- */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/* -----------------------------------------------
   INIT — run everything on DOM ready
----------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initNavToggle();
  initScrollReveal();
  initQuiz();
  initTabs();
  initLightbox();
  setActiveNav();
});
