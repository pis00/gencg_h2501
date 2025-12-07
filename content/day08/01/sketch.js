let video;
let bodypix;
let segmentation;
let options = {
  outputStride: 8,          // qualità/dettaglio
  segmentationThreshold: 0.5 // 0–1, più alto = più sicuro ma meno sensibile
};

function preload() {
  // Carichiamo il modello BodyPix
  bodypix = ml5.bodyPix(options);
}

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  // Webcam
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide(); // non mostriamo il video direttamente
}

function videoReady() {
  console.log("Video ready, starting segmentation...");
  // Avvia il loop di segmentazione
  bodypix.segment(video, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
    return;
  }

  // Salviamo il risultato globale
  segmentation = result;

  // Chiamiamo di nuovo segment per aggiornare continuamente
  bodypix.segment(video, gotResults);
}

function draw() {
  background(255); // bianco di default

  // Se modello non pronto o segmentazione ancora nulla
  if (!segmentation || !segmentation.backgroundMask) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Caricamento modello / segmentazione...", width / 2, height / 2);
    return;
  }

  // Otteniamo la maschera di background/persona
  // backgroundMask: sfondo trasparente, persona opaca
  let maskImg = segmentation.backgroundMask;

  maskImg.loadPixels();
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;

      // Alpha della maschera: >0 = pixel della persona
      let a = maskImg.pixels[index + 3];

      if (a > 0) {
        // PIXEL DELLA PERSONA → nero
        pixels[index + 0] = 0;   // R
        pixels[index + 1] = 0;   // G
        pixels[index + 2] = 0;   // B
        pixels[index + 3] = 255; // alpha
      } else {
        // SFONDO → bianco
        pixels[index + 0] = 255;
        pixels[index + 1] = 255;
        pixels[index + 2] = 255;
        pixels[index + 3] = 255;
      }
    }
  }

  updatePixels();
}