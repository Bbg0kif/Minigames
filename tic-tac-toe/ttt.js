const board = document.getElementById("board");
const status = document.getElementById("status");

let cells = ["", "", "", "", "", "", "", "", ""];
let player = "X";
let gameOver = false;

function drawBoard() {
    board.innerHTML = "";
    cells.forEach((c, i) => {
        const div = document.createElement("div");
        div.className = "cell";
        div.innerText = c;
        div.onclick = () => move(i);
        board.appendChild(div);
    });
}

function move(i) {
    if (cells[i] !== "" || gameOver) return;
    cells[i] = player;
    checkWin();
    player = player === "X" ? "O" : "X";
    drawBoard();
}

function checkWin() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    wins.forEach(w => {
        if (cells[w[0]] && 
            cells[w[0]] === cells[w[1]] && 
            cells[w[1]] === cells[w[2]]) {
            status.innerText = `Переможець: ${cells[w[0]]}`;
            gameOver = true;
        }
    });

    if (!cells.includes("") && !gameOver) {
        status.innerText = "Нічия!";
        gameOver = true;
    }
}

drawBoard();