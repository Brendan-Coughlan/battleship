import { Ship } from "./Ship";

class Player {
  constructor(totalShips, shipColor) {
    this.totalShips = totalShips;
    // in the beginning of the game, each player get different ship types based on total ships
    this.availableShips = [];
    for (let i = 0; i < totalShips; i++) {
      this.availableShips.push(new Ship(i + 1, "black"));
    }

    this.remainingShips = totalShips;
  }
}

export { Player };
