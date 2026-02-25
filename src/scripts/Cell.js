import { CONFIG } from "./config.js";

/* =========================
   Cell
========================= */
export class Cell
{
    /**
     * Creates a new cell on the game board.
     *
     * @param {p5} p - p5 instance used for rendering.
     * @param {number} col - Column index in the grid.
     * @param {number} row - Row index in the grid.
     * @param {number} x - Pixel X position of the cell.
     * @param {number} y - Pixel Y position of the cell.
     * @param {number} size - Pixel width and height of the cell.
     */
    constructor(p, col, row, x, y, size)
    {
        this.p = p;
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;
        this.size = size;

        /** @type {import("./Ship.js").Ship | null} */
        this.ship = null;

        /** @type {"EMPTY" | "HIT" | "MISS"} */
        this.state = "EMPTY";
    }

    /**
     * Fires at this cell.
     *
     * If a ship is present:
     * - Marks the cell as HIT
     * - Notifies the ship that it was hit
     *
     * Otherwise:
     * - Marks the cell as MISS
     *
     * @returns {boolean} True if a ship was hit, otherwise false.
     */
    fire()
    {
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
     * Renders the cell on the board.
     *
     * If masked is true:
     * - Ships are hidden unless sunk.
     *
     * @param {boolean} masked - Whether ships should be hidden.
     * @returns {void}
     */
    render(masked)
    {
        const p = this.p;

        p.fill(CONFIG.colors.gridInner);
        p.stroke(CONFIG.colors.gridBorder);
        p.strokeWeight(2);
        p.rect(this.x, this.y, this.size, this.size);

        // Render ship if present and not masked
        if (this.ship && (!masked || this.ship.isSunk()))
        {
            p.fill(CONFIG.colors.ship);
            p.rect(
                this.x + (this.size - this.size / 1.5) / 2,
                this.y + (this.size - this.size / 1.5) / 2,
                this.size / 1.5,
                this.size / 1.5
            );
        }

        // Render hit/miss markers
        switch (this.state)
        {
            case "MISS":
                p.fill(CONFIG.colors.miss);
                p.ellipse(
                    this.x + this.size / 2,
                    this.y + this.size / 2,
                    this.size / 2,
                    this.size / 2
                );
                break;

            case "HIT":
                p.fill(CONFIG.colors.hit);
                p.ellipse(
                    this.x + this.size / 2,
                    this.y + this.size / 2,
                    this.size / 2,
                    this.size / 2
                );
                break;
        }
    }
}