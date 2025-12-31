let turns = 100;
let thickness = 10;

let phase = "wait";
let dotRadius = 14;

let theta;
let thetaStart;
let thetaEnd;
let k;
let cx, cy;
let stopRadius;
let prevX, prevY;

// Global setup for canvas and initial geometry parameters
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(2);
  noFill();

  cx = width / 2;
  cy = height / 2;

  background(255);
  prepareGeometry();
}

// Calculate key spiral parameters based on canvas size and configuration
function prepareGeometry() {
  stopRadius = 0.5 * sqrt(width * width + height * height) + thickness;

  thetaStart = -PI / 2;
  thetaEnd = thetaStart + TWO_PI * turns;
  k = stopRadius / (TWO_PI * turns);
}

// Main rendering loop controlling spiral animation phases and rendering
function draw() {
  if (phase === "wait") {
    background(255);
    noStroke();
    fill(255, 0, 0);
    circle(cx, cy, dotRadius * 2);
    drawBorder2D();
    noLoop();
    return;
  }

  strokeWeight(thickness);
  strokeCap(SQUARE);

  if (phase === "black") {
    stroke(0);
    for (let i = 0; i < 300 && theta < thetaEnd; i++) {
      const r = k * (theta - thetaStart);

      const targetStepPx = 2.0;
      const denom = sqrt(k * k + r * r);
      const dTheta = targetStepPx / (denom || 1);

      const x = cx + r * cos(theta);
      const y = cy + r * sin(theta);

      if (theta === thetaStart) {
        prevX = cx;
        prevY = cy;
      }
      line(prevX, prevY, x, y);

      prevX = x;
      prevY = y;
      theta += dTheta;
    }

    if (theta >= thetaEnd) {
      phase = "white";
      theta = thetaEnd;
    }
  } else if (phase === "white") {
    stroke(255);
    for (let i = 0; i < 300 && theta > thetaStart; i++) {
      const r = k * (theta - thetaStart);

      const targetStepPx = 2.0;
      const denom = sqrt(k * k + r * r);
      const dTheta = targetStepPx / (denom || 1);

      const x = cx + r * cos(theta);
      const y = cy + r * sin(theta);

      if (theta === thetaEnd) {
        if (prevX === undefined) {
          prevX = cx + (k * (thetaEnd - thetaStart)) * cos(thetaEnd);
          prevY = cy + (k * (thetaEnd - thetaStart)) * sin(thetaEnd);
        }
      }

      line(prevX, prevY, x, y);

      prevX = x;
      prevY = y;
      theta -= dTheta;
    }

    if (theta <= thetaStart) {
      phase = "wait";
    }
  }

  drawBorder2D();
}

// Handle user interaction to initiate spiral animation from waiting state
function mousePressed() {
  if (phase === "wait") {
    const d = dist(mouseX, mouseY, cx, cy);
    if (d <= dotRadius) {
      background(255);
      prepareGeometry();
      theta = thetaStart;
      prevX = cx;
      prevY = cy;
      phase = "black";
      loop();
    }
  }
}

// Adjust canvas and reset state on window resize
function windowResized() {
  const s = min(windowWidth, windowHeight);
  resizeCanvas(s, s);
  cx = width / 2;
  cy = height / 2;

  prepareGeometry();
  phase = "wait";
  background(255);
  loop();
}