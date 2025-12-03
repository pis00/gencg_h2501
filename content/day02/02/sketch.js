// Distorted oblique grid with cursor-controlled "distorsione" lens
// Canvas: 700x600 (WEBGL), grid ~8px, 10px white + 5px black frame

const ANGLE_DEG      = 20;
const SPACING        = 40;
const LINE_THICKNESS = 8.0;

const WHITE_FRAME = 10;
const BLACK_FRAME = 5;

const LENS_RADIUS   = 140.0;
const LENS_STRENGTH = 1.0;

let gridShader;
let VERT_SRC, FRAG_SRC;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  pixelDensity(1);

  // ---- WebGL2 shaders (300 es) ----
  VERT_SRC = `#version 300 es
  precision mediump float;
  in vec3 aPosition;
  in vec2 aTexCoord;
  out vec2 vTexCoord;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uModelViewMatrix;
  void main() {
    vTexCoord = aTexCoord;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
  }`;

  FRAG_SRC = `#version 300 es
  precision mediump float;
  precision mediump int;
  in vec2 vTexCoord;
  out vec4 fragColor;

  uniform vec2  u_resolution;
  uniform vec2  u_mouse;
  uniform float u_spacing;
  uniform float u_thickness;
  uniform float u_angle;
  uniform float u_radius;
  uniform float u_strength;

  vec2 rot(vec2 p, float a){
    float c = cos(a), s = sin(a);
    return vec2(c*p.x - s*p.y, s*p.x + c*p.y);
  }

  float stripeDist(vec2 p, float s){
    float m = mod(p.x + 0.5*s, s) - 0.5*s;
    return abs(m);
  }

  void main() {
    vec2 p = vTexCoord * u_resolution;

    // Distortion lens (bulge + mild swirl)
    vec2 d = p - u_mouse;
    float dist = length(d);
    float t = smoothstep(u_radius, 0.0, dist);     // 1 center -> 0 edge
    float swirl = u_strength * 1.2 * t;
    float cs = cos(swirl), sn = sin(swirl);
    vec2 dSwirl = vec2(cs*d.x - sn*d.y, sn*d.x + cs*d.y);
    float k = 1.0 + u_strength * 0.8 * t * t;      // bulge
    p = u_mouse + dSwirl * k;

    // Build oblique grid (two perpendicular families)
    vec2 c = p - 0.5 * u_resolution;

    vec2 r1 = rot(c, u_angle);
    float d1 = stripeDist(r1, u_spacing);

    vec2 r2 = rot(c, u_angle + 1.57079632679);     // + PI/2
    float d2 = stripeDist(r2, u_spacing);

    float dmin = min(d1, d2);
    float halfT = u_thickness * 0.5;

    float mask = smoothstep(halfT + 0.5, halfT - 0.5, dmin); // AA edges
    vec3 col = mix(vec3(1.0), vec3(0.0), mask);              // black lines

    fragColor = vec4(col, 1.0);
  }`;

  gridShader = createShader(VERT_SRC, FRAG_SRC);  // correct for WEBGL2
}

function draw() {
  shader(gridShader);

  gridShader.setUniform('u_resolution', [width, height]);
  gridShader.setUniform('u_spacing', SPACING);
  gridShader.setUniform('u_thickness', LINE_THICKNESS);
  gridShader.setUniform('u_angle', radians(ANGLE_DEG));
  gridShader.setUniform('u_radius', LENS_RADIUS);
  gridShader.setUniform('u_strength', LENS_STRENGTH);

  // ✅ Mouse already in top-left canvas coords in WEBGL mode
  const mx = constrain(mouseX, 0, width);
  const my = constrain(mouseY, 0, height);
  gridShader.setUniform('u_mouse', [mx, my]);

  // Full-canvas quad
  rectMode(CENTER);
  rect(0, 0, width, height);

  // Draw frames on top (unwarped)
  resetShader();
  drawFrames();
}

function drawFrames() {
  // Draw crisp frames as filled bands (no stroke)
  push();
  rectMode(CORNER);
  noStroke();

  // In WEBGL, origin is canvas center:
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