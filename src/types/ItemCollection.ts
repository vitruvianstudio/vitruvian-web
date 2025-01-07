import {Item} from "./Item";
import {ColorCollection} from "./ColorCollection";
import {ref} from "vue";
import {ItemLayer} from "./ItemLayer";

export abstract class ItemCollection {
    spriteTypes:string[] = []

    items: {
        [key: string]: {
            [key: string]: {
                [key: string]: Item
            }
        }
    } = {}

    colors:ColorCollection
    selected: {
        [key: string]: {
            [key: string]: Item
        }
    } = {}

    constructor(colors:ColorCollection) {
        this.colors = colors
    }

    initItems(items:any) {
        for(const type in items) {
            if(!this.spriteTypes.includes(type)) {
                continue
            }

            if(!(type in this.items)) {
                this.items[type] = {}
            }

            for(const category in items[type]) {
                if(!(category in this.items[type])) {
                    this.items[type][category] = {}
                }

                for(const itemIndex in items[type][category]) {
                    this.items[type][category][itemIndex] = new Item(this, items[type][category][itemIndex])
                }
            }
        }
    }

    findItem(id:string) {
        const [type, category, index]:string[] = id.split('.')

        return this.items[type][category][index]
    }

    addItem(item:Item) {
        const [type, category, index]:string[] = item.id.split('.')

        if(!(type in this.items)) {
            this.items[type] = {}
        }

        if(!(category in this.items[type])) {
            this.items[type][category] = {}
        }

        this.items[type][category][index] = item
        //this.dispatchEvent(new CustomEvent('item-added', {detail: item}))
    }

    removeItem(idOrItem:string | Item) {
        const id: string = (idOrItem instanceof Item) ? idOrItem.id : idOrItem;

        const [type, category, index]:string[] = id.split('.')

        delete this.items[type][category][index]
    }

    getItems(key:string):Item|{[index:string]:Item}|{[category:string]:{[index:string]:Item}}|undefined {
        const keys:string[] = key.split('.')
        const firstKey = keys.shift()

        if(!firstKey) {
            return undefined
        }

        let current:Item|{[type:string]:Item}|{[category:string]:{[index:string]:Item}} = this.items[firstKey]

        if (!current) {
            return undefined
        }

        for (const key of keys) {
            if (Object.prototype.hasOwnProperty.call(current, key)) {
                current = current[key]
            } else {
                return undefined
            }
        }

        return current
    }

    getOptions(key:string):{[key:string]:Item} {
        const out:{[key:string]:Item} = {}
        const options:{[key:string]:Item} = this.getItems(key) as {[key:string]:Item};

        for (const i in options) {
            const part = options[i];

            if(part.isAllowed()) {
                out[i] = options[i]
            }
        }

        return out
    }

    getFilteredOptions(type:string) {
        const options:Item[] = Object.values(this.getOptions(type))
        const elems:{ [key: string]: Item[] } = this.groupBy(options, ({group}: any) => group || '_')
        const sortedKeys:string[] = Object.keys(elems).sort();


        const sorted:{[key:string]:any} = {};
        sortedKeys.forEach((key:any) => {
            sorted[key] = elems[key];
        });

        console.log(type, sorted);

        return sorted;
    }

    groupBy(items: Item[], keyOrFn:any):{[key: string]: any[]} {
        return items.reduce((grouped:{[key:string]:Item[]}, item:Item) => {
            const keyValue:string = typeof keyOrFn === 'function' ? keyOrFn(item) : (item[keyOrFn as keyof Item] as string || '_');

            grouped[keyValue] = grouped[keyValue] || [];
            grouped[keyValue].push(item);

            return grouped;
        }, {});
    }

    async select(idOrItem:string|Item):Promise<Item> {
        let id:string = '';
        let item:Item;

        if(idOrItem instanceof Item) {
            id = idOrItem.id;
            item = idOrItem
        } else {
            id = idOrItem
            item = this.getItems(id) as Item
        }

        const [type, category, index]:string[] = id.split('.')

        if(!(type in this.selected)) {
            this.selected[type] = {}
        }

        this.selected[type][category] = item

        //await this.reloadDepended()
        const start = Date.now();
        await this.recolorizeDepended()
        const end = Date.now();
        console.log(`Execution time: ${end - start} ms`);

        return item
    }

    unselect(idOrItem:string|Item) {
        let id:string = idOrItem as string

        if(idOrItem instanceof Item) {
            id = idOrItem.id;
        }

        const [type, category, index]:string[] = id.split('.')

        delete this.selected[type][category]
    }

    getSelected(key:string):Item|undefined {
        const [type, category]:string[] = key.split('.')

        if(!this.selected[type]) {
            return undefined
        }

        return this.selected[type][category] || undefined
    }

    dumpSelected() {
        const items:{[key: string]:any} = {};

        for(const type in this.selected) {
            for(const category in this.selected[type]) {
                const item:Item = this.selected[type][category];

                if(item) {
                    items[item.id] = {colors: item.colors.colors}
                }
            }
        }

        return items
    }

    async initSelected(data:any) {
        this.selected = {};

        for(const i in data) {
            const item:Item = this.findItem(i)

            for(const material in data[i].colors) {
                item.colors.set(material, data[i].colors[material])
            }

            await this.select(item)
        }
    }



    isSelected(key:string):boolean {
        const [type, category, index]:string[] = key.split('.')

        if(!this.selected[type]) {
            return false
        }

        if(!this.selected[type][category]) {
            return false
        }

        if(this.selected[type][category].id == key) {
            return true
        }

        if(this.selected[type][category].actAs == key) {
            return true
        }

        return false
    }

    // TODO unused
    async reloadDepended() {
        return Promise.all(
            Object.values(this.selected)
                .flatMap(category => Object.values(category))
                .map(item => item.load())
        );
    }

    async recolorizeDepended() {
        return await Promise.all(
            Object.values(this.selected)
                .flatMap(category => Object.values(category))
                .map(item => item.colorize().then(() => item.colors.update()))
        );
    }

    createRenderQueue(): {[key:number]: { item: Item, layer:string }[]} {
        const queue:{[key:number]: { item: Item, layer:string }[]} = {}

        for (const type in this.selected) {
            for (const category in this.selected[type]) {
                const item:Item = this.selected[type][category]

                if (!item) {
                    continue
                }

                for (const layerIndex in item.layers) {
                    const layer:ItemLayer = item.layers[layerIndex]

                    if (!queue[layer.z]) {
                        queue[layer.z] = []
                    }

                    queue[layer.z].push({
                        item: item,
                        layer: layerIndex
                    })
                }
            }
        }

        return queue
    }

    getCredits():{[key:string]:{[key:string]:any}} {
        const credits:{[key:string]:{[key:string]:any}} = {
            colors: {
                name: 'Liberated Palette',
                authors: ['Eliza Wyatt (DeathsDarling)'],
                urls: ["https://github.com/ElizaWy/LPC/wiki/Style-Guide#color-palette"],
                licenses: ["OGA-BY 3.0"],
                notes: ["Original palette made for the LPC set, by Eliza Wyatt."]
            }
        };

        for(const type in this.selected) {
            for(const category in this.selected[type]) {
                const item = this.selected[type][category];

                if(!item) {
                    continue;
                }

                credits[item.id] = item.credits
                credits[item.id].name = item.name
            }
        }

        return credits;
    }

    abstract isBodySelected():boolean
    abstract isAnimationDisabled(animation:string):boolean
    abstract getTileSize(animation:string):number
    abstract getSpriteCategories():any
}