const question = document.getElementById('question'); // get the h1 question id
const choices = Array.from(document.getElementsByClassName('choice-text')) //get the choice-text class

//create variables
let currentQuestion = {}; //object
let acceptingAnswers = false;
let score = 0; //scores
let questionCounter = 0;
let availableQuestionsArr = []; // array of questions

//hardcoded questions for the quiz app
let questionsArr = [
    {
        question: 'Inside which HTML element do we put the JavaScript??',
        choice1: '<script>',
        choice2: '<javascript>',
        choice3: '<js>',
        choice4: '<scripting>',
        answer: 1,
    },
    {
        question:
            "What is the correct syntax for referring to an external script called 'xxx.js'?",
        choice1: "<script href='xxx.js'>",
        choice2: "<script name='xxx.js'>",
        choice3: "<script src='xxx.js'>",
        choice4: "<script file='xxx.js'>",
        answer: 3,
    },
    {
        question: " How do you write 'Hello World' in an alert box?",
        choice1: "msgBox('Hello World');",
        choice2: "alertBox('Hello World');",
        choice3: "msg('Hello World');",
        choice4: "alert('Hello World');",
        answer: 4,
    },
];

//constant
const CORRECT_BONUS = 10; // score gotten when question is answered correctly
const MAX_QUESTIONS = 3; // max amount of questions in the quiz

//function to start the game upon page load
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestionsArr = [... questionsArr]; //copy the questions into the array and use the spread operator to make a full copy
    getNewQuestion();
}

getNewQuestion = () => {
    //check if there are no questions left in the array or the question counter has reached its max questions
    if(availableQuestionsArr.length == 0 || questionCounter >= MAX_QUESTIONS){
        // go to the end page
        return window.location.assign("/end.html");
    }
    questionCounter+=1; //increment the questionCounter by 1
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
        getNewQuestion();
    })
})

//call  the function
startGame();