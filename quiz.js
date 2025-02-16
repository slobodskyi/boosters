<script>
document.addEventListener("DOMContentLoaded", function () {
  const quizContainers = document.querySelectorAll('.quiz-container');
  quizContainers.forEach(function(container) {
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
      container.querySelectorAll('.quiz-btn').forEach(function(button) {
        button.addEventListener('click', function() {
          selectAnswer(parseInt(this.getAttribute('data-index')));
        });
      });
    }

    function selectAnswer(selectedIndex) {
      if (selectedIndex === quizData[currentQuestion].correct) {
        score++;
      }
      currentQuestion++;
      loadQuestion();
    }

    function showResult() {
      // Add celebration if perfect score
      if (score === quizData.length) {
        container.classList.add('perfect');
      }
      container.innerHTML = `
        <h3>${score} / ${quizData.length}</h3>
        <button class="quiz-restart">
          <img src="https://cdn.prod.website-files.com/6558ae529e9653f7d61a6917/67b212cc96f0dbcc969ef511_restart_alt_24dp_000000_FILL0_wght600_GRAD0_opsz24.svg" alt="Restart">
        </button>
      `;
      container.querySelector('.quiz-restart').addEventListener('click', function() {
        currentQuestion = 0;
        score = 0;
        container.classList.remove('perfect');
        loadQuestion();
      });
    }

    loadQuestion();
  });
});
</script>
