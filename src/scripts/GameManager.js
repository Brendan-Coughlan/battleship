import { CONFIG } from "./config.js";
import { Board } from "./Board.js";
import { Player } from "./Player.js";
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

export class GameManager {
  constructor(p) {
    this.p = p;
    this.currentPlayer = 1;
    this.totalShips = null;
    this.state = "INIT"; // INIT | SETUP | PLAY | GAME_OVER

    const player1Board = new Board(p, p.width / 2 - CONFIG.board.separation, p.height / 2, CONFIG.board.size, CONFIG.board.cellSize);
    const player2Board = new Board(p, p.width / 2 + CONFIG.board.separation, p.height / 2, CONFIG.board.size, CONFIG.board.cellSize);

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
  }

  // show popup in the beginning
  // userChoice is an object records user click yes or no
  // if click yes: {ok: true, value: x}
  // if click return: {ok: false, value: 1}
  async init() {
    const userChoice = await this.popup.render();

    if (!userChoice.ok) {
      this.state = "INIT";
      return;
    }

    this.totalShips = userChoice.value;
    this.state = "SETUP";
    this.setup();
  }

  setup() {}

  render() {
    const p = this.p;

    if (this.state === "INIT") return;

    p.background(CONFIG.colors.background);
    this.boards[1].render(this.currentPlayer == 2);
    this.boards[2].render(this.currentPlayer == 1);
    switch (this.state) {
      case "SETUP":
        this.renderLabel(`Player ${this.currentPlayer}'s Setup`);
        break;
      case "PLAY":
        this.renderLabel(`Player ${this.currentPlayer}'s Turn`);
        break;
      case "GAME_OVER":
        this.renderLabel("Game Over");
        break;
    }
  }

  renderLabel(labelText) {
    const p = this.p;
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(CONFIG.ui.labelTextSize);
    p.fill(CONFIG.colors.text)
    p.text(labelText, p.width / 2, CONFIG.ui.labelHeight);
  }

  getOpponentBoard() {
    return this.currentPlayer === 1 ? this.boards[2] : this.boards[1];
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayer];
  }

  nextTurn() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

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

  handleSetupClick(x, y) {
    const player = this.getCurrentPlayer();
    const board = this.boards[this.currentPlayer];
    const cell = board.getCellAt(x, y);
    if (!cell) return;

    // let placed = board.placeShip(
    //   cell.col,
    //   cell.row,
    //   this.shipsPlaced[this.currentPlayer] + 1,
    //   "H",
    // );
    const shipId = player.shipsPlaced + 1;
    const placed = player.placeShip(cell.col, cell.row, shipId, "H");

    if (!placed) return;

    // this.shipsPlaced[this.currentPlayer]++;

    if (player.shipsPlaced >= this.totalShips) {
      if (this.currentPlayer === 1) {
        this.currentPlayer = 2;
        this.toast.render({ message: "Player 2 place ships", variant: "info" });
      } else {
        this.state = "PLAY";
        this.currentPlayer = 1;
        this.toast.render({ message: "Battle begins!", variant: "success" });
      }
    }
  }

  handlePlayClick(x, y) {
    const board = this.getOpponentBoard();
    const cell = board.getCellAt(x, y);
    if (!cell || cell.state !== "EMPTY") return;

    const isHit = cell.fire();

    this.toast.render({
      message: isHit ? "Hit!" : "Miss!",
      variant: isHit ? "success" : "danger",
    });

    if (isHit && cell.ship.isSunk()) {
      this.toast.render({ message: "Ship is sunk", variant: "success" });

      if (board.allShipsSunk()) {
        this.state = "GAME_OVER";
        return;
      }
    }

    this.nextTurn();
  }
}
