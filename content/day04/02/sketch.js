let angle = 0;
let subAngle = 0;
let radius = 200;      // raggio dell'orbita del centro del cerchio invisibile
let circleSize = 80;   // diametro del cerchio invisibile

let canvas;

// punti per il centro dell'orbita (si muove sui 4 lati)
let points = [];
let segmentIndex = 0;  // segmento attuale (0-3)
let t = 0;             // interpolazione [0, 1]

// velocità
let pathSpeed = 0.01;      // velocità lungo il percorso a 4 lati
let angleSpeed = 0.03;     // velocità dell'orbita del cerchio invisibile
let subAngleSpeed = 0.12;  // velocità della pallina sul cerchio

let dotSize = 10;          // diametro della pallina
let lastX = null;
let lastY = null;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(0); // sfondo nero UNA sola volta

  updatePoints();
}

function updatePoints() {
  // centri dell'orbita in modo che la circonferenza con raggio "radius" tocchi i lati
  points = [
    { x: width / 2,      y: radius },          // lato alto
    { x: width - radius, y: height / 2 },      // lato destro
    { x: width / 2,      y: height - radius }, // lato basso
    { x: radius,         y: height / 2 }       // lato sinistro
  ];

  segmentIndex = 0;
  t = 0;
  lastX = null;
  lastY = null;
}

function draw() {
  
  drawBorder2D();

  let p0 = points[segmentIndex];
  let p1 = points[(segmentIndex + 1) % points.length];

  let centerX = lerp(p0.x, p1.x, t);
  let centerY = lerp(p0.y, p1.y, t);

  t += pathSpeed;
  if (t >= 1) {
    t -= 1;
    segmentIndex = (segmentIndex + 1) % points.length;
  }

  // --- centro del cerchio invisibile che orbita attorno al centro ---
  let circleCenterX = centerX + cos(angle) * radius;
  let circleCenterY = centerY + sin(angle) * radius;

  // --- pallina sulla circonferenza del cerchio invisibile ---
  let smallRadius = circleSize / 2;
  let px = circleCenterX + cos(subAngle) * smallRadius;
  let py = circleCenterY + sin(subAngle) * smallRadius;

  // DISEGNA LA SCIA COME LINEA CONTINUA
  if (lastX !== null && lastY !== null) {
    stroke(255);
    strokeWeight(dotSize);      // spessore uguale alla pallina
    line(lastX, lastY, px, py); // linea continua
  }

  // aggiorna ultima posizione
  lastX = px;
  lastY = py;

  // pallina che si muove (la “punta della penna”)
  noStroke();
  fill(255);
  ellipse(px, py, dotSize, dotSize);

  // aggiorna angoli
  angle += angleSpeed;
  subAngle += subAngleSpeed;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0); // pulisco tutto quando cambia dimensione
  updatePoints();
}