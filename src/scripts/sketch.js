import { Board } from "./Board.js";
import { GameManager } from "./GameManager.js";
import { selNumWindow } from "./plugins/selNumWindow.js";

const sketch = (p) => {
  let playerBoard1;
  let playerBoard2;
  let gameManager;

  let totalShips = null;

  const popup = selNumWindow({
    title: "Number of Ships",
    message: "Select number of ships for each player",
    yesText: "Yes",
    noText: "Return",
    min: 1,
    max: 5,
  });

  p.setup = async () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    // show popup in the beginning
    // userChoice is an object records user click yes or no
    // if click yes: {ok: true, value: x}
    // if click return: {ok: false, value: 1}
    const userChoice = await popup.render();

    if (userChoice.ok) {
      totalShips = userChoice.value;
    } else {
      totalShips = null;
    }

    gameManager = new GameManager(p);
    playerBoard1 = new Board(p, p.width / 2 - 400, p.height / 2, 10, 50);
    playerBoard2 = new Board(p, p.width / 2 + 400, p.height / 2, 10, 50);
  };

  p.draw = () => {
    // block game view until user chooses ships
    if (totalShips === null) {
      // return to the main page
      return;
    }

    p.background(255);
    playerBoard1.draw();
    playerBoard2.draw();
    gameManager.drawTurn();
  };

  p.mousePressed = () => {
    // block interaction until ships chosen
    if (totalShips === null) return;

    const cell = playerBoard2.getCellAt(p.mouseX, p.mouseY);
    if (cell) cell.state = 1;
  };
};

new p5(sketch);
