import {Color} from "./Color";

/**
 * Represents the colors.json
 */
export class ColorCollection {
    colors: {[key: string]: Color} = {}

    /**
     * Initialize colors from json data
     *
     * @param colors
     */
    initColors(colors:any):void {
        for(const colorId in colors) {
            this.colors[colorId] = new Color(colorId, colors[colorId].name, colors[colorId].palette, colors[colorId].materials);
        }
    }

    /**
     * Get color by id
     *
     * @param id
     */
    getColor(id:string):Color {
        return this.colors[id]
    }

    getAll():{[key: string]: Color} {
        return this.colors
    }
}