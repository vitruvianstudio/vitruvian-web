import {ItemCollection} from "@/types/ItemCollection";
import {ref} from "vue";

export class CharacterCollection extends ItemCollection {
    spriteTypes = ['anatomy', 'clothes', 'equipment', 'injuries']

    getSpriteCategories():any {
        return {
            anatomy: {
                title: 'Anatomy',
                children: [
                    {title: 'Body', type: 'anatomy.body'},
                    {title: 'Head', type: 'anatomy.head'},
                    {title: 'Ears', type: 'anatomy.ears'},
                    {title: 'Nose', type: 'anatomy.nose'},
                    {title: 'Hair', type: 'anatomy.hair'},
                    {title: 'Beard', type: 'anatomy.beards'},
                    {title: 'Wrinkles', type: 'anatomy.wrinkles'},
                    {title: 'Tail', type: 'anatomy.tail'},
                    {title: 'Wings', type: 'anatomy.wings'},
                    {title: 'Fins', type: 'anatomy.fins'},
                    {title: 'Horns', type: 'anatomy.horns'},
                    {title: 'Shadow', type: 'anatomy.shadow'},
                ]
            },
            clothes: {
                title: 'Clothes',
                active: ref('torso'),
                tabs: {
                    torso: {
                        title: 'Torso',
                        children: [
                            {title: 'Shirt', type: 'clothes.torso'},
                            {title: 'Overshirt/Armor', type: 'clothes.torso2'},
                            {title: 'Jacket/Tabard', type: 'clothes.torso3'},
                            {title: 'Cape', type: 'clothes.cape'},
                            {title: 'Trim', type: 'clothes.trim'},
                            {title: 'Dress', type: 'clothes.dress'},
                            {title: 'Neck', type: 'clothes.neck'},
                            {title: 'Shoulders', type: 'clothes.shoulders'},
                            {title: 'Waist', type: 'clothes.waist'},
                            {title: 'Closure', type: 'clothes.closure'},
                            {title: 'Collar', type: 'clothes.collar'},
                            {title: 'Pockets', type: 'clothes.pockets'},
                            {title: 'Buckles', type: 'clothes.buckles'},
                        ]
                    },
                    legs: {
                        title: 'Legs',
                        children: [
                            {title: 'Feet', type: 'clothes.feet'},
                            {title: 'Legs', type: 'clothes.legs'},
                            {title: 'Skirts', type: 'clothes.skirts'},
                        ]
                    },
                    arms: {
                        title: 'Arms',
                        children: [
                            {title: 'Arms', type: 'clothes.arms'},
                            {title: 'Wrists', type: 'clothes.wrists'},
                            {title: 'Hands', type: 'clothes.hands'},
                        ]
                    },
                    head: {
                        title: 'Head',
                        children: [
                            {title: 'Ears', type: 'clothes.ears'},
                            {title: 'Eyes', type: 'clothes.eyes'},
                            {title: 'Hat', type: 'clothes.hat'},
                            {title: 'Head Coverings', type: 'clothes.head_coverings'},
                            {title: 'Helmet Visor', type: 'clothes.helmet_visor'},
                            {title: 'Helmet Accessory', type: 'clothes.helmet_accessory'},
                        ]
                    }
                }
            },
            injuries: {
                title: 'Injuries',
                children: [
                    {title: 'Arm', type: 'injuries.arm'},
                    {title: 'Body', type: 'injuries.body'},
                    {title: 'Brain', type: 'injuries.brain'},
                    {title: 'Eye', type: 'injuries.eye'},
                    {title: 'Hand', type: 'injuries.hand'},
                    {title: 'Leg', type: 'injuries.leg'},
                    {title: 'Mouth', type: 'injuries.mouth'},
                    {title: 'Ribs', type: 'injuries.ribs'},
                ]
            },
            equipment: {
                title: 'Equipment',
                children: [
                    {title: 'Bows', type: 'equipment.bows'},
                    {title: 'Bow Accessory', type: 'equipment.bow_accessory'},
                    {title: 'Misc', type: 'equipment.misc'},
                    {title: 'Shield', type: 'equipment.shields'},
                    {title: 'Spears', type: 'equipment.spears'},
                    {title: 'Staffs', type: 'equipment.staffs'},
                    {title: 'Staff Accessory', type: 'equipment.staff_accessory'},
                    {title: 'Swords', type: 'equipment.swords'},
                    {title: 'Tools', type: 'equipment.tools'},
                ]
            }
        }
    }

    isBodySelected() {
        return !!this.selected.anatomy?.body
    }

    getTileSize(animation: string): number {
        for (const type in this.selected) {
            for (const category in this.selected[type]) {
                if (!this.selected[type][category]) {
                    continue
                }

                if (!this.selected[type][category].sizes) {
                    continue
                }

                if (!this.selected[type][category].sizes[animation]) {
                    continue
                }

                switch (this.selected[type][category].sizes[animation]) {
                    case 'lg':
                        return 128
                    case 'xl':
                        return 192
                }
            }
        }

        return 64
    }

    isAnimationDisabled(animation: string): boolean {
        return this.isAnimationDisabledForCharacter(animation) && this.isAnimationDisabledForEquipment(animation)
    }

    private isAnimationDisabledForCharacter(animation: string) {
        for (const type of ['anatomy', 'clothing']) {
            for (const category in this.selected[type]) {
                if (!this.selected[type][category]) {
                    continue
                }

                if (this.selected[type][category].animations.indexOf(animation) === -1) {
                    return true
                }
            }
        }

        return false
    }

    private isAnimationDisabledForEquipment(animation: string) {
        const type = 'equipment'

        for (const category in this.selected[type]) {
            if (!this.selected[type][category]) {
                continue
            }

            if (this.selected[type][category].animations.indexOf(animation) >= 0) {
                return false
            }
        }

        return true
    }
}