export class Bot {
  constructor(player, difficulty) {
    this.player = player;
    this.difficulty = difficulty;
  }

  placeNextShip(length) {
    const directions = ["N", "E", "S", "W"];
    let placed = false;

    // loop until the bot place the ship successfully
    while (!placed) {
      const randomRow = Math.floor(Math.random() * this.player.board.boardSize);
      const randomCol = Math.floor(Math.random() * this.player.board.boardSize);

      const randomDirection =
        directions[Math.floor(Math.random() * directions.length)];

      this.player.setOrientation(randomDirection);

      const targetCell = this.player.board.cells[randomRow][randomCol];

      // Player class provides placeShipAt method with cell location and ship length parameters
      // return true if placed a ship successfully
      placed = this.player.placeShipAt(
        targetCell.x + 1,   // +1 to avoid the bot clicking the border pixel
        targetCell.y + 1,
        length,
      );
    }
  }

  getFireLocation(opponentBoard) {
    const randomCell = this.getRandomCell(opponentBoard);
    switch (this.difficulty) {
      case "EASY":
        return randomCell;
      case "MEDIUM":
        return randomCell;
      case "HARD":
        for (let col = 0; col < opponentBoard.boardSize; col++) {
          for (let row = 0; row < opponentBoard.boardSize; row++) {
            if (opponentBoard.cells[col][row].ship) {
              return opponentBoard.cells[col][row];
            }
          }
        }
    }
  }
}
