import { Board } from "./Board.js";

const sketch = (p) =>
{
  let player_board;
  let opponent_board;

  p.setup = () =>
  {
    p.createCanvas(p.windowWidth, p.windowHeight);
    player_board = new Board(p, p.width / 2 - 400, p.height / 2, 10, 50);
    opponent_board = new Board(p, p.width / 2 + 400, p.height / 2, 10, 50);
  };

  p.draw = () =>
  {
    p.background(255);
    player_board.draw();
    opponent_board.draw();
  };

  p.mousePressed = () =>
  {
    const cell = opponent_board.getCellAt(p.mouseX, p.mouseY);

    if (cell)
    {
      cell.state = 1
    }
  };
};

new p5(sketch);
