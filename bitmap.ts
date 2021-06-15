import { BitmapBufferAPI, Decoder, Encoder } from "https://deno.land/x/bitmap/mod.ts";

export interface ColorPixel {
    r: number;
    g: number;
    b: number;
}

export type MonoPixel = number;
export type LogicPixel = boolean;

class Bitmap {
    private _width;
    private _height;
    private _data;

    get width() { return this._width; }
    get height() { return this._height; }

    constructor(width: number, height: number, data?: BitmapBufferAPI) {
        this._width = width;
        this._height = height;

        if(data) {
            this._data = data;
        } else {
            this._data = new BitmapBufferAPI(4 * width * height);
        }
    }

    public static async fromFile(path: string) {
        const data = await Deno.readFile(path);
        const decoder = Decoder(BitmapBufferAPI.from(data));

        return new Bitmap(decoder.width, decoder.height, decoder.data);
    }

    public copy() {
        return { ...this };
    }

    public getPixel(x: number, y: number) : ColorPixel {
        const pos = (y * this._width + x) * 4;

        return {
            r: this._data[pos + 3], 
            g: this._data[pos + 2], 
            b: this._data[pos + 1], 
        };
    } 

    public getMono(x: number, y: number) : MonoPixel {
        const pos = (y * this._width + x) * 4;

        return this._data[pos + 1];
    } 

    public getLogic(x: number, y: number) : LogicPixel {
        const pos = (y * this._width + x) * 4;

        return this._data[pos + 1] != 0;
    }

    public setPixel(x: number, y: number, pixel: ColorPixel) {
        const pos = (y * this._width + x) * 4;

        this._data[pos+1] = pixel.b;
        this._data[pos+2] = pixel.g;
        this._data[pos+3] = pixel.r;
    }

    public setMono(x: number, y: number, pixel: MonoPixel) {
        const pos = (y * this._width + x) * 4;

        this._data[pos+1] = pixel;
        this._data[pos+2] = pixel;
        this._data[pos+3] = pixel;
    }

    public setLogic(x: number, y: number, pixel: LogicPixel) {
        const pos = (y * this._width + x) * 4;

        this._data[pos+1] = pixel ? 255 : 0;
        this._data[pos+2] = pixel ? 255 : 0;
        this._data[pos+3] = pixel ? 255 : 0;
    }

    public async save(path: string) {
        const bitmap = Encoder({
            data: this._data,
            width: this.width,
            height: this.height
        });

        await Deno.writeFile(path, bitmap.data);
    }

    public and(b: Bitmap) : number {
        if(this.width != this.width || b.height != b.height)
            throw new Error("Różne rozmiary");

        let area = 0;

        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                if(this.getLogic(i, j) && b.getLogic(i, j))
                    area++;
                else
                    this.setLogic(i, j, false);
            }
        }

        return area;
    }

    public getMinMax() {
        let min = 256;
        let max = 0;

        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                const pixel = this.getMono(i, j);

                if(pixel < min)
                    min = pixel;

                if(pixel > max)
                    max = pixel;
            }
        }

        return [min, max];
    }
}

export default Bitmap;