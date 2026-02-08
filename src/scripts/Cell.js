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

        /*
        Cell States:
        0 = Empty
        1 = Miss
        2 = Hit 
        */
        this.state = 0;
    }

    render()
    {
        const p = this.p;

        p.fill(255)
        p.stroke(2)
        p.rect(this.x, this.y, this.size, this.size)

        switch (this.state)
        {
            // Miss
            case 1:
                p.fill(200)
                p.ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, this.size / 2)
                break;
            // Hit
            case 2:
                p.fill(150, 50, 50)
                p.ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, this.size / 2)
                break;
        }
    }
}