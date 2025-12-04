let points = [];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(240);
}

function draw() {
}

function mousePressed() {
  let newPoint = createVector(mouseX, mouseY);
  points.push(newPoint);

  fill(0);
  noStroke();
  ellipse(newPoint.x, newPoint.y, 8, 8);

  stroke(0);
  for (let i = 0; i < points.length - 1; i++) {
    let p = points[i];
    line(newPoint.x, newPoint.y, p.x, p.y);
  }
}