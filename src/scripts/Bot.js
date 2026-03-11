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

  getRandomCell(board) {
    let randomCell = null;
    while (!randomCell) {
      const randomX = Math.floor(Math.random() * board.boardSize);
      const randomY = Math.floor(Math.random() * board.boardSize);
      if (board.cells[randomX][randomY].state === "EMPTY") {
        randomCell = board.cells[randomX][randomY];
      }
    }

    return randomCell;
  }

  getNextBestCell(opponentBoard, originalCell) {
    if (originalCell.col != 0 && opponentBoard.cells[originalCell.col - 1][originalCell.row].state === "HIT") {
      return opponentBoard.cells[originalCell.col - 1][originalCell.row];
    }
  }


  getFireLocation(opponentBoard) {
    let selectedCell = null;

    switch (this.difficulty) {
      case "EASY":
        selectedCell = this.getRandomCell(opponentBoard);
        break;
      case "MEDIUM":
        let targetCell = null;
        for (let col = 0; col < opponentBoard.boardSize; col++) {
          for (let row = 0; row < opponentBoard.boardSize; row++) {
            if (opponentBoard.cells[col][row].state === HIT && !opponentBoard.cells[col][row].ship.isSunk()) {
              targetCell = opponentBoard.cells[col][row];
              break;
            }
          }
        }

        if (targetCell) {
          const bestCell = getNextBestCell(opponentBoard, targetCell);
          if (bestCell) {
            selectedCell = bestCell;
            break;
          }
        }
        selectedCell = this.getRandomCell(opponentBoard);
        break;
      case "HARD":
        let found = false;
        for (let col = 0; col < opponentBoard.boardSize && !found; col++) {
          for (let row = 0; row < opponentBoard.boardSize; row++) {
            if (opponentBoard.cells[col][row].ship && opponentBoard.cells[col][row].state === "EMPTY") {
              const shipCell = opponentBoard.cells[col][row];
              selectedCell = shipCell;
              found = true;
              break;
            }
          }
        }
        break;
    }

    const selectedX = selectedCell.x + 1;
    const selectedY = selectedCell.y + 1;
    return { selectedX, selectedY };
  }
}
