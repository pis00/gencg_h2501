let skin;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  skin = color(255, 190, 200); // pink skin
  noLoop();
}

function draw() {
  background(240);
  translate(width / 2, height / 2);

  const faceW = 200;
  const faceH = 250;
  const earW = 40;
  const earH = 70;

  // Ears
  noStroke();
  fill(skin);
  ellipse(-faceW * 0.55, 0, earW, earH);
  ellipse(faceW * 0.55, 0, earW, earH);

  // Face
  ellipse(0, 0, faceW, faceH);

  // Hair
  fill(0);
  arc(0, -faceH * 0.15, faceW * 1.1, faceH * 0.9, PI, 0, CHORD);

  // Eyes
  const eyeY = -faceH * 0.1;
  const eyeX = faceW * 0.2;

  fill(255);
  ellipse(-eyeX, eyeY, 40, 25);
  ellipse(eyeX, eyeY, 40, 25);

  fill(0);
  ellipse(-eyeX, eyeY, 15, 15);
  ellipse(eyeX, eyeY, 15, 15);

  // Mouth
  noFill();
  stroke(120, 0, 40);
  strokeWeight(4);
  arc(0, faceH * 0.2, 80, 40, 0, PI);

  // Nose
  stroke(180);
  strokeWeight(2);
  noFill();
  line(0, 0, 0, 30);
}