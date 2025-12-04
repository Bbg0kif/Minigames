const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

const size = 20;
let snake = [{ x: 200, y: 200 }];
let food = randomFood();
let vx = 0, vy = 0;
let score = 0;

let best = localStorage.getItem("snakeRecord") || 0;
document.getElementById("best").innerText = best;

function randomFood() {
    return {
        x: Math.floor(Math.random() * 20) * size,
        y: Math.floor(Math.random() * 20) * size
    };
}

function drawSnake() {
    ctx.fillStyle = "lime";
    snake.forEach(s => ctx.fillRect(s.x, s.y, size, size));
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, size, size);
}

function update() {
    let head = { x: snake[0].x + vx, y: snake[0].y + vy };

    // Borders
    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
        restart();
        return;
    }

    snake.unshift(head);

    // Food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = randomFood();

        if (score > best) {
            best = score;
            localStorage.setItem("snakeRecord", best);
            document.getElementById("best").innerText = best;
        }
    } else {
        snake.pop();
    }

    // Self collision
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            restart();
            return;
        }
    }

    ctx.clearRect(0, 0, 400, 400);
    drawFood();
    drawSnake();
}

function restart() {
    alert("Програш! Очки: " + score);
    snake = [{ x: 200, y: 200 }];
    vx = vy = 0;
    score = 0;
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && vy === 0) { vx = 0; vy = -size; }
    if (e.key === "ArrowDown" && vy === 0) { vx = 0; vy = size; }
    if (e.key === "ArrowLeft" && vx === 0) { vx = -size; vy = 0; }
    if (e.key === "ArrowRight" && vx === 0) { vx = size; vy = 0; }
});

setInterval(update, 100);