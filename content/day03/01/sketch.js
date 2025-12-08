let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);

  translate(width / 2, height / 2);
  rotate(-90);

  let radius = min(width, height) * 0.45;

  let hr = hour();
  let mn = minute();
  let sc = second();

  let secondIndex = sc;
  let minuteIndex = mn;
  let hourIndex = floor((hr % 12) * 5 + mn / 12);

  let circleRadius = radius;
  let bigDotSize = radius * 0.14;
  let smallDotSize = radius * 0.045;

  noStroke();

  for (let i = 0; i < 60; i++) {
    let angle = map(i, 0, 60, 0, 360);
    let x = cos(angle) * circleRadius;
    let y = sin(angle) * circleRadius;

    let r = 0;
    let g = 0;
    let b = 0;

    if (i === secondIndex) {
      r = 255; g = 0; b = 0;
    }
    if (i === minuteIndex) {
      r = 0; g = 200; b = 0;
    }
    if (i === hourIndex) {
      r = 0; g = 120; b = 255;
    }

    fill(r, g, b);

    if (i % 5 === 0) {
      ellipse(x, y, bigDotSize, bigDotSize);
    } else {
      ellipse(x, y, smallDotSize, smallDotSize);
    }
  }

  drawBorder2D();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}