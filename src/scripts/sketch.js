import { Board } from "./Board.js";

const sketch = (p) => {
  let board;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    board = new Board(p, 10, 50);
  };

  p.draw = () => {
    p.background(255);
    board.draw();
  };
};

new p5(sketch);
