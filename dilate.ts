import StructuralElement from './structural.ts';
import Bitmap from './bitmap.ts';
import { inImage } from './erode.ts';

/**
 * Wykonuje dylację obrazu
 * @param bitmap Obraz wejściowy
 * @param se Element strukturalny
 * @param distance (Przydatne w mapie odległości) Gdy zostanie podana wartość funkcja wpiszę ją zamiast wyniku dylacji
 * @returns Obraz po dylacji
 */
const dilate = (bitmap: Bitmap, se: StructuralElement, distance?: number) => {

    let cx = Math.floor(se.width / 2);
    let cy = Math.floor(se.height / 2);

    let result = new Bitmap(bitmap.width, bitmap.height);

    for(let i = 0; i < bitmap.width; i++) {
        for(let j = 0; j < bitmap.height; j++) {

            let max = 0;

            for(let si = 0; si < se.width; si++) {
                for(let sj = 0; sj < se.height; sj++) {

                    const px = i - (cx - si);
                    const py = j - (cy - sj);

                    if(inImage(px, py, bitmap) && se[si][sj]) {
                        const pixel = bitmap.getMono(px, py);
                        if(pixel > max) 
                            max = pixel;
                    }
                }
            }

            if(distance && max != 0) {
                if(!bitmap.getLogic(i, j))
                    result.setMono(i, j, distance);
                else
                    result.setMono(i, j, bitmap.getMono(i, j));
            } else
                result.setMono(i, j, max);
        }
    }

    return result;
}

export default dilate;