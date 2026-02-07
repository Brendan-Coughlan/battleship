export class GameManager {
  constructor(p) {
    this.p = p;
    this.currentTurnNum = 1;
  }

  /**
   * render available ships for player to place on the board
   */
  renderAvailableShips() {}

  drawTurn() {
    const p = this.p;

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(25);
    if (this.currentTurnNum % 2 == 1) {
      p.text("Player 1's Turn", p.width / 2, 50);
    } else {
      p.text("Player 1's Turn", p.width / 2, 50);
    }
  }

  nextTurn() {
    this.currentTurnNum += 1;
  }
}
