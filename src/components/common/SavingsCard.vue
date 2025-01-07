<script setup lang="ts">
import {ref} from 'vue'

import UIButton from '@/components/ui/Button.vue'

const props = defineProps(['type', 'collection', 'renderer'])
const emit = defineEmits(['loaded'])

const file = ref();
const savings = ref();
savings.value = getSavings();


function onSave(file: any = null) {
  let item;
  let preview;

  if (!file) {
    item = props.collection.dumpSelected();
    preview = getPreviewImage();
  } else {
    item = file.data;
    preview = file.preview;
  }

  const data: any = getSavings();
  const name: string | null = prompt('Save name', file ? file.fileName : '');

  if (!name) {
    return;
  }

  if (data[name]) {
    if (!confirm("Name already exists, do you want to override?")) {
      return;
    }
  }

  data[name] = {
    data: item,
    preview: preview
  };

  localStorage.setItem(`${props.type}-savings`, JSON.stringify(data));
  savings.value = getSavings();
}

function onDelete(key:any) {
  const data: any = getSavings();

  if (!confirm(`Do you really want to remove "${key}"?`)) {
    return;
  }

  delete data[key];
  localStorage.setItem(`${props.type}-savings`, JSON.stringify(data));
  savings.value = getSavings();
}

function getSavings() {
  let loaded = localStorage.getItem(`${props.type}-savings`);
  let data = {};

  if (loaded) {
    data = JSON.parse(loaded);
  }

  return data;
}

function getPreviewImage() {
  const canvas = props.renderer.getAnimationCanvas('walk').value;

  const previewCanvas = document.createElement('canvas');
  previewCanvas.width = 64;
  previewCanvas.height = 64;

  let sourceSize = 64;

  if (props.type == 'horse') {
    sourceSize = 128;
  }

  previewCanvas.getContext('2d')?.drawImage(
      canvas,
      0, // frame
      128, // direction
      sourceSize,
      sourceSize,
      0,
      0,
      64,
      64
  );

  return previewCanvas.toDataURL();
}

async function onLoad(name:any) {
  await props.collection.initSelected(savings.value[name].data);
  emit('loaded')
}

function onExportSaving(name:any) {
  const link = document.createElement('a');
  link.download = name + '.vit';
  link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savings.value[name]));
  link.click();
  URL.revokeObjectURL(link.href);
}

function onExportCurrent() {
  const item = props.collection.dumpSelected();
  const preview = getPreviewImage();

  const data = {
    data: item,
    preview: preview
  };

  const link = document.createElement('a');
  link.download = 'unnamed.vit';
  link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
  link.click();
  URL.revokeObjectURL(link.href);
}

function onImportSaving() {
  file.value.click()
}

function onFileSelected(event: any) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = (e: any) => {
    try {
      const content = JSON.parse(e.target.result);
      content.fileName = file.name.replace('.vit', '');
      props.collection.initSelected(content.data);
      emit('loaded')

      onSave(content);
    } catch (error) {
      console.error('Error parsing JSON file:', error);
    }
  };

  reader.readAsText(file);
}
</script>

<template>
  <div class="text-slate-400 p-2 flex flex-col gap-2">
    <div class="">
      <h2 class="mb-1">
        <span class="font-bold">Savings</span>
      </h2>
      <div class="flex gap-2 place-content-between">
        <UIButton @click="onImportSaving" ui="secondary" :small="true" icon="import" title="Import">Import</UIButton>
        <UIButton @click="onExportCurrent" ui="secondary" :small="true" icon="export" title="Export">Export</UIButton>
        <UIButton @click="onSave(null)" ui="primary" :small="true" icon="content-save" title="Save">Save</UIButton>
        <input class="hidden" @change="onFileSelected" type="file" accept=".vit" ref="file">
      </div>
    </div>
    <div v-for="(value, key, index) in savings" class="bg-slate-800 p-2 rounded flex gap-2">
      <img :src="value.preview" class="bg-slate-700 rounded">
      <div class="flex-grow">
        <div class="flex gap-2 justify-end">
          <UIButton @click="onExportSaving(key)" :small="true" ui="secondary-square" icon="export"
                    title="Export"></UIButton>
          <UIButton @click="onDelete(key)" :small="true" ui="secondary-square" icon="delete" title="Delete"></UIButton>
          <UIButton @click="onLoad(key)" :small="true" ui="primary-square" icon="folder-open" title="Open"></UIButton>
        </div>
        {{ key }}
      </div>

    </div>
  </div>
</template>
