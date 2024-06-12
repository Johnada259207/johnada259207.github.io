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
        currentLevel = (currentLevel + 1) % levels.length;
        player.x = 50;
        player.y = 550;
        shufflePlatforms(currentLevel);
    }
}

function shufflePlatforms(level) {
    const platforms = levels[level].platforms;
    platforms.forEach(platform => {
        platform.x = Math.random() * (canvas.width - platform.width);
        platform.y = Math.random() * (canvas.height - platform.height - 50) + 50;
    });

    // Ensure door is placed on a platform
    const door = levels[level].door;
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    door.x = randomPlatform.x + randomPlatform.width / 2 - door.width / 2;
    door.y = randomPlatform.y - door.height;
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

// Mobile controls
const leftButton = document.createElement('button');
leftButton.innerHTML = 'Left';
document.body.appendChild(leftButton);
leftButton.addEventListener('touchstart', moveLeft);
leftButton.addEventListener('touchend', stop);

const rightButton = document.createElement('button');
rightButton.innerHTML = 'Right';
document.body.appendChild(rightButton);
rightButton.addEventListener('touchstart', moveRight);
rightButton.addEventListener('touchend', stop);

const jumpButton = document.createElement('button');
jumpButton.innerHTML = 'Jump';
document.body.appendChild(jumpButton);
jumpButton.addEventListener('touchstart', jump);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
saveButton.addEventListener('click', saveGame);
loadButton.addEventListener('click', loadGame);

// Background music
const bgMusic = new Audio('assets/background-music.mp3');
bgMusic.loop = true;
bgMusic.play();

update();
