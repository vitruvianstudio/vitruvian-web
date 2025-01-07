import {ItemCollection} from "@/types/ItemCollection";

export class HorseCollection extends ItemCollection {
    spriteTypes = ['horse']

    getSpriteCategories():any {
        return {
            anatomy: {
                title: 'Anatomy',
                children: [
                    {title: 'Body', type: 'horse.body'},
                    {title: 'Face', type: 'horse.face'},
                    {title: 'Mane', type: 'horse.mane'},
                    {title: 'Horn', type: 'horse.horn'},
                ]
            },
            clothes: {
                title: 'Clothes',
                children: [
                    {title: 'Blanket', type: 'horse.blanket'},
                    {title: 'Saddle', type: 'horse.saddle'},
                ]
            }
        }
    }

    isBodySelected():boolean {
        return !!this.selected.horse?.body
    }

    getTileSize(animation:string):number {
        return 128
    }

    isAnimationDisabled(animation:string):boolean {
        return false
    }
}