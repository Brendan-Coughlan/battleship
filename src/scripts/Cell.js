import { CONFIG } from "./config.js";

export class Cell
{
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

    render(masked)
    {
        const p = this.p;

        p.fill(CONFIG.colors.gridInner)
        p.stroke(CONFIG.colors.gridBorder)
        p.strokeWeight(2)
        p.rect(this.x, this.y, this.size, this.size)

        if (this.ship && !masked)
        {
            p.fill(CONFIG.colors.ship)
            p.rect(this.x + (this.size - this.size / 1.5) / 2, this.y + (this.size - this.size / 1.5) / 2, this.size / 1.5, this.size / 1.5)
        }

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