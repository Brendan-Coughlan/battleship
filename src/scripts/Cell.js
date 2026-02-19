import { CONFIG } from "./config.js";

export class Cell
{
    /**
     * Creates a new cell on the game board.
     * @param {object} p 
     * @param {number} col 
     * @param {number} row 
     * @param {number} x 
     * @param {number} y 
     * @param {number} size
     */
    constructor(p, col, row, x, y, size)
    {
        this.p = p;
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;
        this.size = size;

        this.ship = null;
        this.state = "EMPTY"; // EMPTY | HIT | MISS
    }

    /**
     * Fires at this cell. If it contains a ship, marks it as HIT and calls the ship's hit() method. Otherwise, marks it as MISS.
     * @returns {boolean} - True if a ship was hit, false otherwise
     */
    fire()
    {
        if (this.state !== "EMPTY")
        {
            return;
        }

        if (this.ship)
        {
            this.state = "HIT";
            this.ship.hit();
            return true;
        }
        else
        {
            this.state = "MISS";
            return false;
        }
    }

    /**
     * Renders the cell on the board. If masked is true, ships will not be rendered (used for opponent's board).
     * @param {boolean} masked - if true, ships will not be rendered (used for opponent's board)
     */
    render(masked)
    {
        const p = this.p;

        p.fill(CONFIG.colors.gridInner)
        p.stroke(CONFIG.colors.gridBorder)
        p.strokeWeight(2)
        p.rect(this.x, this.y, this.size, this.size)

        // Render ship if present and not masked
        if (this.ship && (!masked || this.ship.isSunk()))
        {
            p.fill(CONFIG.colors.ship)
            p.rect(this.x + (this.size - this.size / 1.5) / 2, this.y + (this.size - this.size / 1.5) / 2, this.size / 1.5, this.size / 1.5)
        }

        // Render hit/miss markers
        switch (this.state)
        {
            case "MISS":
                p.fill(CONFIG.colors.miss)
                p.ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, this.size / 2)
                break;
            case "HIT":
                p.fill(CONFIG.colors.hit)
                p.ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, this.size / 2)
                break;
        }
    }
}