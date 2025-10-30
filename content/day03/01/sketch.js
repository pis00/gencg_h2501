
const GRID_COLS = 40;
const GRID_ROWS = 24;
const MARGIN_PX = 20;
const FLIP_DURATION = 320;
const RANDOM_STAGGER = 120;

const RIPPLE_SPEED = 12;        // cells per second
const RIPPLE_BAND  = 1.2;       // ring thickness (± around radius)
const RIPPLE_MAX_AGE_MS = 6000; // cleanup cutoff

const C_WHITE = 0;
const C_BLACK = 1;
const C_RED   = 2;

let cellW, cellH;
let currentMask; // committed, what the cell "is" right now
let targetMask;  // baseline (from time glyphs)
let flipInfo;    // per-cell ongoing flip {from,to,startMs,duration} or null
let lastRenderKey = "";

let ripples = [];

const FONT5x7 = {
  '0': ["01110","10001","10011","10101","11001","10001","01110"],
  '1': ["00100","01100","00100","00100","00100","00100","01110"],
  '2': ["01110","10001","00001","00010","00100","01000","11111"],
  '3': ["11110","00001","00001","01110","00001","00001","11110"],
  '4': ["00010","00110","01010","10010","11111","00010","00010"],
  '5': ["11111","10000","11110","00001","00001","10001","01110"],
  '6': ["00110","01000","10000","11110","10001","10001","01110"],
  '7': ["11111","00001","00010","00100","01000","01000","01000"],
  '8': ["01110","10001","10001","01110","10001","10001","01110"],
  '9': ["01110","10001","10001","01111","00001","00010","01100"],
  ':': ["0","1","0","0","1","0","0"]
};

function make2D(rows, cols, val = C_WHITE) {
  const a = new Array(rows);
  for (let r = 0; r < rows; r++) a[r] = new Array(cols).fill(val);
  return a;
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  calculateCellSize();

  currentMask = make2D(GRID_ROWS, GRID_COLS, C_WHITE);
  targetMask  = make2D(GRID_ROWS, GRID_COLS, C_WHITE);
  flipInfo    = new Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(null));

  noLoop();
  setInterval(tick, 33); 
  updateTimeMask(); 
}

function calculateCellSize() {
  const usableW = width - MARGIN_PX * 2;
  const usableH = height - MARGIN_PX * 2;
  cellW = usableW / GRID_COLS;
  cellH = usableH / GRID_ROWS;
}

function tick() {
  updateTimeMask();
  drawGrid();
}

function drawGrid() {
  background(240);
  push();
  translate(MARGIN_PX, MARGIN_PX);
  stroke(0);
  strokeWeight(1);

  const nowMs = millis();
  cleanupRipples(nowMs);

  // hover cell (grid coords)
  const gx = (mouseX - MARGIN_PX) / cellW;
  const gy = (mouseY - MARGIN_PX) / cellH;
  const hoveredC = floor(gx);
  const hoveredR = floor(gy);
  const hoverValid =
    hoveredC >= 0 && hoveredC < GRID_COLS &&
    hoveredR >= 0 && hoveredR < GRID_ROWS;

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const x = c * cellW;
      const y = r * cellH;

      const baseCode = targetMask[r][c];

      const rippleCode = rippleDesiredCode(baseCode, r, c, nowMs);

      const desired = (rippleCode !== null) ? rippleCode : baseCode;

      if (!flipInfo[r][c] && currentMask[r][c] !== desired) {
        flipInfo[r][c] = {
          from: currentMask[r][c],
          to: desired,
          startMs: nowMs,
          duration: FLIP_DURATION
        };
      }

      const info = flipInfo[r][c];
      if (info) {
        const t = constrain((nowMs - info.startMs) / info.duration, 0, 1);
        const squash = abs(cos(PI * t));
        const midwayCol = (t < 0.5) ? info.from : info.to;

        push();
        translate(x + cellW / 2, y + cellH / 2);
        scale(1, squash);
        fill(colorFor(midwayCol));
        rectMode(CENTER);
        rect(0, 0, cellW, cellH);
        pop();

        noFill();
        rect(x, y, cellW, cellH);

        if (t >= 1) {
          currentMask[r][c] = info.to;
          flipInfo[r][c] = null;
        }
      } else {
        let drawCode = currentMask[r][c];

        if (hoverValid && r === hoveredR && c === hoveredC && baseCode === C_WHITE) {
          drawCode = C_RED;
        }

        fill(colorFor(drawCode));
        rect(x, y, cellW, cellH);

        noFill();
        rect(x, y, cellW, cellH);
      }
    }
  }
  pop();
}

function colorFor(code) {
  if (code === C_BLACK) return 0;                
  if (code === C_RED)   return color(220, 0, 0); 
  return 255;
}

function rippleDesiredCode(baseCode, r, c, nowMs) {
  for (let i = 0; i < ripples.length; i++) {
    const rp = ripples[i];
    const dt = (nowMs - rp.startMs) / 1000; 
    if (dt < 0) continue;
    const radius = dt * RIPPLE_SPEED;  
    const dr = dist(c, r, rp.c, rp.r); 

    if (abs(dr - radius) <= RIPPLE_BAND) {
      if (baseCode === C_WHITE) return C_BLACK;
      if (baseCode === C_BLACK) return C_WHITE;
      if (baseCode === C_RED)   return C_RED; 
    }
  }
  return null;
}

function updateTimeMask() {
  const now = new Date();
  const hh = nf(now.getHours(), 2);
  const mm = nf(now.getMinutes(), 2);
  const ss = now.getSeconds();
  const colonOn = (ss % 2 === 1);

  const renderKey = `${hh}:${mm}:${colonOn ? 1 : 0}`;
  if (renderKey === lastRenderKey) return false;
  lastRenderKey = renderKey;

  const glyphW = 5, glyphH = 7, colonW = 1;
  const chars = [hh[0], hh[1], ':', mm[0], mm[1]];

  const baseCols = glyphW * 4 + colonW + 4;
  const baseRows = glyphH;

  const maxCols = floor(GRID_COLS * 0.8);
  const maxRows = floor(GRID_ROWS * 0.6);
  const S = max(1, min(floor(maxCols / baseCols), floor(maxRows / baseRows)));

  const patternCols = baseCols * S;
  const patternRows = baseRows * S;
  const startC = floor((GRID_COLS - patternCols) / 2);
  const startR = floor((GRID_ROWS - patternRows) / 2);

  // clear to white
  for (let r = 0; r < GRID_ROWS; r++)
    for (let c = 0; c < GRID_COLS; c++)
      targetMask[r][c] = C_WHITE;

  let cursor = 0;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const glyph = FONT5x7[ch];
    const w = (ch === ':') ? colonW : glyphW;

    for (let gy = 0; gy < 7; gy++) {
      const row = glyph[gy];
      for (let gx = 0; gx < w; gx++) {
        if (row[gx] === '1') {
          const colorCode = (ch === ':' ? (colonOn ? C_RED : C_WHITE) : C_BLACK);
          for (let sy = 0; sy < S; sy++) {
            for (let sx = 0; sx < S; sx++) {
              const rr = startR + gy * S + sy;
              const cc = startC + (cursor + gx) * S + sx;
              if (rr >= 0 && rr < GRID_ROWS && cc >= 0 && cc < GRID_COLS)
                targetMask[rr][cc] = colorCode;
            }
          }
        }
      }
    }
    cursor += w + 1;
  }
  
  const nowMs = millis();
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const baseline = targetMask[r][c];
      if (!flipInfo[r][c] && currentMask[r][c] !== baseline) {
        flipInfo[r][c] = {
          from: currentMask[r][c],
          to: baseline,
          startMs: nowMs + random(RANDOM_STAGGER),
          duration: FLIP_DURATION
        };
      }
    }
  }
  return true;
}

function mousePressed() {
  const gx = (mouseX - MARGIN_PX) / cellW;
  const gy = (mouseY - MARGIN_PX) / cellH;
  const c = floor(gx);
  const r = floor(gy);
  if (c >= 0 && c < GRID_COLS && r >= 0 && r < GRID_ROWS) {
    ripples.push({ r, c, startMs: millis() });
  }
}

// Cleanup old ripples
function cleanupRipples(nowMs) {
  const maxGridRadius = sqrt(GRID_COLS * GRID_COLS + GRID_ROWS * GRID_ROWS);
  const maxTravelMs = (maxGridRadius / RIPPLE_SPEED) * 1000;
  const cutoff = maxTravelMs + RIPPLE_MAX_AGE_MS;
  ripples = ripples.filter(rp => (nowMs - rp.startMs) <= cutoff);
}