/*******************************************************************************************
 * Program: Board.js
 * Description:
 *   Defines the Board class for the Battleship game, responsible for managing the grid of cells, ship placements, and rendering the game board.
 *  - Initializes a grid of Cell instances based on specified dimensions.
 *  - Provides methods for rendering the board, validating ship placements, and checking game state (e.g., all ships sunk).
 *  - Handles coordinate conversions between pixel space and grid indices.
 *
 * Inputs:
 *   - p5 instance for rendering
 *   - Board position and dimensions for initialization
 *   - Method parameters for ship placement and cell retrieval
 *
 * Output:
 *   - Rendered game board with grid and coordinate labels
 *   - Validated ship placements and updated cell states based on game actions
 *   - Status of ships (sunk or not) for game logic decisions
 *
 * Collaborators:
 *   - Brendan Coughlan
 *   - Jiaxing Rong
 *
 * Creation Date: 2026-02-28
 * Revision Dates:
 *   - N/A
 *******************************************************************************************/

import { Cell } from "./Cell.js";
import { CONFIG } from "./config.js";
import { Ship } from "./Ship.js";

/* =========================
   Board
========================= */
export class Board
{
  /**
   * Creates a new game board.
   *
   * @param {p5} p - p5 instance used for rendering.
   * @param {number} x - Center X position of the board (canvas space).
   * @param {number} y - Center Y position of the board (canvas space).
   * @param {number} boardSize - Number of cells per row/column (e.g., 10 for 10x10).
   * @param {number} cellSize - Pixel size of each cell.
   */
  constructor(p, x, y, boardSize, cellSize)
  {
    this.p = p;
    this.x = x;
    this.y = y;
    this.boardSize = boardSize;
    this.cellSize = cellSize;
    this.cells = [];
    this.ships = [];

    let borderPixelSize = boardSize * cellSize;
    let startX = x - borderPixelSize / 2;
    let startY = y - borderPixelSize / 2;

    // Initialize grid cells
    for (let col = 0; col < boardSize; col++)
    {
      this.cells[col] = [];

      for (let row = 0; row < boardSize; row++)
      {
        this.cells[col][row] = new Cell(
          p,
          col,
          row,
          startX + col * cellSize,
          startY + row * cellSize,
          cellSize
        );
      }
    }
  }

  /**
   * Renders the board grid and coordinate labels.
   *
   * @param {boolean} masked - If true, ships will not be rendered (used for opponent board).
   * @returns {void}
   */
  render(masked)
  {
    const p = this.p;

    let borderPixelSize = this.boardSize * this.cellSize;
    let startX = this.x - borderPixelSize / 2;
    let startY = this.y - borderPixelSize / 2;

    for (let col = 0; col < this.boardSize; col++)
    {
      for (let row = 0; row < this.boardSize; row++)
      {
        this.cells[col][row].render(masked);
      }
    }

    p.push();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(this.cellSize * 0.35);
    p.fill(CONFIG.colors.text);
    p.noStroke();

    // Column labels (A, B, C, ...)
    for (let col = 0; col < this.boardSize; col++)
    {
      const label = String.fromCharCode(65 + col);
      p.text(
        label,
        startX + col * this.cellSize + this.cellSize / 2,
        startY - this.cellSize * 0.4
      );
    }

    // Row labels (1, 2, 3, ...)
    for (let row = 0; row < this.boardSize; row++)
    {
      const label = row + 1;
      p.text(
        label,
        startX - this.cellSize * 0.4,
        startY + row * this.cellSize + this.cellSize / 2
      );
    }

    p.pop();
  }

  /**
   * Determines whether a ship can be placed at a given position.
   *
   * @param {number} col - Starting column index.
   * @param {number} row - Starting row index.
   * @param {number} length - Length of the ship.
   * @param {"N"|"S"|"E"|"W"} orientation - Direction of ship placement.
   * @returns {Cell[]|null} Array of valid cells if placement is allowed, otherwise null.
   */
  getValidPlacementCells(col, row, length, orientation)
  {
    const DIRECTIONS = {
      N: { dc: 0, dr: -1 },
      S: { dc: 0, dr: 1 },
      E: { dc: 1, dr: 0 },
      W: { dc: -1, dr: 0 },
    };

    const { dc, dr } = DIRECTIONS[orientation];
    const cells = [];

    for (let i = 0; i < length; i++)
    {
      const c = col + dc * i;
      const r = row + dr * i;

      if (
        c < 0 || c >= this.boardSize ||
        r < 0 || r >= this.boardSize
      ) return null;

      const cell = this.cells[c][r];
      if (cell.ship) return null;

      cells.push(cell);
    }

    return cells;
  }

  /**
   * Attempts to place a ship on the board.
   *
   * @param {number} col - Starting column index.
   * @param {number} row - Starting row index.
   * @param {number} length - Length of the ship.
   * @param {"N"|"S"|"E"|"W"} orientation - Direction of placement.
   * @returns {Ship|false} The created ship if successful, otherwise false.
   */
  placeShip(col, row, length, orientation)
  {
    const cells = this.getValidPlacementCells(col, row, length, orientation);
    if (!cells) return false;

    const ship = new Ship(length);
    ship.placeOnCells(cells);

    this.ships.push(ship);
    return ship;
  }

  /**
   * Returns the cell at given pixel coordinates.
   *
   * @param {number} px - Pixel X coordinate (canvas space).
   * @param {number} py - Pixel Y coordinate (canvas space).
   * @returns {Cell|null} Cell instance if inside board, otherwise null.
   */
  getCellAt(px, py)
  {
    const borderPixelSize = this.boardSize * this.cellSize;
    const startX = this.x - borderPixelSize / 2;
    const startY = this.y - borderPixelSize / 2;

    const col = Math.floor((px - startX) / this.cellSize);
    const row = Math.floor((py - startY) / this.cellSize);

    if (
      col >= 0 && col < this.boardSize &&
      row >= 0 && row < this.boardSize
    )
    {
      return this.cells[col][row];
    }

    return null;
  }

  /**
   * Checks whether all ships on this board have been sunk.
   *
   * @returns {boolean} True if every ship reports sunk.
   */
  allShipsSunk()
  {
    return this.ships.every(ship => ship.isSunk());
  }
}