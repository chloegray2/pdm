// Global audio variables
let sine, squareW, sawtooth, triangleW;
let ampEnv, highCut, lowCut;
let oscillators = {};  // mapping wave types to their oscillator objects

// UI elements
let oscSelect;  // dropdown for wave type
let highCutCheckbox, lowCutCheckbox;

// Visuals
let visualColors = []; // palette from project 2
let synthVisuals = []; // array for ellipse pulse effects

function setup() {
  createCanvas(800, 600);
  
  // Create the amplitude envelope
  ampEnv = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.3,
    sustain: 0.3,
    release: 0.2
  });
  
  // Create filter nodes
  highCut = new Tone.Filter(1000, "lowpass", -24);
  lowCut = new Tone.Filter(200, "highpass", -24);
  
  // Create four oscillators with different wave types
  sine = new Tone.OmniOscillator("A4", "sine");
  squareW = new Tone.OmniOscillator("A4", "square");
  sawtooth = new Tone.OmniOscillator("A4", "sawtooth6");
  triangleW = new Tone.OmniOscillator("A4", "triangle");
  
  // Connect all oscillators to the amplitude envelope
  sine.connect(ampEnv);
  squareW.connect(ampEnv);
  sawtooth.connect(ampEnv);
  triangleW.connect(ampEnv);
  
  // Create a mapping for easy access based on dropdown selection
  oscillators = {
    "Sine": sine,
    "Square": squareW,
    "Sawtooth": sawtooth,
    "Triangle": triangleW
  };
  
  // Set up the Tone.js output routing (by default, no filters)
  updateFilterRouting();
  
  // Create UI elements
  oscSelect = createSelect();
  oscSelect.position(20, 20);
  oscSelect.option("Sine");
  oscSelect.option("Square");
  oscSelect.option("Sawtooth");
  oscSelect.option("Triangle");
  
  highCutCheckbox = createCheckbox("High Cut", false);
  highCutCheckbox.position(20, 50);
  highCutCheckbox.changed(updateFilterRouting);
  
  lowCutCheckbox = createCheckbox("Low Cut", false);
  lowCutCheckbox.position(20, 80);
  lowCutCheckbox.changed(updateFilterRouting);
  
  // Define a color palette (taken from project 2)
  visualColors = [
    color(163, 0, 0),
    color(242, 0, 0),
    color(255, 0, 0),
    color(255, 79, 0),
    color(255, 207, 0),
    color(198, 255, 0),
    color(94, 255, 0),
    color(0, 255, 146),
    color(0, 178, 255),
    color(0, 40, 255),
    color(102, 0, 255),
    color(129, 0, 169)
  ];
}

function updateFilterRouting() {
  // Clear previous connections from ampEnv
  ampEnv.disconnect();
  highCut.disconnect();
  lowCut.disconnect();
  
  // Route the amplitude envelope output according to the filter checkboxes:
  if (highCutCheckbox.checked() && lowCutCheckbox.checked()){
    ampEnv.connect(highCut);
    highCut.connect(lowCut);
    lowCut.connect(Tone.Destination);
  } else if (highCutCheckbox.checked()){
    ampEnv.connect(highCut);
    highCut.connect(Tone.Destination);
  } else if (lowCutCheckbox.checked()){
    ampEnv.connect(lowCut);
    lowCut.connect(Tone.Destination);
  } else {
    ampEnv.connect(Tone.Destination);
  }
}

function draw() {
  background(225);
  
  // Draw the rotating circles and connecting lines (visual backbone)
  drawRotatingCircles();
  
  // Update and draw pulse effects triggered on note play
  for (let i = synthVisuals.length - 1; i >= 0; i--) {
    let effect = synthVisuals[i];
    noStroke();
    fill(red(effect.color), green(effect.color), blue(effect.color), effect.alpha);
    ellipse(effect.x, effect.y, effect.size);
    effect.alpha -= effect.decay;
    if (effect.alpha <= 0) {
      synthVisuals.splice(i, 1);
    }
  }
  
  // Overlay instructions
  fill(0);
  textSize(14);
  text("Press keys 1 (A4), 2 (C5), 3 (E5), 4 (A5) to play notes", 20, height - 20);
}

function drawRotatingCircles() {
  push();
  // Rotate the canvas over time for a dynamic visual effect
  translate(width/2, height/2);
  let rotationAngle = radians(frameCount / 2);
  rotate(rotationAngle);
  translate(-width/2, -height/2);
  
  // Define 12 points in a circle
  let numPoints = 12;
  let angleIncrement = TWO_PI / numPoints;
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = min(width, height) / 3;
  let circles = [];
  
  for (let i = 0; i < numPoints; i++) {
    let angle = angleIncrement * i - HALF_PI;
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    let circleColor = visualColors[i % visualColors.length];
    circles.push({ x: x, y: y, size: 10, color: circleColor });
  }
  
  noStroke();
  for (let circle of circles) {
    fill(circle.color);
    ellipse(circle.x, circle.y, circle.size);
  }
  
  // Draw lines connecting circles with a random offset for variation
  let randomIndex = floor(random(0, numPoints));
  strokeWeight(2);
  for (let i = 0; i < circles.length; i++) {
    let circle1 = circles[i];
    let circle2 = circles[(i + randomIndex) % circles.length];
    let lineColor = visualColors[(i + randomIndex) % visualColors.length];
    stroke(lineColor);
    line(circle1.x, circle1.y, circle2.x, circle2.y);
  }
  
  pop();
}

function keyPressed() {
  // Start Tone.js if it isn’t already running (required by some browsers)
  if (Tone.context.state !== 'running') {
    Tone.start();
  }
  
  let waveType = oscSelect.value();
  let currentOsc = oscillators[waveType];
  if (!currentOsc) return;
  
  // Map number keys to specific notes
  let note;
  if (keyCode === 49) { note = 'A4'; }
  else if (keyCode === 50) { note = 'C5'; }
  else if (keyCode === 51) { note = 'E5'; }
  else if (keyCode === 52) { note = 'A5'; }
  
  if (note) {
    currentOsc.frequency.value = note;
    currentOsc.start();
    // Trigger the envelope for a smoother sound onset
    ampEnv.triggerAttack();
    // Create a visual pulse effect for feedback
    generateEllipseEffect();
  }
}

function keyReleased() {
  let waveType = oscSelect.value();
  let currentOsc = oscillators[waveType];
  if (!currentOsc) return;
  
  if ([49, 50, 51, 52].includes(keyCode)) {
    currentOsc.stop();
    ampEnv.triggerRelease();
  }
}

function generateEllipseEffect() {
  // Create a random ellipse that fades out to provide visual feedback
  let effect = {
    x: random(width),
    y: random(height),
    size: random(20, 50),
    color: color(random(255), random(255), random(255)),
    alpha: 255,
    decay: 5
  };
  synthVisuals.push(effect);
}