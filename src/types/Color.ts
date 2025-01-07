export class Color {
    id: string
    name: string
    palette: number[][]
    materials: string[]

    constructor(id:string, name:string, palette:number[][], materials:string[]) {
        this.id = id
        this.name = name
        this.palette = palette
        this.materials = materials
    }
}