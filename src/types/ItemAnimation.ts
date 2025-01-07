import {Item} from "./Item";
import {ItemLayer} from "./ItemLayer";
import {ItemCondition} from "./ItemCondition";


export class ItemAnimation {
    item: Item
    layer: ItemLayer
    condition: ItemCondition|null = null
    type: string
    image:HTMLImageElement|null = null
    canvas:HTMLCanvasElement|null = null
    context:CanvasRenderingContext2D|null = null
    originalCanvas:HTMLCanvasElement|null = null
    originalContext:CanvasRenderingContext2D|null = null
    loaded:boolean = false;
    colorized:boolean = false;
    isMask:boolean = false

    constructor(item:Item, layer:ItemLayer, type:string) {
        this.item = item
        this.layer = layer
        this.type = type

        if(layer.id == 'mask') {
            this.isMask = true
        }
    }

    /**
     * Load the sprite sheet and create canvases
     */
    async load() {
        if(!this.loaded) {
            this.loaded = true
            this.canvas = document.createElement('canvas')
            this.image = new Image()
            this.image.crossOrigin = 'Anonymous' // to avoid CORS if used with Canvas
            this.image.src = this.getPath()
            await this.image.decode()
            this.initCanvas()
        }
    }

    /**
     * Colorize the image
     */
    async colorize() {
        await this.load()
        if (!this.context || !this.originalContext || !this.canvas || !this.image) {
            return
        }

        const colorMap = this.item.colors.getDifferences()

        if (!colorMap/* && this.colorized*/) {
            return
        }

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        const imageData = this.originalContext.getImageData(0, 0, this.image.width, this.image.height)

        if (!imageData) {
            return
        }

        const pixelData: Uint8ClampedArray = imageData.data;

        if (colorMap) {
            for (let i = 0; i < pixelData.length; i += 4) {
                /*for (const map of colorMap) {
                    if (pixelData[i] == map.from[0]
                        && pixelData[i + 1] == map.from[1]
                        && pixelData[i + 2] == map.from[2]) {
                        pixelData[i] = map.to[0];
                        pixelData[i + 1] = map.to[1];
                        pixelData[i + 2] = map.to[2];
                    }
                }*/
                if(colorMap[`${pixelData[i]}-${pixelData[i + 1]}-${pixelData[i + 2]}`]) {
                    const color = colorMap[`${pixelData[i]}-${pixelData[i + 1]}-${pixelData[i + 2]}`];
                    pixelData[i] = color[0]
                    pixelData[i + 1] = color[1]
                    pixelData[i + 2] = color[2]
                }
            }
        }

        /*const out = [];

        if (colorMap) {
            for (let i = 0; i < pixelData.length; i += 4) {
                for (const map of colorMap) {
                    out.push(this.colorizePixel(pixelData, i, map))
                }
            }
        }

        await Promise.all(out);*/

        this.context.putImageData(imageData, 0, 0)
        this.colorized = true;

    }

    /**
     * Create canvas and context objects
     */
    createCanvas():any {
        if(!this.image) {
            return
        }

        const canvas = document.createElement('canvas')
        canvas.width = this.image.width
        canvas.height = this.image.height
        const context = canvas.getContext('2d', {willReadFrequently: true})

        if(!context) {
            return [canvas, context]
        }

        context.clearRect(0, 0, this.image.width, this.image.height)
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height)

        return [canvas, context]
    }

    /**
     * Initialize canvas and context objects
     */
    initCanvas() {
        [this.originalCanvas, this.originalContext] = this.createCanvas();
        [this.canvas, this.context] = this.createCanvas();
    }

    /**
     * Adds a condition
     *
     * @param condition
     */
    addCondition(condition:ItemCondition) {
        this.condition = condition
    }

    /**
     * Get filepath for the sprite sheet
     */
    getPath() {
        let path = ''
        if(this.condition) {
            path += this.condition.getPath()
        } else {
            path += this.layer.getPath()
        }

        path += '/' + this.type + '.png'

        return path
    }
}
