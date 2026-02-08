import { Board } from "./Board.js";

export class GameManager {
  constructor(p) {
    this.p = p;
    this.currentPlayer = 1;
    this.state = "PLAY"; // SETUP | PLAY | GAME_OVER

    this.boards = {
      1: new Board(p, p.width / 2 - 400, p.height / 2, 10, 50),
      2: new Board(p, p.width / 2 + 400, p.height / 2, 10, 50),
    };
  }

  /**
   * render available ships for player to place on the board
   */
  renderAvailableShips() { }

  render() {
    const p = this.p;
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
    toast.render({ message: "Hit!", variant: "success" });
    // miss
    toast.render({ message: "Miss!", variant: "danger" });

    this.nextTurn();
  }
}
