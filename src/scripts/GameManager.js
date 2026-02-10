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

export class GameManager
{
  constructor(p)
  {
    this.p = p;
    this.currentPlayer = 1;
    this.totalShips = null;
    this.state = "INIT"; // INIT | SETUP | PLAY | GAME_OVER

    this.boards = {
      1: new Board(p, p.width / 2 - 400, p.height / 2, 10, 50),
      2: new Board(p, p.width / 2 + 400, p.height / 2, 10, 50),
    };

    this.shipsPlaced = {
      1: 0,
      2: 0
    };

    this.popup = popup;
    this.toast = toast;
  }

  // show popup in the beginning
  // userChoice is an object records user click yes or no
  // if click yes: {ok: true, value: x}
  // if click return: {ok: false, value: 1}
  async init()
  {
    const userChoice = await this.popup.render();

    if (!userChoice.ok)
    {
      this.state = "INIT";
      return;
    }

    this.totalShips = userChoice.value;
    this.state = "SETUP";
    this.setup();
  }

  setup()
  {

  }

  render()
  {
    const p = this.p;

    if (this.state === "INIT") return;

    p.background(255);
    this.boards[1].render()
    this.boards[2].render()
    switch (this.state)
    {
      case "SETUP":
        break;
      case "PLAY":
        this.renderTurnLabel();
        break;
      case "GAME_OVER":
        break;
    }
  }

  renderTurnLabel()
  {
    const p = this.p;
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(25);
    p.text(`Player ${this.currentPlayer}'s Turn`, p.width / 2, 50);
  }

  getOpponentBoard()
  {
    return this.currentPlayer === 1 ? this.boards[2] : this.boards[1];
  }

  nextTurn()
  {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  handleClick(x, y)
  {
    if (this.state === "SETUP")
    {
      this.handleSetupClick(x, y);
      return;
    }

    if (this.state === "PLAY")
    {
      this.handlePlayClick(x, y);
    }
  }

  handleSetupClick(x, y)
  {
    const board = this.boards[this.currentPlayer];
    const cell = board.getCellAt(x, y);
    if (!cell) return;

    let placed = board.placeShip(
      cell.col,
      cell.row,
      this.shipsPlaced[this.currentPlayer] + 1,
      "H"
    );

    if(!placed) return;

    this.shipsPlaced[this.currentPlayer]++;

    if (this.shipsPlaced[this.currentPlayer] >= this.totalShips)
    {
      if (this.currentPlayer === 1)
      {
        this.currentPlayer = 2;
        this.toast.render({ message: "Player 2 place ships", variant: "info" });
      } else
      {
        this.state = "PLAY";
        this.currentPlayer = 1;
        this.toast.render({ message: "Battle begins!", variant: "success" });
      }
    }
  }

  handlePlayClick(x, y)
  {
    const board = this.getOpponentBoard();
    const cell = board.getCellAt(x, y);
    if (!cell || cell.state !== "EMPTY") return;

    const isHit = cell.fire();

    this.toast.render({
      message: isHit ? "Hit!" : "Miss!",
      variant: isHit ? "success" : "danger"
    });

    if(cell.ship.isSunk()) {
        this.toast.render({ message: "Ship is sunk", variant: "success" });
    }

    this.nextTurn();
  }

}
