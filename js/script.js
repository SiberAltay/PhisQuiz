// script.js
let currentQuestion = 0;
let score = 0;
let questions = [];

// DOM elementleri
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const phishingBtn = document.getElementById('phishing-btn');
const realBtn = document.getElementById('real-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const restartQuizBtn = document.getElementById('restart-quiz-btn');
const showExplanationBtn = document.getElementById('show-explanation-btn');
const questionImage = document.getElementById('question-image');
const feedback = document.getElementById('feedback');
const feedbackText = document.getElementById('feedback-text');
const explanation = document.getElementById('explanation');
const explanationModal = document.getElementById('explanation-modal');
const explanationClose = document.getElementById('explanation-close');
const explanationTitle = document.getElementById('explanation-title');
const progress = document.getElementById('progress');
const scoreProgress = document.getElementById('score-progress');
const currentQuestionEl = document.getElementById('current-question');
const totalQuestionsEl = document.getElementById('total-questions');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');

// Açıklama penceresi
const EXPLANATION_TITLES = {
    phishing: 'Bu e-postayı ele veren detay',
    real: 'Bu e-postayı gerçek kılan detay',
};

let lastFocused = null;

function openExplanation() {
    lastFocused = document.activeElement;
    explanationModal.classList.remove('hidden');
    explanationClose.focus();
}

function closeExplanation() {
    if (explanationModal.classList.contains('hidden')) return;
    explanationModal.classList.add('hidden');
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    lastFocused = null;
}

// Quiz'i başlat
function startQuiz() {
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');

    questions = [...questionsData].sort(() => Math.random() - 0.5);
    currentQuestion = 0;
    score = 0;

    totalQuestionsEl.textContent = questions.length;
    showQuestion();
}

// Soruyu göster
function showQuestion() {
    const question = questions[currentQuestion];

    questionImage.src = question.image;
    currentQuestionEl.textContent = currentQuestion + 1;
    progress.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    // Geri bildirimi ve açıklamayı sıfırla
    feedback.className = 'feedback hidden';
    closeExplanation();
    explanation.textContent = '';
    nextBtn.classList.add('hidden');

    // Cevap butonlarını sıfırla
    for (const btn of [phishingBtn, realBtn]) {
        btn.disabled = false;
        btn.classList.remove('selected', 'correct', 'incorrect');
    }

    // Dar ekranlarda tek sütuna düştüğü için görseli tekrar üste al
    quizScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Cevabı kontrol et
function checkAnswer(answer) {
    const question = questions[currentQuestion];
    const isCorrect = answer === question.correct;

    if (isCorrect) score++;

    phishingBtn.disabled = true;
    realBtn.disabled = true;

    const selectedBtn = answer === 'phishing' ? phishingBtn : realBtn;
    selectedBtn.classList.add('selected', isCorrect ? 'correct' : 'incorrect');

    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    if (isCorrect) {
        feedbackText.textContent = 'Doğru cevap.';
    } else {
        const gercek = question.correct === 'phishing' ? 'phishing' : 'gerçek';
        feedbackText.textContent = `Yanlış cevap — bu aslında bir ${gercek} e-posta.`;
    }

    explanationTitle.textContent =
        EXPLANATION_TITLES[question.correct] ?? EXPLANATION_TITLES.phishing;
    explanation.textContent = question.explanation;
    nextBtn.textContent =
        currentQuestion + 1 < questions.length ? 'Sonraki Soru' : 'Sonucu Gör';
    nextBtn.classList.remove('hidden');
}

// Sonuçları göster
function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    scoreEl.textContent = score;
    totalEl.textContent = questions.length;
    scoreProgress.style.width = `${(score / questions.length) * 100}%`;

    resultScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Event listeners
startBtn.addEventListener('click', startQuiz);
phishingBtn.addEventListener('click', () => checkAnswer('phishing'));
realBtn.addEventListener('click', () => checkAnswer('real'));

showExplanationBtn.addEventListener('click', openExplanation);
explanationClose.addEventListener('click', closeExplanation);

// Arka plana ve "Kapat" butonuna tıklayınca da kapansın
for (const el of explanationModal.querySelectorAll('[data-close]')) {
    el.addEventListener('click', closeExplanation);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeExplanation();
});

nextBtn.addEventListener('click', () => {
    if (currentQuestion + 1 < questions.length) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
});

restartBtn.addEventListener('click', startQuiz);
restartQuizBtn.addEventListener('click', startQuiz);
