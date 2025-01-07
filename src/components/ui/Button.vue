<script setup lang="ts">
const props = defineProps<{
  ui: string,
  title: string,
  icon?: string,
  active?: boolean
  small?: boolean
}>()

function getClasses():string {
  let colorsPrimary:string = 'bg-violet-600 hover:bg-violet-700';
  let colorsSecondary:string = 'bg-slate-600 hover:bg-slate-700';
  let squareSize:string = ' h-8 w-8';

  if(props.active) {
    colorsPrimary = 'bg-violet-400 hover:bg-violet-400';
    colorsSecondary = 'bg-slate-400 hover:bg-slate-400';
  }

  if(props.small) {
    colorsPrimary += ' text-sm'
    colorsSecondary += ' text-sm'
    squareSize = ' h-6 w-6';
  }

  switch(props.ui) {
    case 'primary':
      return colorsPrimary + ' py-1 px-3 disabled:bg-violet-800 disabled:text-slate-500 text-slate-200';
    case 'primary-square':
      return colorsPrimary + squareSize + ' aspect-square leading-none disabled:bg-violet-800 disabled:text-slate-500 text-slate-200';
    case 'secondary':
      return colorsSecondary + ' py-1 px-3 disabled:bg-slate-800 disabled:text-slate-500 text-slate-200';
    case 'secondary-square':
      return colorsSecondary + squareSize + ' aspect-square leading-none disabled:bg-slate-800 disabled:text-slate-500 text-slate-200';
  }

  return ''
}

function getIconClass(slots:any) {
  let out = `mdi mdi-${props.icon}`;

  if(slots._) {
    out += ' mr-2';
  }

  return out;
}
</script>
<template>
  <button :title="title" :class="getClasses()" class="rounded flex place-content-center">
    <template v-if="icon">
      <i :class="getIconClass($slots)" class="self-center"></i>
    </template>
    <template v-if="$slots">
      <slot></slot>
    </template>
  </button>
</template>