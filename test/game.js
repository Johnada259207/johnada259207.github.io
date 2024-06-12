const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 400,
    y: 300,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0
};

const item = {
    x: Math.random() * (canvas.width - 20),
    y: Math.random() * (canvas.height - 20),
    width: 20,
    height: 20
};

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawItem() {
    ctx.fillStyle = 'red';
    ctx.fillRect(item.x, item.y, item.width, item.height);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
    player.x += player.dx;
    player.y += player.dy;

    detectWalls();
}

function detectWalls() {
    // Left wall
    if (player.x < 0) {
        player.x = 0;
    }

    // Right wall
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // Top wall
    if (player.y < 0) {
        player.y = 0;
    }

    // Bottom wall
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

function detectCollision() {
    if (
        player.x < item.x + item.width &&
        player.x + player.width > item.x &&
        player.y < item.y + item.height &&
        player.y + player.height > item.y
    ) {
        item.x = Math.random() * (canvas.width - 20);
        item.y = Math.random() * (canvas.height - 20);
    }
}

function update() {
    clear();
    drawItem();
    drawPlayer();

    newPos();
    detectCollision();

    requestAnimationFrame(update);
}

function moveUp() {
    player.dy = -player.speed;
}

function moveDown() {
    player.dy = player.speed;
}

function moveRight() {
    player.dx = player.speed;
}

function moveLeft() {
    player.dx = -player.speed;
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        moveRight();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        moveLeft();
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        moveUp();
    } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        moveDown();
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left' ||
        e.key === 'ArrowUp' ||
        e.key === 'Up' ||
        e.key === 'ArrowDown' ||
        e.key === 'Down'
    ) {
        player.dx = 0;
        player.dy = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

update();
