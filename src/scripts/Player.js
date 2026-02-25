/* =========================
   Player
========================= */
export class Player
{
  /**
   * Creates a player instance.
   * @param {number} id - Unique player ID (typically 1 or 2).
   * @param {Board} board - The player's board instance.
   */
  constructor(id, board)
  {
    this.id = id;
    this.board = board;

    this.ships = {};
  }

  /**
   * Attempts to place a ship on the player's board.
   *
   * Delegates placement validation to the board.
   * If successful, the ship is stored in the player's ship collection.
   *
   * @param {number} col - Column index on the board grid.
   * @param {number} row - Row index on the board grid.
   * @param {number} length - Length of the ship.
   * @param {"N"|"E"|"S"|"W"} orientation - Direction the ship faces.
   * @returns {boolean} True if the ship was successfully placed.
   */
  placeShip(col, row, length, orientation)
  {
    const placedShip = this.board.placeShip(col, row, length, orientation);
    if (!placedShip) return false;

    this.ships[length] = placedShip;
    return true;
  }

  /**
   * Retrieves a cell from the player's board.
   *
   * @param {number} x - X coordinate in canvas space.
   * @param {number} y - Y coordinate in canvas space.
   * @returns {any} The board cell at the specified position.
   */
  getCellAt(x, y)
  {
    return this.board.getCellAt(x, y);
  }

  /**
   * Checks if all ships belonging to this player are sunk.
   *
   * @returns {boolean} True if all ships are destroyed.
   */
  allShipsSunk()
  {
    return this.board.allShipsSunk();
  }
}