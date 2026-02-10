import { Ship } from "./Ship.js";

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

    render()
    {
        const p = this.p;

        p.fill(255)
        p.stroke(2)
        p.rect(this.x, this.y, this.size, this.size)

        if (this.ship)
        {
            p.fill(100)
            p.rect(this.x + (this.size - this.size / 1.5) / 2, this.y + (this.size - this.size / 1.5) / 2, this.size / 1.5, this.size / 1.5)
        }

        switch (this.state)
        {
            // Miss
            case "MISS":
                p.fill(200)
                p.ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, this.size / 2)
                break;
            // Hit
            case "HIT":
                p.fill(150, 50, 50)
                p.ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, this.size / 2)
                break;
        }
    }
}