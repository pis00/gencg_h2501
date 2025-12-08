const ANGLE_DEG      = 20;
const SPACING        = 40;
const LINE_THICKNESS = 8.0;

const LENS_RADIUS   = 140.0;
const LENS_STRENGTH = 1.0;

let gridShader;
let VERT_SRC, FRAG_SRC;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  pixelDensity(1);

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

    vec2 d = p - u_mouse;
    float dist = length(d);
    float t = smoothstep(u_radius, 0.0, dist);
    float swirl = u_strength * 1.2 * t;
    float cs = cos(swirl), sn = sin(swirl);
    vec2 dSwirl = vec2(cs*d.x - sn*d.y, sn*d.x + cs*d.y);
    float k = 1.0 + u_strength * 0.8 * t * t;
    p = u_mouse + dSwirl * k;

    vec2 c = p - 0.5 * u_resolution;

    vec2 r1 = rot(c, u_angle);
    float d1 = stripeDist(r1, u_spacing);

    vec2 r2 = rot(c, u_angle + 1.57079632679);
    float d2 = stripeDist(r2, u_spacing);

    float dmin = min(d1, d2);
    float halfT = u_thickness * 0.5;

    float mask = smoothstep(halfT + 0.5, halfT - 0.5, dmin);
    vec3 col = mix(vec3(1.0), vec3(0.0), mask);

    fragColor = vec4(col, 1.0);
  }`;

  gridShader = createShader(VERT_SRC, FRAG_SRC);
}

function draw() {
  shader(gridShader);

  gridShader.setUniform('u_resolution', [width, height]);
  gridShader.setUniform('u_spacing', SPACING);
  gridShader.setUniform('u_thickness', LINE_THICKNESS);
  gridShader.setUniform('u_angle', radians(ANGLE_DEG));
  gridShader.setUniform('u_radius', LENS_RADIUS);
  gridShader.setUniform('u_strength', LENS_STRENGTH);

  const mx = constrain(mouseX, 0, width);
  const my = constrain(mouseY, 0, height);
  gridShader.setUniform('u_mouse', [mx, my]);

  rectMode(CENTER);
  rect(0, 0, width, height);

  resetShader();
  drawBorderWEBGL();
}