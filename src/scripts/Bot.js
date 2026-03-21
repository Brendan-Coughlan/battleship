export class Bot
{
  constructor(player, difficulty)
  {
    this.player = player;
    this.difficulty = difficulty;
  }

  getSmartTarget(board)
  {
    const hits = [];

    // Collect all valid HIT cells (not sunk)
    for (let col = 0; col < board.boardSize; col++)
    {
      for (let row = 0; row < board.boardSize; row++)
      {
        const cell = board.cells[col][row];
        if (cell.state === "HIT" && !cell.ship.isSunk())
        {
          hits.push(cell);
        }
      }
    }

    if (hits.length === 0) return null;

    // Try to detect direction (horizontal or vertical)
    if (hits.length >= 2)
    {
      for (let i = 0; i < hits.length; i++)
      {
        for (let j = i + 1; j < hits.length; j++)
        {
          const a = hits[i];
          const b = hits[j];

          // SAME ROW → horizontal ship
          if (a.row === b.row)
          {
            const row = a.row;
            const cols = hits
              .filter(c => c.row === row)
              .map(c => c.col)
              .sort((a, b) => a - b);

            const left = cols[0] - 1;
            const right = cols[cols.length - 1] + 1;

            if (left >= 0)
            {
              const cell = board.cells[left][row];
              if (cell.state === "EMPTY") return cell;
            }

            if (right < board.boardSize)
            {
              const cell = board.cells[right][row];
              if (cell.state === "EMPTY") return cell;
            }
          }

          // SAME COLUMN → vertical ship
          if (a.col === b.col)
          {
            const col = a.col;
            const rows = hits
              .filter(c => c.col === col)
              .map(c => c.row)
              .sort((a, b) => a - b);

            const up = rows[0] - 1;
            const down = rows[rows.length - 1] + 1;

            if (up >= 0)
            {
              const cell = board.cells[col][up];
              if (cell.state === "EMPTY") return cell;
            }

            if (down < board.boardSize)
            {
              const cell = board.cells[col][down];
              if (cell.state === "EMPTY") return cell;
            }
          }
        }
      }
    }

    // Fallback: just probe around first hit
    return this.getNextBestCell(board, hits[0]);
  }

  placeNextShip(length)
  {
    const directions = ["N", "E", "S", "W"];
    let placed = false;

    // loop until the bot place the ship successfully
    while (!placed)
    {
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

  getRandomCell(board)
  {
    let randomCell = null;
    while (!randomCell)
    {
      const randomX = Math.floor(Math.random() * board.boardSize);
      const randomY = Math.floor(Math.random() * board.boardSize);
      if (board.cells[randomX][randomY].state === "EMPTY")
      {
        randomCell = board.cells[randomX][randomY];
      }
    }

    return randomCell;
  }

  getNextBestCell(board, cell)
  {
    const directions = [
      [0, -1], // N
      [1, 0],  // E
      [0, 1],  // S
      [-1, 0], // W
    ];

    for (const [dx, dy] of directions)
    {
      const newCol = cell.col + dx;
      const newRow = cell.row + dy;

      if (
        newCol >= 0 &&
        newCol < board.boardSize &&
        newRow >= 0 &&
        newRow < board.boardSize
      )
      {
        const nextCell = board.cells[newCol][newRow];

        if (nextCell.state === "EMPTY")
        {
          return nextCell;
        }
      }
    }

    return null;
  }


  getFireLocation(opponentBoard)
  {
    let selectedCell = null;

    switch (this.difficulty)
    {
      case "EASY":
        selectedCell = this.getRandomCell(opponentBoard);
        break;
      case "MEDIUM":
        // 25% chance the bot uses their powerup
        const powerupChance = Math.random()
        if (powerupChance <= 0.25) this.usePowerup();

        const smartCell = this.getSmartTarget(opponentBoard);

        if (smartCell)
        {
          selectedCell = smartCell;
        } else
        {
          selectedCell = this.getRandomCell(opponentBoard);
        }
        break;
      case "HARD":
        this.usePowerup();
        let found = false;
        for (let col = 0; col < opponentBoard.boardSize && !found; col++)
        {
          for (let row = 0; row < opponentBoard.boardSize; row++)
          {
            if (opponentBoard.cells[col][row].ship && opponentBoard.cells[col][row].state === "EMPTY")
            {
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

  usePowerup()
  {
    if (!this.player.has_powerup) return;

    this.player.powerup_active = true;
    this.player.has_powerup = false;
  }
}
