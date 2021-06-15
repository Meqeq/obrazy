class StructuralElement extends Array<Array<number>> {
    public readonly width: number;
    public readonly height: number;

    constructor(width: number, height: number) {
        super();

        this.width = width;
        this.height = height;

        for(let i = 0; i < width; i++) {
            this.push((new Array(height).fill(0)));
        }
    }

    private bresenham(x0: number, y0: number, x1: number, y1: number) {
        let d, dx, dy, ai, bi, xi, yi;
        let x = x0, y = y0;

        if(x0 < x1) {
            xi = 1; dx = x1 - x0;
        } else {
            xi = -1; dx = x0 - x1;
        }

        if(y0 < y1) {
            yi = 1; dy = y1 - y0;
        } else {
            yi = -1; dy = y0 - y1;
        }

        this[x][y] = 1;
        

        if(dx > dy) {
            ai = (dy - dx) * 2;
            bi = dy * 2;
            d = bi - dx;

            while (x != x1) {
                if (d >= 0) {
                    x += xi; y += yi; d += ai;
                } else { 
                    d += bi; x += xi;
                }
                this[x][y] = 1; 
            }
        } else {
            ai = (dx - dy) * 2; 
            bi = dx * 2;
            d = bi - dy;

            while (y != y1) {
                if (d >= 0) {
                    x += xi; y += yi; d += ai;
                } else {
                    d += bi; y += yi;
                }
                this[x][y] = 1;
            }
        }
    }

    public print(content = true) {
        console.log("Wymiary: ", this.width, "x", this.height);
        if(content)
            for(let y = 0; y < this.height; y++) {
                let line = "";
                for(let x = 0; x < this.width; x++) {
                    if(this[x][y])
                        line += "1";
                    else
                        line += "0";
                }
                console.log(line);
            }
    }

    static line(length: number, angle: number) : StructuralElement {
        let x0 = 0;
        let y0 = 0;
        length -= 1;
        angle = angle % 180;

        let x = length * Math.cos(angle * Math.PI / 180);
        let y = length * Math.sin(angle * Math.PI / 180);
        let x1 = Math.ceil(x) % 2 ? Math.floor(x) : Math.ceil(x);
        let y1 = Math.ceil(y) % 2 ? Math.floor(y) : Math.ceil(y);

        const se = new StructuralElement(Math.abs(x0 - x1)+1, Math.abs(y0 - y1)+1);

        if(x1 < x0) {
            x0 -= x1; x1 = 0;
        }

        y0 = se.height - 1;
        y1 = y1*-1 + se.height - 1;

        se.bresenham(x0, y0, x1, y1);

        return se;
    }

    static square(size: number) : StructuralElement {
        const se = new StructuralElement(size, size);

        for(let i = 0; i < se.width; i++) {
            for(let j = 0; j < se.height; j++) {
                se[i][j] = 1;
            }
        }

        return se;
    }

    static fromUserInput() : StructuralElement {
        const input = prompt("Podaj wymiary maski (szer)x(wys)");

        if(!input)
            throw new Error("Podaj wymiary");
        
        const [width, height] = input.trim().split("x").map(val => Number(val));
    
        if(!(height % 2 && width % 2) || height < 3 || width < 3)
            throw new Error("Nieprawidłowe wymiary maski");
    
        const se = new StructuralElement(width, height);

        console.log("Podaj maskę");

        for(let j = 0; j < height; j++) {
            const row = prompt("");
            if(row) {
                const rowElements = row.trim().split(" ").map( value => {
                    if(value != "1" && value != "0")
                        throw new Error("Nieprawidłowe wartości maski");
                    return Number(value);
                });

                for(let i = 0; i < width; i++) {
                    se[i][j] = rowElements[i];
                }
            }
        }

        return se;
    }
}

export default StructuralElement;