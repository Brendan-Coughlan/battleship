export class Bot {
  constructor(player, difficulty) {
    this.player = player;
    this.difficulty = difficulty;
  }

  getRandomCell(board) {
    const randomX = Math.floor(Math.random() * board.boardSize);
    const randomY = Math.floor(Math.random() * board.boardSize);
    const randomCell = board.cells[randomX][randomY];

    return randomCell;
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

  placeNextShip(length) {
    const player = this.player;
    const board = this.player.board;

    let hasPlaced = false;
    while (!hasPlaced) {
      const randomX = Math.floor(Math.random() * board.boardSize);
      const randomY = Math.floor(Math.random() * board.boardSize);

      const orientations = ["N", "S", "E", "W"]
      const randomOrientation = orientations[Math.floor(Math.random() * orientations.length)]
      player.orientation = randomOrientation;

      hasPlaced = player.placeShipAt(randomX, randomY, length);
    }
  }
}