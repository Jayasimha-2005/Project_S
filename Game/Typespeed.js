let startTime;
let timerInterval;
const textElement = document.getElementById("text");
const inputElement = document.getElementById("input");
const timerElement = document.getElementById("timer");
const speedElement = document.getElementById("speed");
const accuracyElement = document.getElementById("accuracy");
const errorsElement = document.getElementById("errors");
const levelSelector = document.getElementById("level");
const leaderboardElement = document.getElementById("leaderboard");
const achievementsElement = document.getElementById("achievements");
const restartBtn = document.getElementById("restartBtn");
const saveBtn = document.getElementById("saveBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

const texts = {
    basic: [
        "The sun rises in the east and sets in the west.",
        "Birds fly in the sky.",
        "Water is essential for life.",
        "Reading books is a good habit.",
        "Honesty is the best policy."
    ],
    medium: [
        "Typing is a fundamental skill that improves over time with practice.",
        "Patience and consistency are key to mastering any skill.",
        "Technology is rapidly changing the way we live and work.",
        "Effective communication is essential in every aspect of life."
    ],
    advanced: [
        "Success in life requires hard work, persistence, and a constant desire to improve oneself.",
        "Critical thinking is essential in problem-solving and decision-making.",
        "Innovation and creativity drive progress in various fields."
    ]
};

let scores = JSON.parse(localStorage.getItem("scores")) || [];
let achievements = JSON.parse(localStorage.getItem("achievements")) || [];

// Event Listeners
levelSelector.addEventListener("change", changeLevel);
inputElement.addEventListener("input", handleInput);
restartBtn.addEventListener("click", resetTest);
saveBtn.addEventListener("click", saveScore);
darkModeBtn.addEventListener("click", toggleDarkMode);

// Functions
function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(() => {
        let elapsedTime = (new Date().getTime() - startTime) / 1000;
        timerElement.textContent = elapsedTime.toFixed(1);
    }, 100);
}

function handleInput() {
    if (!startTime) startTimer();
    calculateSpeedAndAccuracy();
}

function calculateSpeedAndAccuracy() {
    const typedText = inputElement.value;
    const originalText = textElement.textContent;
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const timeTaken = (new Date().getTime() - startTime) / 60000;
    const wpm = wordsTyped / timeTaken || 0;
    let correctChars = 0;
    let errors = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === originalText[i]) correctChars++;
        else errors++;
    }
    const accuracy = (correctChars / originalText.length) * 100;

    speedElement.textContent = Math.round(wpm);
    accuracyElement.textContent = Math.max(0, accuracy.toFixed(1));
    errorsElement.textContent = errors;

    if (typedText === originalText) {
        clearInterval(timerInterval);
        checkAchievements();
    }
}

function resetTest() {
    clearInterval(timerInterval);
    startTime = null;
    timerElement.textContent = "0";
    speedElement.textContent = "0";
    accuracyElement.textContent = "100";
    errorsElement.textContent = "0";
    inputElement.value = "";
    inputElement.focus();
    changeLevel();
}

function changeLevel() {
    const selectedLevel = levelSelector.value;
    const randomText = texts[selectedLevel][Math.floor(Math.random() * texts[selectedLevel].length)];
    textElement.textContent = randomText;
    resetTest();
}

function saveScore() {
    const name = prompt("Enter your name:");
    if (name) {
        const score = {
            name: name,
            wpm: speedElement.textContent,
            accuracy: accuracyElement.textContent,
            level: levelSelector.value
        };
        scores.push(score);
        localStorage.setItem("scores", JSON.stringify(scores));
        updateLeaderboard();
    }
}

function updateLeaderboard() {
    leaderboardElement.innerHTML = "";
    scores.sort((a, b) => b.wpm - a.wpm).forEach(score => {
        const li = document.createElement("li");
        li.textContent = `${score.name}: ${score.wpm} WPM (${score.accuracy}%) - ${score.level}`;
        leaderboardElement.appendChild(li);
    });
}

function checkAchievements() {
    const wpm = parseInt(speedElement.textContent);
    const accuracy = parseInt(accuracyElement.textContent);

    if (wpm >= 50 && !achievements.includes("Fast Typer")) {
        achievements.push("Fast Typer");
        alert("Achievement Unlocked: Fast Typer!");
    }
    if (accuracy >= 90 && !achievements.includes("Accuracy Master")) {
        achievements.push("Accuracy Master");
        alert("Achievement Unlocked: Accuracy Master!");
    }
    if (wpm >= 100 && !achievements.includes("Speed Demon")) {
        achievements.push("Speed Demon");
        alert("Achievement Unlocked: Speed Demon!");
    }

    localStorage.setItem("achievements", JSON.stringify(achievements));
    updateAchievements();
}

function updateAchievements() {
    achievementsElement.innerHTML = "";
    achievements.forEach(achievement => {
        const li = document.createElement("li");
        li.textContent = achievement;
        achievementsElement.appendChild(li);
    });
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Initialize
updateLeaderboard();
updateAchievements();
changeLevel();