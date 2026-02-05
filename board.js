class Board {
    constructor(boardSize, cellSize) {
        this.boardSize = boardSize;
        this.cellSize = cellSize;
    }

    draw() {
        fill(0, 0, 255)

        for (let x = 0; x < this.boardSize; x++) {
            for (let y = 0; y < this.boardSize; y++) {
                rect(
                    x * this.cellSize,
                    y * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
            }
        }
    }
}