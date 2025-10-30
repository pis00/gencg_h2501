let stars = [];
let orbitR = {};
let fontSize;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(60);
  noCursor();
  strokeCap(ROUND);
  textAlign(CENTER, CENTER);

  const radius = min(width, height) * 0.40;
  orbitR.seconds = radius * 1.00;
  orbitR.minutes = radius * 0.70;
  orbitR.hours   = radius * 0.50;
  orbitR.face    = radius * 1.00;
  fontSize = radius * 0.12;

  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(-width, width),
      y: random(-height, height),
      a: random(180, 255),
      s: random(0.5, 2.0)
    });
  }
}

function draw() {
  translate(width / 2, height / 2);
  
  const t = getContinuousTime();
  const secondAngle = map(t.secondExact, 0, 60, 0, 360) - 90;  // continuous
  const minuteAngle = map(t.minuteExact, 0, 60, 0, 360) - 90;  // continuous
  const hourAngle   = map(t.hour12Exact, 0, 12, 0, 360) - 90;  // continuous

  // Background & ambiance
  drawSkyGradient(t.hour24 + t.minuteExact / 60);
  drawVignette();
  drawStars(t);
  drawHorizonOrb(t);
  drawGlassDial(orbitR.face);

  // Ticks & numerals
  drawTicksAndNumerals();

  // Orbits
  drawOrbit(orbitR.hours,   3, color(255, 255, 255, 40));
  drawOrbit(orbitR.minutes, 2, color(255, 255, 255, 35));
  drawOrbit(orbitR.seconds, 1, color(255, 255, 255, 30));

  // Hands as glowing comets (all move linearly)
  drawComet(secondAngle, orbitR.seconds, 9,  color(255, 10, 100), 24, 6);
  drawComet(minuteAngle, orbitR.minutes, 10, color(100, 255, 10), 18, 5);
  drawComet(hourAngle,   orbitR.hours,   12, color(10, 100, 255), 12, 4);

  drawCenterHub();
}

// ===== Time helpers (continuous from Date) =====
function getContinuousTime() {
  const now = new Date();
  const ms  = now.getMilliseconds() / 1000;              // 0..1 sec fraction
  const s   = now.getSeconds() + ms;                     // 0..60 smoothly
  const m   = now.getMinutes() + s / 60;                 // 0..60 smoothly
  const h24 = now.getHours();
  const h12 = (h24 % 12) + m / 60;                       // 0..12 smoothly
  return {
    secondExact: s,
    minuteExact: m,
    hour12Exact: h12,
    hour24: h24
  };
}

// ===== Visual helpers =====
function drawSkyGradient(hourFloat) {
  const nightWeight = constrain(
    sin(map(hourFloat, 18, 30, 0, 180, true)) ** 2, 0, 1
  );
  const dayInner = color(210, 235, 255);
  const dayOuter = color(140, 190, 255);
  const nightInner = color(20, 24, 38);
  const nightOuter = color(5, 8, 20);
  const inner = lerpColor(dayInner, nightInner, nightWeight);
  const outer = lerpColor(dayOuter, nightOuter, nightWeight);

  noStroke();
  const maxR = sqrt(sq(width) + sq(height)) * 0.6;
  for (let r = maxR; r > 0; r -= 6) {
    const t = r / maxR;
    const c = lerpColor(inner, outer, 1 - t);
    fill(red(c), green(c), blue(c), 255);
    ellipse(0, 0, r * 2, r * 2);
  }
}

function drawStars(now) {
  const hourFloat = now.hour24 + now.minuteExact / 60;
  const nightWeight = constrain(
    sin(map(hourFloat, 18, 30, 0, 180, true)) ** 2, 0, 1
  );
  push();
  noStroke();
  for (const st of stars) {
    const twinkle = 0.6 + 0.4 * sin((frameCount * 0.6) + st.x * 0.01 + st.y * 0.01);
    fill(255, st.a * nightWeight * twinkle);
    ellipse(st.x * 0.4, st.y * 0.4, st.s, st.s);
  }
  pop();
}

function drawHorizonOrb(now) {
  const tDay = (now.hour24 + now.minuteExact / 60) / 24.0;
  const angle = map(tDay, 0, 1, -90, 270);
  const r = orbitR.face * 1.05;
  const dayAmt = constrain(map(now.hour24, 6, 18, 0, 1), 0, 1);
  const sunC = color(255, 210, 100, 220 * dayAmt);
  const moonC = color(200, 220, 255, 200 * (1 - dayAmt));

  push();
  noStroke();
  for (let i = 10; i >= 1; i--) {
    const rr = i * 4;
    const a = 8 * i;
    fill(255, 220, 160, a * dayAmt);
    ellipse(r * cos(angle), r * sin(angle), rr, rr);
    fill(200, 220, 255, a * (1 - dayAmt));
    ellipse(r * cos(angle + 180), r * sin(angle + 180), rr, rr);
  }
  fill(sunC);  ellipse(r * cos(angle),        r * sin(angle),        12, 12);
  fill(moonC); ellipse(r * cos(angle + 180),  r * sin(angle + 180),  10, 10);
  pop();
}

function drawGlassDial(d) {
  push();
  for (let i = 8; i >= 1; i--) {
    stroke(255, 255, 255, 10 + i * 4);
    strokeWeight(10 - i);
    noFill();
    ellipse(0, 0, d * 2 + i * 8, d * 2 + i * 8);
  }
  noStroke();
  fill(255, 255, 255, 22);
  ellipse(0, 0, d * 2, d * 2);
  const g = drawingContext.createRadialGradient(0, 0, d * 0.1, -d * 0.25, -d * 0.25, d * 1.2);
  g.addColorStop(0, 'rgba(255,255,255,0.15)');
  g.addColorStop(1, 'rgba(255,255,255,0.00)');
  drawingContext.fillStyle = g;
  ellipse(0, 0, d * 2, d * 2);
  pop();
}

function drawTicksAndNumerals() {
  push();
  stroke(255, 230);
  fill(255);
  const outer = orbitR.seconds;
  const innerMinor = outer - 10;
  const innerMajor = outer - 18;

  for (let i = 0; i < 60; i++) {
    const a = -90 + i * 6;
    const isMajor = i % 5 === 0;
    const r1 = isMajor ? innerMajor : innerMinor;
    const r2 = outer;
    strokeWeight(isMajor ? 2.5 : 1.2);
    line(r1 * cos(a), r1 * sin(a), r2 * cos(a), r2 * sin(a));
  }

  textSize(fontSize * 0.7);
  noStroke();
  const numR = orbitR.seconds - 36;
  const numerals = ['12','1','2','3','4','5','6','7','8','9','10','11'];
  for (let i = 0; i < 12; i++) {
    const a = -90 + i * 30;
    push();
    translate(numR * cos(a), numR * sin(a));
    rotate(a + 90);
    fill(255, 235);
    text(numerals[i], 0, 0);
    pop();
  }
  pop();
}

function drawOrbit(r, w, col) {
  push();
  noFill();
  stroke(col);
  strokeWeight(w);
  ellipse(0, 0, r * 2, r * 2);
  pop();
}

function drawComet(angle, radius, headSize, headColor, tailLen, tailStep) {
  push();
  noStroke();
  for (let i = tailLen; i >= 1; i--) {
    const tAng = angle - i * tailStep;
    const p = polar(radius, tAng);
    const alpha = map(i, 1, tailLen, 200, 0);
    const sz = map(i, 1, tailLen, headSize * 0.7, 2);
    fill(red(headColor), green(headColor), blue(headColor), alpha);
    ellipse(p.x, p.y, sz, sz);
  }
  pop();

  push();
  noStroke();
  const headP = polar(radius, angle);
  for (let g = 10; g >= 1; g--) {
    fill(red(headColor), green(headColor), blue(headColor), 12 + g * 4);
    ellipse(headP.x, headP.y, headSize + g * 3, headSize + g * 3);
  }
  fill(255);
  ellipse(headP.x, headP.y, headSize * 0.6, headSize * 0.6);
  fill(headColor);
  ellipse(headP.x, headP.y, headSize * 0.4, headSize * 0.4);
  pop();
}

function drawCenterHub() {
  push();
  noStroke();
  for (let i = 8; i >= 1; i--) {
    fill(255, 255, 255, 12 + i * 8);
    ellipse(0, 0, 16 + i * 4, 16 + i * 4);
  }
  fill(255);
  ellipse(0, 0, 8, 8);
  pop();
}

function drawVignette() {
  push();
  noStroke();
  const g = drawingContext.createRadialGradient(0, 0, 0, 0, 0, width * 0.8);
  g.addColorStop(0.7, 'rgba(0,0,0,0)');
  g.addColorStop(1.0, 'rgba(0,0,0,0.25)');
  drawingContext.fillStyle = g;
  rectMode(CENTER);
  rect(0, 0, width * 2, height * 2);
  pop();
}

function polar(r, a) {
  return { x: r * cos(a), y: r * sin(a) };
}