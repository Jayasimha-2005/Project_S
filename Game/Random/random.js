let randomNumber, attempts, timeLeft, timerInterval;
let bestScore = localStorage.getItem("bestScore");
let topScores = JSON.parse(localStorage.getItem("topScores")) || [];
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const timeoutSound = document.getElementById("timeoutSound");

// Ensure bestScore is a valid number or set to "--"
bestScore = bestScore ? Number(bestScore) : "--";
document.getElementById("bestScore").textContent = bestScore;

resetGame(); // Initialize game

function setDifficulty() {
    let difficulty = document.getElementById("difficulty").value;

    if (difficulty === "easy") {
        timeLeft = 60;
    } else if (difficulty === "medium") {
        timeLeft = 30;
    } else {
        timeLeft = 15;
    }

    document.getElementById("timer").textContent = timeLeft;

    resetGame(); // Reset game with updated difficulty
}

function startTimer() {
    clearInterval(timerInterval); // Clear existing timer
    document.getElementById("timer").textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById("message").textContent = " Time's up! You lost!";
            document.getElementById("message").style.color = "red";
            timeoutSound.play(); // Play the timeout sound
            disableGame();
        }
    }, 1000);
}

function checkGuess() {
    let userGuess = document.getElementById("userGuess").value;
    let message = document.getElementById("message");
    let attemptsDisplay = document.getElementById("attempts");

    if (userGuess === "" || isNaN(userGuess)) {
        message.textContent = " Enter a valid number!";
        message.style.color = "red";
        return;
    }

    userGuess = Number(userGuess);
    attempts++;

    if (userGuess < randomNumber) {
        message.textContent = "Too low! Try again.";
        message.style.color = "orange";
        wrongSound.play();
        document.getElementById("userGuess").classList.add("shake");
        setTimeout(() => {
            document.getElementById("userGuess").classList.remove("shake");
        }, 500);
    } else if (userGuess > randomNumber) {
        message.textContent = " Too high! Try again.";
        message.style.color = "red";
        wrongSound.play();
        document.getElementById("userGuess").classList.add("shake");
        setTimeout(() => {
            document.getElementById("userGuess").classList.remove("shake");
        }, 500);
    } else {
        message.textContent = ` Correct! The number was ${randomNumber}`;
        message.style.color = "green";
        correctSound.play();
        document.getElementById("userGuess").classList.add("bounce");
        setTimeout(() => {
            document.getElementById("userGuess").classList.remove("bounce");
        }, 500);
        clearInterval(timerInterval);

        // Update best score
        if (bestScore === "--" || attempts < bestScore) {
            bestScore = attempts;
            localStorage.setItem("bestScore", bestScore);
            document.getElementById("bestScore").textContent = bestScore;
        }

        // Update top scores
        updateTopScores(attempts);
        disableGame();
    }

    attemptsDisplay.textContent = attempts;

    // Provide hints after 3 attempts
    if (attempts === 3) {
        provideHint();
    }
}

// Hint System
function provideHint() {
    let hint = "";
    if (randomNumber % 2 === 0) {
        hint = "Hint: The number is even.";
    } else {
        hint = "Hint: The number is odd.";
    }
    document.getElementById("hint").textContent = hint;
}

// Update Top Scores
function updateTopScores(score) {
    topScores.push(score);
    topScores.sort((a, b) => a - b); // Sort in ascending order
    topScores = topScores.slice(0, 5); // Keep only top 5 scores
    localStorage.setItem("topScores", JSON.stringify(topScores));
    displayTopScores();
}

// Display Top Scores
function displayTopScores() {
    const topScoresList = document.getElementById("topScores");
    topScoresList.innerHTML = "";
    topScores.forEach((score, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${score} attempts`;
        topScoresList.appendChild(li);
    });
}

// Initialize top scores display
displayTopScores();

// Allow checking when pressing Enter key
document.getElementById("userGuess").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        checkGuess();
    }
});

function disableGame() {
    document.getElementById("userGuess").disabled = true;
}

function resetGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;

    // Get difficulty value again to ensure correct timeLeft
    let difficulty = document.getElementById("difficulty").value;
    if (difficulty === "easy") {
        timeLeft = 60;
    } else if (difficulty === "medium") {
        timeLeft = 30;
    } else {
        timeLeft = 15;
    }
    document.getElementById("message").textContent = "";
    document.getElementById("attempts").textContent = "0";
    document.getElementById("userGuess").value = "";
    document.getElementById("userGuess").disabled = false;
    document.getElementById("timer").textContent = timeLeft;

    startTimer(); // Restart timer
}