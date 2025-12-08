let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(240);

  translate(width / 2, height / 2);
  rotate(-90); // 0° verso l'alto

  // cerchio un po' più grande per avere i pallini più lontani tra loro (dal centro)
  let radius = min(width, height) * 0.45;

  // ==== TEMPO ====
  let hr = hour();
  let mn = minute();
  let sc = second();

  // 0–59
  let secondIndex = sc;
  let minuteIndex = mn;

  // ore mappate su 0–59 (5 step per ogni ora)
  let hourIndex = floor((hr % 12) * 5 + mn / 12);

  // === RAGGI E DIMENSIONI ===
  let circleRadius = radius;        // stesso raggio per grandi e piccoli
  let bigDotSize = radius * 0.14;
  let smallDotSize = radius * 0.045;

  noStroke(); // niente bordi per nessun pallino

  // === 60 PALLINI (12 grandi + 48 piccoli) ===
  for (let i = 0; i < 60; i++) {
    let angle = map(i, 0, 60, 0, 360);

    let x = cos(angle) * circleRadius;
    let y = sin(angle) * circleRadius;

    // colore di base = nero
    let r = 0;
    let g = 0;
    let b = 0;

    // priorità: secondi < minuti < ore
    if (i === secondIndex) {
      r = 255; g = 0; b = 0;      // rosso
    }
    if (i === minuteIndex) {
      r = 0; g = 200; b = 0;      // verde
    }
    if (i === hourIndex) {
      r = 0; g = 120; b = 255;    // blu
    }

    fill(r, g, b);

    // pallini grandi ogni 5 step, altrimenti piccoli
    if (i % 5 === 0) {
      ellipse(x, y, bigDotSize, bigDotSize);
    } else {
      ellipse(x, y, smallDotSize, smallDotSize);
    }
  }

  // (opzionale) punto centrale di riferimento
  fill(0);
  ellipse(0, 0, radius * 0.05, radius * 0.05);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}