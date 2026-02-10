export class Ship
{
  constructor(length)
  {
    this.length = length;
    this.hits = 0;
    this.cells = [];
  }

  hit()
  {
    this.hits++;
  }

  place(cells)
  {
    if (cells.length !== this.length)
    {
      throw new Error("Invalid ship placement");
    }

    this.cells = cells;
    for (const cell of cells)
    {
      cell.ship = this;
    }
  }

  /**
  * determine whether the ship is sunk
  * @returns true if the ship is sunk
  */
  isSunk()
  {
    return this.hits >= this.length;
  }
}
