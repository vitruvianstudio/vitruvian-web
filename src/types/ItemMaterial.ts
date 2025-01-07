export class ItemMaterial {
    name: string
    palettes: string[]

    constructor(material:any) {
        this.name = material.name
        this.palettes = material.palettes
    }
}
