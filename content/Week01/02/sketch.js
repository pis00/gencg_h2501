let grid = [];
const spacing = 60;
const dotSize = 20;

let cols, rows;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initGrid();
  drawGrid();
}

function initGrid() {
  grid = [];

  cols = floor(width / spacing);
  rows = floor(height / spacing);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push({
        x: spacing / 2 + x * spacing,
        y: spacing / 2 + y * spacing,
        color: color(0),
        clicked: false
      });
    }
  }
}

function drawGrid() {
  background(255);

  for (let p of grid) {
    noStroke();
    fill(p.color);
    ellipse(p.x, p.y, dotSize, dotSize);
  }

  drawBorder2D();
}

function mousePressed() {
  for (let p of grid) {
    const d = dist(mouseX, mouseY, p.x, p.y);

    if (d < dotSize / 2 && !p.clicked) {
      p.color = color(random(255), random(255), random(255));
      p.clicked = true;
      drawGrid();
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initGrid();
  drawGrid();
}