let colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'brown', 'white', 'black'];
let selectedColor = 'black';
let paletteWidth = 40;
let prevX, prevY;
let backgroundStopped = true; 
let sustainMode = false; 
let activeNotes = {}; 
let sustainButton; 

let lastNoteTime = 0;
let noteInterval = 150;
let paintNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

let synths = {};
let effects = {};
let backgroundSynth, bgSequence;

const colorSoundMap = {
  red: { synth: "FMSynth", effect: "reverb" },
  orange: { synth: "MonoSynth", effect: "distortion" },
  yellow: { synth: "FMSynth", effect: "reverb" },
  green: { synth: "Synth", effect: "chorus" },
  cyan: { synth: "MembraneSynth", effect: "reverb" },
  blue: { synth: "Synth", effect: "bitcrusher" },
  magenta: { synth: "DuoSynth", effect: "pingPongDelay" },
  brown: { synth: "Synth", effect: "vibrato" },
  white: { synth: "Synth", effect: "phaser" },
  black: { synth: "MonoSynth", effect: "tremolo" }
};

function setup() {
  createCanvas(600, 400);
  background(225);
  drawPalette();

  let clearButton = createButton("Clear Canvas");
  clearButton.position(620, 50);
  clearButton.mousePressed(clearCanvas);

  sustainButton = createButton("Continuous Sound: Off");
  sustainButton.position(620, 100);
  sustainButton.mousePressed(toggleSustainMode);

  for (let color in colorSoundMap) {
    let settings = colorSoundMap[color];
    switch (settings.synth) {
      case "FMSynth":
        synths[color] = new Tone.FMSynth({
          harmonicity: color === "yellow" ? 2.0 : 3.0,
          modulationIndex: 5,
          oscillator: { type: "sine" },
          envelope: { attack: 0.2, decay: 1, sustain: 0.5, release: 2 }
        }).toDestination();
        break;
      case "MonoSynth":
        synths[color] = new Tone.MonoSynth().toDestination();
        break;
      case "MembraneSynth":
        synths[color] = new Tone.MembraneSynth().toDestination();
        break;
      case "Synth":
        synths[color] = new Tone.Synth({
          oscillator: { type: color === "blue" ? "sawtooth" : "square" },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.1 }
        }).toDestination();
        break;
      case "DuoSynth":
        synths[color] = new Tone.DuoSynth().toDestination();
        break;
      default:
        synths[color] = new Tone.Synth().toDestination();
        break;
    }
    switch (settings.effect) {
      case "reverb":
        effects[color] = new Tone.Reverb(3).toDestination();
        break;
      case "distortion":
        effects[color] = new Tone.Distortion(0.5).toDestination();
        break;
      case "delay":
        effects[color] = new Tone.FeedbackDelay("8n", 0.5).toDestination();
        break;
      case "chorus":
        effects[color] = new Tone.Chorus(1.5, 3.5, 0.5).toDestination();
        break;
      case "bitcrusher":
        effects[color] = new Tone.BitCrusher(4).toDestination();
        break;
      case "pingPongDelay":
        effects[color] = new Tone.PingPongDelay("4n", 0.5).toDestination();
        break;
      case "vibrato":
        effects[color] = new Tone.Vibrato(4, 0.5).toDestination();
        break;
      case "phaser":
        effects[color] = new Tone.Phaser(0.5, 3, 400).toDestination();
        break;
      case "tremolo":
        effects[color] = new Tone.Tremolo(8, 0.5).toDestination();
        break;
      default:
        effects[color] = null;
    }
    if (effects[color]) {
      synths[color].connect(effects[color]);
    }
  }

  backgroundSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 2, decay: 3, sustain: 0.5, release: 4 }
  }).toDestination();

  let chordProgression = [
    ["C4", "E4", "G4"],
    ["A3", "D4", "F4"],
    ["G3", "B3", "D4"],
    ["F3", "A3", "C4"]
  ];
  let chordIndex = 0;
  bgSequence = new Tone.Loop((time) => {
    let chord = chordProgression[chordIndex];
    backgroundSynth.triggerAttackRelease(chord, "4n", time);
    chordIndex = (chordIndex + 1) % chordProgression.length;
  }, "2m");
}

function draw() {
  drawPalette();
}

function toggleSustainMode() {
  sustainMode = !sustainMode;
  if (sustainMode) {
    sustainButton.html("Continuous Sound: On");
  } else {
    sustainButton.html("Continuous Sound: Off");
    releaseSustainedNotes();
  }
}

function releaseSustainedNotes() {
  for (let color in activeNotes) {
    if (activeNotes[color]) {
      synths[color].triggerRelease(activeNotes[color]);
    }
  }
  activeNotes = {};
}

function drawPalette() {
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    noStroke();
    rect(0, i * paletteWidth, paletteWidth, paletteWidth);
  }
}

function mousePressed() {
  if (mouseX < paletteWidth) {
    let index = floor(mouseY / paletteWidth);
    if (index >= 0 && index < colors.length) {
      selectedColor = colors[index];
      let synth = synths[selectedColor];
      if (synth) {
        synth.triggerAttackRelease("C4", "8n");
      }
      if (backgroundStopped) {
        Tone.start().then(() => {
          Tone.Transport.start();
          bgSequence.start(0);
          backgroundStopped = false;
        });
      }
    }
  }
}

function mouseDragged() {
  if (mouseX <= paletteWidth || mouseX >= width || mouseY <= 0 || mouseY >= height) {
    return;
  }
  
  stroke(selectedColor);
  strokeWeight(5);
  if (prevX !== undefined && prevY !== undefined) {
    line(prevX, prevY, mouseX, mouseY);
  }
  prevX = mouseX;
  prevY = mouseY;
  
  if (millis() - lastNoteTime > noteInterval) {
    let noteIndex = floor(map(mouseY, 0, height, 0, paintNotes.length));
    noteIndex = constrain(noteIndex, 0, paintNotes.length - 1);
    let note = paintNotes[noteIndex];
    let synth = synths[selectedColor];
    if (synth) {
      if (sustainMode) {
        if (activeNotes[selectedColor] && activeNotes[selectedColor] !== note) {
          synth.triggerRelease(activeNotes[selectedColor]);
        }
        if (activeNotes[selectedColor] !== note) {
          synth.triggerAttack(note);
          activeNotes[selectedColor] = note;
        }
      } else {
        synth.triggerAttackRelease(note, "8n");
      }
    }
    lastNoteTime = millis();
  }
}

function mouseReleased() {
  prevX = undefined;
  prevY = undefined;
  if (sustainMode) {
  }
}

function clearCanvas() {
  background(225);
  drawPalette();
  bgSequence.stop();
  backgroundStopped = true;
  releaseSustainedNotes();
}