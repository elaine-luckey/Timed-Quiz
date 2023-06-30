//Create constant variables for elements by ID and query selectors
const startPage = document.querySelector('.start-quiz-page');
const startButton = document.querySelector('.start-button');
const questionPage = document.querySelector('.questions-page');
const timerRemaining = document.getElementById('timer');
const answerBar = document.querySelector('.answer-bar');
const answerResponse = document.getElementById('correct-or-wrong-response');
const resultsPage = document.querySelector('.first-results-page');
const fScore = document.getElementById('final-score');
const scoreInitials = document.getElementById('fs');
const submitButton = document.getElementById('submit-hs');
const highScoresPage = document.querySelector('.high-score-page');
const highScoresList = document.querySelector('.high-scores-list');
const backButton = document.querySelector('.go-back');
const clearHS = document.querySelector('.clear');
const goToHsPage = document.getElementById('high-score-link');
const pageHeader = document.querySelector('.page-header');

// Global Variables
let finalScore = 0;        //finalScore will be set to 0 initially until the user has started the quiz
let quizOver = false;      //quizOver should be false until the user has completed the entire quiz
let questionIndex = 0;     //Always want the index to start at 0 so the quiz starts with the first question
let totalTime = 75;        //totalTime will start at 75 seconds
let userInitials = '';     //userInitials is set to an empty string to take in the user's actual initials later
let highScoresArray = [];  //highScoreArray is set as an empty array so the scores can be later added into the array
let index = 1;             

//Start the timer
const startTimeCount = () => {
    let timer = setInterval(() => {
        //if the quiz is not over
        if(!quizOver) {
            totalTime--;
            finalScore = totalTime;
            timerRemaining.innerText = `Time Remaining: ${totalTime}`;
        }
        //if the quiz is over
        if(quizOver) {
            clearInterval(timerRemaining);
        }
        //if the timer gets to zero
        if(totalTime < 0){
            clearInterval(timerRemaining);
            showScore();
            timerRemaining.innerText = 'Time Remaining: 0';
        }
    }, 1000)
}

//Start the quiz
const startQuiz = () => {
    //Hide the startPage
    startPage.classList.add('hide');
    //Remove the hide on the start page
    questionPage.classList.remove('hide');
    showQuestion(questionIndex);
    //Display the timer with the total time remaining
    timerRemaining.innerText = `Time Remaining: ${totalTime}`;
    //Start the counting down of the timer and calling the startTimeCount function
    startTimeCount();
}

//Show the questions page
const showQuestion = (index) => {
//Create constant variables question and answers to grab the ID element for question and answers from the HTML
    const question = document.getElementById('questions');
    const answers = document.getElementById('answers');

    //If there are any questions left that need to be displayed
    if (questionIndex <= codingQuestions.length - 1) {
        question.innerHTML = `<h1>${codingQuestions[index].question}</h1>`;

        answers.innerHTML =
        `<button class="btn">${codingQuestions[index].answers[0]}</button>
        <button class="btn">${codingQuestions[index].answers[1]}</button>
        <button class="btn">${codingQuestions[index].answers[2]}</button>
        <button class="btn">${codingQuestions[index].answers[3]}</button>`

        const buttons = document.querySelectorAll('.btn');

    //Create an event listener for each button that is clicked and check the answer
        buttons.forEach((button) => {
            button.addEventListener('click', checkAnswer)
        })
    } else {
        quizOver = true;
        showScore();
    };
};

//Check if the answer is correct or wrong
const checkAnswer = (event) => {
    const answerClicked = event.target.innerText;

    //If the correct answer is selected
    if(answerClicked === codingQuestions[questionIndex].correctAnswer){
        answerResponse.innerText = 'Correct!';
        answerBar.classList.remove('hide');
    //If the wrong answer is selected
    } else if (answerClicked !== codingQuestions[questionIndex].correctAnswer) {
        totalTime -= 10;
        answerResponse.innerText = 'Wrong!';
        answerBar.classList.remove('hide');
    //If there are no more answerResponse to check then the quizOver becomes true and display the score
    } else {
    quizOver = true;
    showScore();
    }

    //Display the answer, whether it is correct or wrong after 500 milliseconds after the question is answered
    setTimeout(() => {
        answerBar.classList.add('hide');
        questionIndex++;
        showQuestion(questionIndex);
    }, 500);
};

const showScore = () => {
    quizOver = true;
    questionPage.classList.add('hide');
    resultsPage.classList.remove('hide');
    fScore.innerText = `${finalScore}`;
}

//Create high score page with user being able to enter in their initials and display a final score
const createHighScore = () => {
    userInitials = scoreInitials.value;

    //If the user does not enter any information
    if(!userInitials){
        alert("Please enter your initials!");
        return;
    }
    //Clear the input field
    scoreInitials.value = '';

    let highScore = {
        userInitials,
        finalScore,
    }

    //Enter the final scores and initials into the high scores array
    highScoresArray.push(highScore);

    //Prevents from displaying the high score of the first child twice
    while (highScoresList.firstChild) {
        highScoresList.removeChild(highScoresList.firstChild);
    }

    //Add the high scores to the HTML with a for loop
    for (let i = 0; i < highScoresArray.length; i++) {
        let highScoreLi = document.createElement('li');
        highScoreLi.innerText = `${index}. ${highScoresArray[i].userInitials} - ${highScoresArray[i].finalScore}`;
        highScoresList.appendChild(highScoreLi);
        index++;
    }

    //Calling in the saveHighScore and displayHighScores functions
    saveHighScore();
    displayHighScores();
}

// Use local storage on the browser to save the high scores
const saveHighScore = () => {
    localStorage.setItem('HighScore', JSON.stringify(highScoresArray));
}

// Get the high scores loaded from the local storage that it was previously saved on
const getHighScore = () => {
    let loadHighScores = JSON.parse(localStorage.getItem('HighScore'));

    //if there is not local storage return false and stop the action
    if (!localStorage) {
        return false;
    }
};

//Display high scores page
const displayHighScores = () => {
    quizOver = true;

    resultsPage.classList.add('hide');
    startPage.classList.add('hide');
    questionPage.classList.add('hide');

    highScoresPage.classList.remove('hide');
    pageHeader.style.visibility = 'hidden';
    timerRemaining.innerText = 'Time Remaining: 0';

}

//Clear the high scores page
const clearScores = () => {
    highScoresArray = [];
    index = 1;

    //Removes the high scores after clearing the local browser storage
while (highScoresList.firstChild) {
    highScoresList.removeChild(highScoresList.firstChild);
};

    localStorage.clear('HighScore');
}

//Set global variables back to what they were in the beginning, when clicking on the Back button
const backToStart = () => {
    quizOver = false;
    questionIndex = 0;
    totalTime = 75; // Set the total time back to the initial value
    finalScore = 0;
    userInitials = '';
    index = 1;

    resultsPage.classList.add('hide');

    renderStartPage();
}

//Render start page after the user clicks the go back button
const renderStartPage = () => {
    //hide the high score page
    highScoresPage.classList.add('hide');
    //hide the results page when going back to the start page
    resultsPage.classList.add('hide');
    //remove the hide from the start page
    startPage.classList.remove('hide');
    //have the pageHeader visible
    pageHeader.style.visibility = 'visible';
    //reset the timerRemaining to be 0 again
    timerRemaining.innerText = 'Time Remaining: 0';
}

//Get the local storage array to render from the start
getHighScore();

//Add event listeners for all buttons
//start quiz button
startButton.addEventListener('click', startQuiz);
//submit button
submitButton.addEventListener('click', createHighScore)
//back to start button
backButton.addEventListener('click', backToStart);
//display the high score link
goToHsPage.addEventListener('click', displayHighScores);
//clear the high scores button
clearHS.addEventListener('click', clearScores); 

