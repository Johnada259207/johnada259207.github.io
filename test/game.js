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
    onGround: false,
    sprite: new Image()
};

player.sprite.src = 'assets/player.png';

const platformSprite = new Image();
platformSprite.src = 'assets/platform.png';

const doorSprite = new Image();
doorSprite.src = 'assets/door.png';

const background = new Image();
background.src = 'assets/background.png';

const levels = [
    {
        platforms: [
            { x: 0, y: 580, width: 800, height: 20 },
            { x: 100, y: 450, width: 200, height: 20 },
            { x: 400, y: 350, width: 200, height: 20 },
            { x: 650, y: 250, width: 100, height: 20 }
        ],
        door: { x: 750, y: 210, width: 40, height: 40 }
    },
    {
        platforms: [
            { x: 0, y: 580, width: 800, height: 20 },
            { x: 150, y: 450, width: 200, height: 20 },
            { x: 450, y: 350, width: 200, height: 20 },
            { x: 700, y: 250, width: 100, height: 20 }
        ],
        door: { x: 50, y: 210, width: 40, height: 40 }
    }
];

let currentLevel = 0;

function drawPlayer() {
    ctx.drawImage(player.sprite, player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    levels[currentLevel].platforms.forEach(platform => {
        ctx.drawImage(platformSprite, platform.x, platform.y, platform.width, platform.height);
    });
}

function drawDoor() {
    const door = levels[currentLevel].door;
    ctx.drawImage(doorSprite, door.x, door.y, door.width, door.height);
}

function drawBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
    player.dy += player.gravity;
    player.x += player.dx;
    player.y += player.dy;

    detectCollisions();
    detectDoor();
}

function detectCollisions() {
    player.onGround = false;
    levels[currentLevel].platforms.forEach(platform => {
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

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }
}

function detectDoor() {
    const door = levels[currentLevel].door;
    if (
        player.x < door.x + door.width &&
        player.x + player.width > door.x &&
        player.y < door.y + door.height &&
        player.y + player.height > door.y
    ) {
        currentLevel = (currentLevel + 1) % levels.length;
        player.x = 50;
        player.y = 550;
    }
}

function update() {
    clear();
    drawBackground();
    drawPlatforms();
    drawDoor();
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
        },
        currentLevel
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGame() {
    const gameState = JSON.parse(localStorage.getItem('gameState'));
    if (gameState) {
        player.x = gameState.player.x;
        player.y = gameState.player.y;
        currentLevel = gameState.currentLevel;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
saveButton.addEventListener('click', saveGame);
loadButton.addEventListener('click', loadGame);

update();
