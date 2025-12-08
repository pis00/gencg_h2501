// Global border for all p5 sketches

const WHITE_FRAME = 10;
const BLACK_FRAME = 5;

// For WEBGL sketches
function drawBorderWEBGL() {
  push();
  rectMode(CORNER);
  noStroke();

  // In WEBGL (0,0) is at the center
  const TLX = -width / 2;
  const TLY = -height / 2;

  // ---- Outer black frame (5 px) ----
  fill(0);
  // top, bottom
  rect(TLX, TLY, width, BLACK_FRAME);
  rect(TLX, TLY + height - BLACK_FRAME, width, BLACK_FRAME);
  // left, right
  rect(TLX, TLY, BLACK_FRAME, height);
  rect(TLX + width - BLACK_FRAME, TLY, BLACK_FRAME, height);

  // ---- Inner white frame (10 px) ----
  const x = TLX + BLACK_FRAME;
  const y = TLY + BLACK_FRAME;
  const w = width  - 2 * BLACK_FRAME;
  const h = height - 2 * BLACK_FRAME;

  fill(255);
  // top, bottom
  rect(x, y, w, WHITE_FRAME);
  rect(x, y + h - WHITE_FRAME, w, WHITE_FRAME);
  // left, right
  rect(x, y, WHITE_FRAME, h);
  rect(x + w - WHITE_FRAME, y, WHITE_FRAME, h);

  pop();
}

// (optional) For 2D sketches (no WEBGL)
function drawBorder2D() {
  push();
  rectMode(CORNER);
  noStroke();

  // ---- Outer black frame (5 px) ----
  fill(0);
  // top, bottom
  rect(0, 0, width, BLACK_FRAME);
  rect(0, height - BLACK_FRAME, width, BLACK_FRAME);
  // left, right
  rect(0, 0, BLACK_FRAME, height);
  rect(width - BLACK_FRAME, 0, BLACK_FRAME, height);

  // ---- Inner white frame (10 px) ----
  const x = BLACK_FRAME;
  const y = BLACK_FRAME;
  const w = width  - 2 * BLACK_FRAME;
  const h = height - 2 * BLACK_FRAME;

  fill(255);
  // top, bottom
  rect(x, y, w, WHITE_FRAME);
  rect(x, y + h - WHITE_FRAME, w, WHITE_FRAME);
  // left, right
  rect(x, y, WHITE_FRAME, h);
  rect(x + w - WHITE_FRAME, y, WHITE_FRAME, h);

  pop();
}