console.log("Hello, World!");document.addEventListener("DOMContentLoaded", function () {
  // Find every quiz container on the page
  const quizContainers = document.querySelectorAll('.quiz-container');
  quizContainers.forEach(function(container) {
    // Parse the quiz data from the data attribute
    const quizData = JSON.parse(container.getAttribute('data-quiz'));
    // Initialize state
    let currentQuestion = 0;
    let score = 0;

    // Function to render a question
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
      // Attach event listeners for answer buttons
      container.querySelectorAll('.quiz-btn').forEach(function(button) {
        button.addEventListener('click', function() {
          selectAnswer(parseInt(this.getAttribute('data-index')));
        });
      });
    }

    // Function to handle answer selection
    function selectAnswer(selectedIndex) {
      if (selectedIndex === quizData[currentQuestion].correct) {
        score++;
      }
      currentQuestion++;
      loadQuestion();
    }

    // Function to display the final result
    function showResult() {
      container.innerHTML = `
        <h2>Your Score: ${score} / ${quizData.length}</h2>
        <button class="quiz-restart">Restart Quiz</button>
      `;
      container.querySelector('.quiz-restart').addEventListener('click', function() {
        currentQuestion = 0;
        score = 0;
        loadQuestion();
      });
    }

    // Start the quiz
    loadQuestion();
  });
});