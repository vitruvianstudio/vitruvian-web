<script setup lang="ts">
import {ref} from "vue";

import {Item} from "@/types/Item";
import SpriteSelect from "@/components/common/SpriteSelect.vue";

const props = defineProps<{
  refresh: any
  hidden: boolean,
  tab: string,
  collection: any
}>()

const emit = defineEmits(['selected', 'toggle-color-selector'])

function onSpriteSelected(selected:Item) {
  emit('selected', selected)
}

function onToggleColorSelector(selected:Item, material:string) {
  emit('toggle-color-selector', selected, material)
}

const data:any = props.collection.getSpriteCategories();
</script>

<template>
  <div class="p-2 flex-grow" :class="{hidden: hidden}">
    <div v-for="(value, index) of data" :class="{hidden: tab != index.toString()}">
      <template v-if="value.tabs">
        <div class="grid grid-cols-4 text-center text-slate-200 font-bold my-1">
          <button v-for="(tab, tabIndex, order) of value.tabs" @click="value.active.value = tabIndex"
                  :class="{'bg-slate-400': value.active.value == tabIndex, 'bg-slate-600 hover:bg-slate-700': value.active.value != tabIndex, 'rounded-l': order == 0, 'rounded-r': order == Object.keys(value.tabs).length - 1}"
                  class="p-1">{{tab.title}}</button>
        </div>
        <div v-for="(tab, tabIndex) of value.tabs" :class="{hidden: value.active.value != tabIndex}">
          <sprite-select v-for="(category) of tab.children" @selected="onSpriteSelected"
                         @toggle-color-selector="onToggleColorSelector" :refresh="refresh"
                         :collection="collection" :title="category.title" :type="category.type"></sprite-select>
        </div>
      </template>
      <template v-if="!value.tabs">
        <sprite-select v-for="(category) of value.children" @selected="onSpriteSelected"
                       @toggle-color-selector="onToggleColorSelector" :refresh="refresh"
                       :collection="collection" :title="category.title" :type="category.type"></sprite-select>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>