export class Player {
  /**
   * @param {number} id player ID
   * @param {Board} board the player's own board
   */
  constructor(id, board) {
    this.id = id;
    this.board = board;
    this.shipsPlaced = 0;
  }

  /**
   * Place a ship on player's own board.
   * @param {number} col
   * @param {number} row
   * @param {number} shipLength the length of the ship
   * @param {"H"|"V"} direction the direction of the ship
   * @returns {boolean} placed
   */
  placeShip(col, row, shipLength, direction = "H") {
    const placed = this.board.placeShip(col, row, shipLength, direction);
    if (placed) this.shipsPlaced++;
    return placed;
  }

  /**
   * Get a specific cell on player's board
   * @param {*} x
   * @param {*} y
   * @returns
   */
  getCellAt(x, y) {
    return this.board.getCellAt(x, y);
  }

  /**
   * Check if all this player's ships are sunk (uses board method)
   */
  allShipsSunk() {
    return this.board.allShipsSunk();
  }
}
