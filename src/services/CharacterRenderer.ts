import {Renderer} from "@/services/Renderer";
import {ref, type UnwrapRef} from "vue";
import {Item} from "../types/Item";
import {ItemCollection} from "../types/ItemCollection";
import type {ItemAnimation} from "@/types/ItemAnimation";

export class CharacterRenderer extends Renderer {
    constructor(collection: ItemCollection) {
        super(collection);

        this.animations = {
            hurt: {
                name: 'Hurt',
                width: 6,
                height: 1,
                canvas: ref()
            },
            shoot: {
                name: 'Shoot',
                width: 13,
                height: 4,
                canvas: ref()
            },
            slash: {
                name: 'Slash',
                width: 6,
                height: 4,
                canvas: ref()
            },
            backslash: {
                name: 'Backslash',
                width: 6,
                height: 4,
                canvas: ref()
            },
            spell: {
                name: 'Spell',
                width: 7,
                height: 4,
                canvas: ref()
            },
            thrust: {
                name: 'Thrust',
                width: 8,
                height: 4,
                canvas: ref()
            },
            walk: {
                name: 'Walk',
                width: 8,
                height: 4,
                canvas: ref()
            },
            rod: {
                name: 'Rod',
                width: 13,
                height: 4,
                canvas: ref()
            },
            whip: {
                name: 'Whip',
                width: 8,
                height: 4,
                canvas: ref()
            },
            idle: {
                name: 'Idle',
                width: 1,
                height: 4,
                canvas: ref()
            },
        };
    }

    drawAnimations(item: Item, layer: string): void {
        for (const animation of item.animations) {
            this.drawAnimation(this.animations[animation].canvas.value, item, layer, animation)
        }

        if (item.animations.indexOf('backslash') === -1 && item.animations.indexOf('slash') >= 0) {
            this.drawAnimation(this.animations['backslash'].canvas.value, item, layer, 'backslash', true)
        }

        if (item.animations.indexOf('whip') === -1 && item.animations.indexOf('slash') >= 0) {
            this.drawAnimation(this.animations['whip'].canvas.value, item, layer, 'whip', true)
        }

        if (item.animations.indexOf('rod') === -1 && item.animations.indexOf('thrust') >= 0) {
            this.drawAnimation(this.animations['rod'].canvas.value, item, layer, 'rod', true)
        }
    }

    drawAnimation(canvas: HTMLCanvasElement, item: Item, layer: string, animationKey: string, isCustom: boolean = false) {
        let baseAnimationKey: string = animationKey
        const animationSize:{width:number, height:number} = this.getAnimationSize(animationKey)
        let cols:number[] = Array.from({length: animationSize.width}, (_, index) => index)

        if (isCustom) {
            switch (animationKey) {
                case 'backslash':
                    baseAnimationKey = 'slash'
                    cols = [5, 4, 3, 2, 1, 0]
                    break
                case 'whip':
                    baseAnimationKey = 'slash'
                    cols = [0, 1, 4, 5, 3, 2, 2, 1]
                    break
                case 'rod':
                    baseAnimationKey = 'thrust'
                    cols = [0, 1, 2, 3, 4, 5, 4, 4, 4, 5, 4, 2, 3]
                    break
            }
        }

        const size: number = item.getPartSize(baseAnimationKey)
        const canvasTileSize: number = this.collection.getTileSize(animationKey)
        const baseAnimation: ItemAnimation | undefined = item.layers[layer].getAnimation(baseAnimationKey);

        if (!baseAnimation || !baseAnimation.canvas) {
            return
        }

        const context = canvas.getContext('2d', {willReadFrequently: true})

        if(!context) {
            return
        }

        if (baseAnimation.isMask) {
            context.globalCompositeOperation = 'destination-out'
        } else {
            context.globalCompositeOperation = 'source-over'
        }

        for (let row = 0; row < animationSize.height; row++) {
            for (let col = 0; col < cols.length; col++) {

                const x:number = col * canvasTileSize + (canvasTileSize - size) / 2
                const y:number = row * canvasTileSize + (canvasTileSize - size) / 2
                context.drawImage(baseAnimation.canvas, cols[col] * size, row * size, size, size, x, y, size, size)
            }
        }
    }
}