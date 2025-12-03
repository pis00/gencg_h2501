
let video, faceapi, detections = [];
let libLoaded = false, modelIsReady = false;

let current = { face: 0, eyes: 0, nose: 0, ears: 0, hair: 0, mouth: 0 };
let skin;

// alignment controls
let EYE_X_FRAC = 0.20;    // cartoon eye x = ± w * EYE_X_FRAC
let EYE_Y_FRAC = -0.10;   // cartoon eye row y = h * EYE_Y_FRAC (negative == above center)
let SMOOTH = 0.25;
let SHOW_DEBUG = true;

let s = { cx: null, cy: null, a: 0, w: 220, h: 260 };

const options = { withLandmarks:true, withDescriptors:false, minConfidence:0.5 };

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  skin = color(255, 190, 200);
  randomizeAll();

  if (typeof ml5 === "undefined") {
    const scr = document.createElement("script");
    scr.src = "https://unpkg.com/ml5@0.12.2/dist/ml5.min.js";
    scr.onload = () => { libLoaded = true; init(); };
    document.body.appendChild(scr);
  } else { libLoaded = true; init(); }
}

function init(){
  video = createCapture({ video:{ facingMode:"user", width:width, height:height }, audio:false }, () => {
    video.size(width, height); video.hide();
    faceapi = ml5.faceApi(video, options, () => { modelIsReady = true; faceapi.detect(gotResults); });
  });
}

function gotResults(err, result){
  if (err){ console.error(err); setTimeout(()=>faceapi.detect(gotResults), 120); return; }
  detections = result || [];
  faceapi.detect(gotResults);
}

function draw(){
  background(16);

  if (video && video.elt && video.elt.readyState >= 2) {
    push(); translate(width,0); scale(-1,1); image(video,0,0,width,height); pop();
  } else { drawStatus("Starting camera…"); return; }

  if (!libLoaded || !modelIsReady) { drawStatus("Loading ml5 / model…"); return; }

  if (detections.length === 0) {
    drawStatus("No face detected — click to randomize");
    drawCartoonFace(s.cx ?? width/2, s.cy ?? height/2, s.w, s.h, s.a);
    if (SHOW_DEBUG) drawHUD(0, 0, s.w, s.h);
    return;
  }

  const d = detections[0];

  // landmarks (source coords): eyes
  const le = avg(d.parts.leftEye);
  const re = avg(d.parts.rightEye);
  // chin: lowest jaw point
  const chinRaw = lowestOnJaw(d);

  // mirror to drawing coords
  const L = { x: width - le.x, y: le.y };
  const R = { x: width - re.x, y: re.y };
  const chin = chinRaw ? { x: width - chinRaw.x, y: chinRaw.y } : null;

  // --- 1) angle from eye line
  let angle = Math.atan2(R.y - L.y, R.x - L.x);

  // --- 2) resolve 180° ambiguity using chin
  // local +y (down) axis in world space for angle θ is: yAxis = (-sinθ, +cosθ)
  if (chin) {
    const ex = (L.x + R.x) * 0.5, ey = (L.y + R.y) * 0.5;
    const vEyeToChin = { x: chin.x - ex, y: chin.y - ey };
    const yAxis = { x: -Math.sin(angle), y: Math.cos(angle) };
    const dot = vEyeToChin.x * yAxis.x + vEyeToChin.y * yAxis.y;
    if (dot < 0) angle += Math.PI; // flip so local "down" points toward chin
  }

  // --- 3) width so cartoon eye spacing matches your eyes
  const eyeDist = dist(L.x, L.y, R.x, R.y);
  const w = constrain(eyeDist / (2 * max(0.05, EYE_X_FRAC)), 120, width * 0.95);

  // --- 4) height as a simple aspect of width (tweak if needed)
  const h = w * 1.25;

  // --- 5) center so cartoon eye row maps to real eye row
  const ex = (L.x + R.x) * 0.5, ey = (L.y + R.y) * 0.5;
  const yEyeLocal = h * EYE_Y_FRAC;     // negative means above center in local coords
  const yAxis = { x: -Math.sin(angle), y: Math.cos(angle) };
  const cx = ex - yAxis.x * yEyeLocal;  // subtract because positive local y is down
  const cy = ey - yAxis.y * yEyeLocal;

  // smooth
  s.cx = lerp(s.cx ?? cx, cx, SMOOTH);
  s.cy = lerp(s.cy ?? cy, cy, SMOOTH);
  s.a  = lerpAngle(s.a, angle, SMOOTH);
  s.w  = lerp(s.w, w, SMOOTH);
  s.h  = lerp(s.h, h, SMOOTH);

  // draw overlay
  drawCartoonFace(s.cx, s.cy, s.w, s.h, s.a);

  // debug
  if (SHOW_DEBUG) {
    stroke(0,200,255); strokeWeight(2); line(L.x, L.y, R.x, R.y);
    drawDot(L.x, L.y, color(0,200,255));
    drawDot(R.x, R.y, color(0,200,255));
    if (chin) drawDot(chin.x, chin.y, color(255,120,0));
    // draw cartoon eye anchors in its rotated frame
    push(); translate(s.cx, s.cy); rotate(s.a);
    const dx = s.w * EYE_X_FRAC, yE = s.h * EYE_Y_FRAC;
    noFill(); stroke(255,80,80); rectMode(CENTER); rect(0,0, s.w, s.h, 12);
    noStroke(); fill(255,0,0); circle(-dx, yE, 8); circle(dx, yE, 8);
    pop();
    drawHUD(eyeDist, degrees(angle), w, h);
  }
}

// ---------------- utilities ----------------
function avg(part){ let sx=0, sy=0; for (const p of part){ sx+=p._x??p.x; sy+=p._y??p.y; } const n=max(1,part.length); return {x:sx/n,y:sy/n}; }
function lowestOnJaw(d){
  if (!(d.parts && d.parts.jawOutline && d.parts.jawOutline.length)) return null;
  let maxY = -1e9, cx = 0;
  for (const p of d.parts.jawOutline){ const x=p._x??p.x, y=p._y??p.y; if (y>maxY){ maxY=y; cx=x; } }
  return { x: cx, y: maxY };
}
function lerpAngle(a,b,t){ let d=((b-a+Math.PI)%(Math.PI*2))-Math.PI; return a + d*t; }
function drawDot(x,y,c){ noStroke(); fill(c); circle(x,y,8); }
function drawStatus(msg){ noStroke(); fill(255); textAlign(CENTER,CENTER); textSize(14); text(msg, width/2, height-20); }
function drawHUD(eyeDist, angleDeg, w, h){
  const lines = [
    `angle: ${angleDeg.toFixed(1)}°`,
    `eyeDist: ${eyeDist.toFixed(1)} px`,
    `fit: W=${w.toFixed(1)}  H=${h.toFixed(1)}`,
    `EYE_X_FRAC=${EYE_X_FRAC.toFixed(3)}  EYE_Y_FRAC=${EYE_Y_FRAC.toFixed(3)}  SMOOTH=${SMOOTH.toFixed(2)}`,
    `D toggle debug, 1/2 X, 3/4 Y, 7/8 smooth`
  ];
  const wBox = 360, hBox = 20*(lines.length+1);
  push(); noStroke(); fill(0,0,0,170); rect(8,8,wBox,hBox,8);
  fill(255); textAlign(LEFT,TOP); textSize(12);
  text("DEBUG", 16, 12); let y=32; for (const s of lines){ text(s, 16, y); y+=16; } pop();
}

// ---------------- input ----------------
function keyPressed(){
  const fine = keyIsDown(SHIFT);
  const stepX = fine ? 0.005 : 0.01;
  const stepY = fine ? 0.005 : 0.01;
  const stepS = fine ? 0.02  : 0.05;

  if (key === '1') EYE_X_FRAC = max(0.10, EYE_X_FRAC - stepX);
  if (key === '2') EYE_X_FRAC = min(0.35, EYE_X_FRAC + stepX);

  if (key === '3') EYE_Y_FRAC = max(-0.30, EYE_Y_FRAC - stepY);
  if (key === '4') EYE_Y_FRAC = min(0.10,  EYE_Y_FRAC + stepY);

  if (key === '7') SMOOTH = max(0.00, SMOOTH - stepS);
  if (key === '8') SMOOTH = min(0.80, SMOOTH + stepS);

  if (key === 'D' || key === 'd') SHOW_DEBUG = !SHOW_DEBUG;
}
function mousePressed(){ randomizeAll(); }
function touchStarted(){ randomizeAll(); return false; }

// ---------------- cartoon renderer ----------------
function randomizeAll(){ current.face=floor(random(5)); current.eyes=floor(random(5)); current.nose=floor(random(5)); current.ears=floor(random(5)); current.hair=floor(random(5)); current.mouth=floor(random(5)); }

function getFaceMetrics(type, w, h) {
  let templeX=w*0.46, fringeY=-h*0.16, capY=-h*0.27, capW=w*1.28, capH=h*0.70;
  switch (type) {
    case 0: break;
    case 1: templeX=w*0.50; fringeY=-h*0.155; capY=-h*0.26; capW=w*1.32; capH=h*0.68; break;
    case 2: templeX=w*0.44; fringeY=-h*0.165; capY=-h*0.28; capW=w*1.34; capH=h*0.68; break;
    case 3: templeX=w*0.42; fringeY=-h*0.17;  capY=-h*0.29; capW=w*1.30; capH=h*0.72; break;
    case 4: templeX=w*0.41; fringeY=-h*0.17;  capY=-h*0.29; capW=w*1.26; capH=h*0.68; break;
  }
  return { templeX, fringeY, capY, capW, capH };
}

function drawCartoonFace(cx, cy, w, h, angRad=0) {
  push(); translate(cx, cy); rotate(angRad);
  const fm = getFaceMetrics(current.face, w, h);
  drawFaceShape(current.face, w, h);
  drawHair(current.hair, w, h, fm);
  drawEars(current.ears, w, h);
  drawEyes(current.eyes, w, h);
  drawNose(current.nose, w, h);
  drawMouth(current.mouth, w, h);
  pop();
}

function drawFaceShape(type, w, h) {
  noStroke(); fill(skin);
  switch (type) {
    case 0: ellipse(0, 0, w, h); break;
    case 1: ellipse(0, 0, w*0.95, h*0.95); break;
    case 2: rectMode(CENTER); rect(0, 0, w*0.90, h*0.95, w*0.12); break;
    case 3:
      push(); translate(0, -h*0.05);
      beginShape();
      for (let a=PI,i=0;i<=40;i++,a+=PI/40){ const rx=(w*0.52)*cos(a), ry=(h*0.35)*sin(a)-h*0.05; vertex(rx, ry); }
      bezierVertex(w*0.35, h*0.15, w*0.20, h*0.45, 0, h*0.48);
      bezierVertex(-w*0.20, h*0.45, -w*0.35, h*0.15, -w*0.52, 0);
      endShape(CLOSE); pop(); break;
    case 4: rectMode(CENTER); rect(0, 0, w*0.80, h, w*0.20); break;
  }
}

function drawEars(type, w, h) {
  noStroke(); fill(skin); const earCX = w*0.55;
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
    const t = i / samples, x = lerp(LT, RT, t);
    let y = fm.fringeY, amp = h * 0.018;
    switch (type) {
      case 0: break;
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
  const y = h * EYE_Y_FRAC;
  const dx = w * EYE_X_FRAC;
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
  const y = h*0.20; stroke(120,0,40); strokeWeight(4); noFill();
  switch (type) {
    case 0: arc(0,y,80,40,0,PI); break;
    case 1: line(-40,y,40,y); break;
    case 2: arc(0,y+20,80,40,PI,0); break;
    case 3: noStroke(); fill(120,0,40); ellipse(0,y+4,32,40); fill(255,180,180); ellipse(0,y+16,30,14); break;
    case 4: noFill(); stroke(120,0,40); arc(0,y,90,50,0,PI); stroke(255); strokeWeight(2); line(-34,y,34,y); for(let i=-4;i<=4;i++){const x=map(i,-4,4,-30,30); line(x,y,x,y+14);} break;
  }
}2221111