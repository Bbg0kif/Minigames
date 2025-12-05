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
    jumpCount: 0,
    hp: 3
};

let obstacles = [];
let score = 0;
let best = localStorage.getItem("dinoRecord") || 0;
document.getElementById("best").innerText = best;

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
    ctx.fillText("[] " + dino.hp, 10, 20);
}

function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Очки: " + score, 680, 20);
}

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

    dino.dy += gravity;
    dino.y += dino.dy;

    if (dino.y >= 150) {
        dino.y = 150;
        dino.dy = 0;
        dino.jumpCount = 0;
    }

    spawnTimer++;
    if (spawnTimer > 80 + Math.random() * 40) {
        spawnObstacle();
        spawnTimer = 0;
    }

    obstacles.forEach((o, i) => {
        o.x -= speed;

        if (o.x + o.w < 0) obstacles.splice(i, 1);

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
    speed += speedIncrease;

    drawDino();
    drawHP();
    drawScore();

    requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (dino.jumpCount < 2) {
            dino.dy = -12;
            dino.jumpCount++;
        }
    }

    if (e.code === "KeyR") restartGame();
});

function restartGame() {
    score = 0;
    speed = 6;
    dino.hp = 3;
    obstacles = [];
}

update();