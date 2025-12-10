const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");

const size = 20;
const cell = canvas.width / size;

let maze = Array(size).fill(null).map(() => Array(size).fill(1));
let player = { x: 0, y: 0 };

function generateMaze() {
    function carve(x, y) {
        const dirs = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ].sort(() => Math.random() - 0.5);

        maze[y][x] = 0;

        for (const [dx, dy] of dirs) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;

            if (ny >= 0 && ny < size && nx >= 0 && nx < size && maze[ny][nx] === 1) {
                maze[y + dy][x + dx] = 0;
                carve(nx, ny);
            }
        }
    }

    carve(0, 0);

    maze[size - 1][size - 2] = 0;
    maze[size - 2][size - 1] = 0;
    maze[size - 1][size - 1] = 0;
}

generateMaze();

function draw() {
    ctx.fillStyle = "#f7e8d5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = "#4a2e16";
                ctx.fillRect(x * cell, y * cell, cell, cell);
            }
        }
    }

    ctx.fillStyle = "red";
    ctx.fillRect(player.x * cell + 4, player.y * cell + 4, cell - 8, cell - 8);

    ctx.fillStyle = "green";
    ctx.fillRect((size - 1) * cell + 4, (size - 1) * cell + 4, cell - 8, cell - 8);
}

draw();

document.addEventListener("keydown", (e) => {
    let nx = player.x;
    let ny = player.y;

    if (e.key === "w" || e.key === "ArrowUp") ny--;
    if (e.key === "s" || e.key === "ArrowDown") ny++;
    if (e.key === "a" || e.key === "ArrowLeft") nx--;
    if (e.key === "d" || e.key === "ArrowRight") nx++;

    if (maze[ny] && maze[ny][nx] === 0) {
        player.x = nx;
        player.y = ny;
    }

    draw();

    if (player.x === size - 1 && player.y === size - 1) {
        setTimeout(() => alert("🎉 Перемога!"), 30);
    }
});