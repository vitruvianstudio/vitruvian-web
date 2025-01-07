import {Item} from "./Item";
import {Color} from "./Color";

export class ItemColors {
    item: Item
    colors: {[key:string]: string} = {}
    originalColors: {[key:string]: string} = {}
    currentColors: {[key:string]: string} = {}

    constructor(item:Item) {
        this.item = item
    }

    //addColor(key:string, color:ItemColor) {
    addColor(material:string, color:string) {
        this.originalColors[material] = color
        this.colors[material] = color
        this.currentColors[material] = this.find(color)?.id as string
    }

    get(material:string):string {
        return this.colors[material]
    }

    set(material:string, color:string) {
        this.colors[material] = color
    }

    getOriginal(material:string):string {
        return this.originalColors[material]
    }

    getCurrent(material:string):string {
        return this.currentColors[material]
    }

    setCurrent(material:string, color:string) {
        this.currentColors[material] = this.find(color)?.id as string
    }

    find(color:string):Color|null {
        if(!color) {
            return null
        }

        if(color.indexOf('.') === -1) {
            return this.item.collection.colors.getColor(color)
        }

        const selected = this.find(this.item.collection.getSelected(color)?.colors.get('primary') as string)

        if(selected) {
            return selected;
        }

        // TODO improve default color collection
        if(color == 'anatomy.body' || color == 'anatomy.head') {
            return this.find('ivory')
        }

        return null
    }

    findOriginal(color:string):Color|null {
        if(!color) {
            return null
        }

        // TODO improve default color collection
        if(color == 'anatomy.body' || color == 'anatomy.head') {
            return this.find('ivory')
        }

        if(color.indexOf('.') === -1) {
            return this.item.collection.colors.getColor(color)
        }

        const selected = this.findOriginal(this.item.collection.getSelected(color)?.colors.getOriginal('primary') as string)

        if(selected) {
            return selected;
        }

        return null
    }

    getDifferences():{[key:string]:number[]}|null {
        let hasChanges:boolean = false;
        const out:{[key:string]:number[]} = {}

        for(const material in this.colors) {
            if(!this.get(material)) {
                continue;
            }

            const newColor = this.find(this.get(material));
            const currentColor = this.find(this.getCurrent(material))
            const originalColor = this.findOriginal(this.getOriginal(material))

            if(!originalColor || !newColor) {
                return null;
            }

            if (newColor?.id != currentColor?.id) {
                hasChanges = true
                for(const index in originalColor.palette as number[][]) {
                    out[`${originalColor?.palette[index][0]}-${originalColor?.palette[index][1]}-${originalColor?.palette[index][2]}`] = newColor?.palette[index]
                }
            }
        }

        if(hasChanges) {
            return out;
        }

        return null
    }

    update() {
        for(const material in this.colors) {
            this.setCurrent(material, this.get(material))
        }
    }
}