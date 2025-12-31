let current = { face: 0, eyes: 0, nose: 0, ears: 0, hair: 0, mouth: 0 };
let skin;

// Setup and initialization
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  skin = color(255, 190, 200);
  noLoop();
  randomizeAll();
}

// Main draw structure and rendering order
function draw() {
  background(255);

  push();
  translate(width / 2, height / 2);

  const faceW = 200;
  const faceH = 250;

  const fm = getFaceMetrics(current.face, faceW, faceH);

  drawFaceShape(current.face, faceW, faceH);
  drawHair(current.hair, faceW, faceH, fm);
  drawEars(current.ears, faceW, faceH);
  drawEyes(current.eyes, faceW, faceH);
  drawNose(current.nose, faceW, faceH);
  drawMouth(current.mouth, faceW, faceH);

  pop();

  drawBorder2D();
}

// Interaction handling
function mousePressed() {
  randomizeAll();
  redraw();
}

// Randomization logic
function randomizeAll() {
  current.face  = floor(random(5));
  current.eyes  = floor(random(5));
  current.nose  = floor(random(5));
  current.ears  = floor(random(5));
  current.hair  = floor(random(5));
  current.mouth = floor(random(5));
}

// Face metric computation
function getFaceMetrics(type, w, h) {
  let templeX = w * 0.46;
  let fringeY = -h * 0.16;
  let capY    = -h * 0.27;
  let capW    = w * 1.28;
  let capH    = h * 0.70;
  switch (type) {
    case 0: break;
    case 1: templeX = w*0.50; fringeY = -h*0.155; capY = -h*0.26; capW = w*1.32; capH = h*0.68; break;
    case 2: templeX = w*0.44; fringeY = -h*0.165; capY = -h*0.28; capW = w*1.34; capH = h*0.68; break;
    case 3: templeX = w*0.42; fringeY = -h*0.17;  capY = -h*0.29; capW = w*1.30; capH = h*0.72; break;
    case 4: templeX = w*0.41; fringeY = -h*0.17;  capY = -h*0.29; capW = w*1.26; capH = h*0.68; break;
  }
  return { templeX, fringeY, capY, capW, capH };
}

// Facial feature groups

function drawFaceShape(type, w, h) {
  noStroke();
  fill(skin);
  switch (type) {
    case 0: ellipse(0, 0, w, h); break;
    case 1: ellipse(0, 0, w*0.95, h*0.95); break;
    case 2: rectMode(CENTER); rect(0, 0, w*0.90, h*0.95, w*0.12); break;
    case 3:
      push(); translate(0, -h*0.05);
      beginShape();
      for (let a=PI, i=0;i<=40;i++,a+=PI/40){
        const rx=(w*0.52)*cos(a), ry=(h*0.35)*sin(a)-h*0.05;
        vertex(rx, ry);
      }
      bezierVertex(w*0.35, h*0.15, w*0.20, h*0.45, 0, h*0.48);
      bezierVertex(-w*0.20, h*0.45, -w*0.35, h*0.15, -w*0.52, 0);
      endShape(CLOSE);
      pop();
      break;
    case 4: rectMode(CENTER); rect(0, 0, w*0.80, h, w*0.20); break;
  }
}

function drawEars(type, w, h) {
  noStroke(); fill(skin);
  const earCX = w*0.55;
  switch (type) {
    case 0: ellipse(-earCX, 0, w*0.18, h*0.30); ellipse( earCX, 0, w*0.18, h*0.30); break;
    case 1: ellipse(-earCX, -h*0.02, w*0.14, w*0.14); ellipse( earCX, -h*0.02, w*0.14, w*0.14); break;
    case 2: ellipse(-earCX, 0, w*0.12, h*0.36); ellipse( earCX, 0, w*0.12, h*0.36); break;
    case 3: rectMode(CENTER); rect(-earCX, 0, w*0.16, h*0.26, w*0.04); rect( earCX, 0, w*0.16, h*0.26, w*0.04); break;
    case 4: ellipse(-earCX, h*0.08, w*0.22, h*0.22); ellipse( earCX, h*0.08, w*0.22, h*0.22); break;
  }
  stroke(210); strokeWeight(2); noFill();
  const dW=(type===3)?w*0.10:w*0.12, dH=(type===3)?h*0.18:h*0.20;
  arc(-earCX, 0, dW, dH, -HALF_PI, HALF_PI);
  arc( earCX, 0, dW, dH,  HALF_PI, -HALF_PI);
}

function drawHair(type, w, h, fm) {
  fill(0); noStroke();
  const LT = -fm.templeX, RT = fm.templeX;

  beginShape();

  const samples = 18;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = lerp(LT, RT, t);
    let y = fm.fringeY;
    const amp = h * 0.018;
    switch (type) {
      case 0: y += 0; break;
      case 1: y += amp * (-0.6 + 1.2 * abs(t - 0.5)); break;
      case 2: y += lerp(-amp*0.4, amp*0.4, t); break;
      case 3: y += amp * sin(t * TWO_PI); break;
      case 4: y += -amp * 0.9 * exp(-20 * (t-0.5) * (t-0.5)); break;
    }
    vertex(x, y);
  }

  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const a = (PI * i) / steps;
    const x = (fm.capW * 0.5) * cos(a);
    const y = fm.capY - (fm.capH * 0.5) * sin(a);
    vertex(x, y);
  }

  endShape(CLOSE);
}

function drawEyes(type, w, h) {
  const y = -h*0.10, dx = w*0.20;
  noStroke();
  switch (type) {
    case 0: fill(255); ellipse(-dx,y,40,25); ellipse(dx,y,40,25); fill(0); ellipse(-dx,y,14,14); ellipse(dx,y,14,14); break;
    case 1: fill(255); drawAlmondEye(-dx,y,46,22); drawAlmondEye(dx,y,46,22); fill(0); ellipse(-dx,y,12,12); ellipse(dx,y,12,12); break;
    case 2: fill(255); arc(-dx,y,42,26,PI,0,CHORD); arc(dx,y,42,26,PI,0,CHORD); fill(0); ellipse(-dx,y+2,10,10); ellipse(dx,y+2,10,10); break;
    case 3: fill(255); rectMode(CENTER); rect(-dx,y,48,20,8); rect(dx,y,48,20,8); fill(0); ellipse(-dx,y,12,12); ellipse(dx,y,12,12); break;
    case 4: fill(255); ellipse(-dx,y,44,24); ellipse(dx,y,44,24); fill(0); ellipse(-dx,y+1,10,10); ellipse(dx,y+1,10,10); stroke(0); strokeWeight(2); line(-dx-22,y-8,-dx+22,y-8); line(dx-22,y-8,dx+22,y-8); noStroke(); break;
  }
}
function drawAlmondEye(cx, cy, ew, eh) {
  beginShape();
  vertex(cx - ew*0.5, cy);
  bezierVertex(cx - ew*0.25, cy - eh*0.8, cx + ew*0.25, cy - eh*0.8, cx + ew*0.5, cy);
  bezierVertex(cx + ew*0.25, cy + eh*0.8, cx - ew*0.25, cy + eh*0.8, cx - ew*0.5, cy);
  endShape(CLOSE);
}

function drawNose(type, w, h) {
  stroke(120); strokeWeight(2); noFill();
  switch (type) {
    case 0: line(0,0,0,h*0.12); break;
    case 1: beginShape(); vertex(0,0); quadraticVertex(-w*0.03,h*0.08,0,h*0.14); endShape(); break;
    case 2: line(0,0,0,h*0.10); arc(0,h*0.12,w*0.10,h*0.05,0,PI); point(-w*0.02,h*0.12); point(w*0.02,h*0.12); break;
    case 3: beginShape(); vertex(0,-h*0.02); vertex(0,h*0.08); vertex(w*0.03,h*0.12); endShape(); break;
    case 4: beginShape(); vertex(0,-h*0.02); quadraticVertex(w*0.02,h*0.05,-w*0.01,h*0.10); quadraticVertex(-w*0.02,h*0.12,0,h*0.14); endShape(); break;
  }
}

function drawMouth(type, w, h) {
  const y = h*0.20;
  stroke(120,0,40); strokeWeight(4); noFill();
  switch (type) {
    case 0: arc(0,y,80,40,0,PI); break;
    case 1: line(-40,y,40,y); break;
    case 2: arc(0,y+20,80,40,PI,0); break;
    case 3: noStroke(); fill(120,0,40); ellipse(0,y+4,32,40); fill(255,180,180); ellipse(0,y+16,30,14); break;
    case 4: noFill(); stroke(120,0,40); arc(0,y,90,50,0,PI); stroke(255); strokeWeight(2); line(-34,y,34,y); for(let i=-4;i<=4;i++){const x=map(i,-4,4,-30,30); line(x,y,x,y+14);} break;
  }
}