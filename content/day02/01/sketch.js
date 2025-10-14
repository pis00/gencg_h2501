const SEED = 99173;
const CANVAS_W = 900;
const CANVAS_H = 800;

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  pixelDensity(2);
  noCursor();
}

function draw() {
  background(255);

  // Smooth transition factor
  const t = constrain(mouseY / height, 0, 1);
  const ease = t * t * (3 - 2 * t); // smoothstep

  // Density via mouseX
  const cols = max(2, round(map(constrain(mouseX, 0, width), 0, width, 6, 40)));
  const cellW = width / cols;
  const rows = max(2, round(height / cellW));
  const cellH = height / rows;
  const cellSize = min(cellW, cellH);

  // Shape size grows as alignment increases
  const s = lerp(cellSize * 0.6, cellSize * 0.98, ease);

  // Stable "messy" layout
  noiseSeed(SEED);
  randomSeed(SEED);

  noStroke();
  fill(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Perfect grid position
      const gx = (i + 0.5) * cellW;
      const gy = (j + 0.5) * cellH;

      // Stable messy offset
      const offAmp = cellSize * 1.1;
      const ox = (noise(i * 0.31, j * 0.29) - 0.5) * 2 * offAmp;
      const oy = (noise(i * 0.33 + 80, j * 0.27 + 80) - 0.5) * 2 * offAmp;

      // Start and end positions
      const sx = gx + ox;
      const sy = gy + oy;
      const x = lerp(sx, gx, ease);
      const y = lerp(sy, gy, ease);

      // Rotation smoothing
      const baseRot = (noise(i * 0.37 + 200, j * 0.41 + 200) - 0.5) * PI;
      const rot = lerp(baseRot, 0, ease);

      // Orientation morphing (random → checkerboard)
      const startIsA = noise(i * 0.5 + 500, j * 0.5 + 500) > 0.5;
      const targetIsA = ((i + j) % 2) === 1;

      const triA = [
        { x: -s / 2, y: -s / 2 },
        { x:  s / 2, y: -s / 2 },
        { x: -s / 2, y:  s / 2 },
      ];
      const triB = [
        { x:  s / 2, y:  s / 2 },
        { x:  s / 2, y: -s / 2 },
        { x: -s / 2, y:  s / 2 },
      ];

      const S = startIsA ? triA : triB;
      const T = targetIsA ? triA : triB;

      // Morph triangle vertices
      const v0 = { x: lerp(S[0].x, T[0].x, ease), y: lerp(S[0].y, T[0].y, ease) };
      const v1 = { x: lerp(S[1].x, T[1].x, ease), y: lerp(S[1].y, T[1].y, ease) };
      const v2 = { x: lerp(S[2].x, T[2].x, ease), y: lerp(S[2].y, T[2].y, ease) };

      push();
      translate(x, y);
      rotate(rot);
      triangle(v0.x, v0.y, v1.x, v1.y, v2.x, v2.y);
      pop();
    }
  }

  // Minimal black ring cursor
  push();
  noFill();
  stroke(0);
  strokeWeight(2);
  circle(mouseX, mouseY, 14);
  pop();
}