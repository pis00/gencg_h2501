
let turns = 100;        // lots of turns
let thickness = 10;     // line thickness (>= spacing implied by turns)

let phase = "wait";     // "wait" | "black" | "white"
let dotRadius = 14;

let theta;              // current angle
let thetaStart;         // starting angle (upward)
let thetaEnd;           // ending angle (after N turns)
let k;                  // r = k * (theta - thetaStart)
let cx, cy;             // center
let stopRadius;         // farthest corner radius
let prevX, prevY;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(2);
  noFill();

  cx = width / 2;
  cy = height / 2;

  background(255);
  prepareGeometry();    // compute k, thetaStart/End, stopRadius
}

function prepareGeometry() {
  // farthest corner radius + margin for complete coverage
  stopRadius = 0.5 * sqrt(width * width + height * height) + thickness;

  thetaStart = -PI / 2;               // straight up
  thetaEnd   = thetaStart + TWO_PI * turns;
  k          = stopRadius / (TWO_PI * turns);
}

function draw() {
  if (phase === "wait") {
    // show a clean red dot (no outline)
    background(255);
    noStroke();
    fill(255, 0, 0);
    circle(cx, cy, dotRadius * 2);
    noLoop();            // pause here until the next click
    return;
  }

  // Spiral drawing (both phases share the same render logic, just direction)
  strokeWeight(thickness);
  strokeCap(SQUARE);

  // Draw many small segments each frame for smooth/fast animation
  if (phase === "black") {
    stroke(0);
    for (let i = 0; i < 300 && theta < thetaEnd; i++) {
      const r = k * (theta - thetaStart);

      // adaptive step for ~constant pixel length
      const targetStepPx = 2.0;
      const denom = sqrt(k * k + r * r);
      const dTheta = targetStepPx / (denom || 1); // positive

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
      // switch to white spiral, starting exactly where black ended
      phase = "white";
      theta = thetaEnd;  // start stepping backward
    }
  } else if (phase === "white") {
    // draw backward (from edge toward center) in white over the black canvas
    stroke(255);
    for (let i = 0; i < 300 && theta > thetaStart; i++) {
      const r = k * (theta - thetaStart);

      const targetStepPx = 2.0;
      const denom = sqrt(k * k + r * r);
      const dTheta = targetStepPx / (denom || 1); // positive magnitude

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
      theta -= dTheta; // step backward toward center
    }

    if (theta <= thetaStart) {
      // white spiral finished at center -> show red dot again
      phase = "wait";     // <- key change (not "done")
      // next frame will draw the dot in the "wait" branch
    }
  }
}

function mousePressed() {
  // Start/restart only if clicking inside red dot while waiting
  if (phase === "wait") {
    const d = dist(mouseX, mouseY, cx, cy);
    if (d <= dotRadius) {
      // reset everything and begin black spiral
      background(255);
      prepareGeometry();
      theta = thetaStart;
      prevX = cx;
      prevY = cy;
      phase = "black";
      loop();            // resume animation
    }
  }
}

function windowResized() {
  const s = min(windowWidth, windowHeight);
  resizeCanvas(s, s);
  cx = width / 2;
  cy = height / 2;

  // Recompute geometry for new size and return to waiting state
  prepareGeometry();
  phase = "wait";
  background(255);
  loop();               // draw the red dot again after resize
}