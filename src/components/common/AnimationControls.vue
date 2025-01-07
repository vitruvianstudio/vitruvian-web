<script setup lang="ts">
import UIButton from '@/components/ui/Button.vue'

const props = defineProps([
  'directionUpDisabled',
  'directionLeftDisabled',
  'directionRightDisabled',
  'directionDownDisabled',
  'directionUpHidden',
  'directionLeftHidden',
  'directionRightHidden',
  'directionDownHidden',
  'zoomInDisabled',
  'zoomOutDisabled',
  'directionUpActive',
  'directionLeftActive',
  'directionRightActive',
  'directionDownActive',
  'totalFrames',
  'currentState',
  'currentFrame',
  'currentDirection',
  'currentSpeed',
  'currentZoom',
  'minZoom',
  'maxZoom'
])
</script>

<template>
  <div class="flex place-content-end w-44 min-w-44 h-full">
    <div class="place-content-center">
      <div class="grid grid-rows-3 grid-cols-3 gap-4 text-center w-40 bg-slate-700 p-4 rounded">
        <div></div>
        <div>
          <UIButton v-if="!directionUpHidden" @click="$emit('update:currentDirection', 'up')" :active="currentDirection == 'up'" :disabled="directionUpDisabled" ui="primary-square" title="Look Up" icon="arrow-up"></UIButton>
        </div>
        <div></div>
        <div>
          <UIButton v-if="!directionLeftHidden" @click="$emit('update:currentDirection', 'left')" :active="currentDirection == 'left'" :disabled="directionLeftDisabled" ui="primary-square" title="Look Left" icon="arrow-left"></UIButton>
        </div>
        <div>
          <UIButton @click="$emit('update:currentState', 'pause')" :class="{hidden: currentState == 'pause'}" ui="primary-square" title="Pause" icon="pause"></UIButton>
          <UIButton @click="$emit('update:currentState', 'play')" :class="{hidden: currentState == 'play'}" ui="primary-square" title="Play" icon="play"></UIButton>
        </div>
        <div>
          <UIButton v-if="!directionRightHidden" @click="$emit('update:currentDirection', 'right')" :active="currentDirection == 'right'" :disabled="directionRightDisabled" ui="primary-square" title="Look Right" icon="arrow-right"></UIButton>
        </div>
        <div></div>
        <div>
          <UIButton v-if="!directionDownHidden" @click="$emit('update:currentDirection', 'down')" :active="currentDirection == 'down'" ui="primary-square" title="Look Down" icon="arrow-down"></UIButton>
        </div>
        <div></div>
        <div>
          <UIButton @click="$emit('zoomOut')" :disabled="currentZoom <= minZoom" ui="primary-square" title="Zoom Out" icon="magnify-minus-outline"></UIButton>
        </div>
        <div>
          <UIButton @click="$emit('center')" title="Center" ui="primary-square" icon="image-filter-center-focus"></UIButton>
        </div>
        <div>
          <UIButton @click="$emit('zoomIn')" :disabled="currentZoom >= maxZoom" ui="primary-square" title="Zoom In" icon="magnify-plus-outline"></UIButton>
        </div>
        <div class="col-span-3">
          <label>
            <span class="text-xs font-bold text-slate-300">Zoom</span>
            <input class="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-[7px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-slate-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[1em] [&::-webkit-slider-thumb]:w-[1em] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:border-0 [&::-moz-range-track]:h-[7px]              [&::-moz-range-track]:rounded-full              [&::-moz-range-track]:bg-slate-800     [&::-moz-range-thumb]:appearance-none     [&::-moz-range-thumb]:h-[1em]     [&::-moz-range-thumb]:w-[1em]     [&::-moz-range-thumb]:rounded-full     [&::-moz-range-thumb]:bg-violet-500     [&::-moz-range-thumb]:border-0" @input="$emit('zoom-change', ($event.target as HTMLInputElement).value)" type="range" :min="minZoom" :max="maxZoom" :value="currentZoom">
          </label>
        </div>
        <div class="col-span-3">
          <label>
            <span class="text-xs font-bold text-slate-300">Speed</span>
            <input class="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-[7px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-slate-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[1em] [&::-webkit-slider-thumb]:w-[1em] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:border-0 [&::-moz-range-track]:h-[7px]              [&::-moz-range-track]:rounded-full              [&::-moz-range-track]:bg-slate-800     [&::-moz-range-thumb]:appearance-none     [&::-moz-range-thumb]:h-[1em]     [&::-moz-range-thumb]:w-[1em]     [&::-moz-range-thumb]:rounded-full     [&::-moz-range-thumb]:bg-violet-500     [&::-moz-range-thumb]:border-0" @input="$emit('update:current-speed', ($event.target as HTMLInputElement).value)" type="range" :min="1" :max="24" :value="currentSpeed">
          </label>
        </div>
        <div class="col-span-3">
          <label>
            <span class="text-xs font-bold text-slate-300">Frame</span>
            <input class="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-[7px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-slate-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[1em] [&::-webkit-slider-thumb]:w-[1em] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:border-0 [&::-moz-range-track]:h-[7px]              [&::-moz-range-track]:rounded-full              [&::-moz-range-track]:bg-slate-800     [&::-moz-range-thumb]:appearance-none     [&::-moz-range-thumb]:h-[1em]     [&::-moz-range-thumb]:w-[1em]     [&::-moz-range-thumb]:rounded-full     [&::-moz-range-thumb]:bg-violet-500     [&::-moz-range-thumb]:border-0" @input="$emit('update:current-frame', ($event.target as HTMLInputElement).value)" type="range" :min="0" :max="totalFrames - 1" :value="currentFrame">
          </label>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>