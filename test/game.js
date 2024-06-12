const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BLOCK_SIZE = 20;
const ROWS = canvas.height / BLOCK_SIZE;
const COLS = canvas.width / BLOCK_SIZE;

let grid = [];
for (let row = 0; row < ROWS; row++) {
    grid[row] = [];
    for (let col = 0; col < COLS; col++) {
        grid[row][col] = 0; // 0 means empty, 1 means block
    }
}

canvas.addEventListener('click', function(event) {
    const x = event.offsetX;
    const y = event.offsetY;

    const col = Math.floor(x / BLOCK_SIZE);
    const row = Math.floor(y / BLOCK_SIZE);

    if (grid[row][col] === 0) {
        grid[row][col] = 1;
    } else {
        grid[row][col] = 0;
    }

    drawGrid();
});

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (grid[row][col] === 1) {
                ctx.fillStyle = 'green';
                ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
            ctx.strokeStyle = 'gray';
            ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

drawGrid();
