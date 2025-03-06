let synth;
let filter;
let distortion;
let reverb;
let started = false;

let distortionAmountSlider, distortionWetSlider, reverbWetSlider;
let distortionAmountLabel, distortionWetLabel, reverbWetLabel;

let container;
let sliderContainer;

let notes = {
  '1': 'C4', 
  '2': 'D4', 
  '3': 'E4', 
  '4': 'F4', 
  '5': 'G4',
  '6': 'A4', 
  '7': 'B4', 
  '8': 'C5', 
  '9': 'D5', 
  '0': 'E5'
};

let activeKeys = {};

function setup() {
  container = createDiv();
  container.style('position', 'relative');
  container.style('width', '600px');
  container.style('height', '400px');

  let cnv = createCanvas(800, 400);
  cnv.parent(container);
  
  textSize(20);
  textAlign(CENTER, CENTER);

  sliderContainer = createDiv();
  sliderContainer.style('position', 'absolute');
  sliderContainer.style('left', '20px');
  sliderContainer.style('top', '250px');
  sliderContainer.style('z-index', '10');


  distortionAmountLabel = createP("Distortion Amount: 0.00");
  distortionAmountLabel.style('margin', '0');
  distortionAmountLabel.style('color', 'white'); 
  distortionAmountLabel.parent(sliderContainer);

  distortionAmountSlider = createSlider(0, 1, 0, 0.01); 
  distortionAmountSlider.parent(sliderContainer);

  distortionWetLabel = createP("Distortion Wet: 0.00");
  distortionWetLabel.style('margin', '0');
  distortionWetLabel.style('color', 'white'); 
  distortionWetLabel.parent(sliderContainer);
  
  distortionWetSlider = createSlider(0, 1, 0, 0.01); 
  distortionWetSlider.parent(sliderContainer);
  distortionWetSlider.style('margin-top', '10px');


  reverbWetLabel = createP("Reverb Wet: 0.00");
  reverbWetLabel.style('margin', '0');
  reverbWetLabel.style('color', 'white'); 
  reverbWetLabel.parent(sliderContainer);
  
  reverbWetSlider = createSlider(0, 1, 0, 0.01);  
  reverbWetSlider.parent(sliderContainer);
  reverbWetSlider.style('margin-top', '10px');


  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square" },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 1 }
  });

  filter = new Tone.Filter(1200, "lowpass");

  distortion = new Tone.Distortion({
    distortion: 0, 
    oversample: '4x'
  });


  reverb = new Tone.Reverb({ decay: 1.5, wet: 0.0 });

  synth.chain(filter, distortion, reverb, Tone.Destination);

  let startButton = document.getElementById("startSynth");
  startButton.addEventListener("click", async () => {
    await Tone.start();
    console.log("Tone.js Audio Context Started");
    started = true;
    startButton.style.display = "none"; 
  });
}

function draw() {
  background(30);
  fill(255);

  text("Press a key to start the synthesizer!", width / 2, 30);
  text("Use keys 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 to play notes", width / 2, 60);

  // Update slider values if changed
  let newDistortion = distortionAmountSlider.value();
  let newDistortionWet = distortionWetSlider.value();
  let newReverbWet = reverbWetSlider.value();

  if (distortion.distortion !== newDistortion) {
    distortion.distortion = newDistortion;
  }

  if (distortion.wet.value !== newDistortionWet) {
    distortion.wet.value = newDistortionWet;
  }

  if (reverb.wet.value !== newReverbWet) {
    reverb.wet.value = newReverbWet;
  }

  // Update UI Labels
  distortionAmountLabel.html("Distortion Amount: " + distortion.distortion.toFixed(2));
  distortionWetLabel.html("Distortion Wet: " + distortion.wet.value.toFixed(2));
  reverbWetLabel.html("Reverb Wet: " + reverb.wet.value.toFixed(2));

  let x = 50;
  for (let k in notes) {
    if (activeKeys[k]) {
      fill(200, 100, 255); 
    } else {
      fill(255);
    }
    rect(x, 100, 40, 100, 10);
    fill(0);
    text(k, x + 20, 150);
    x += 45;
  }
}

function keyPressed() {
  if (!started) return; 

  let pressedKey = key;
  if (notes[pressedKey] && !activeKeys[pressedKey]) {
    console.log(`Key pressed: ${pressedKey} -> Note: ${notes[pressedKey]}`);
    synth.triggerAttack(notes[pressedKey]);
    activeKeys[pressedKey] = true;
  }
}

function keyReleased() {
  let releasedKey = key;
  if (notes[releasedKey]) {
    console.log(`Key released: ${releasedKey} -> Stopping note`);
    synth.triggerRelease(notes[releasedKey]);
    delete activeKeys[releasedKey];
  }
}
