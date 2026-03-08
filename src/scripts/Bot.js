export class Bot {
    constructor(player, difficulty) {
        this.player = player;
        this.difficulty = difficulty;
    }

    getFireLocation(opponentBoard) {
        switch (this.difficulty) {
            case "EASY":
                const randomX = Math.floor(Math.random() * opponentBoard.boardSize);
                const randomY = Math.floor(Math.random() * opponentBoard.boardSize);
                const randomCell = opponentBoard.cells[randomX][randomY];
                return randomCell;
            case "MEDIUM":
                break;
            case "HARD":
                break;
        }
    }
}