const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('status-text');
const resetButton = document.getElementById('reset-button');
const gameBoard = document.getElementById('game-board');
let currentPlayer = Math.random() > 0.5 ? 'X' : 'O'; // Randomly choose starting player
let gameActive = true;

const winConditions = [
    { cells: [0, 1, 2], type: 'horizontal' },
    { cells: [3, 4, 5], type: 'horizontal' },
    { cells: [6, 7, 8], type: 'horizontal' },
    { cells: [0, 3, 6], type: 'vertical' },
    { cells: [1, 4, 7], type: 'vertical' },
    { cells: [2, 5, 8], type: 'vertical' },
    { cells: [0, 4, 8], type: 'diagonal1' },
    { cells: [2, 4, 6], type: 'diagonal2' },
];

const handleClick = (e) => {
    const cell = e.target;
    if (cell.classList.contains('X') || cell.classList.contains('O') || !gameActive) return;

    cell.classList.add(currentPlayer);

    if (checkWin(currentPlayer)) {
        statusText.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (isDraw()) {
        statusText.textContent = `It's a Draw!`;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `${currentPlayer}'s Turn`;
};

const checkWin = (player) => {
    for (const condition of winConditions) {
        const { cells: winCells, type } = condition;
        const [a, b, c] = winCells;
        if (cells[a].classList.contains(player) &&
            cells[b].classList.contains(player) &&
            cells[c].classList.contains(player)) {
            applyWinningLine(type, winCells);
            return true;
        }
    }
    return false;
};

const applyWinningLine = (type, winCells) => {
    // Remove old winning lines if any
    document.querySelectorAll('.winning-line').forEach(line => line.remove());

    const rects = winCells.map(index => cells[index].getBoundingClientRect());
    const gameBoardRect = gameBoard.getBoundingClientRect();

    const line = document.createElement('div');
    line.classList.add('winning-line');
    gameBoard.appendChild(line); // Append to gameBoard, not body

    let lineWidth, lineHeight, left, top, transform;

    switch (type) {
        case 'horizontal':
            lineWidth = `${rects[2].right - rects[0].left}px`;
            lineHeight = '5px';
            left = `${rects[0].left - gameBoardRect.left}px`;
            top = `${rects[0].top - gameBoardRect.top + (rects[0].height / 2) - 2.5}px`;
            transform = 'none';
            break;
        case 'vertical':
            lineWidth = '5px';
            lineHeight = `${rects[2].bottom - rects[0].top}px`;
            left = `${rects[0].left - gameBoardRect.left + (rects[0].width / 2) - 2.5}px`;
            top = `${rects[0].top - gameBoardRect.top}px`;
            transform = 'none';
            break;
        case 'diagonal1':
            const topLeft = rects[0];
            const bottomRight = rects[2];
            const diagonal1Width = Math.sqrt(Math.pow(bottomRight.right - topLeft.left, 2) + Math.pow(bottomRight.bottom - topLeft.top, 2));
            lineWidth = `${diagonal1Width}px`;
            lineHeight = '5px';
            left = `${topLeft.left - gameBoardRect.left}px`;
            top = `${topLeft.top - gameBoardRect.top}px`;
            transform = `rotate(45deg)`;
            break;
        case 'diagonal2':
            const topRight = rects[2];
            const bottomLeft = rects[0];
            const diagonal2Width = Math.sqrt(Math.pow(topRight.left - bottomLeft.right, 2) + Math.pow(bottomLeft.bottom - topRight.top, 2));
            lineWidth = `${diagonal2Width}px`;
            lineHeight = '5px';
            left = `${topRight.right - gameBoardRect.left}px`;
            top = `${topRight.top - gameBoardRect.top}px`;
            transform = `rotate(-45deg)`;
            break;
    }

    line.style.width = lineWidth;
    line.style.height = lineHeight;
    line.style.backgroundColor = '#ffffff'; /* White color for win line */
    line.style.position = 'absolute';
    line.style.left = left;
    line.style.top = top;
    line.style.transform = transform;
    line.style.zIndex = '2'; /* Ensure the line is above the cells */
    line.style.transformOrigin = 'left'; /* Ensure the line grows from left to right */
};

const isDraw = () => {
    return [...cells].every(cell => cell.classList.contains('X') || cell.classList.contains('O'));
};

const resetGame = () => {
    currentPlayer = Math.random() > 0.5 ? 'X' : 'O';
    gameActive = true;
    statusText.textContent = `${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.classList.remove('X', 'O');
    });
    document.querySelectorAll('.winning-line').forEach(line => line.remove());
};

cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});
resetButton.addEventListener('click', resetGame);
