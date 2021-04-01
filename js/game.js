const question = document.getElementById('question'); // get the h1 question id
const choices = Array.from(document.getElementsByClassName('choice-text')) //get the choice-text class
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progress-bar-full');

//create variables
let currentQuestion = {}; //object
let acceptingAnswers = false;
let score = 0; //scores
let questionCounter = 0;
let availableQuestionsArr = []; // array of questions

// use the API fetch call to get the questions from a local json file
let questionsArr = [];
fetch("https://opentdb.com/api.php?amount=20&category=11&difficulty=easy&type=multiple").then(res => {
    return res.json();
}).then(loadedQuestions => {
    questionsArr = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
            question: loadedQuestion.question,
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
            loadedQuestion.correct_answer
        );

        answerChoices.forEach((choice, index) => {
            formattedQuestion['choice' + (index + 1)] = choice;
        });

        return formattedQuestion;
    });

    
    startGame();
}).catch(err => {
    console.error(err);
})

//constant
const CORRECT_BONUS = 10; // score gotten when question is answered correctly
const MAX_QUESTIONS = 15; // max amount of questions in the quiz

//function to start the game upon page load
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestionsArr = [... questionsArr]; //copy the questions into the array and use the spread operator to make a full copy
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
}

getNewQuestion = () => {
    //check if there are no questions left in the array or the question counter has reached its max questions
    if(availableQuestionsArr.length == 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("recentScore", score);
        // go to the end page
        return window.location.assign("/end.html");
    }
    questionCounter+=1; //increment the questionCounter by 1
    progressText.innerText = `Question ${questionCounter} / ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    const questionIndex = Math.floor(Math.random() * availableQuestionsArr.length); //get any random question index and place it in the variable
    currentQuestion = availableQuestionsArr[questionIndex]; //get the current question and assign it
    question.innerText = currentQuestion.question; // get the current question text and assign it to the const question innerText

    //get the current question choices and set the choices innerText
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    })

    availableQuestionsArr.splice(questionIndex, 1); //splice the array of questions to make sure a question does not repeat itself
    acceptingAnswers = true;
}
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target; //get the selected choice and assign it to selectedChoice
        const selectedAnswer = selectedChoice.dataset["number"]; // get the choices answer
        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        if (classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
          selectedChoice.parentElement.classList.remove(classToApply);
          getNewQuestion();
        }, 1000);
    });
});

//create function to increment the score 
incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

//create function to decrement the score by 1
decrementScore = () => {
    score -= 1;
    scoreText.innerText = score;
}