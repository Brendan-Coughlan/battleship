/*******************************************************************************************
 * Program: GameManager.js
 * Description:
 *   Central class for managing the Battleship game. Handles:
 *     - Game states (INIT, SETUP, PLAY, GAME_OVER)
 *     - Rendering of boards, labels, and UI elements
 *     - Player turns and input handling
 *     - Ship placement during setup
 *     - Firing on opponent's board during gameplay
 *     - Integration with popups, toasts, and timers
 *
 * Inputs:
 *   - Mouse click coordinates for placing ships and firing
 *   - Keyboard input (optional, e.g., for rotation)
 *
 * Output:
 *   - Visual game board rendering on canvas
 *   - Toast messages for hit/miss/sunk notifications
 *   - Popups for player turn confirmation and ship placement
 *
 * Collaborators:
 *   - Brendan Coughlan
 *   - Jiaxing Rong
 *
 * Creation Date: 2026-02-28
 * Revision Dates:
 *   - N/A
 *******************************************************************************************/

/* =========================
   Imports
========================= */
import { CONFIG } from "./config.js";
import { Board } from "./Board.js";
import { Player } from "./Player.js";
import { Timer } from "./Timer.js";

import { confirmWindow } from "./plugins/confirmWindow.js";
import { selNumWindow } from "./plugins/selNumWindow.js";
import { toastsWindow } from "./plugins/toastsWindow.js";

/* =========================
   UI Windows & Audio
========================= */
const popup = selNumWindow({
  title: "Number of Ships",
  message: "Select number of ships for each player",
  yesText: "Confirm",
  noText: "Return",
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

/* =========================
   Game Manager
========================= */
export class GameManager {
  /**
   * Creates the game manager and initializes core systems.
   * @param {object} p - The p5 instance used for rendering and input.
   */
  constructor(p) {
    this.p = p;
    this.music = null;
    this.sfx = null;

    this.currentPlayerID = 1;
    this.shipsPerPlayer = null;
    this.gameState = "INIT";
    this.isResolvingTurn = false;

    this.ghostCells = [];
    this.hoveredCell = null;

    this.timer = new Timer(
      p,
      p.width / 2,
      CONFIG.turnTimer.height,
      CONFIG.turnTimer.seconds,
    );

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

    this.players = {
      1: new Player(1, player1Board),
      2: new Player(2, player2Board),
    };

    this.popup = popup;
    this.toast = toast;
    this.nextTurnWindow = nextTurnWindow;
  }

  /* =========================
     Initialization
  ========================= */

  /**
   * Prompts user for setup configuration and starts setup phase.
   * @returns {Promise<void>}
   */
  async init() {
    this.music = this.p.loadSound(CONFIG.sfx.background, () => {
      this.music.setVolume(CONFIG.sfx.backgroundVolume);
      this.music.setLoop(true);
      this.startMusic();
    });

    this.sfx = {
      click: this.p.loadSound(CONFIG.sfx.click),
      hit: this.p.loadSound(CONFIG.sfx.hit),
      miss: this.p.loadSound(CONFIG.sfx.miss),
      sunk: this.p.loadSound(CONFIG.sfx.sunk),
    };
    this.sfx.click.setVolume(CONFIG.sfx.interactionVolume);
    this.sfx.hit.setVolume(CONFIG.sfx.interactionVolume);
    this.sfx.miss.setVolume(CONFIG.sfx.interactionVolume);
    this.sfx.sunk.setVolume(CONFIG.sfx.interactionVolume);

    // guard: min/max ships must be valid
    if (
      CONFIG.ships.minShips <= 0 ||
      CONFIG.ships.maxShips > CONFIG.board.size
    ) {
      throw new Error(
        "Invalid number of minnimum or/and maximum ships in configuration",
      );
    }

    const userChoice = await this.popup.render();

    if (!userChoice.ok) {
      this.gameState = "INIT";
      window.history.back();
      return;
    }

    this.shipsPerPlayer = userChoice.value;

    window.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        this.togglePause();
      }
    });

    this.gameState = "SETUP";
  }

  /* =========================
     Player Helpers
  ========================= */

  /**
   * Plays background music if not already playing.
   * @returns {void}
   */
  startMusic() {
    if (this.music && !this.music.isPlaying()) this.music.play();
  }

  /**
   * Stops background music if it's playing.
   * @returns {void}
   */
  stopMusic() {
    if (this.music) this.music.stop();
  }

  /**
   * Gets the current player instance.
   * @returns {Player}
   */
  getCurrentPlayer() {
    return this.players[this.currentPlayerID];
  }

  /**
   * Gets the opponent player instance.
   * @returns {Player}
   */
  getOpponentPlayer() {
    const opponentID = this.currentPlayerID === 1 ? 2 : 1;
    return this.players[opponentID];
  }

  /**
   * Switches the current player.
   * @returns {void}
   */
  nextTurn() {
    this.currentPlayerID = this.currentPlayerID === 1 ? 2 : 1;
  }

  /**
   * Checks if both players have placed all their ships.
   * @returns {boolean}
   */
  areBothPlayersReady() {
    return (
      Object.keys(this.players[1].ships).length === this.shipsPerPlayer &&
      Object.keys(this.players[2].ships).length === this.shipsPerPlayer
    );
  }

  /**
   * Starts the main gameplay phase after setup is complete.
   * @returns {void}
   */
  startGame() {
    this.gameState = "PLAY";
    this.currentPlayerID = 1;

    this.toast.render({
      message: "Battle begins!",
      variant: "success",
    });

    this.timer.reset(CONFIG.turnTimer.seconds);
    this.timer.resume();
  }

  /* =========================
     Ship Placement Helpers
  ========================= */

  /**
   * Determines the next ship length to place.
   * @returns {number|null}
   */
  getNextShipLength() {
    const player = this.getCurrentPlayer();

    for (let i = 1; i <= this.shipsPerPlayer; i++) {
      if (!player.ships[i]) return i;
    }

    return null;
  }

  /**
   * Updates ghost preview cells during placement.
   * @returns {void}
   */
  updateGhost() {
    if (!this.hoveredCell) {
      this.ghostCells = [];
      return;
    }

    const player = this.getCurrentPlayer();
    const board = player.board;
    const length = this.getNextShipLength();

    if (!length) {
      this.ghostCells = [];
      return;
    }

    const cells = board.getValidPlacementCells(
      this.hoveredCell.col,
      this.hoveredCell.row,
      length,
      player.getOrientation(),
    );

    this.ghostCells = cells || [];
  }

  /* =========================
   Rendering
========================= */

  /**
   * Renders the game based on the current state.
   * @returns {void}
   */
  render() {
    const p = this.p;

    if (this.gameState === "INIT") return;

    p.background(CONFIG.colors.background);

    const player1Board = this.players[1].board;
    const player2Board = this.players[2].board;

    player1Board.render(this.currentPlayerID == 2);
    player2Board.render(this.currentPlayerID == 1);

    switch (this.gameState) {
      case "SETUP":
        this.renderLabel(`Player ${this.currentPlayerID}'s Setup`);
        if (!this.isResolvingTurn) this.renderGhost();
        break;

      case "PLAY":
        this.renderLabel(`Player ${this.currentPlayerID}'s Turn`);
        this.timer.render();

        if (!this.isResolvingTurn && this.timer.isFinished()) {
          this.handleTimeout();
        }
        break;

      case "GAME_OVER":
        this.renderLabel("Game Over");
        break;
    }
  }

  /**
   * Renders ghost preview cells during ship placement.
   * @returns {void}
   */
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
   * Displays a label at the top of the screen.
   * @param {string} labelText - Text to display.
   * @returns {void}
   */
  renderLabel(labelText) {
    const p = this.p;

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(CONFIG.ui.labelTextSize);
    p.fill(CONFIG.colors.text);
    p.text(labelText, p.width / 2, CONFIG.ui.labelHeight);
  }

  /* =========================
     Input Handling
  ========================= */

  /**
   * Handles mouse movement during setup.
   * @param {number} x - Mouse x position.
   * @param {number} y - Mouse y position.
   * @returns {void}
   */
  handleMouseMove(x, y) {
    if (this.gameState !== "SETUP") return;

    const board = this.getCurrentPlayer().board;
    const cell = board.getCellAt(x, y);

    if (!cell) return;

    this.hoveredCell = cell;
    this.updateGhost();
  }

  /**
   * Handles keyboard input.
   * @param {string} key - Pressed key.
   * @returns {void}
   */
  handleKeyPress(key) {
    if (this.gameState != "SETUP") return;

    const pressedKey = key.toLowerCase();

    if (pressedKey === CONFIG.controls.deleteShip) {
      const p = this.p;
      const player = this.getCurrentPlayer();

      const deleted = player.deleteShipAt(p.mouseX, p.mouseY);

      if (deleted) {
        this.toast.render({ message: "Ship deleted", variant: "info" });
        // deletion changes board, so refresh ghost
        this.handleMouseMove(p.mouseX, p.mouseY);
      } else {
        this.toast.render({ message: "No ship to delete", variant: "danger" });
      }
    } else if (pressedKey === CONFIG.controls.rotateShip) {
      const player = this.getCurrentPlayer();
      player.rotateShip();
      this.updateGhost(); // refresh the ghost with new orientation
    }
  }

  /**
   * Routes click events to the correct phase handler.
   * @param {number} x - Mouse x position.
   * @param {number} y - Mouse y position.
   * @returns {void}
   */
  handleClick(x, y) {
    if (this.gameState === "GAME_OVER") return;

    this.sfx.click.play();

    if (this.gameState === "SETUP") {
      this.handleSetupClick(x, y);
      return;
    }

    if (this.gameState === "PLAY") {
      this.handlePlayClick(x, y);
      return;
    }
  }

  /* =========================
     Setup Phase
  ========================= */

  /**
   * Handles ship placement during setup.
   * @param {number} x - Mouse x position.
   * @param {number} y - Mouse y position.
   * @returns {Promise<void>}
   */
  async handleSetupClick(x, y) {
    if (this.isResolvingTurn) return;

    const player = this.getCurrentPlayer();
    const length = this.getNextShipLength();
    if (!length) return;

    const hasPlaced = player.placeShipAt(x, y, length);

    if (!hasPlaced) return;

    // reset ghost after placing
    this.ghostCells = [];
    this.hoveredCell = null;

    this.isResolvingTurn = true;

    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.ui.resolvingTurnDelay),
    );
    const res = await nextTurnWindow.render();

    if (res.ok) {
      this.isResolvingTurn = false;
      if (this.areBothPlayersReady()) {
        this.startGame();
      } else {
        this.nextTurn();
        this.ghostCells = [];
        this.hoveredCell = null;
        this.toast.render({
          message: `Player ${this.currentPlayerID} place ship`,
          variant: "info",
        });
      }
    } else {
      this.gameState = "GAME_OVER";
    }
  }

  /* =========================
     Play Phase
  ========================= */

  /**
   * Handles firing at the opponent's board.
   * @param {number} x - Mouse x position.
   * @param {number} y - Mouse y position.
   * @returns {Promise<void>}
   */
  async handlePlayClick(x, y) {
    if (this.isResolvingTurn) return;

    const opponentPlayer = this.getOpponentPlayer();
    const opponentBoard = opponentPlayer.board;

    const shot = opponentPlayer.fireAt(x, y);
    if (!shot.ok) return;

    this.isResolvingTurn = true;

    const { isHit, cell } = shot;
    
    this.toast.render({
      message: isHit ? "Hit!" : "Miss!",
      variant: isHit ? "success" : "danger",
    });

    if (isHit) this.sfx.hit.play();
    else this.sfx.miss.play();

    if (isHit && cell.ship.isSunk()) {
      this.toast.render({ message: "Ship is sunk", variant: "success" });
      this.sfx.sunk.play();

      if (opponentBoard.allShipsSunk()) {
        this.toast.render({
          message:
            this.currentPlayerID == 1 ? "Player 1 Wins!" : "Player 2 Wins!",
          variant: "success",
        });

        await this.handleGameOver(this.currentPlayerID);
        return;
      }
    }

    if (this.gameState !== "GAME_OVER") {
      this.timer.pause();

      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.ui.resolvingTurnDelay),
      );

      const res = await nextTurnWindow.render();

      if (res.ok) {
        this.isResolvingTurn = false;
        this.nextTurn();

        // reset timer for next player's turn
        this.timer.reset(CONFIG.turnTimer.seconds);
        this.timer.resume();
      } else {
        this.gameState = "GAME_OVER";
      }
    }
  }

  /* =========================
     Timer & Pause
  ========================= */

  /**
   * Handles timeout when a player runs out of time.
   * @returns {Promise<void>}
   */
  async handleTimeout() {
    if (this.isResolvingTurn) return;

    this.isResolvingTurn = true;
    this.timer.pause();

    this.toast.render({ message: "Time up!", variant: "danger" });

    const res = await this.nextTurnWindow.render();

    if (res.ok) {
      this.isResolvingTurn = false;
      this.nextTurn();
      this.timer.reset(CONFIG.turnTimer.seconds);
      this.timer.resume();
    } else {
      this.gameState = "GAME_OVER";
    }
  }

  /**
   * Toggles pause for the turn timer.
   * @returns {void}
   */
  togglePause() {
    if (this.gameState !== "PLAY") return;

    if (this.timer.running) {
      this.timer.pause();
      this.toast.render({ message: "Paused", variant: "info" });
    } else {
      this.timer.resume();
      this.toast.render({ message: "Resumed", variant: "success" });
    }
  }

  async handleGameOver(winner) {
    this.gameState = "GAME_OVER";
    this.stopMusic();
    this.timer.pause();
    // wait for 2s before redirect to game over page
    await new Promise((resolve) => setTimeout(resolve, 2000));
    window.location.href = `gameOver.html?winner=${encodeURIComponent(winner)}`;
  }
}
