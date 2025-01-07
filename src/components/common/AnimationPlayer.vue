<script setup lang="ts">
import {ref, watch, onMounted, type Ref} from 'vue'

import AnimationControls from '@/components/common/AnimationControls.vue'
import {ItemCollection} from "@/types/ItemCollection";
import {Renderer} from "@/services/Renderer";

const props = defineProps<{
  collection: ItemCollection,
  current: string,
  renderer: Renderer
}>()

const canvas: Ref<HTMLCanvasElement | undefined> = ref();
const base: Ref<HTMLElement | undefined> = ref();
let context: CanvasRenderingContext2D | null = null;

const zoomMin: number = 2;
const zoomMax: number = 15;
const zoomStep: number = 1;

let animationRequestId: number = 0
let animationStartTime: number = 0

const currentCanvas: Ref<HTMLCanvasElement | undefined> = ref();
const playerState: Ref<string> = ref('pause');
const playerDirection: Ref<string> = ref('down');
const playerZoom: Ref<number> = ref(4);
const playerSpeed: Ref<number> = ref(8);
const totalFrames: Ref<number> = ref(0);
const currentFrame: Ref<number> = ref(0);

function getDirectionOffset() {
  const directionOffsets: any = {
    'up': 0,
    'left': 1,
    'down': (props.current === 'hurt') ? 0 : 2,
    'right': 3
  };

  return directionOffsets[playerDirection.value] || 0;
}

function init() {
  const animation: any = props.renderer.getAnimationCanvas(props.current);

  if (!animation.value) {
    return;
  }

  if (props.current === 'hurt') {
    playerDirection.value = 'down';
  }

  currentCanvas.value = animation.value;
  totalFrames.value = (animation.value.width / props.collection.getTileSize(props.current));

  //onZoom();
}

function animate() {
  init();
  cancelAnimationFrame(animationRequestId)
  animationStartTime = performance.now()
  animationRequestId = requestAnimationFrame(runAnimation)
}

function runAnimation(timestamp: number) {
  animationRequestId = requestAnimationFrame(runAnimation)

  init()

  const elapsedTime: number = timestamp - animationStartTime
  const nextFrame: number = Math.floor(elapsedTime / 1000 * playerSpeed.value) % totalFrames.value

  if (nextFrame === currentFrame.value) return

  if (playerState.value == 'play') {
    currentFrame.value = nextFrame
  }

  drawFrame(currentFrame.value);
}

function drawFrame(currentFrame: number) {
  const canvasTileSize: number = 192;
  const size: number = props.collection.getTileSize(props.current);
  const col: number = currentFrame;
  const row: number = getDirectionOffset();
  const x: number = (canvasTileSize - size) / 2;
  const y: number = (canvasTileSize - size) / 2;

  if (!currentCanvas.value) {
    return
  }

  context?.clearRect(0, 0, canvasTileSize, canvasTileSize);
  context?.drawImage(
      currentCanvas.value,
      col * size,
      row * size,
      size,
      size,
      x,
      y,
      size,
      size
  );

  if (!base.value) {
    return;
  }
}

function onZoomIn() {
  playerZoom.value += zoomStep;

  if (playerZoom.value > zoomMax) {
    playerZoom.value = zoomMax;
  }

  onZoom();
}

function onZoomOut() {
  playerZoom.value -= zoomStep;

  if (playerZoom.value < zoomMin) {
    playerZoom.value = zoomMin;
  }

  onZoom();
}

function onZoom(factor = null) {
  if (factor) {
    playerZoom.value = factor;
  }

  if(!canvas.value) {
    return
  }

  canvas.value.style.width = `${64 * playerZoom.value}px`;
  canvas.value.style.height = `${64 * playerZoom.value}px`;

  onCenter();
}

function onCenter() {
  if(!canvas.value || !base.value) {
    return
  }

  const parentNode: HTMLElement = base.value.parentNode as HTMLElement;
  const horizontalSpace: number = (canvas.value.offsetWidth - parentNode.offsetWidth) / 4;
  const verticalSpace: number = (canvas.value.offsetHeight - parentNode.offsetHeight) / 2;

  parentNode.scrollTo(horizontalSpace, verticalSpace);
}

onMounted(() => {
  if(canvas.value) {
    context = canvas.value.getContext('2d');
    onZoom();
    animate()
  }
})

watch(() => props.current, async () => {
  init()
})
</script>

<template>
  <div class="w-full h-full flex gap-5 place-content-around">
    <div class="grow overflow-scroll scrollbar-thin">
      <div ref="base"
           class="text-center leading-[0] flex place-content-center">
        <canvas
            class="h-fit aspect-square shrink-0 grow-0 relative pointer-events-none origin-center bg-cover bg-slate-700 rounded inline-block"
            style="image-rendering: pixelated;" ref="canvas" width="192" height="192"></canvas>
      </div>
    </div>

    <AnimationControls
        @zoom-in="onZoomIn"
        @zoom-out="onZoomOut"
        @zoom-change="onZoom"
        @center="onCenter"
        :direction-up-disabled="props.current == 'hurt'"
        :direction-left-disabled="props.current == 'hurt'"
        :direction-right-disabled="props.current == 'hurt'"
        :total-frames="totalFrames"
        :min-zoom="zoomMin"
        :max-zoom="zoomMax"
        v-model:current-state="playerState"
        v-model:current-frame="currentFrame"
        v-model:current-direction="playerDirection"
        v-model:current-speed="playerSpeed"
        v-model:current-zoom="playerZoom"
    />
  </div>
</template>
