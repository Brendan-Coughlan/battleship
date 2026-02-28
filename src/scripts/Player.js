/*******************************************************************************************
 * Program: Player.js
 * Description:
 *   Represents a Battleship game player.
 *   - Holds the player's board
 *   - Stores all ships placed by the player
 *   - Handles ship placement using current orientation
 *   - Handles ship rotation during setup
 *   - Supports firing at the board (when targeted by opponent)
 *   - Allows ship deletion during setup
 *   - Provides status checks (e.g., whether all ships are sunk)
 *
 * Inputs:
 *   - Board instance to operate on
 *   - Mouse coordinates for ship placement, deletion, and firing
 *   - Ship length for placement
 *
 * Output:
 *   - Boolean results for placement, firing, and deletion actions
 *   - Ship and board state updates
 *   - Ship status information (all sunk or not)
 *
 * Collaborators:
 *   - Brendan Coughlan
 *   - Jiaxing Rong
 *
 * Creation Date: 2026-02-28
 * Revision Dates:
 *   - 2/28/2026 Updated to encapsulate orientation, firing, and deletion logic
 *******************************************************************************************/

/* =========================
   Player
========================= */
export class Player {
  /**
   * Creates a player instance.
   * @param {number} id - Unique player ID (typically 1 or 2).
   * @param {Board} board - The player's board instance.
   */
  constructor(id, board) {
    this.id = id;
    this.board = board;

    this.ships = {};

    this.orientation = "N";
  }

  /**
   * Place a ship using canvas coordinates.
   * @param {number} x
   * @param {number} y
   * @param {number} length
   * @returns {boolean} true if placed successfully
   */
  placeShipAt(x, y, length) {
    const cell = this.board.getCellAt(x, y);
    if (!cell) return false;

    const placedShip = this.board.placeShip(
      cell.col,
      cell.row,
      length,
      this.orientation,
    );

    if (!placedShip) return false;

    this.ships[length] = placedShip;
    return true;
  }

  /**
   * Fires at this player's board using canvas coordinates.
   * @param {number} x
   * @param {number} y
   * @returns {{ ok: boolean, isHit?: boolean, cell?: any }}
   */
  fireAt(x, y) {
    const cell = this.board.getCellAt(x, y);
    if (!cell) return { ok: false };
    if (cell.state !== "EMPTY") return { ok: false };

    const isHit = cell.fire(); // your Cell.fire() already returns hit/miss
    return { ok: true, isHit, cell };
  }

  /**
   * Deletes a ship at given coordinates.
   * @returns {boolean} True if a ship was deleted.
   */
  deleteShipAt(x, y) {
    const cell = this.board.getCellAt(x, y);

    if (!cell || !cell.ship) return false;

    const ship = cell.ship;
    const shipCells = ship.cells || [];

    for (const c of shipCells) {
      c.ship = null;
    }

    const len = shipCells.length;
    if (len in this.ships) {
      delete this.ships[len];
    }
    return true;
  }

  /**
   * Rotates the ships orientation when placing
   */
  rotateShip() {
    const directions = ["N", "E", "S", "W"];
    const idx = directions.indexOf(this.orientation);
    this.orientation = directions[(idx + 1) % directions.length];
  }

  /**
   * Get current ship direction
   * @returns {string} "N", "E", "S", "W"
   */
  getOrientation() {
    return this.orientation;
  }

  /**
   * Retrieves a cell from the player's board.
   *
   * @param {number} x - X coordinate in canvas space.
   * @param {number} y - Y coordinate in canvas space.
   * @returns {any} The board cell at the specified position.
   */
  getCellAt(x, y) {
    return this.board.getCellAt(x, y);
  }

  /**
   * Checks if all ships belonging to this player are sunk.
   *
   * @returns {boolean} True if all ships are destroyed.
   */
  allShipsSunk() {
    return this.board.allShipsSunk();
  }
}
