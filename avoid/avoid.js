const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

const GAME_AREA_WIDTH = 400;
const GAME_AREA_HEIGHT = 500;
const PLAYER_SIZE = 30;
const PLAYER_SPEED = 7;
const ENEMY_SIZE = 25;

let score = 0;
let playerX = GAME_AREA_WIDTH / 2 - PLAYER_SIZE / 2;
let enemySpeed = 2; 
let enemySpawnRate = 1000;
let gameInterval;
let enemyInterval;


function updatePlayerPosition() {
    playerX = Math.max(0, Math.min(playerX, GAME_AREA_WIDTH - PLAYER_SIZE));
    player.style.left = playerX + 'px';
}

document.addEventListener('keydown', (event) => {
    if (gameOverScreen.classList.contains('hidden')) {
        if (event.key === 'ArrowLeft') {
            playerX -= PLAYER_SPEED;
        } else if (event.key === 'ArrowRight') {
            playerX += PLAYER_SPEED;
        }
        updatePlayerPosition();
    }
});


function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    
    const enemyX = Math.floor(Math.random() * (GAME_AREA_WIDTH - ENEMY_SIZE));
    enemy.style.left = enemyX + 'px';
    
    enemy.y = -ENEMY_SIZE;
    enemy.style.top = enemy.y + 'px';
    
    gameArea.appendChild(enemy);
}

function updateGame() {
    if (!gameOverScreen.classList.contains('hidden')) return;

    const enemies = document.querySelectorAll('.enemy');
    
    enemies.forEach(enemy => {
        enemy.y += enemySpeed;
        enemy.style.top = enemy.y + 'px';

        if (enemy.y > GAME_AREA_HEIGHT) {
            score++;
            scoreDisplay.textContent = score;
            enemy.remove();
        }

        if (checkCollision(player, enemy)) {
            endGame();
        }
    });

    if (score > 0 && score % 10 === 0 && enemySpeed < 10) {
        enemySpeed += 0.005; 
    }
}

function checkCollision(playerElement, enemyElement) {
    const playerRect = playerElement.getBoundingClientRect();
    const enemyRect = enemyElement.getBoundingClientRect();

    return (
        playerRect.left < enemyRect.right &&
        playerRect.right > enemyRect.left &&
        playerRect.top < enemyRect.bottom &&
        playerRect.bottom > enemyRect.top
    );
}


function endGame() {
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    
    finalScoreDisplay.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    enemySpeed = 2;
    playerX = GAME_AREA_WIDTH / 2 - PLAYER_SIZE / 2;
    updatePlayerPosition();

    document.querySelectorAll('.enemy').forEach(e => e.remove());
    
    gameOverScreen.classList.add('hidden');

    gameInterval = setInterval(updateGame, 1000 / 60);

    enemyInterval = setInterval(createEnemy, enemySpawnRate); 
}

restartButton.addEventListener('click', startGame);

startGame();