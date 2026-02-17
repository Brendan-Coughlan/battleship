import { Cell } from "./Cell.js";
import { CONFIG } from "./config.js";
import { Ship } from "./Ship.js";

export class Board
{
  /**
   * Creates a new game board.
   * @param {p5} p - p5 instance
   * @param {number} x - center x position of the board
   * @param {number} y - center y position of the board
   * @param {number} boardSize - number of cells in one dimension (e.g. 10 for a 10x10 board)
   * @param {number} cellSize - pixel size of each cell
   */
  constructor(p, x, y, boardSize, cellSize)
  {
    this.p = p;
    this.x = x;
    this.y = y;
    this.boardSize = boardSize;
    this.cellSize = cellSize;
    this.cells = [];
    this.ships = []

    let borderPixelSize = boardSize * cellSize;
    let startX = x - borderPixelSize / 2;
    let startY = y - borderPixelSize / 2;

    // Initialize cells
    for (let col = 0; col < boardSize; col++)
    {
      this.cells[col] = [];
      for (let row = 0; row < boardSize; row++)
      {
        this.cells[col][row] = new Cell(p, col, row, startX + col * cellSize, startY + row * cellSize, cellSize);
      }
    }
  }

  /**
   * Renders the board and its cells.
   * @param {boolean} masked - if true, ships will not be rendered (used for opponent's board)
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

    // Create column labels (A, B, C...)
    for (let col = 0; col < this.boardSize; col++)
    {
      const label = String.fromCharCode(65 + col); // A = 65
      p.text(
        label,
        startX + col * this.cellSize + this.cellSize / 2,
        startY - this.cellSize * 0.4
      );
    }

    // Create row labels (1, 2, 3...)
    for (let row = 0; row < this.boardSize; row++)
    {
      const label = row + 1;
      p.text(
        label,
        startX - this.cellSize * 0.4,
        startY + row * this.cellSize + this.cellSize / 2
      );
    }
  }

  /**
   * Checks if a ship can be placed at the specified location and orientation.
   * @param {*} col 
   * @param {*} row 
   * @param {*} length 
   * @param {*} orientation 
   * @returns 
   */
  getCellsForPlacement(col, row, length, orientation)
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
      )
      {
        return null;
      }

      const cell = this.cells[c][r];
      if (cell.ship) return null;

      cells.push(cell);
    }

    return cells;
  }

  /**
   * Attempts to place a ship on the board. Returns true if successful, false if placement is invalid.
   * @param {*} col 
   * @param {*} row 
   * @param {*} length 
   * @param {*} orientation 
   * @returns {boolean}
   */
  placeShip(col, row, length, orientation)
  {
    const cells = this.getCellsForPlacement(col, row, length, orientation);
    if (!cells) return false;

    const ship = new Ship(length);
    ship.place(cells);

    this.ships.push(ship);
    return true;
  }

  /**
   * Returns the cell at the given pixel coordinates, or null if out of bounds.
   * @param {*} px 
   * @param {*} py 
   * @returns {object|null} - The cell at the given coordinates, or null if out of bounds
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
   * Checks if all ships on the board have been sunk.
   * @returns {boolean} - True if all ships are sunk, false otherwise
   */
  allShipsSunk()
  {
    return this.ships.every(ship => ship.isSunk());
  }
}