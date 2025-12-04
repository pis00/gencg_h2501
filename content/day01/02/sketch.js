let grid = [];
let cols = 10;
let rows = 10;
let spacing = 50;
let dotSize = 20;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);


  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push({
        x: 50 + x * spacing,
        y: 50 + y * spacing,
        color: color(0), 
        clicked: false 
      });
    }
  }

  drawGrid();
}

function drawGrid() {
  background(240);

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