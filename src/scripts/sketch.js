import { GameManager } from "./GameManager.js";
import { selNumWindow } from "./plugins/selNumWindow.js";

const sketch = (p) => {
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
  };

  p.draw = () => {
    // block game view until user chooses ships
    if (totalShips === null) {
      // return to the main page
      return;
    }

    gameManager.render();
  };

  p.mousePressed = () => {
    gameManager.handleClick(p.mouseX, p.mouseY)
  };
};

new p5(sketch);
