import StructuralElement from './structural.ts';
import Bitmap from './bitmap.ts';

/**
 * Funkcja sprawdza czy podane współrzędne mieszczą się w obrazie
 * @param x x - owa współrzędna obrazu
 * @param y y - owa współrzędna obraz
 * @param bitmap obraz
 * @returns Czy współrzędne mieszczą się w obrazie
 */
export const inImage = (x: number, y: number, bitmap: Bitmap) => {
    return x >= 0 && y >= 0 && x < bitmap.width && y < bitmap.height;
}

/**
 * Wykonuje erozje obrazu
 * @param bitmap Obraz wejściowy
 * @param se Element strukturalny   
 * @returns Obraz po erozji
 */
const erode = (bitmap: Bitmap, se: StructuralElement) => {

    let cx = Math.floor(se.width / 2);
    let cy = Math.floor(se.height / 2);

    let result = new Bitmap(bitmap.width, bitmap.height);

    for(let i = 0; i < bitmap.width; i++) {
        for(let j = 0; j < bitmap.height; j++) {

            let min = 256;

            for(let si = 0; si < se.width; si++) {
                for(let sj = 0; sj < se.height; sj++) {

                    const px = i - (cx - si);
                    const py = j - (cy - sj);

                    if(inImage(px, py, bitmap) && se[si][sj]) {
                        const pixel = bitmap.getMono(px, py);
                        if(pixel < min) 
                            min = pixel;
                    }
                }
            }

            result.setMono(i, j, min);
        }
    }

    return result;
}

export default erode;