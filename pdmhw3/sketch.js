let characters = [];
let spriteSheets = [];
let numCharacters = 3; 
let frameWidth = 80;
let frameHeight = 80;
let numFrames = 8; 
let scaleFactor = 2.75;

function preload() {
  spriteSheets.push(loadImage("assets/character1.png")); 
  spriteSheets.push(loadImage("assets/character2.png"));
  spriteSheets.push(loadImage("assets/character3.png"));
}

function setup() {
  createCanvas(800, 400);
  
  addCharacter(100, 200, spriteSheets[0]);
  addCharacter(300, 250, spriteSheets[1]);
  addCharacter(500, 220, spriteSheets[2]);
}

function addCharacter(x, y, spriteSheet) {
  characters.push(new Character(x, y, spriteSheet));
}


function draw() {
  background(220);
  for (let character of characters) {
    character.update();
    character.display();
  }
}

class Character {
  constructor(x, y, spriteSheet) {
    this.x = x;
    this.y = y;
    this.spriteSheet = spriteSheet;
    this.currentFrame = 0;
    this.frameDelay = 5;
    this.frameCounter = 0;
    this.direction = 1;
    this.moving = false;
  }

  update() {
    this.moving = false;
    
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 2;
      this.direction = -1;
      this.moving = true;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += 2;
      this.direction = 1;
      this.moving = true;
    }

    if (this.moving) {
      this.frameCounter++;
      if (this.frameCounter >= this.frameDelay) {
        this.currentFrame = (this.currentFrame + 1) % numFrames;
        this.frameCounter = 0;
      }
    } else {
      this.currentFrame = 0;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    scale(this.direction, 1);
    image(
      this.spriteSheet,
      -frameWidth / 2,
      -frameHeight / 2,
      frameWidth,
      frameHeight,
      this.currentFrame * frameWidth,
      0,
      frameWidth,
      frameHeight
    );
    pop();
  }
}

