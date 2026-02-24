import { GameManager } from "./GameManager.js";

const sketch = (p) =>
{
  let gameManager;

  p.setup = async () =>
  {
    p.createCanvas(p.windowWidth, p.windowHeight);

    gameManager = new GameManager(p);
    await gameManager.init();
  };

  p.draw = () =>
  {
    gameManager.render();
  };

  p.mousePressed = () =>
  {
    gameManager.handleClick(p.mouseX, p.mouseY)
  };

  p.mouseMoved = () =>
  {
    gameManager.handleMouseMove(p.mouseX, p.mouseY);
  };

  p.keyPressed = () =>
  {
    gameManager.handleKeyPress(p.key)
  };
};

new p5(sketch);
