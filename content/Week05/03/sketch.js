let angle = 0;
let subAngle = 0;
let radius = 200;
let circleSize = 80;

let canvas;

// Center points for the orbit path (moves along 4 sides)
let points = [];
let segmentIndex = 0;
let t = 0;

// Speeds for movement
let pathSpeed = 0.01;
let angleSpeed = 0.03;
let subAngleSpeed = 0.12;

let dotSize = 10;

function setup() {
  // Canvas setup and initial points calculation
  canvas = createCanvas(windowWidth, windowHeight);
  background(0);
  updatePoints();
}

function updatePoints() {
  // Define points for the rectangular path
  points = [
    { x: width / 2,      y: radius },
    { x: width - radius, y: height / 2 },
    { x: width / 2,      y: height - radius },
    { x: radius,         y: height / 2 }
  ];

  segmentIndex = 0;
  t = 0;
}

function draw() {
  // Main draw loop handling path movement and nested orbiting

  // Calculate center position moving along the 4-segment path
  let p0 = points[segmentIndex];
  let p1 = points[(segmentIndex + 1) % points.length];

  let centerX = lerp(p0.x, p1.x, t);
  let centerY = lerp(p0.y, p1.y, t);

  t += pathSpeed;
  if (t >= 1) {
    t -= 1;
    segmentIndex = (segmentIndex + 1) % points.length;
  }

  // Draw main center point
  noStroke();
  fill(255);
  ellipse(centerX, centerY, dotSize, dotSize);

  // Draw invisible orbit circle around center
  noFill();
  stroke(255, 80);
  strokeWeight(dotSize);
  ellipse(centerX, centerY, radius * 2, radius * 2);

  // Calculate orbiting circle center
  let circleCenterX = centerX + cos(angle) * radius;
  let circleCenterY = centerY + sin(angle) * radius;

  noStroke();
  fill(255);
  ellipse(circleCenterX, circleCenterY, dotSize, dotSize);

  // Draw smaller orbit circle around the orbiting circle center
  let smallRadius = circleSize / 2;

  noFill();
  stroke(255, 80);
  strokeWeight(dotSize);
  ellipse(circleCenterX, circleCenterY, smallRadius * 2, smallRadius * 2);

  // Calculate position of small dot on the smaller orbit
  let px = circleCenterX + cos(subAngle) * smallRadius;
  let py = circleCenterY + sin(subAngle) * smallRadius;

  noStroke();
  fill(255);
  ellipse(px, py, dotSize, dotSize);

  // Update angles for orbit rotations
  angle += angleSpeed;
  subAngle += subAngleSpeed;

  drawBorder2D();
}

function windowResized() {
  // Handle canvas resize and update points accordingly
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  updatePoints();
}