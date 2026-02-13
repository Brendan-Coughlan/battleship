export class Ship
{
  /**
   * create a ship with the given length
   * @param {number} length - the length of the ship
   */
  constructor(length)
  {
    this.length = length;
    this.hits = 0;
    this.cells = [];
  }

  /**
   * register a hit on the ship
   */
  hit()
  {
    this.hits++;
  }

  /**
   * place the ship on the board by assigning it to the given cells
   * @param {Cell[]} cells - the cells to place the ship on
   */
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
  * @returns {boolean} true if the ship is sunk
  */
  isSunk()
  {
    return this.hits >= this.length;
  }
}
