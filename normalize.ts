import Bitmap from './bitmap.ts';

interface Section {
    start: number;
    end: number;
    a: number;
    b: number;
}

/**
 * Na podstawie punktów (x,y) tworzy sekcje które zawierają początek i 
 * koniec oraz współczynniki funkcji liniowej według której wyliczana będzie znormalizowana wartość
 * @param input Tablica punktów (x,y)
 * @returns tablica sekcji
 */
const makeSections = (input: number[][]) : Section[] => {
    let result: Section[] = [];

    let prevX = 0;
    let prevY = 0;

    input.forEach(value => { // dla każdej pary punktów wyliczane są współczynniki

        const a = (prevY - value[1])/(prevX - value[0]);
        const b = prevY - a * prevX;

        result.push({
            start: prevX,
            end: value[0],
            a, b
        });

        prevX = value[0];
        prevY = value[1];
    });

    const a = (prevY - 255)/(prevX - 255);
    const b = prevY - a * prevX;

    result.push({
        start: prevX,
        end: 255,
        a, b
    });

    return result;
}

/**
 * Na podstawie wartości piksela szuka odpowiedniej sekcji i wylicza 
 * nową wartość używając współczynników funkcji liniowej w danej sekcji
 * @param value Wartość piksela
 * @param sections Tablica z sekcjami
 * @returns Znormalizowana wartość piksela
 */
const getNormalizedValue = (value: number, sections: Section[]) => {
    const section = sections.find(section => value >= section.start && value <= section.end);
    
    if(!section) {
        console.log("KEKEK", value);
        throw new Error("Wrong value");
    }
        
    
    return Math.floor(value * section.a + section.b);
}

/**
 * Normalizuje obraz według zadanej krzywej opisanej punktami
 * @param bitmap Obraz wejściowy
 * @param points Tablica punktów krzywej
 */
export const normalize = (bitmap: Bitmap, points: number[][]) => {
    const sections = makeSections(points);

    for(let i = 0; i < bitmap.width; i++) {
        for(let j = 0; j < bitmap.height; j++) {
            const pixel = bitmap.getPixel(i, j);

            pixel.r = getNormalizedValue(pixel.r, sections);
            pixel.g = getNormalizedValue(pixel.g, sections);
            pixel.b = getNormalizedValue(pixel.b, sections);

            bitmap.setPixel(i, j, pixel);
        }
    }
}


const normalization = async (bitmap: Bitmap) => {
    const input = prompt("Podaj punkty krzywej (x,y)");

    if(!input) 
        throw new Error("Podaj punkty (x,y)");

    const points = input.split(" ").map(value => value.split(",").map(value => {
        const res = Number(value);

        if(res < 0 || res > 255) 
            throw new Error("Niedozwolona wartość: " + res);

        return res;
    }));

    if(points.length < 3) 
        throw new Error("Podaj przynajmniej 3 punkty");

    normalize(bitmap, points);
}

export default normalization;