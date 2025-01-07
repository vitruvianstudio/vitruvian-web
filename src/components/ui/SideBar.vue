<script setup lang="ts">
import { defineExpose, ref } from 'vue'

const wrapper = ref()

defineExpose({ wrapper })
</script>

<template>
  <aside :ref="wrapper" class="bg-slate-900 w-72 min-w-72 overflow-y-auto scrollbar-thin">
    <slot></slot>
  </aside>
</template>