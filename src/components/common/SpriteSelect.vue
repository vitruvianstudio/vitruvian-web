<script setup lang="ts">
import {type Ref, ref, watch} from 'vue'

import UiDropdown from "@/components/ui/Dropdown.vue";
import type {ItemCollection} from "@/types/ItemCollection";
import type {Item} from "@/types/Item";

const props = defineProps<{
  type: string,
  title: string,
  refresh: bigint,
  collection: ItemCollection
}>()

const emit = defineEmits(['selected', 'toggle-color-selector'])

const selected: Ref<Item> = ref(props.collection.getSelected(props.type)) as Ref<Item>;

function openColorSelector(material:string) {
  emit('toggle-color-selector', selected.value, material)
}

async function onSelectionChanged(event:any) {
  if (event.target.value) {
    selected.value = await props.collection.select(event.target.value)
  } else {
    props.collection.unselect(props.type);
    selected.value = props.collection.getSelected(props.type) as Item;
  }
  emit("selected", selected);
}

function getColor(material: any) {
  const c = selected.value.colors.find(selected.value.colors.getCurrent(material))?.palette[2];

  if(!c) {
    return ''
  }

  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function isLast(index: number) {
  return index == Object.keys(selected.value.materials).length - 1;
}

function hasNoColors() {
  return !selected.value || !selected.value.id || Object.keys(selected.value.materials).length == 0;
}

function hasOptions() {
  return Object.keys(getOptions()).length > 0;
}

function getOptions() {
  return props.collection.getFilteredOptions(props.type)
}

async function onSelect(itemId: string) {
  if (itemId) {
    selected.value = await props.collection.select(itemId)
  } else {
    props.collection.unselect(props.type);
    selected.value = props.collection.getSelected(props.type) as Item;
  }

  emit("selected", selected);
}

watch(() => props.refresh, () => {
  selected.value = props.collection.getSelected(props.type) as Item;
})

</script>

<template>
  <div v-if="Object.keys(getOptions()).length > 0">
    <h2 class="text-xs text-slate-400 font-bold">{{ title }}</h2>
    <div class="flex my-2">
      <ui-dropdown @selected="onSelect" :selected="collection.getSelected(type)" :options="getOptions()" :type="type"
                   :class="{'rounded-r': hasNoColors()}"></ui-dropdown>
      <template v-if="selected">
        <button @click="openColorSelector(key as string)" :title="value.name" class="min-w-8 w-8 bg-slate-700 p-1"
                :class="{ 'rounded-r': isLast(index) }" v-for="(value, key, index) in selected.materials">
          <div class="h-full rounded align-center" :style="{ backgroundColor: getColor(key)}"></div>
        </button>
      </template>
    </div>

    <div v-if="false" class="flex my-2">
      <select @change="onSelectionChanged($event)"
              class="bg-slate-700 text-slate-300 flex-grow p-2 rounded-l truncate w-full"
              :class="{'rounded-r': hasNoColors()}" id="">
        <option value="">Select...</option>
        <option v-for="value in getOptions()" :value="value.id" :selected="value.id == selected.id">{{ value.name }}
        </option>
      </select>

      <template v-if="selected">
        <button @click="openColorSelector(key as string)" :title="value.name" class="min-w-8 w-8 bg-slate-700 p-1"
                :class="{ 'rounded-r': isLast(index) }" v-for="(value, key, index) in selected.materials">
          <div class="h-full rounded align-center" :style="{ backgroundColor: getColor(key)}"></div>
        </button>
      </template>

    </div>
  </div>
</template>
