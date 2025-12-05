const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
ctx.scale(20, 20);

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) continue outer;
        }
        arena.splice(y, 1);
        arena.unshift(new Array(12).fill(0));
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && 
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createPiece(type) {
    if (type === 'T')
        return [
            [0,1,0],
            [1,1,1],
            [0,0,0],
        ];
    if (type === 'O')
        return [
            [1,1],
            [1,1],
        ];
    if (type === 'L')
        return [
            [0,1,0],
            [0,1,0],
            [0,1,1],
        ];
}

function draw() {
    ctx.fillStyle = '#f7e8d5';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawMatrix(arena,{x:0,y:0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset){
    matrix.forEach((row,y)=>{
        row.forEach((val,x)=>{
            if(val!==0){
                ctx.fillStyle = 'orange';
                ctx.fillRect(x+offset.x, y+offset.y, 1, 1);
            }
        })
    })
}

function merge(arena, player){
    player.matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if(value!==0){
                arena[y+player.pos.y][x+player.pos.x] = value;
            }
        })
    })
}

function playerDrop(){
    player.pos.y++;
    if(collide(arena,player)){
        player.pos.y--;
        merge(arena,player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerReset(){
    const pieces = 'TOL';
    player.matrix = createPiece(pieces[(pieces.length*Math.random())|0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length/2 | 0) - (player.matrix[0].length/2 | 0);

    if(collide(arena, player)){
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function updateScore(){
    document.getElementById("best").innerText = player.score;
}

let dropCounter = 0;
let dropInterval = 500;

let lastTime = 0;
function update(time = 0){
    const delta = time - lastTime;
    lastTime = time;
    dropCounter += delta;
    if(dropCounter > dropInterval){
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

const arena = Array.from({length:20}, () => Array(12).fill(0));

const player = {
    pos: {x:0,y:0},
    matrix: null,
    score: 0
};

document.addEventListener("keydown", event=>{
    if(event.key==="ArrowLeft") player.pos.x--;
    if(event.key==="ArrowRight") player.pos.x++;
    if(event.key==="ArrowDown") playerDrop();
});

playerReset();
update();