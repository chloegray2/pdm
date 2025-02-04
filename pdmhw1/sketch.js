function setup() {
  createCanvas(800, 800);
}

function draw() {
  background(255);
  
  drawExample1(50, 50);
  drawExample2(450, 50);
  drawExample3(50, 450);
  drawExample4(450, 450);
}

function drawExample1(x, y) {
  fill(0, 255, 0);


  rect(x, y, 150, 100);
  fill(255);
  stroke('black')
  strokeWeight(2)
  ellipse(x + 40, y + 50, 50, 50);
  rect(x + 90, y + 20, 50, 50);
}

function drawExample2(x, y) {
  noStroke();
  fill(0, 0, 255, 150);
  ellipse(x + 50, y + 100, 100, 100);
  fill(0, 255, 0, 150);
  ellipse(x + 100, y + 100, 100, 100);
  fill(255, 0, 0, 150);
  ellipse(x + 75, y + 50, 100, 100);
}

function drawExample3(x, y) {
  fill('black')
  rect(x,y-50,250,200)
  fill(255, 255, 0);
  arc(x + 50, y + 50, 100, 100, -PI/1.5, PI/1.5, PIE);
  fill(255, 0, 0);
  arc(x +190, y+25, 80, 80, PI, 0, PIE);
  rect(x + 150, y+25, 80, 80);
  fill(255);
  ellipse(x + 170, y + 20, 20, 20);
  ellipse(x + 210, y + 20, 20, 20);
  fill(0, 0, 255);
  ellipse(x + 170, y + 20, 10, 10);
  ellipse(x + 210, y + 20, 10, 10);
}

function drawExample4(x, y) {
  fill(0, 0, 150);
  rect(x, y, 150, 150);
  stroke('white')
  strokeWeight(2.5,0.0)
  fill(0, 255, 0);
  ellipse(x + 75, y + 75, 100, 100);
  fill(255, 0, 0); 
  
  beginShape();



  for (let i = 0; i < 5; i++) {
    let angle = TWO_PI * i / 5 - PI / 2;
    let vx = x + 75 + cos(angle) * 40;
    let vy = y + 75 + sin(angle) * 40;
    vertex(vx, vy);
    angle += TWO_PI / 10;
    vx = x + 75 + cos(angle) * 20;
    vy = y + 75 + sin(angle) * 20;
    vertex(vx, vy);
  }
  endShape(CLOSE);
}
