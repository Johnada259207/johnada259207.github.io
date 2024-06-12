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
    jumps: 0,
    maxJumps: 2,
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

const doorSound = new Audio('assets/door-sound.mp3');

let currentLevel = 0;
let platformsPerLevel = 4;

function createLevel(platformCount) {
    const platforms = [];
    for (let i = 0; i < platformCount; i++) {
        platforms.push({
            x: Math.random() * (canvas.width - 100),
            y: Math.random() * (canvas.height - 100),
            width: 100,
            height: 20
        });
    }
    const door = { x: 0, y: 0, width: 40, height: 40 };
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    door.x = randomPlatform.x + randomPlatform.width / 2 - door.width / 2;
    door.y = randomPlatform.y - door.height;
    return { platforms, door };
}

let levels = [createLevel(platformsPerLevel)];

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
            player.jumps = 0; // Reset jumps when on the ground
        }
    });

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
        player.jumps = 0; // Reset jumps when on the ground
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
        doorSound.play();
        currentLevel++;
        platformsPerLevel++;
        levels.push(createLevel(platformsPerLevel));
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
    if (player.jumps < player.maxJumps) {
        player.dy = player.jumpPower;
        player.jumps++;
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
    } else if (e.key === 'ArrowUp' || e.key === 'Up' || e.key === ' ') {
        jump();
    } else if (e.key === '>') {
        player.width += 10;
        player.height += 10;
    } else if (e.key === '<') {
        player.width -= 10;
        player.height -= 10;
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
        currentLevel,
        platformsPerLevel
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGame() {
    const gameState = JSON.parse(localStorage.getItem('gameState'));
    if (gameState) {
        player.x = gameState.player.x;
        player.y = gameState.player.y;
        currentLevel = gameState.currentLevel;
        platformsPerLevel = gameState.platformsPerLevel;
        levels = [createLevel(platformsPerLevel)];
    }
}

// Mobile controls
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);

let touchStartX = null;
let touchStartY = null;

function handleTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchMove(e) {
    if (!touchStartX || !touchStartY) return;

    const touch = e.touches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal movement
        if (diffX > 0) {
            moveRight();
        } else {
            moveLeft();
        }
    } else {
        // Vertical movement
        if (diffY < 0) {
            jump();
        }
    }

    touchStartX = null;
    touchStartY = null;
}

function handleTouchEnd() {
    stop();
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
saveButton.addEventListener('click', saveGame);
loadButton.addEventListener('click', loadGame);

// Background music
const bgMusic = new Audio('assets/background-music.mp3');
bgMusic.loop = true;
bgMusic.play();

update();
