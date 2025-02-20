let bugSprite;
let deadBugSprite;
let bugs = []; 
let startTime;
let speedMultiplier = 1;
let timerDuration = 30; 
let numBugs = 1; 
let splatCount = 0; 
let gameStarted = false; 
let gameOver = false; 

function preload() {
  bugSprite = loadImage('assets/bug.png');
  deadBugSprite = loadImage('assets/deadBug.png'); 
}

function setup() {
  createCanvas(800, 600); 
  textAlign(CENTER, CENTER); 
}

function draw() {
  background(220); 
  
  if (!gameStarted && !gameOver) {
    fill(0);
    textSize(32);
    text("Start Game", width / 2, height / 2);

    noFill();
    stroke(0);
    rectMode(CENTER);
    rect(width / 2, height / 2, 200, 50);
  } 
  else if (gameOver) {
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER)
    text("Game Over", width / 2, height / 2 - 50);
    textSize(32);
    text(`Splats: ${splatCount}`, width / 2, height / 2);

    text("Play Again", width / 2, height / 2 + 100);
    noFill();
    stroke(0);
    rectMode(CENTER);
    rect(width / 2, height / 2 + 100, 200, 50);
  } 
  else {
    let elapsedTime = (millis() - startTime) / 1000; 
    let timeLeft = timerDuration - elapsedTime;
    
    speedMultiplier = 1;
   
    if (elapsedTime >= timerDuration) {
      endGame(); 
    }
    
    numBugs = 1 + floor(splatCount / 1) * 2; 
    
    while (bugs.length < numBugs) {
      spawnBug();
    }
    while (bugs.length > numBugs) {
      bugs.pop();
    }
    
    for (let bug of bugs) {
      bug.update(speedMultiplier);
      bug.display();
    }
    
    fill(0);
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Time: ${timeLeft.toFixed(1)}s`, 10, 10);
    text(`Splats: ${splatCount}`, 10, 40); 
  }
}

function spawnBug(minSpeed = 3) {
  let newBug = new Bug();
  bugs.push(newBug);
}

function resetGame() {
  startTime = millis(); 
  bugs = []; 
  numBugs = 1; 
  splatCount = 0; 
  gameOver = false; 
  spawnBug(); 
}

function endGame() {
  gameStarted = false;
  gameOver = true;
}

class Bug {
  constructor(minSpeed = 3) {
    this.margin = 35;
    this.minSpeed = minSpeed;
    this.reset();
  }
  

  reset() {
    this.x = random(-this.margin, width + this.margin);
    this.y = random(-this.margin, height + this.margin);
    let speed = random(this.minSpeed, this.minSpeed + 3);
    let angle = random(TWO_PI);
    this.xSpeed = speed * cos(angle);
    this.ySpeed = speed * sin(angle);

    this.isSplat = false;
    this.angle = atan2(this.ySpeed, this.xSpeed) + PI / 2;
  }
  
  update(speedMultiplier) {
    if (!this.isSplat) {
      this.angle = atan2(this.ySpeed, this.xSpeed) + PI / 2;
      this.x += this.xSpeed * speedMultiplier;
      this.y += this.ySpeed * speedMultiplier;
    }

    if (this.x < -this.margin) {
      this.x = -this.margin;
      this.xSpeed *= -1;
    } else if (this.x > width + this.margin - bugSprite.width) {
      this.x = width + this.margin - bugSprite.width;
      this.xSpeed *= -1;
    }

    if (this.y < -this.margin) {
      this.y = -this.margin;
      this.ySpeed *= -1;
    } else if (this.y > height + this.margin - bugSprite.height) {
      this.y = height + this.margin - bugSprite.height;
      this.ySpeed *= -1;
    }
  }
  

  display() {
    push();
    translate(this.x + bugSprite.width / 2, this.y + bugSprite.height / 2);
    rotate(this.angle);
    imageMode(CENTER);
    if (this.isSplat) {
      image(deadBugSprite, 0, 0);
    } else {
      image(bugSprite, 0, 0);
    }
    pop();
  }
  

  checkSplat() {
    if (mouseX > this.x && mouseX < this.x + bugSprite.width &&
        mouseY > this.y && mouseY < this.y + bugSprite.height) {
      if (!this.isSplat) {
        this.isSplat = true;
        this.xSpeed = 0;
        this.ySpeed = 0;
        splatCount++; 

      let splattedSpeed = sqrt(this.xSpeed ** 2 + this.ySpeed ** 2);

      spawnBug(splattedSpeed * 1.2);
      spawnBug(splattedSpeed * 1.2);
      }
    }
  }
}


function mousePressed() {
  if (!gameStarted && !gameOver) {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
        mouseY > height / 2 - 25 && mouseY < height / 2 + 25) {
      gameStarted = true;
      startTime = millis();
      resetGame();
    }
  } else if (gameOver) {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
        mouseY > height / 2 + 75 && mouseY < height / 2 + 125) {
      resetGame();
    }
  } else {
    for (let bug of bugs) {
      bug.checkSplat();
    }
  }
}
