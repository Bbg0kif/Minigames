const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let dino = { x: 30, y: 150, w: 40, h: 40, dy: 0, jump: false };
let cactus = { x: 800, y: 160, w: 20, h: 40 };

let score = 0;
let best = localStorage.getItem("dinoRecord") || 0;
document.getElementById("best").innerText = best;

function drawDino() {
    ctx.fillStyle = "black";
    ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
}

function drawCactus() {
    ctx.fillStyle = "green";
    ctx.fillRect(cactus.x, cactus.y, cactus.w, cactus.h);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gravity
    if (dino.y < 150) {
        dino.dy += 1;
    } else {
        dino.dy = 0;
        dino.y = 150;
        dino.jump = false;
    }

    dino.y += dino.dy;

    // Move cactus
    cactus.x -= 6;
    if (cactus.x < -20) {
        cactus.x = 800;
        score++;

        if (score > best) {
            best = score;
            localStorage.setItem("dinoRecord", best);
            document.getElementById("best").innerText = best;
        }
    }

    // Collision
    if (
        dino.x < cactus.x + cactus.w &&
        dino.x + dino.w > cactus.x &&
        dino.y + dino.h > cactus.y
    ) {
        alert("Програш! Очки: " + score);
        score = 0;
        cactus.x = 800;
    }

    drawDino();
    drawCactus();
    requestAnimationFrame(update);
}

document.addEventListener("keydown", () => {
    if (!dino.jump) {
        dino.jump = true;
        dino.dy = -15;
    }
});

update();