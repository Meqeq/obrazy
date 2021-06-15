import Bitmap from './bitmap.ts';

import normalization from './normalize.ts';
import filtration from './standardDeviationFilter.ts';
import close from './close.ts';
import makeMap from './map.ts';

while(true) {
    try {
        console.log("Program do przekształceń obrazów");
        console.log("================================");
    
        const path = prompt("Podaj ścieżkę do pliku");
        
        console.log("Wybierz opcję");
    
        console.log("1) Normalizacja za pomocą krzywej");
        console.log("2) Filtracja odchylenia standardowego");
        console.log("3) Zamknięcie elementem linijnym");
        console.log("4) Mapa odległości geodezyjnej");
    
        const input = prompt("");

        if(!path)
            throw new Error("Nie podano ścieżki");

        let bitmap = await Bitmap.fromFile(path.trim());
    
        switch(input) {
            case "1":
                normalization(bitmap);
                break;
            case "2":
                bitmap = filtration(bitmap);
                break;
            case "3":
                bitmap = close(bitmap);
                break;
            case "4":
                bitmap = makeMap(bitmap);
                break;
            default:
                throw new Error("Nie wybrano opcji");
        }

        const outputPath = prompt("Wykonano przekształcenie\nPodaj ściężkę do pliku wynikowego");

        if(!outputPath)
            throw new Error("Nie podano ścieżki wyniku");

        await bitmap.save(outputPath);

    } catch(e) {
        console.log(e.message);
        break;
    }
}