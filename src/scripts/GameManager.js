import { Board } from "./Board.js";
import { selNumWindow } from "./plugins/selNumWindow.js";
import { toastsWindow } from "./plugins/toastsWindow.js";

const popup = selNumWindow({
  title: "Number of Ships",
  message: "Select number of ships for each player",
  yesText: "Confirm",
  noText: "Cancel",
  min: 1,
  max: 5,
});

const toast = toastsWindow({
  position: "top-center",
  delay: 1000,
});

export class GameManager {
  constructor(p) {
    this.p = p;
    this.currentPlayer = 1;
    this.totalShips = null;
    this.state = "INIT"; // INIT | SETUP | PLAY | GAME_OVER

    this.boards = {
      1: new Board(p, p.width / 2 - 400, p.height / 2, 10, 50),
      2: new Board(p, p.width / 2 + 400, p.height / 2, 10, 50),
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
    this.state = "PLAY";
  }

  /**
   * render available ships for player to place on the board
   */
  renderAvailableShips() { }

  render() {
    const p = this.p;

    if (this.state === "INIT") return;

    p.background(255);
    this.boards[1].render()
    this.boards[2].render()
    switch (this.state) {
      case "SETUP":
        break;
      case "PLAY":
        this.renderTurnLabel();
        break;
      case "GAME_OVER":
        break;
    }
  }

  renderTurnLabel() {
    const p = this.p;
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(25);
    p.text(`Player ${this.currentPlayer}'s Turn`, p.width / 2, 50);
  }

  getOpponentBoard() {
    return this.currentPlayer === 1 ? this.boards[2] : this.boards[1];
  }

  nextTurn() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  handleClick(x, y) {
    if (this.state !== "PLAY") return;

    const board = this.getOpponentBoard();
    const cell = board.getCellAt(x, y);
    if (!cell || cell.state !== 0) return;

    cell.state = 1;

    // hit
    this.toast.render({ message: "Hit!", variant: "success" });
    // miss
    this.toast.render({ message: "Miss!", variant: "danger" });

    this.nextTurn();
  }
}
