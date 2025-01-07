<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps(['renderer', 'current'])

const zoomed = ref(false)

const animations = {
  hurt: ref(),
  shoot: ref(),
  slash: ref(),
  spell: ref(),
  thrust: ref(),
  walk: ref(),
  rod: ref(),
  backslash: ref(),
  whip: ref(),
  idle: ref()
}

onMounted(() => {
  props.renderer.initAnimationCanvases(animations)
})
</script>
<template>
  <div class="grid grid-cols-[80px_1fr] gap-5" @click="zoomed = !zoomed" style="image-rendering: pixelated">
    <h2 class="font-bold text-slate-300">Walk</h2>
    <div class="bg-slate-300 rounded max-w-min" :style="{zoom: (zoomed ? '200%' : '100%')}">
      <canvas :ref="animations.walk" width="512" height="256"></canvas>
    </div>

    <h2 class="font-bold text-slate-300">Shoot</h2>
    <div class="bg-slate-300 rounded max-w-min" :style="{zoom: (zoomed ? '200%' : '100%')}">
      <canvas :ref="animations.shoot" width="832" height="256"></canvas>
    </div>

    <h2 class="font-bold text-slate-300">Slash</h2>
    <div class="bg-slate-300 rounded max-w-min" :style="{zoom: (zoomed ? '200%' : '100%')}">
    <canvas :ref="animations.slash" width="384" height="256"></canvas>
    </div>

    <h2 class="font-bold text-slate-300">Backslash</h2>
    <div class="bg-slate-300 rounded max-w-min" :style="{zoom: (zoomed ? '200%' : '100%')}">
    <canvas :ref="animations.backslash" width="576" height="256"></canvas>
    </div>

    <h2 class="font-bold text-slate-300">Spell</h2>
    <div class="bg-slate-300 rounded max-w-min" :style="{zoom: (zoomed ? '200%' : '100%')}">
    <canvas :ref="animations.spell" width="448" height="256"></canvas>
    </div>

    <h2 class="font-bold text-slate-300">Thrust</h2>
    <div class="bg-slate-300 rounded max-w-min" :style="{zoom: (zoomed ? '200%' : '100%')}">
    <canvas :ref="animations.thrust" width="512" height="256"></canvas>
    </div>

    <h2 class="font-bold text-slate-300">Rod</h2>
    <div class="bg-slate-300 rounded max-w-min" :style="{zoom: (zoomed ? '200%' : '100%')}">
    <canvas :ref="animations.rod" width="576" height="256"></canvas>
    </div>

    <h2 class="font-bold text-slate-300">Whip</h2>
    <div class="bg-slate-300 rounded max-w-min" :style="{zoom: (zoomed ? '200%' : '100%')}">
    <canvas :ref="animations.whip" width="576" height="256"></canvas>
    </div>

    <h2 class="font-bold text-slate-300">Hurt</h2>
    <div class="bg-slate-300 rounded max-w-min" :style="{zoom: (zoomed ? '200%' : '100%')}">
    <canvas :ref="animations.hurt" width="384" height="64"></canvas>
    </div>

    <h2 class="font-bold text-slate-300">Idle</h2>
    <div class="bg-slate-300 rounded max-w-min" :style="{zoom: (zoomed ? '200%' : '100%')}">
    <canvas :ref="animations.idle" width="64" height="256"></canvas>
    </div>
  </div>
</template>