touchEnded.Transport.bpm.value = 120;
let button;
let sampler;

function setup(){
  sampler = new Tone.Players({
    "sample1": "sample1.mp3",
    "sample2": "sample2.mp3",
    "sample3": "sample3.mp3",
    "sample4": "sample4.mp3",
    "sample5": "sample5.mp3",
  }).toMaster();

  button1 = createButton('sample 1');
  button1.position(10, 10);
  button1.mousePressed(playSample1);

  function playSample1(){
    sampler.get('sample1').start()
  }

  button2 = createButton('sample 2');
  button2.position(10, 30);
  button2.mousePressed(playSample2);

  function playSample2(){
    sampler.get('sample2').start()
  }

  button3 = createButton('sample 3');
  button3.position(10, 50);
  button3.mousePressed(playSample3);

  function playSample3(){
    sampler.get('sample3').start()
  }

  button4 = createButton('sample 4');
  button4.position(10, 70);
  button4.mousePressed(playSample4);

  function playSample4(){
    sampler.get('sample4').start()
  }

  button5 = createButton('sample 5');
  button5.position(10, 90);
  button5.mousePressed(playSample5);

  function playSample5(){
    sampler.get('sample5').start()
  }

  slider = createSlider(0, 1, 0);
  slider.position(70, 140);
  slider.style('width', '15px');

  function effect(){
    if (slider.value() == 1){
      new Tone.Reverb(2).toMaster();
    }
  }
}

function draw(){
  createCanvas(400, 400);
  text("reverb", 11, 150)
}