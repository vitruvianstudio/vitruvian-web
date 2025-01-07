<script setup lang="ts">
import UIButton from '@/components/ui/Button.vue'

const props = defineProps(['collection'])

function getCredits():{[key:string]:{[key:string]:any}} {
  return props.collection.getCredits()
}

function onDownload() {
  const link = document.createElement('a');
  link.download = 'credits.json';
  link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(getCredits(), null, 2));
  link.click();
  URL.revokeObjectURL(link.href);
}
</script>

<template>
  <div class="text-slate-400 p-2 flex flex-col gap-2">
    <h2 class="font-bold flex">
      <span class="flex-grow">Credits</span>
      <UIButton @click="onDownload" ui="secondary-square" title="Download Credits" icon="download"></UIButton>
    </h2>
    <div v-for="credit of getCredits()" class="bg-slate-800 p-2 rounded">
      <div class="text-violet-500">{{credit.name}}</div>
      <div class="text-sm">Sprites by: {{credit.authors.join(', ')}}</div>
      <div class="text-sm my-2">License: {{credit.licenses.join(', ')}}</div>
      <ul class="text-xs">
        <li v-for="url of credit.urls"><a :href="url" target="_blank" class="hover:text-slate-500">{{url}}</a></li>
      </ul>
    </div>
  </div>
</template>
