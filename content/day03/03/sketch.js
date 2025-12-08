let canvas;

let ballX;
let ballY;
let ballRadius;

let ballVelX;
const SECONDS_PER_SIDE = 1.0;

let hitCount = 0;
let ballColor;

// counters per colore
let blackHits = 0;
let redHits = 0;
let greenHits = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  initBall();
}

function initBall() {
  ballRadius = min(width, height) * 0.03;
  ballX = ballRadius;
  ballY = height / 2;

  let travelDistance = width - 2 * ballRadius;
  ballVelX = travelDistance / SECONDS_PER_SIDE;

  hitCount = 0;
  ballColor = color(0); // nero

  blackHits = 0;
  redHits = 0;
  greenHits = 0;
}

function draw() {
  let dt = deltaTime / 1000;
  ballX += ballVelX * dt;

  // bordo sinistro
  if (ballX - ballRadius <= 0) {
    ballX = ballRadius;
    ballVelX = abs(ballVelX);
    onWallHit();
  }

  // bordo destro
  if (ballX + ballRadius >= width) {
    ballX = width - ballRadius;
    ballVelX = -abs(ballVelX);
    onWallHit();
  }

  background(255);

  // pallina
  fill(ballColor);
  noStroke();
  ellipse(ballX, ballY, ballRadius * 2, ballRadius * 2);

  // contatori in alto a destra
  drawCounters();
}

function onWallHit() {
  hitCount++;

  // ogni ORA (3600, 7200, 10800, ...)
  if (hitCount % 3600 === 0) {
    ballColor = color(0, 255, 0); // verde
    greenHits++;
  }
  // ogni MINUTO (60, 120, 180, ...) ma NON quelli dell’ora
  else if (hitCount % 60 === 0) {
    ballColor = color(255, 0, 0); // rosso
    redHits++;
  }
  // tutti gli altri secondi
  else {
    ballColor = color(0); // nero
    blackHits++;
  }
}

function drawCounters() {
  let margin = 20;
  let x = width - 150;  // zona vicino al bordo destro
  let y = margin;
  let lineSpacing = 24;
  let dotSize = 12;

  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);

  // nero
  fill(0);
  ellipse(x, y + dotSize / 2, dotSize, dotSize);
  fill(0);
  text("= " + blackHits, x + 18, y);

  // rosso
  y += lineSpacing;
  fill(255, 0, 0);
  ellipse(x, y + dotSize / 2, dotSize, dotSize);
  fill(0);
  text("= " + redHits, x + 18, y);

  // verde
  y += lineSpacing;
  fill(0, 255, 0);
  ellipse(x, y + dotSize / 2, dotSize, dotSize);
  fill(0);
  text("= " + greenHits, x + 18, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initBall();
}