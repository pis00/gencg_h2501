let video;
let bodypix;
let segmentation;
let options = {
  outputStride: 8,
  segmentationThreshold: 0.5
};

function setup() {
  // canvas a tutta “area sketch” come gli altri giorni
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();

  bodypix = ml5.bodyPix(options, modelReady);
}

function modelReady() {
  console.log("BodyPix model loaded");
}

function videoReady() {
  console.log("Video ready");
  if (bodypix) {
    console.log("Starting segmentation...");
    bodypix.segment(video, gotResults);
  }
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
    return;
  }

  segmentation = result;
  bodypix.segment(video, gotResults);
}

function draw() {
  background(255);

  if (!segmentation || !segmentation.backgroundMask) return;

  let maskImg = segmentation.backgroundMask;
  maskImg.loadPixels();
  loadPixels();

  let mW = maskImg.width;
  let mH = maskImg.height;

  for (let y = 0; y < height; y++) {
    // mappa y canvas -> y mask
    let py = floor((y / height) * (mH - 1));
    for (let x = 0; x < width; x++) {
      // mappa x canvas -> x mask
      let px = floor((x / width) * (mW - 1));

      let mIndex = (px + py * mW) * 4;
      let a = maskImg.pixels[mIndex + 3];

      let index = (x + y * width) * 4;

      if (a > 0) {
        pixels[index + 0] = 0;
        pixels[index + 1] = 0;
        pixels[index + 2] = 0;
        pixels[index + 3] = 255;
      } else {
        pixels[index + 0] = 255;
        pixels[index + 1] = 255;
        pixels[index + 2] = 255;
        pixels[index + 3] = 255;
      }
    }
  }

  updatePixels();
  drawBorder2D();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(width, height);
}