import Bitmap from './bitmap.ts';
import StructuralElement from './structural.ts';
import dilate from './dilate.ts';

import { normalize } from './normalize.ts';

/**
 * Funkcja zwraca mapę odległości geodezyjnej od zadanego przez
 * użytkownika punktu (x, y)
 * @param bitmap Obraz wejściowy
 * @returns Mapa odległości geodezyjnej od punktu
 */
const makeMap = (bitmap: Bitmap) => {
    const input = prompt("Podaj punkt (x,y)");

    if(!input)
        throw new Error("Nie podano punktu");

    const [x, y] = input.trim().split(",").map(val => Number(val));

    const mask = StructuralElement.square(3);
    mask[1][1] = 0;

    let marker = new Bitmap(bitmap.width, bitmap.height);

    marker.setMono(x, y, 255);


    let distance = 1;
    let prevArea = 0;
    let newArea = 1;

    while(prevArea != newArea) {
        marker = dilate(marker, mask, distance);

        prevArea = newArea;
        newArea = marker.and(bitmap);
        
        distance++;
    }

    const [min, max] = marker.getMinMax();

    normalize(marker, [[1,1], [max,255]]);

    return marker;
}

export default makeMap;