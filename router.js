document.addEventListener('DOMContentLoaded', () => {
  
  const confettiScript = document.createElement('script');
  confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
  confettiScript.defer = true;
  document.body.appendChild(confettiScript);
  
  // Dynamically load quiz.js
  const quizScript = document.createElement('script');
  quizScript.src = 'https://scripts.slobodskyi.com/quiz.js';
  quizScript.defer = true;
  document.body.appendChild(quizScript);

  // Dynamically load date-localizer.js
  const dateScript = document.createElement('script');
  dateScript.src = 'https://scripts.slobodskyi.com/date-localizer.js';
  dateScript.defer = true;
  document.body.appendChild(dateScript);
});
