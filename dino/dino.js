const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 220;

let gravity = 0.7;
let speed = 6;
let speedIncrease = 0.002;

let dino = {
    x: 50,
    y: 150,
    w: 40,
    h: 40,
    dy: 0,
    jumpCount: 0, // подвійний стрибок
    hp: 3
};

let obstacles = [];
let score = 0;
let best = localStorage.getItem("dinoRecord") || 0;
document.getElementById("best").innerText = best;

// --- ФУНКЦІЇ МАЛЮВАННЯ ----------------------------------------------------

function drawDino() {
    ctx.fillStyle = "#000";
    ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
}

function drawGround() {
    ctx.fillStyle = "#888";
    ctx.fillRect(0, 190, 800, 4);
}

function drawObstacle(o) {
    ctx.fillStyle = "#0a0";
    ctx.fillRect(o.x, o.y, o.w, o.h);
}

function drawHP() {
    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.fillText("❤️ " + dino.hp, 10, 20);
}

function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Очки: " + score, 680, 20);
}

// --- ЛОГІКА ГРИ -----------------------------------------------------------

function spawnObstacle() {
    let height = 30 + Math.random() * 40;
    let width = 20 + Math.random() * 20;

    obstacles.push({
        x: 820,
        y: 190 - height,
        w: width,
        h: height
    });
}

let spawnTimer = 0;

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGround();

    // Гравітація
    dino.dy += gravity;
    dino.y += dino.dy;

    // Заборона падіння нижче землі
    if (dino.y >= 150) {
        dino.y = 150;
        dino.dy = 0;
        dino.jumpCount = 0; // оновлюємо подвійний стрибок
    }

    // Рух та спавн кактусів
    spawnTimer++;
    if (spawnTimer > 80 + Math.random() * 40) {
        spawnObstacle();
        spawnTimer = 0;
    }

    obstacles.forEach((o, i) => {
        o.x -= speed;

        // Видалення ліворуч
        if (o.x + o.w < 0) obstacles.splice(i, 1);

        // Перевірка колізії
        if (
            dino.x < o.x + o.w &&
            dino.x + dino.w > o.x &&
            dino.y + dino.h > o.y
        ) {
            dino.hp--;
            obstacles.splice(i, 1);

            if (dino.hp <= 0) {
                alert("Програш! Очки: " + score);

                if (score > best) {
                    localStorage.setItem("dinoRecord", score);
                    document.getElementById("best").innerText = score;
                }

                return restartGame();
            }
        }

        drawObstacle(o);
    });

    score++;
    speed += speedIncrease; // плавне збільшення швидкості

    drawDino();
    drawHP();
    drawScore();

    requestAnimationFrame(update);
}

// --- КЕРУВАННЯ ------------------------------------------------------------

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (dino.jumpCount < 2) { // подвійний стрибок!
            dino.dy = -12;
            dino.jumpCount++;
        }
    }

    if (e.code === "KeyR") restartGame();
});

// --- ПЕРЕЗАПУСК -----------------------------------------------------------

function restartGame() {
    score = 0;
    speed = 6;
    dino.hp = 3;
    obstacles = [];
}

// --- СТАРТ ---------------------------------------------------------------
update();