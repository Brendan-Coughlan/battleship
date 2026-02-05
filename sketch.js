let board;

function setup() {
  createCanvas(windowWidth, windowHeight);

  board = new Board(10, 50);
}

function draw() {
  background(255);
  board.draw()
}
