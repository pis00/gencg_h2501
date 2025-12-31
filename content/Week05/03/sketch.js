let angle = 0;
let subAngle = 0;
let radius = 200;
let circleSize = 80;

let canvas;

// punti per il centro dell'orbita (si muove sui 4 lati)
let points = [];
let segmentIndex = 0;
let t = 0;

// velocità
let pathSpeed = 0.01;
let angleSpeed = 0.03;
let subAngleSpeed = 0.12;

let dotSize = 10;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(0);
  updatePoints();
}

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

function draw() {
  // background(0);

  // --- movimento del centro sul percorso a 4 lati ---
  let p0 = points[segmentIndex];
  let p1 = points[(segmentIndex + 1) % points.length];

  let centerX = lerp(p0.x, p1.x, t);
  let centerY = lerp(p0.y, p1.y, t);

  t += pathSpeed;
  if (t >= 1) {
    t -= 1;
    segmentIndex = (segmentIndex + 1) % points.length;
  }

  // centro principale
  noStroke();
  fill(255);
  ellipse(centerX, centerY, dotSize, dotSize);

  // --- orbita del cerchio invisibile ---
  noFill();
  stroke(255, 80);
  strokeWeight(dotSize);
  ellipse(centerX, centerY, radius * 2, radius * 2);

  let circleCenterX = centerX + cos(angle) * radius;
  let circleCenterY = centerY + sin(angle) * radius;

  noStroke();
  fill(255);
  ellipse(circleCenterX, circleCenterY, dotSize, dotSize);

  // --- pallina sulla circonferenza del cerchio invisibile ---
  let smallRadius = circleSize / 2;

  noFill();
  stroke(255, 80);
  strokeWeight(dotSize);
  ellipse(circleCenterX, circleCenterY, smallRadius * 2, smallRadius * 2);

  let px = circleCenterX + cos(subAngle) * smallRadius;
  let py = circleCenterY + sin(subAngle) * smallRadius;

  noStroke();
  fill(255);
  ellipse(px, py, dotSize, dotSize);

  // aggiorna angoli
  angle += angleSpeed;
  subAngle += subAngleSpeed;

  drawBorder2D();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  updatePoints();
}