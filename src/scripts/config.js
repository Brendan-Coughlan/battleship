/*******************************************************************************************
 * Program: config.js
 * Description:
 *   Configuration file for the Battleship game that defines constants and settings used throughout the application.
 *  - Board dimensions and cell sizes
 *  - Ship limits
 *  - UI settings for toasts and labels
 *  - Color schemes for different game elements
 *  - Control key mappings
 *
 * Inputs:
 *   - N/A
 *
 * Output:
 *   - Exported CONFIG object that can be imported and used in other modules for consistent settings and values
 *
 * Collaborators:
 *   - Brendan Coughlan
 *   - Jiaxing Rong
 *
 * Creation Date: 2026-02-28
 * Revision Dates:
 *   - N/A
 *******************************************************************************************/

export const CONFIG = Object.freeze({
  board: {
    size: 10,
    cellSize: 50,
    separation: 400
  },
  ships: {
    minShips: 1,
    maxShips: 5
  },
  ui: {
    toastDelay: 2000,
    resolvingTurnDelay: 2000,
    labelTextSize: 25,
    labelHeight: 50
  },
  colors: {
    background: 255,
    gridInner: 255,
    gridBorder: 0,
    hit: [150, 50, 50],
    miss: [200],
    ship: 100,
    shipGhost: [0, 150, 255, 120],
    text: 0
  },
  controls: {
    rotateShip: "r",
    deleteShip: "x"
  },
  sfk: {
    miss: "../sfx/miss.wav",
    hit: "../sfx/hit.wav",
    sunk: "../sfx/sunk.wav"
  },
  turnTimer: {
    seconds: 20,
    height: 450,
  }
});
