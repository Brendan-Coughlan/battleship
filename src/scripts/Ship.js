/* =========================
   Ship
========================= */
export class Ship
{
  /**
   * Creates a ship with the given length.
   *
   * @param {number} length - The number of cells this ship occupies.
   */
  constructor(length)
  {
    this.length = length;
    this.hits = 0;

    this.cells = [];
  }

  /**
   * Registers a hit on the ship.
   *
   * Increases the internal hit counter by one.
   *
   * @returns {void}
   */
  hit()
  {
    this.hits++;
  }

  /**
   * Places the ship onto specific board cells.
   *
   * Each provided cell will reference this ship.
   *
   * @param {import("./Cell.js").Cell[]} cells - Cells that the ship will occupy.
   * @throws {Error} If the number of cells does not match ship length.
   * @returns {void}
   */
  placeOnCells(cells)
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
   * Determines whether the ship has been sunk.
   *
   * A ship is sunk when its hit count is
   * greater than or equal to its length.
   *
   * @returns {boolean} True if the ship is sunk.
   */
  isSunk()
  {
    return this.hits >= this.length;
  }
}