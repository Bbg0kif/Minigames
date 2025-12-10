const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const TILE_SIZE = 20; 
ctx.scale(TILE_SIZE, TILE_SIZE);

const ARENA_WIDTH = 12;
const ARENA_HEIGHT = 20;

const colors = [
    null, 
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) continue outer;
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

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
    if (type === 'T') return [[0,1,0], [1,1,1], [0,0,0]];
    if (type === 'L') return [[0,2,0], [0,2,0], [0,2,2]];
    if (type === 'J') return [[3,0,0], [3,3,3], [0,0,0]];
    if (type === 'I') return [[0,0,0,0], [4,4,4,4], [0,0,0,0], [0,0,0,0]];
    if (type === 'S') return [[0,5,5], [5,5,0], [0,0,0]];
    if (type === 'Z') return [[6,6,0], [0,6,6], [0,0,0]];
    if (type === 'O') return [[7,7], [7,7]];
}

function drawMatrix(matrix, offset){
    matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if(value!==0){
                ctx.fillStyle = colors[value];
                ctx.fillRect(x+offset.x, y+offset.y, 1, 1);
                
            }
        })
    })
}

function draw() {
    ctx.fillStyle = '#f7e8d5'; 
    ctx.fillRect(0,0,ARENA_WIDTH,ARENA_HEIGHT);
    drawMatrix(arena,{x:0,y:0});
    drawMatrix(player.matrix, player.pos);
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

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
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

function playerMove(offset){
    player.pos.x += offset;
    if(collide(arena,player)){
        player.pos.x -= offset;
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    
    rotate(player.matrix, dir);
    
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir); 
            player.pos.x = pos;
            return;
        }
    }
}

function playerReset(){
    const pieces = 'T L J I S Z O'.split(' '); 
    player.
    matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    if(collide(arena, player)){
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
        alert("Гру Закінчено! Ваш фінальний рахунок: " + player.score);
    }
}

function updateScore(){
    document.getElementById("score").innerText = player.score;
}

let dropCounter = 0;
let dropInterval = 1000; 
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

const arena = Array.from({length: ARENA_HEIGHT}, () => Array(ARENA_WIDTH).fill(0));

const player = {
    pos: {x:0,y:0},
    matrix: null,
    score: 0
};

document.addEventListener("keydown", event=>{
    if(event.key==="ArrowLeft") playerMove(-1);
    if(event.key==="ArrowRight") playerMove(1);
    if(event.key==="ArrowDown") playerDrop();
    if(event.key==="q" || event.key==="Q") playerRotate(-1);
    if(event.key==="w" || event.key==="W" || event.key==="ArrowUp") playerRotate(1);
    
    if(event.code==="Space"){
        while(!collide(arena, player)){
            player.pos.y++;
        }
        player.pos.y--;
        merge(arena,player);
        playerReset();
        arenaSweep();
        updateScore();
        dropCounter = 0;
    }
});

playerReset();
updateScore();
update();