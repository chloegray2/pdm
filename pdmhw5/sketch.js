let sampler;
let isLoaded = false;
let reverb;
let soundOutput;

function preload() {
  sounds = {
    sample1: loadSound('assets/sample1.mp3'),
    sample2: loadSound('assets/sample2.mp3'),
    sample3: loadSound('assets/sample3.mp3'),
    sample4: loadSound('assets/sample4.mp3'),
    sample5: loadSound('assets/sample5.mp3')
  };
}

function setup() {
  createCanvas(400, 400);
  userStartAudio();
  
  // Audio setup
  soundOutput = getAudioContext();
  reverb = new p5.Reverb();
  reverb.disconnect();
  reverb.connect();
  reverb.drywet(0);

  // Canvas positioning
  const canvas = document.querySelector('canvas');
  canvas.style.position = 'absolute';
  canvas.style.zIndex = '0';

  // Controls container
  const controls = createDiv();
  controls.style.position = 'absolute';
  controls.style.zIndex = '1';
  controls.style.padding = '20px';

  let yPos = 10;

  // Create buttons
  button1 = createButton('sample 1 (loading...)');
  button1.parent(controls);
  button1.position(10, yPos);
  button1.attribute('disabled', true);
  yPos += 30;

  button2 = createButton('sample 2 (loading...)');
  button2.parent(controls);
  button2.position(10, yPos);
  button2.attribute('disabled', true);
  yPos += 30;

  button3 = createButton('sample 3 (loading...)');
  button3.parent(controls);
  button3.position(10, yPos);
  button3.attribute('disabled', true);
  yPos += 30;

  button4 = createButton('sample 4 (loading...)');
  button4.parent(controls);
  button4.position(10, yPos);
  button4.attribute('disabled', true);
  yPos += 30;

  button5 = createButton('sample 5 (loading...)');
  button5.parent(controls);
  button5.position(10, yPos);
  button5.attribute('disabled', true);
  yPos += 30;

  // Slider setup
  slider = createSlider(0, 1, 0, 0.01);
  slider.parent(controls);
  slider.position(70, yPos);
  slider.style('width', '100px');
  slider.style('height', '15px');
  slider.input(() => {
    reverb.drywet(slider.value());
  });

  const reverbLabel = createDiv('reverb');
  reverbLabel.parent(controls);
  reverbLabel.position(10, yPos);
  reverbLabel.style('color', 'black');

  document.body.addEventListener('click', () => {
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }
  });

  setTimeout(checkLoading, 100);
}

function checkLoading() {
  if (Object.values(sounds).every(s => s.isLoaded())) {
    enableButtons();
  } else {
    setTimeout(checkLoading, 100);
  }
}

function enableButtons() {
  isLoaded = true;
  const buttons = [button1, button2, button3, button4, button5];
  buttons.forEach((btn, i) => {
    btn.html(`sample ${i + 1}`);
    btn.removeAttribute('disabled');
    btn.mousePressed(() => playSample(i + 1));
  });
}

function playSample(num) {
  if (!isLoaded) return;
  const sound = sounds[`sample${num}`];

  sound.disconnect(); 
  sound.connect(reverb); 
  sound.stop(); 
  sound.play(); 
}

function draw() {
  background(220);
}