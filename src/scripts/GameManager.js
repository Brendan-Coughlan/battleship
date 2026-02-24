import { CONFIG } from "./config.js";
import { Board } from "./Board.js";
import { Player } from "./Player.js";
import { confirmWindow } from "./plugins/confirmWindow.js";
import { selNumWindow } from "./plugins/selNumWindow.js";
import { toastsWindow } from "./plugins/toastsWindow.js";

const popup = selNumWindow({
  title: "Number of Ships",
  message: "Select number of ships for each player",
  yesText: "Confirm",
  noText: "Cancel",
  min: CONFIG.ships.minShips,
  max: CONFIG.ships.maxShips,
});

const toast = toastsWindow({
  position: "top-center",
  delay: CONFIG.ui.toastDelay,
});

const nextTurnWindow = confirmWindow({
  title: "Next turn",
  message:
    "Please hand over device to the next player, and let him/her confirm",
  yesText: "Confirm",
  noText: "Cancel",
  hidden: true,
  hideTargets: "canvas",
});

const missAudio = new Audio(CONFIG.sfk.miss);
const hitAudio = new Audio(CONFIG.sfk.hit);
const sunkAudio = new Audio(CONFIG.sfk.sunk);

export class GameManager {
  /**
   * Initializes the game manager with the provided p5 instance, sets up the game state, and creates the player boards and UI components.
   * @param {object} p - The p5 instance used for rendering and input handling
   */
  constructor(p) {
    this.p = p;
    this.currentPlayer = 1;
    this.totalShips = null;
    this.state = "INIT"; // INIT | SETUP | PLAY | GAME_OVER
    this.isResolvingTurn = false;
    this.ghostCells = [];
    this.hoveredCell = null;
    this.orientation = "N";

    // Create player boards, positioned side by side with a separation defined in the config
    const player1Board = new Board(
      p,
      p.width / 2 - CONFIG.board.separation,
      p.height / 2,
      CONFIG.board.size,
      CONFIG.board.cellSize,
    );
    const player2Board = new Board(
      p,
      p.width / 2 + CONFIG.board.separation,
      p.height / 2,
      CONFIG.board.size,
      CONFIG.board.cellSize,
    );

    this.boards = {
      1: player1Board,
      2: player2Board,
    };

    this.players = {
      1: new Player(1, player1Board),
      2: new Player(2, player2Board),
    };

    this.popup = popup;
    this.toast = toast;
    this.nextTurnWindow = nextTurnWindow;
  }

  /**
   * Initializes the game by prompting the user to select the number of ships for each player.
   * Sets the game state to "SETUP" if the user confirms, or keeps it at "INIT" if they cancel.
   * This method is called once at the start of the game to set up the initial conditions.
   * @async
   */
  async init() {
    const userChoice = await this.popup.render();

    if (!userChoice.ok) {
      this.state = "INIT";
      return;
    }

    this.totalShips = userChoice.value;

    this.state = "SETUP";
  }

  updateGhost() {
    if (!this.hoveredCell) {
      this.ghostCells = [];
      return;
    }

    const player = this.getCurrentPlayer();
    const length = player.shipsPlaced + 1;
    const board = this.boards[this.currentPlayer];

    const cells = board.getCellsForPlacement(
      this.hoveredCell.col,
      this.hoveredCell.row,
      length,
      this.orientation
    );

    this.ghostCells = cells || [];
  }


  rotateShip() {
    const directions = ["N", "E", "S", "W"];
    const currentIndex = directions.indexOf(this.orientation);

    this.orientation = directions[(currentIndex + 1) % directions.length];
    this.updateGhost()
  }

  deleteShip() {
    const p = this.p;

    const board = this.boards[this.currentPlayer]
    const x = p.mouseX;
    const y = p.mouseY;

    const cell = board.getCellAt(x, y);
    if (!cell) return;

    const shipCells = cell.ship.cells;
    for (const cell of shipCells) {
      cell.ship = null;
    }
  }

  /**
   * Renders the game state, including the boards and a label indicating the current phase of the game (setup, play, or game over).
   * The label at the top of the screen updates based on the game state to provide context to the players.
   */
  render() {
    const p = this.p;

    if (this.state === "INIT") return;

    p.background(CONFIG.colors.background);
    this.boards[1].render(this.currentPlayer == 2);
    this.boards[2].render(this.currentPlayer == 1);
    switch (this.state) {
      case "SETUP":
        this.renderLabel(`Player ${this.currentPlayer}'s Setup`);
        if (!this.isResolvingTurn) this.renderGhost();
        break;
      case "PLAY":
        this.renderLabel(`Player ${this.currentPlayer}'s Turn`);
        break;
      case "GAME_OVER":
        this.renderLabel("Game Over");
        break;
    }
  }

  renderGhost() {
    const p = this.p;

    if (this.ghostCells.length === 0) return;

    p.push();
    p.fill(CONFIG.colors.shipGhost);
    p.noStroke();

    for (const cell of this.ghostCells) {
      p.rect(cell.x, cell.y, cell.size, cell.size);
    }

    p.pop();
  }


  /**
   * Renders a label at the top of the screen indicating the current game state (e.g., which player's turn it is, or if the game is over).
   * @param {string} labelText - The text to display in the label
   */
  renderLabel(labelText) {
    const p = this.p;
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(CONFIG.ui.labelTextSize);
    p.fill(CONFIG.colors.text);
    p.text(labelText, p.width / 2, CONFIG.ui.labelHeight);
  }

  /**
   * Get opponent board when the game is in play, so the player can only fire on opponent's board
   * @returns {object} board instance
   */
  getOpponentBoard() {
    return this.currentPlayer === 1 ? this.boards[2] : this.boards[1];
  }

  /**
   * Gets current player instance
   * @returns {object} player instance
   */
  getCurrentPlayer() {
    return this.players[this.currentPlayer];
  }

  /**
   * Switches the current player to the other player.
   * Called at the end of a turn to hand control to the next player.
   */
  nextTurn() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  handleMouseMove(x, y) {
    if (this.state !== "SETUP") return;

    const board = this.boards[this.currentPlayer];
    const cell = board.getCellAt(x, y);

    this.hoveredCell = cell;

    this.updateGhost();
  }

  handleKeyPress(key) {
    if (this.state != "SETUP") return;

    const pressedKey = key.toLowerCase();
    if (pressedKey === CONFIG.controls.deleteShip) {
      this.deleteShip();
    }
    else if (pressedKey === CONFIG.controls.rotateShip) {
      this.rotateShip();
    }
  }

  /**
 * Routes mouse click input to the correct handler based on the current game state.
 * Prevents invalid interactions (e.g., clicking after game over or during the wrong phase).
 *
 * @param {number} x - X coordinate of the click
 * @param {number} y - Y coordinate of the click
 */
  handleClick(x, y) {
    if (this.state === "GAME_OVER") return;

    if (this.state === "SETUP") {
      this.handleSetupClick(x, y);
      return;
    }

    if (this.state === "PLAY") {
      this.handlePlayClick(x, y);
    }
  }

  /*
    * Handles ship placement during the setup phase.
    * Validates the click location and attempts to place a ship of the appropriate length.
    * Advances the game state to the next player's setup or starts the game if both players have placed their ships.
    * @param {number x - X coordinate of the click
    * @param {number} y - Y coordinate of the click
    */
  async handleSetupClick(x, y) {
    if (this.isResolvingTurn) return;

    const player = this.getCurrentPlayer();
    const board = this.boards[this.currentPlayer];
    const cell = board.getCellAt(x, y);
    if (!cell) return;

    const nextShipLength = player.shipsPlaced + 1;
    const placed = player.placeShip(cell.col, cell.row, nextShipLength, this.orientation);

    if (!placed) return;

    // Check if the current player has placed all their ships. If so, either switch to the next player's setup or start the game.
    if (player.shipsPlaced >= this.totalShips) {
      this.isResolvingTurn = true;
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.ui.resolvingTurnDelay),
      );
      const res = await nextTurnWindow.render();
      if (res.ok) {
        this.isResolvingTurn = false;
        if (this.currentPlayer === 1) {
          this.currentPlayer = 2;
          this.toast.render({ message: "Player 2 place ships", variant: "info" });
        } else {
          this.state = "PLAY";
          this.currentPlayer = 1;
          this.toast.render({ message: "Battle begins!", variant: "success" });
        }
      }
      else {
        this.state = "GAME_OVER";
      }
    }
  }

  /*
    * Handles firing at the opponent's board during the play phase.
    * Validates the click location and updates the game state based on hit/miss and sunk ships.
    * Implements a delay to allow players to see the result before switching turns.
    * @async
    * @param {number} x - X coordinate of the click
    * @param {number} y - Y coordinate of the click
    */
  async handlePlayClick(x, y) {
    if (this.isResolvingTurn) return;

    const board = this.getOpponentBoard();
    const cell = board.getCellAt(x, y);
    if (!cell || cell.state !== "EMPTY") return;

    this.isResolvingTurn = true;
    const isHit = cell.fire();

    this.toast.render({
      message: isHit ? "Hit!" : "Miss!",
      variant: isHit ? "success" : "danger",
    });

    if (isHit) {
      hitAudio.play();
    }
    else {
      missAudio.play();
    }

    // Check if the hit ship is sunk and if the game is over
    if (isHit && cell.ship.isSunk()) {
      this.toast.render({ message: "Ship is sunk", variant: "success" });
      sunkAudio.play();

      if (board.allShipsSunk()) {
        this.state = "GAME_OVER";
        return;
      }
    }

    // Delay before showing next turn prompt to allow players to see hit/miss result
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.ui.resolvingTurnDelay),
    );

    // Show next turn confirmation window
    // If the current player confirms, switch turns. If they cancel, end the game.
    if (this.state !== "GAME_OVER") {
      const res = await nextTurnWindow.render();
      if (res.ok) {
        this.isResolvingTurn = false;
        this.nextTurn();
      }
      else {
        this.state = "GAME_OVER";
      }
    }
  }
}
