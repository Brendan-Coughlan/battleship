import { Cell } from "./Cell.js";

export class Board
{
  constructor(p, x, y, boardSize, cellSize)
  {
    this.p = p;
    this.x = x;
    this.y = y;
    this.boardSize = boardSize;
    this.cellSize = cellSize;
    this.cells = [];

    let borderPixelSize = boardSize * cellSize;
    let startX = x - borderPixelSize / 2;
    let startY = y - borderPixelSize / 2;

    for (let col = 0; col < boardSize; col++)
    {
      this.cells[col] = [];
      for (let row = 0; row < boardSize; row++)
      {
        this.cells[col][row] = new Cell(p, col, row, startX + col * cellSize, startY + row * cellSize, cellSize);
      }
    }
  }

  draw()
  {
    const p = this.p;
    let borderPixelSize = this.boardSize * this.cellSize;
    let startX = this.x - borderPixelSize / 2;
    let startY = this.y - borderPixelSize / 2;

    for (let col = 0; col < this.boardSize; col++)
    {
      for (let row = 0; row < this.boardSize; row++)
      {
        this.cells[col][row].draw();
      }
    }

    p.push();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(this.cellSize * 0.35);
    p.fill(0);
    p.noStroke();

    // column labels (A, B, C...)
    for (let col = 0; col < this.boardSize; col++)
    {
      const label = String.fromCharCode(65 + col); // A = 65
      p.text(
        label,
        startX + col * this.cellSize + this.cellSize / 2,
        startY - this.cellSize * 0.4
      );
    }

    // row labels (1, 2, 3...)
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
}