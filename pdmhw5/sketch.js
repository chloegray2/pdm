let samples;
let buttons = [];
let startContextButton;
let sampleKeys = ["sample1", "sample2", "sample3", "sample4"];

function preload() {
  // Load audio samples using Tone.Players with an onload callback.
  samples = new Tone.Players({
    sample1: "assets/sample1.mp3",
    sample2: "assets/sample2.mp3",
    sample3: "assets/sample3.mp3",
    sample4: "assets/sample4.mp3"
  }, () => {
    console.log("Samples loaded!");
  }).toDestination();
}

function setup() {
  createCanvas(400, 300);
  background(220);

  // Display title and instructions
  textAlign(CENTER, CENTER);
  textSize(18);
  fill(0);
  text("Simple Sampler (Tone.js)", width / 2, 30);
  textSize(12);
  text("Click buttons to play samples.", width / 2, 50);

  // Button to start Tone.js audio context
  startContextButton = createButton("Start Audio Context");
  startContextButton.position(10, 10);
  startContextButton.mousePressed(startAudioContext);

  // Create buttons for each sample
  for (let i = 0; i < sampleKeys.length; i++) {
    let btn = createButton("Play Sample " + (i + 1));
    btn.position(20, 80 + i * 40);
    btn.mousePressed(() => playSample(sampleKeys[i]));
    buttons.push(btn);
  }
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(18);
  fill(0);
  text("Simple Sampler (Tone.js)", width / 2, 30);
  textSize(12);
  text("Click buttons to play samples.", width / 2, 50);
}

function startAudioContext() {
  // Start Tone.js audio context on user gesture
  Tone.start().then(() => {
    console.log("Audio Context Started");
  }).catch(e => console.error(e));
}

function playSample(key) {
  // Updated method to retrieve the sample
  samples.get(key).start();
}