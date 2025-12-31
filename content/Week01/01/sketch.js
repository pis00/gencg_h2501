let points = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
}

function draw() {
  drawBorder2D();
}

function mousePressed() {
  const newPoint = createVector(mouseX, mouseY);
  points.push(newPoint);

  noStroke();
  fill(0);
  ellipse(newPoint.x, newPoint.y, 8, 8);

  stroke(0);
  for (let i = 0; i < points.length - 1; i++) {
    const p = points[i];
    line(newPoint.x, newPoint.y, p.x, p.y);
  }
}