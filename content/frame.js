// Global border for all p5 sketches
// Now ONLY the black outer frame is drawn

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

  pop();
}

// For 2D sketches
function drawBorder2D() {
  push();
  rectMode(CORNER);
  noStroke();

  fill(0);

  // top, bottom
  rect(0, 0, width, BLACK_FRAME);
  rect(0, height - BLACK_FRAME, width, BLACK_FRAME);

  // left, right
  rect(0, 0, BLACK_FRAME, height);
  rect(width - BLACK_FRAME, 0, BLACK_FRAME, height);

  pop();
}