const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('.cell');
const gameBoard = document.getElementById('gameBoard');
const gameStatus = document.getElementById('gameStatus');
const playerScoreElement = document.getElementById('playerScore');
const tieScoreElement = document.getElementById('tieScore');
const computerScoreElement = document.getElementById('computerScore');
const pages = document.querySelectorAll('.page');

const onePlayerBtn = document.getElementById('onePlayerBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const settingsIcon = document.getElementById('settingsIcon');
const easyBtn = document.getElementById('easyBtn');
const mediumBtn = document.getElementById('mediumBtn');
const hardBtn = document.getElementById('hardBtn');
const backBtn = document.getElementById('backBtn');
const restartBtn = document.getElementById('restartBtn');

let playerScore = 0;
let tieScore = 0;
let computerScore = 0;
let isPlayerTurn = true;
let gameMode = 'twoPlayer';
let difficulty = 'medium';

showPage('homePage');

onePlayerBtn.addEventListener('click', () => startGame('onePlayer'));
twoPlayerBtn.addEventListener('click', () => startGame('twoPlayer'));
settingsIcon.addEventListener('click', () => showPage('settingsPage'));
easyBtn.addEventListener('click', () => selectDifficulty('easy'));
mediumBtn.addEventListener('click', () => selectDifficulty('medium'));
hardBtn.addEventListener('click', () => selectDifficulty('hard'));
backBtn.addEventListener('click', () => showPage('homePage'));
restartBtn.addEventListener('click', () => {
    // Reset scores and game
    playerScore = 0;
    tieScore = 0;
    computerScore = 0;
    updateScores();
    initGame();
});

function startGame(mode) {
    gameMode = mode;
    if (mode === 'onePlayer') {
        showPage('difficultyPage');
    } else {
        showPage('gamePage');
        initGame();
    }
}

function selectDifficulty(level) {
    difficulty = level;
    showPage('gamePage');
    initGame();
}

function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }
}

function initGame() {
    isPlayerTurn = true;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    gameStatus.innerText = "Player X's turn";
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = isPlayerTurn ? X_CLASS : O_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (gameMode === 'onePlayer' && !isPlayerTurn) {
            setTimeout(computerMove, 500);
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass.toUpperCase();
}

function swapTurns() {
    isPlayerTurn = !isPlayerTurn;
    gameStatus.innerText = isPlayerTurn ? "Player X's turn" : "Player O's turn";
}

function setBoardHoverClass() {
    gameBoard.classList.remove(X_CLASS);
    gameBoard.classList.remove(O_CLASS);
    gameBoard.classList.add(isPlayerTurn ? X_CLASS : O_CLASS);
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    let message;
    if (draw) {
        message = 'Draw!';
        tieScore++;
    } else {
        const winner = checkWinner();
        if (winner === 'x') {
            message = 'Player X Wins!';
            playerScore++;
        } else if (winner === 'o') {
            message = 'Player O Wins!';
            computerScore++;
        }
    }
    updateScores();
    showPopup(message);
}

function checkWinner() {
    if (checkWin(X_CLASS)) {
        return 'x';
    } else if (checkWin(O_CLASS)) {
        return 'o';
    } else {
        return null;
    }
}

function updateScores() {
    playerScoreElement.innerText = playerScore;
    tieScoreElement.innerText = tieScore;
    computerScoreElement.innerText = computerScore;
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerText = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
        initGame();
    }, 2000);
}

function computerMove() {
    let move;
    switch (difficulty) {
        case 'easy':
            move = randomMove();
            break;
        case 'medium':
            move = blockOrRandomMove();
            break;
        case 'hard':
            move = findBestMove();
            break;
        default:
            move = randomMove();
            break;
    }
    const cell = cellElements[move];
    placeMark(cell, O_CLASS);
    if (checkWin(O_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function randomMove() {
    const emptyCells = [];
    cellElements.forEach((cell, index) => {
        if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
            emptyCells.push(index);
        }
    });
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function blockOrRandomMove() {
    const move = findWinningMove();
    if (move !== null) {
        return move;
    }
    return randomMove();
}

function findWinningMove() {
    const availableMoves = [];
    WINNING_COMBINATIONS.forEach(combination => {
        const [a, b, c] = combination;
        const cellA = cellElements[a];
        const cellB = cellElements[b];
        const cellC = cellElements[c];
        if (cellA.classList.contains(O_CLASS) && cellB.classList.contains(O_CLASS) && !cellC.classList.contains(X_CLASS)) {
            availableMoves.push(c);
        } else if (cellA.classList.contains(O_CLASS) && cellC.classList.contains(O_CLASS) && !cellB.classList.contains(X_CLASS)) {
            availableMoves.push(b);
        } else if (cellB.classList.contains(O_CLASS) && cellC.classList.contains(O_CLASS) && !cellA.classList.contains(X_CLASS)) {
            availableMoves.push(a);
        }
    });
    return availableMoves.length > 0 ? availableMoves[0] : null;
}

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    cellElements.forEach((cell, index) => {
        if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
            cell.classList.add(O_CLASS);
            const score = minimax(cellElements, false);
            cell.classList.remove(O_CLASS);
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }
    });
    return bestMove;
}

function minimax(board, isMaximizing) {
    const winner = checkWinner();
    if (winner !== null) {
        return winner === 'o' ? 1 : -1;
    }
    if (isDraw()) {
        return 0;
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach((cell, index) => {
            if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
                cell.classList.add(O_CLASS);
                const score = minimax(board, false);
                cell.classList.remove(O_CLASS);
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((cell, index) => {
            if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
                cell.classList.add(X_CLASS);
                const score = minimax(board, true);
                cell.classList.remove(X_CLASS);
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

initGame();
function toggleAudio() {
    var audio = document.getElementById('backgroundAudio');
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

function showSettings() {
    var settingsPage = document.getElementById('settingsPage');
    settingsPage.style.display = 'block';
}

function hideSettings() {
    var settingsPage = document.getElementById('settingsPage');
    settingsPage.style.display = 'none';
}

function toggleFullScreen() {
    var elem = document.documentElement;
    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}
function showPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    
    // Add emojis based on the message
    switch (message) {
        case "Player X Wins!":
            message += " 🎉😎"; // You have won🎉😎
            break;
        case "Player O Wins!":
            message += " 😢 Try again!"; // You have Lost 😢 Try again! 
            break;
        case "Draw!":
            message += " 😅"; // Draw 😅
            break;
    }

    popup.innerText = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
        initGame();
    }, 2000);
}

