<script setup lang="ts">
import UIButton from '@/components/ui/Button.vue'
import JSZip from 'jszip';

const props = defineProps(['collection', 'renderer', 'current'])

function getCredits():{[key:string]:{[key:string]:any}} {
  return props.collection.getCredits()
}

async function onDownloadCurrent() {
  const zip = new JSZip();

  zip.file(props.current + '.png', props.renderer.getAnimationCanvas(props.current).value.toDataURL().split(';base64,').pop(), { base64: true });

  zip.file('credits.json', JSON.stringify(getCredits(), null, 2));


  const content = await zip.generateAsync({ type: 'blob' });

  const blob = new Blob([content], { type: 'application/zip' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'spritesheets.zip';
  link.click();
}

async function onDownloadAll() {
  const zip = new JSZip();

  const animations = props.renderer.getAnimationCanvases();

  for(let animation in animations) {
    zip.file(animation + '.png', animations[animation].value.toDataURL().split(';base64,').pop(), { base64: true });
  }

  zip.file('credits.json', JSON.stringify(getCredits(), null, 2));

  const content:any = await zip.generateAsync({ type: 'blob' });
  const blob:Blob = new Blob([content], { type: 'application/zip' });
  const link:HTMLAnchorElement = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'spritesheets.zip';
  link.click();
}

async function onDownloadLayers() {
  const zip = new JSZip();

  const selected = props.collection.selected;

  for(const type in selected) {
    const typeFolder:any = zip.folder(type);

    for(const category in selected[type]) {
      if(!selected[type][category]) {
        continue;
      }

      const categoryFolder:any = typeFolder.folder(category);
      const partFolder:any = categoryFolder.folder(selected[type][category].id.replace(type + '.' + category + '.', ''));

      for(const layer in selected[type][category].render) {
        const layerFolder = partFolder.folder(layer);
        for(const pose in selected[type][category].render[layer]) {
          layerFolder.file(pose + '.png', selected[type][category].render[layer][pose].canvas.toDataURL().split(';base64,').pop(), { base64: true });
        }
      }
    }
  }

  zip.file('credits.json', JSON.stringify(getCredits(), null, 2));

  const content:any = await zip.generateAsync({ type: 'blob' });

  const blob:Blob = new Blob([content], { type: 'application/zip' });
  const link:HTMLAnchorElement = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'spritesheets.zip';
  link.click();
}
</script>

<template>
  <div class="text-slate-400 p-2 flex flex-col gap-2">
    <h2 class="font-bold flex mb-2">
      <span class="flex-grow">Rendering</span>
    </h2>
    <UIButton @click="onDownloadCurrent" :ui="'secondary'" title="Download Current Animation">Download Current Animation</UIButton>
    <UIButton @click="onDownloadAll" :ui="'secondary'" title="Download All">Download All</UIButton>
    <UIButton @click="onDownloadLayers" :ui="'secondary'" title="Download All">Download All Layers</UIButton>
  </div>
</template>
