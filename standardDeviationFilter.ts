import Bitmap from './bitmap.ts';
import StructuralElement from './structural.ts';

import { normalize } from './normalize.ts';

/**
 * Funkcja sprawdza czy podane współrzędne są w granicach obrazu i zwraca 
 * originalne współrzędne lub odbicie lustrzane // Przydatne na krawędziach obrazu 
 * @param px x - owy element obrazu
 * @param py y - owy element obrazu
 * @param width szerokość obrazu
 * @param height wysokość obrazu
 * @returns para x, y
 */
const getIndex = (px: number, py: number, width: number, height: number) => {
    if(px < 0)
        px *= -1;
    if(py < 0)
        py *= -1;

    if(px >= width)
        px = width - (px - width) - 1;

    if(py >= height)
        py = height - (py - height) - 1;

    return [px, py];
}

/**
 * Wykonuje filtracje odchylenia standardowego maską pobraną od użytkownika
 * @param bitmap Obraz wejściowy
 * @returns Obraz po filtracji
 */
const filtration = (bitmap: Bitmap) => {
    const result = new Bitmap(bitmap.width, bitmap.height);
    const se = StructuralElement.fromUserInput();

    let cx = Math.floor(se.width / 2);
    let cy = Math.floor(se.height / 2);

    for(let i = 0; i < bitmap.width; i++) {
        for(let j = 0; j < bitmap.height; j++) {

            let sum = 0;
            let totalElements = se.width * se.height * 3;

            for(let si = 0; si < se.width; si++) {
                for(let sj = 0; sj < se.height; sj++) {
                    const [vPx, vPy] = getIndex(i - (cx - si), j - (cy - sj), bitmap.width, bitmap.height);

                    const pixel = bitmap.getPixel(vPx, vPy);

                    if(se[si][sj])
                        sum += (pixel.r + pixel.g + pixel.b);
                    else
                        totalElements -= 3;
                }
            }

            const mean = sum / totalElements;
            let temp = 0;

            for(let si = 0; si < se.width; si++) {
                for(let sj = 0; sj < se.height; sj++) {
                    const [vPx, vPy] = getIndex(i - (cx - si), j - (cy - sj), bitmap.width, bitmap.height);

                    const pixel = bitmap.getPixel(vPx, vPy);

                    if(se[si][sj]) 
                        temp += Math.pow(pixel.r - mean, 2) + Math.pow(pixel.g - mean, 2) + Math.pow(pixel.g - mean, 2);
                }
            }

            const standardDeviation = Math.floor(Math.sqrt(temp/totalElements));
            result.setMono(i, j, standardDeviation);
        }
    }

    const [min, max] = result.getMinMax();

    normalize(result, [[min, 0], [max, 255]]);

    return result;
}

export default filtration;