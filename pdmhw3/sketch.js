let characters = [];
let spriteSheets = [];
let numCharacters = 3; // At least three different characters
let frameWidth = 80;
let frameHeight = 80;
let numFrames = 8; // Assuming 8 frames for walking
let scaleFactor = 1.5;

function preload() {
  // Load sprite sheets (update these paths with correct file URLs)
  spriteSheets.push(loadImage("assets/character1.png")); // Replace with actual sprite sheet paths
  spriteSheets.push(loadImage("assets/character2.png"));
  spriteSheets.push(loadImage("assets/character3.png"));
}

function setup() {
  createCanvas(800, 400);
  for (let i = 0; i < numCharacters; i++) {
    let x = random(width - frameWidth);
    let y = height / 2 + i * 30; // Spread them out
    characters.push(new Character(x, y, spriteSheets[i]));
  }
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
    this.direction = 1; // 1 for right, -1 for left
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 2;
      this.direction = -1;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += 2;
      this.direction = 1;
    }

    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % numFrames;
      this.frameCounter = 0;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    scale(this.direction * scaleFactor, scaleFactor);
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
