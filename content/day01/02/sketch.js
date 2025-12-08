let grid = [];
let spacing = 60;
let dotSize = 20;

let cols, rows;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  cols = floor(width / spacing);
  rows = floor(height / spacing);

  // Genera la griglia
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

  drawGrid();
}

function drawGrid() {
  background(255);

  for (let p of grid) {
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, dotSize, dotSize);
  }
}

function mousePressed() {
  for (let p of grid) {
    let d = dist(mouseX, mouseY, p.x, p.y);

    if (d < dotSize / 2 && !p.clicked) {
      p.color = color(random(255), random(255), random(255));
      p.clicked = true;
      drawGrid();
      break;
    }
  }
}

function windowResized() {
  setup(); 
}