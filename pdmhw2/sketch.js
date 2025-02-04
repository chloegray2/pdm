let colors = [
  'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'brown', 'white', 'black'
];
let selectedColor = 'black';
let paletteWidth = 40;
let prevX, prevY;


function setup() {
  createCanvas(600, 400);
  background(225);
  drawPalette();
}

function draw() {
  if (mouseIsPressed){
    if (mouseX > paletteWidth){
      stroke(selectedColor);
      strokeWeight(5);
      if (prevX !== undefined && prevY !== undefined){
        line(prevX, prevY, mouseX, mouseY);
      }
      prevX = mouseX;
      prevY = mouseY;
    }
  } else {
    prevX = undefined;
    prevY = undefined;
  }
  drawPalette();
}
function drawPalette(){
  for (let i = 0; i < colors.length; i++){
    fill(colors[i]);
    rect(0, i * 40, paletteWidth, 40);
  }
}

function mousePressed() {
  if (mouseX < paletteWidth){
    let index = floor(mouseY / 40);
    if (index >= 0 && index < colors.length){
      selectedColor = colors[index];
    }
  }
}