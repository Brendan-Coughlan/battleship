export class Board {
  constructor(p, boardSize, cellSize) {
    this.p = p;
    this.boardSize = boardSize;
    this.cellSize = cellSize;
  }

  draw() {
    const p = this.p;
    p.fill(0, 0, 255);

    for (let x = 0; x < this.boardSize; x++) {
      for (let y = 0; y < this.boardSize; y++) {
        p.rect(
          x * this.cellSize,
          y * this.cellSize,
          this.cellSize,
          this.cellSize,
        );
      }
    }
  }
}
