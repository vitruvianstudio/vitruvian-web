<script setup lang="ts">
import {type Ref, ref} from 'vue';

import {Item} from "@/types/Item";

const props = defineProps<{
  type: string,
  options: any,
  selected: any
}>();

const emit = defineEmits(['selected'])

const isDropdownOpen:Ref<boolean> = ref(false);
const dropdownLabel:Ref<HTMLElement | null> = ref(null);
const dropdownList:Ref<HTMLElement | null> = ref(null);
const position:Ref<string> = ref('bottom');
const filterText:Ref<string> = ref('');

function getHiddenHeight(element:HTMLElement) {
  if(!element?.cloneNode) {
    return 0;
  }

  const clone:HTMLElement = element.cloneNode(true) as HTMLElement;

  Object.assign(clone.style, {
    overflow: 'visible',
    height: 'auto',
    //maxHeight: 'none',
    opacity: '0',
    visibility: 'hidden',
    display: 'block',
  });

  element.after(clone);
  const height = clone.offsetHeight;

  clone.remove();

  return height;
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;

  if(!dropdownList.value || !dropdownLabel.value) {
    return
  }

  dropdownList.value.scrollTo(0, 0);

  const dropdownHeight:number = getHiddenHeight(dropdownList.value)
  const windowHeight:number = window.innerHeight
  const dropdownTop:number = dropdownLabel.value.getBoundingClientRect().top

  if (windowHeight - dropdownTop < dropdownHeight) {
    position.value = 'top'
  } else {
    position.value = 'bottom'
  }
}

function selectOption(option:Item | null) {
  isDropdownOpen.value = false;

  if(!option) {
    emit('selected', null)
  } else {
    emit('selected', option.id)
  }
}

function closeDropdownOnOutsideClick(event:any) {
  if (!event.target.closest('#select-' + props.type.replace('.', '-'))) {
    isDropdownOpen.value = false;
  }
}

window.addEventListener('click', closeDropdownOnOutsideClick);
</script>

<template>
  <div ref="dropdownLabel" :id="'select-' + type.replace('.', '-')" class="relative inline-block cursor-pointer bg-slate-700 text-slate-300 w-full overflow-visible" :class="{'rounded-bl': position == 'top' && isDropdownOpen, 'rounded-tl': position == 'bottom' && isDropdownOpen, 'rounded-l': !isDropdownOpen}">
    <div @click="toggleDropdown" class="p-1.5 flex">
      <div class="grow select-none">
        {{(selected && selected.id) ? selected.name : 'Select...'}}
      </div>
      <div class="justify-self-end"><i class="mdi mdi-menu-down"></i></div>
    </div>

    <ul ref="dropdownList" class="z-10 list-none p-0 m-0 absolute w-full bg-slate-600 overflow-y-scroll scrollbar-thin max-h-96 divide-y divide-slate-700" :class="{hidden: !isDropdownOpen, 'top-full': position == 'bottom', 'bottom-auto': position == 'bottom', 'top-auto': position == 'top', 'bottom-full': position == 'top', 'rounded-b': position == 'bottom', 'rounded-t': position == 'top'}">
      <li class="bg-slate-600 flex" v-if="false && position == 'bottom' && isDropdownOpen">
        <input v-model="filterText" class="w-full p-2 m-2 rounded bg-slate-500" placeholder="Search...">
      </li>
      <li class="select-none text-slate-200 px-2 py-1 cursor-pointer hover:bg-slate-500" @click.stop="selectOption(null)">
        None
      </li>

      <template v-for="(opts, key) of options">
        <li v-if="key.toString() != '_'" class="select-none capitalize text-slate-200 px-2 py-1 pointer-events-none bg-slate-700" @click.stop="selectOption(null)">
          {{key}}
        </li>
        <li :title="option.name" class="select-none text-slate-200 px-2 py-1 cursor-pointer hover:bg-slate-500 flex" v-for="(option, index) in opts" :key="option?.id" @click.stop="selectOption(option)">
          <div class="w-[64px] min-w-[64px] aspect-square mr-2"><img class="rounded bg-slate-400" :src="option.preview"></div>
          <div class="self-center truncate">{{ option.name }}</div>
        </li>

      </template>

    </ul>
  </div>
</template>

<style>

</style>
