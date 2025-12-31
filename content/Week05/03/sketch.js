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
}

// Main draw loop phases
function draw() {
  background(0);

  let p0 = points[segmentIndex];
  let p1 = points[(segmentIndex + 1) % points.length];

  let centerX = lerp(p0.x, p1.x, t);
  let centerY = lerp(p0.y, p1.y, t);

  noFill();
  stroke(100);
  strokeWeight(1);
  ellipse(centerX, centerY, radius * 2, radius * 2);

  t += pathSpeed;
  if (t >= 1) {
    t -= 1;
    segmentIndex = (segmentIndex + 1) % points.length;
  }

  let circleCenterX = centerX + cos(angle) * radius;
  let circleCenterY = centerY + sin(angle) * radius;

  fill(150);
  noStroke();
  ellipse(circleCenterX, circleCenterY, 6, 6);

  let smallRadius = circleSize / 2;
  let px = circleCenterX + cos(subAngle) * smallRadius;
  let py = circleCenterY + sin(subAngle) * smallRadius;

  noFill();
  stroke(80);
  ellipse(circleCenterX, circleCenterY, circleSize, circleSize);

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