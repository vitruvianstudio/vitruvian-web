<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps(['renderer', 'current'])

const animations = {
  walk: ref(),
  gallop: ref(),
  idle: ref(),
}

onMounted(() => {
  props.renderer.initAnimationCanvases(animations)
})
</script>
<template>
  <div>
    <h2 class="mb-2 font-bold text-slate-300">Walk</h2>
    <div class="bg-slate-300 rounded mb-5 max-w-min">
      <canvas :ref="animations.walk" width="512" height="256"></canvas>
    </div>

    <h2 class="mb-2 font-bold text-slate-300">Gallop</h2>
    <div class="bg-slate-300 rounded mb-5 max-w-min">
      <canvas :ref="animations.gallop" width="832" height="256"></canvas>
    </div>

    <h2 class="mb-2 font-bold text-slate-300">Idle</h2>
    <div class="bg-slate-300 rounded mb-5 max-w-min">
    <canvas :ref="animations.idle" width="384" height="256"></canvas>
    </div>
  </div>
</template>