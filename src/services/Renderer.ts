import {ItemCollection} from "@/types/ItemCollection";
import {Item} from "@/types/Item";

export abstract class Renderer {
    collection: ItemCollection;
    animations: { [key: string]: any } = {};

    protected constructor(collection: ItemCollection) {
        this.collection = collection;
    }

    getAnimationSize(animation: string): { width: number; height: number } {
        const anim = this.animations[animation];
        return {width: anim.width, height: anim.height};
    }

    initAnimationCanvases(animations: any) {

        for (const animation in animations) {
            this.animations[animation].canvas = animations[animation];
            this.animations[animation].context = animations[animation].value.getContext('2d', {alpha: true});
        }
    }

    getAnimationCanvases() {
        const out: { [key: string]: any } = {};

        for (const animation in this.animations) {
            out[animation] = this.animations[animation].canvas
        }

        return out;
    }

    getAnimationCanvas(animation: string) {
        return this.animations[animation].canvas
    }

    recalculateCanvasSizes() {
        for (const animation in this.animations) {
            const tileSize = this.collection.getTileSize(animation)

            this.animations[animation].canvas.value.width = tileSize * this.animations[animation].width
            this.animations[animation].canvas.value.height = tileSize * this.animations[animation].height
        }
    }

    draw() {
        this.recalculateCanvasSizes()
        this.clearCanvases()
        const queue: { [key: number]: { item: Item, layer: string }[] } = this.collection.createRenderQueue()

        for (const z in queue) {
            for (const item in queue[z]) {
                this.drawAnimations(queue[z][item].item, queue[z][item].layer)
            }
        }
    }

    clearCanvases() {
        for (const animation in this.animations) {
            const canvas:HTMLCanvasElement = this.animations[animation].canvas.value;
            const context:CanvasRenderingContext2D = this.animations[animation].context;
            context.clearRect(0, 0, canvas.width, canvas.height)
        }
    }

    abstract drawAnimations(item: Item, layer: string): void
}