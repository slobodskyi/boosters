document.addEventListener("DOMContentLoaded", function () {
  // Determine the current locale based on the URL pathname
  var path = window.location.pathname;
  var currentLocale = 'en';
  if (path.startsWith('/ru/')) {
    currentLocale = 'ru';
  } else if (path.startsWith('/ua/')) {
    currentLocale = 'ua';
  }
  
  // Localized texts for the results, restart button, and question counter
  const texts = {
    en: { result: "Results:", restart: "Restart", questionCounter: "Question:" },
    ru: { result: "Результат:", restart: "Еще раз", questionCounter: "Вопрос:" },
    ua: { result: "Результат:", restart: "Ще раз", questionCounter: "Питання:" }
  };

  const quizContainers = document.querySelectorAll('.quiz-container');
  
  quizContainers.forEach(function(container) {
    // Set a default border on the container (4px solid black) and transition for border-color
    container.style.border = "4px solid black";
    container.style.transition = "border-color 0.1s ease-out";
    
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

      // Add localized question counter above the question title
      let html = `
        <div class="question-counter" style="font-size: 23px; color:#878787; margin-bottom: 10px;">
          ${texts[currentLocale].questionCounter} ${currentQuestion + 1} / ${quizData.length}
        </div>
      `;
      html += `<h3>${currentItem.question}</h3>`;
      currentItem.answers.forEach((answer, index) => {
        html += `<button class="quiz-btn" data-index="${index}">${answer}</button>`;
      });
      container.innerHTML = html;

      // Attach click listeners to each answer button
      container.querySelectorAll('.quiz-btn').forEach(function(button) {
        button.addEventListener('click', function() {
          // Send a Zaraz event on quiz button click (if zaraz is available)
          if (typeof zaraz === 'object' && typeof zaraz.track === 'function') {
            zaraz.track("quiz_click", {
              url: window.location.href,
              locale: currentLocale
            });
          }

          selectAnswer(parseInt(this.getAttribute('data-index')));
        });
      });
    }

    // Animate border feedback: correct -> green, wrong -> red, then revert back to black
    function animateFeedback(isCorrect) {
      container.style.borderColor = isCorrect ? "#D3FF75" : "#FF7575";
      setTimeout(function() {
        container.style.borderColor = "black";
      }, 600);
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
      }, 400);
    }

    function showResult() {
      let imageHtml = "";
      // If not a perfect score, show the "try again" image above the results, centered
      if (score !== quizData.length) {
        imageHtml = `
          <div style="text-align:center; margin-bottom:15px;">
            <img src="https://cdn.prod.website-files.com/6558ae529e9653f7d61a6917/67b255ce040723aed51313f9_try-again-quiz.webp"
                 alt="Try Again" style="max-width:100%;"/>
          </div>
        `;
      }
      // If perfect score, trigger confetti animation (if available)
      if (score === quizData.length && typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      // On result screen, display localized "Results:" text and the score
      container.innerHTML = `
        ${imageHtml}
        <div class="question-counter" style="font-size: 23px; text-align:center; margin-bottom: 10px; color:#878787;">
          ${texts[currentLocale].result}
        </div>
        <h3 style="text-align: center;">${score} / ${quizData.length}</h3>
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
