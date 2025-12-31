let canvas;

// Global state and configuration variables
let ballX;
let ballY;
let ballRadius;

let ballVelX;
const SECONDS_PER_SIDE = 1.0;

let seconds = 0;
let minutes = 0;
let hours   = 0;

let ballColor;

let blackHits = 0;
let redHits = 0;
let greenHits = 0;

// Setup and ball initialization logic
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

  seconds = 0;
  minutes = 0;
  hours = 0;

  ballColor = color(0);

  blackHits = 0;
  redHits = 0;
  greenHits = 0;
}

// Main draw loop structure
function draw() {
  let dt = deltaTime / 1000;
  ballX += ballVelX * dt;

  // Collision and tick handling
  if (ballX - ballRadius <= 0) {
    ballX = ballRadius;
    ballVelX = abs(ballVelX);
    onTick();
  }

  if (ballX + ballRadius >= width) {
    ballX = width - ballRadius;
    ballVelX = -abs(ballVelX);
    onTick();
  }

  background(255);

  fill(ballColor);
  noStroke();
  ellipse(ballX, ballY, ballRadius * 2, ballRadius * 2);

  drawCounters();

  drawBorder2D();
}

// Time counting logic based on collisions
function onTick() {

  // Increment seconds per collision
  seconds++;

  // Increment total hit counter
  blackHits++;

  // Handle rollover for minutes and hours with color changes
  if (seconds >= 60) {
    seconds = 0;
    minutes++;

    ballColor = color(255, 0, 0);
    redHits++;
  } else {
    ballColor = color(0);
  }

  if (minutes >= 60) {
    minutes = 0;
    hours++;

    ballColor = color(0, 255, 0);
    greenHits++;
  }
}

// Counter rendering logic
function drawCounters() {
  let margin = 20;
  let x = width - 150;
  let y = margin;
  let lineSpacing = 24;
  let dotSize = 12;

  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);

  // Black counter
  fill(0);
  ellipse(x, y + dotSize / 2, dotSize, dotSize);
  fill(0);
  text("= " + blackHits, x + 18, y);

  y += lineSpacing;

  // Red counter
  fill(255, 0, 0);
  ellipse(x, y + dotSize / 2, dotSize, dotSize);
  fill(0);
  text("= " + redHits, x + 18, y);

  y += lineSpacing;

  // Green counter
  fill(0, 255, 0);
  ellipse(x, y + dotSize / 2, dotSize, dotSize);
  fill(0);
  text("= " + greenHits, x + 18, y);
}

// Resize handling
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initBall();
}