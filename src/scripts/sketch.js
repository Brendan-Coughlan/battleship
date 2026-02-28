/*******************************************************************************************
 * Program: sketch.js
 * Description:
 *   Main p5.js sketch file that initializes and runs the Battleship game.
 *   - Creates the canvas
 *   - Initializes the GameManager
 *   - Handles rendering, mouse, and keyboard input
 *
 * Inputs:
 *   - Mouse click coordinates for placing ships and firing
 *   - Mouse movement for ghost ship placement
 *   - Keyboard input for ship rotation or other controls
 *
 * Output:
 *   - Visual game board and UI rendering on canvas
 *
 * Collaborators:
 *   - Brendan Coughlan
 *   - Jiaxing Rong
 *
 * Creation Date: 2026-02-28
 * Revision Dates:
 *   - N/A
 *******************************************************************************************/

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
