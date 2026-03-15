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
 *   - 3/15 added preload function to load explosion frames from assets
 *******************************************************************************************/

import { GameManager } from "./GameManager.js";

const sketch = (p) => {
  let gameManager;

  const explosionFrames = [];
  // load explosion frame
  p.preload = () => {
    for (let i = 0; i < 7; i++) {
      explosionFrames.push(p.loadImage(`../../assets/sprites/explosion/${i+1}.png`));
    }
  };

  p.setup = async () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    // search the mode in the parameter of the URL
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    // console.log(mode);

    gameManager = new GameManager(p, mode, explosionFrames);
    await gameManager.init();
  };

  p.draw = () => {
    gameManager.render();
  };

  p.mousePressed = () => {
    gameManager.handleClick(p.mouseX, p.mouseY);
  };

  p.mouseMoved = () => {
    gameManager.handleMouseMove(p.mouseX, p.mouseY);
  };

  p.keyPressed = () => {
    gameManager.handleKeyPress(p.key);
  };
};

new p5(sketch);
