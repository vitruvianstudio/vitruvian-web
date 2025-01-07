import {ItemAnimation} from "./ItemAnimation";
import {ItemCondition} from "./ItemCondition";
import {Item} from "./Item";

export class ItemLayer {
    id: string
    item: Item
    z: number
    conditions: ItemCondition[]|null = null
    animations: {[key:string]: ItemAnimation} = {}
    path: string

    constructor(item:Item, id:string, layer:any) {
        this.id = id
        this.item = item;
        this.z = layer.z
        this.path = layer.path || ''

        const animations:{[key:string]: {[key:string]: ItemAnimation}} = {};

        if(layer.conditions) {
            this.conditions = []

            for(const conditionRule in layer.conditions) {
                const conditionPath = layer.conditions[conditionRule];

                if(!animations[conditionPath]) {
                    animations[conditionPath] = {}

                    for(const animation of item.animations) {
                        animations[conditionPath][animation] = new ItemAnimation(item, this, animation)
                    }
                }

                const condition = new ItemCondition(this, conditionRule, layer.conditions[conditionRule], animations[conditionPath])
                this.conditions.push(condition)

                for(const animation in animations[conditionPath]) {
                    animations[conditionPath][animation].addCondition(condition)
                }
            }
        } else {
            this.animations = {}
            for(const animation of item.animations) {
                this.animations[animation] = new ItemAnimation(item, this, animation)
            }
        }
    }

    getPath() {
        if(this.path) {
            return this.item.getPath() + '/' + this.path
        }

        return this.item.getPath()
    }

    async load() {
        if(this.conditions) {
            return Promise.all(this.conditions.map(condition => condition.load()));
        } else if(this.animations) {
            return Promise.all(Object.values(this.animations).map(animation => animation.load()));
        }
    }

    async colorize() {
        if(this.conditions) {
            return Promise.all(this.conditions.map(condition => condition.colorize()));
        } else if(this.animations) {
            return Promise.all(Object.values(this.animations).map(animation => animation.colorize()));
        }
    }

    isAllowed():boolean {
        if (this.conditions) {
            for (const condition in this.conditions) {
                if (this.item.collection.isSelected(this.conditions[condition].condition)) {
                    return true
                }
            }

            return false
        }

        return true
    }

    getAnimations() {
        if(this.conditions) {
            for (const condition in this.conditions) {
                if (this.item.collection.isSelected(this.conditions[condition].condition)) {
                    return this.conditions[condition].animations;
                }
            }
        } else if(this.animations) {
            return this.animations;
        }
    }

    getAnimation(animation:string) {
        if(this.conditions) {
            for (const condition in this.conditions) {
                if (this.item.collection.isSelected(this.conditions[condition].condition)) {
                    return this.conditions[condition].animations[animation];
                }
            }
        } else if(this.animations) {
            return this.animations[animation];
        }
    }

}

