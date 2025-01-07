import {ref} from "vue";

import {Renderer} from "@/services/Renderer";
import type {ItemCollection} from "@/types/ItemCollection";
import type {Item} from "@/types/Item";
import type {ItemAnimation} from "@/types/ItemAnimation";

export class HorseRenderer extends Renderer {
    constructor(collection:ItemCollection) {
        super(collection);

        this.animations = {
            idle: {
                name: 'Idle',
                width: 1,
                height: 4,
                canvas: ref()
            },
            gallop: {
                name: 'Gallop',
                width: 6,
                height: 4,
                canvas: ref()
            },
            walk: {
                name: 'Walk',
                width: 6,
                height: 4,
                canvas: ref()
            }
        };
    }

    drawAnimations(item:Item, layer:string) {
        for (const animation of item.animations) {
            this.drawAnimation(this.animations[animation].canvas.value, item, layer, animation)
        }
    }

    drawAnimation(canvas: HTMLCanvasElement, item: Item, layer: string, animationKey: string) {
        const baseAnimationKey:string = animationKey;
        const animationSize:{width:number, height:number} = this.getAnimationSize(animationKey);
        const cols:number[] = Array.from({ length: animationSize.width }, (_, index) => index);

        const size:number = item.getPartSize(baseAnimationKey);
        const canvasTileSize = this.collection.getTileSize(animationKey);

        const baseAnimation: ItemAnimation | undefined = item.layers[layer].getAnimation(baseAnimationKey);

        if (!baseAnimation || !baseAnimation.canvas) {
            return
        }

        const context = canvas.getContext('2d', { willReadFrequently: true })

        if(!context) {
            return
        }

        for (let row = 0; row < animationSize.height; row++) {
            for (let col = 0; col < cols.length; col++) {
                const x:number = col * canvasTileSize + (canvasTileSize - size) / 2;
                const y:number = row * canvasTileSize + (canvasTileSize - size) / 2;
                context.drawImage(baseAnimation.canvas, cols[col] * size, row * size, size, size, x, y, size, size);
            }
        }
    }
}