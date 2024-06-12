const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');

const player = {
    x: 50,
    y: 550,
    width: 40,
    height: 40,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    onGround: false
};

const platforms = [
    { x: 0, y: 580, width: 800, height: 20 },
    { x: 100, y: 450, width: 200, height: 20 },
    { x: 400, y: 350, width: 200, height: 20 },
    { x: 650, y: 250, width: 100, height: 20 }
];

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
    player.dy += player.gravity;
    player.x += player.dx;
    player.y += player.dy;

    detectCollisions();
}

function detectCollisions() {
    player.onGround = false;
    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y
        ) {
            player.dy = 0;
            player.y = platform.y - player.height;
            player.onGround = true;
        }
    });

    // Prevent player from going out of canvas
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }
}

function update() {
    clear();
    drawPlatforms();
    drawPlayer();

    newPos();

    requestAnimationFrame(update);
}

function moveRight() {
    player.dx = player.speed;
}

function moveLeft() {
    player.dx = -player.speed;
}

function jump() {
    if (player.onGround) {
        player.dy = player.jumpPower;
        player.onGround = false;
    }
}

function stop() {
    player.dx = 0;
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        moveRight();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        moveLeft();
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        jump();
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left'
    ) {
        stop();
    }
}

function saveGame() {
    const gameState = {
        player: {
            x: player.x,
            y: player.y
        }
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGame() {
    const gameState = JSON.parse(localStorage.getItem('gameState'));
    if (gameState) {
        player.x = gameState.player.x;
        player.y = gameState.player.y;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
saveButton.addEventListener('click', saveGame);
loadButton.addEventListener('click', loadGame);

update();
