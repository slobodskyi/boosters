document.addEventListener("DOMContentLoaded", function () {
  // Determine the current locale based on the URL pathname
  var path = window.location.pathname;
  var currentLocale = 'en';
  if (path.startsWith('/ru/')) {
    currentLocale = 'ru';
  } else if (path.startsWith('/ua/')) {
    currentLocale = 'ua';
  }
  
  // Localized texts for the results and restart button
  const texts = {
    en: { result: "Results:", restart: "Restart" },
    ru: { result: "Результат:", restart: "Еще раз" },
    ua: { result: "Результат:", restart: "Ще раз" }
  };

  const quizContainers = document.querySelectorAll('.quiz-container');
  
  quizContainers.forEach(function(container) {
    // Parse quiz data from the data-quiz attribute
    const quizData = JSON.parse(container.getAttribute('data-quiz'));
    let currentQuestion = 0;
    let score = 0;

    function loadQuestion() {
      if (currentQuestion >= quizData.length) {
        showResult();
        return;
      }
      const currentItem = quizData[currentQuestion];
      let html = `<h3>${currentItem.question}</h3>`;
      currentItem.answers.forEach((answer, index) => {
        html += `<button class="quiz-btn" data-index="${index}">${answer}</button>`;
      });
      container.innerHTML = html;
      // Attach click listeners to each answer button
      container.querySelectorAll('.quiz-btn').forEach(function(button) {
        button.addEventListener('click', function() {
          // Send a GA4 event on quiz button click
          if (typeof gtag === 'function') {
            gtag('event', 'quiz_click', {
              event_category: 'quiz',
              event_label: `question_${currentQuestion}`,
              value: 1
            });
          }
          selectAnswer(parseInt(this.getAttribute('data-index')));
        });
      });
    }

    // Animate background color feedback: green if correct, red if incorrect
    function animateFeedback(isCorrect) {
      container.style.transition = "background-color 0.1s ease-in";
      container.style.backgroundColor = isCorrect ? "#D3FF75" : "#FF7575";
      setTimeout(function() {
        container.style.backgroundColor = "";
      }, 500);
    }

    function selectAnswer(selectedIndex) {
      var isCorrect = (selectedIndex === quizData[currentQuestion].correct);
      if (isCorrect) {
        score++;
      }
      animateFeedback(isCorrect);
      currentQuestion++;
      setTimeout(function() {
        loadQuestion();
      }, 600);
    }

    function showResult() {
      // If perfect score, trigger confetti animation (if available)
      if (score === quizData.length && typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      // Display the localized result text and restart button
      container.innerHTML = `
        <h3>${texts[currentLocale].result} ${score} / ${quizData.length}</h3>
        <button class="quiz-restart">${texts[currentLocale].restart}</button>
      `;
      container.querySelector('.quiz-restart').addEventListener('click', function() {
        currentQuestion = 0;
        score = 0;
        loadQuestion();
      });
    }

    loadQuestion();
  });
});
