import Bitmap from './bitmap.ts';
import StructuralElement from './structural.ts';
import dilate from './dilate.ts';
import erode from './erode.ts';

/**
 * Funkcja wykonuje zamknięcie elementem linijnym o
 * parametrach pobranych od użytkownika
 * @param bitmap Obraz wejściowy
 * @returns Obraz po zamknięciu
 */
const close = (bitmap: Bitmap) => {
    let input = prompt("Podaj długość");

    if(!input)
        throw new Error("Nie podano długości");

    const length = Number(input);

    input = prompt("Podaj kąt nachylenia (deg)");

    if(!input)
        throw new Error("Nie podano kąta");

    const angle = Number(input);

    const se = StructuralElement.line(length, angle);

    console.log(" ");
    se.print();
    console.log(" ");

    let result = dilate(bitmap, se);
    result = erode(result, se);

    return result;
}

export default close;