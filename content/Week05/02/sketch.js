let angle = 0;
let subAngle = 0;
let radius = 200;
let circleSize = 80;

let canvas;

let points = [];
let segmentIndex = 0;
let t = 0;

let pathSpeed = 0.01;
let angleSpeed = 0.03;
let subAngleSpeed = 0.12;

let dotSize = 10;
let lastX = null;
let lastY = null;

// Global state and configuration variables

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(0);

  updatePoints();
}

// Path and orbit setup logic
function updatePoints() {
  points = [
    { x: width / 2,      y: radius },
    { x: width - radius, y: height / 2 },
    { x: width / 2,      y: height - radius },
    { x: radius,         y: height / 2 }
  ];

  segmentIndex = 0;
  t = 0;
  lastX = null;
  lastY = null;
}

// Main draw loop phases
function draw() {
  let p0 = points[segmentIndex];
  let p1 = points[(segmentIndex + 1) % points.length];

  let centerX = lerp(p0.x, p1.x, t);
  let centerY = lerp(p0.y, p1.y, t);

  t += pathSpeed;
  if (t >= 1) {
    t -= 1;
    segmentIndex = (segmentIndex + 1) % points.length;
  }

  let circleCenterX = centerX + cos(angle) * radius;
  let circleCenterY = centerY + sin(angle) * radius;

  let smallRadius = circleSize / 2;
  let px = circleCenterX + cos(subAngle) * smallRadius;
  let py = circleCenterY + sin(subAngle) * smallRadius;

  // Trail rendering logic
  if (lastX !== null && lastY !== null) {
    stroke(255);
    strokeWeight(dotSize);
    line(lastX, lastY, px, py);
  }

  lastX = px;
  lastY = py;

  noStroke();
  fill(255);
  ellipse(px, py, dotSize, dotSize);

  // Motion update logic
  angle += angleSpeed;
  subAngle += subAngleSpeed;

  drawBorder2D();
}

// Resize handling
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  updatePoints();
}