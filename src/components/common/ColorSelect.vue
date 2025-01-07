<script setup lang="ts">
import {Color} from "@/types/Color";

const props = defineProps(['collection', 'item', 'material'])
const emit = defineEmits(['selected', 'close'])

function getCurrentType(): { name: string, palettes: string[] }|null {
  if (!props.item) {
    return null;
  }

  return props.item.materials[props.material];
}

function isShown(color: Color, value: string): boolean {
  return color.materials.indexOf(value) >= 0;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <div v-if="item" class="p-2">

    <h2 class="font-bold px-2 flex">
      <div class="flex-grow">{{ getCurrentType()?.name }}</div>
      <button @click="$emit('close')"><i class="mdi mdi-close"></i></button>

    </h2>

    <div v-for="color in getCurrentType()?.palettes">
      <h3 class="text-xs font-bold pl-2 my-2">{{ capitalize(color) }}</h3>

      <div v-for="(value, key) of collection.colors.getAll()" class="cursor-pointer">
        <template v-if="isShown(value, color)">
          <div class="flex hover:bg-slate-500 p-2 rounded" @click="emit('selected', key)">
            <div class="w-1/2 text-xs">{{ value.name }}</div>
            <div class="w-1/2 grid grid-rows-1 grid-cols-6 align-center">
              <div v-for="(v, index) in value.palette" class="h-4"
                   :class="{ 'rounded-l': index == 0, 'rounded-r': index == value.palette.length - 1}"
                   :style="{backgroundColor: `rgb(${v[0]}, ${v[1]}, ${v[2]})`}">&nbsp;
              </div>
            </div>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>
