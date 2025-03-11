
var stoneBreakImg;    
var gifDuration = 4000; 
var gifPlaying = false; 
var crunchRepeatId;    

function setup() {
  createCanvas(640, 480);

  stoneBreakImg = createImg("minecraft.gif", "Minecraft block breaking");
  stoneBreakImg.size(256, 256);
  stoneBreakImg.position(width / 2 - 128, height / 2 - 128);
  stoneBreakImg.hide(); 

  Tone.Transport.start();
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(0);

  if (!gifPlaying) {
    text("Click to break the Minecraft block!", width / 2, height / 2);
  }
}

async function mouseClicked() {
  await Tone.start();

  if (gifPlaying) return; 
  gifPlaying = true;

  stoneBreakImg.attribute('src', 'minecraft.gif?' + new Date().getTime());
  stoneBreakImg.show();

  crunchRepeatId = Tone.Transport.scheduleRepeat((time) => {
    if (gifPlaying) {
      playCrunch(time);
    }
  }, "0.5", "+2");


  setTimeout(() => {
    stoneBreakImg.hide();
    stopSound();
    gifPlaying = false;
  }, gifDuration);
}

function playCrunch(time) {
  const noise = new Tone.Noise("white");
  const crunchFilt = new Tone.Filter(800, "bandpass");
  const noiseEnv = new Tone.AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.1,
    sustain: 0.0,
    release: 0.05
  }).toDestination();

  noise.connect(crunchFilt);
  crunchFilt.connect(noiseEnv);
  noise.start(time);
  noiseEnv.triggerAttackRelease(0.2, time);
  noise.stop(time + 0.5);
}

function stopSound() {
  if (crunchRepeatId !== undefined) {
    Tone.Transport.clear(crunchRepeatId);
  }
}