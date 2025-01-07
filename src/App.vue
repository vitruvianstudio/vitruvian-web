<script setup lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import CharacterView from '@/components/CharacterView.vue'
import HorseView from '@/components/HorseView.vue'

import {ref, watch} from 'vue'

let tab = ref('character');

</script>

<template>
  <div class="flex flex-col h-screen bg-slate-900 scrollbar-thumb-violet-950 scrollbar-track-transparent scrollbar-thumb-rounded">
    <header class="flex bg-slate-900 text-slate-300 h-16 px-4 items-center gap-4 border-b border-slate-800">
      <div class="flex gap-2 w-96 items-center text-slate-400">
        <img :src="'logo.png'" class="border-slate-600 border-2 rounded-full h-11 bg-slate-800">
        <h1>Vitruvian - LPC Studio</h1>
      </div>
      <div class="grow flex gap-2 justify-center">
        <button @click="tab = 'character'" class="p-1 px-2 rounded" :class="{'bg-slate-700': tab == 'character', 'hover:bg-slate-800': tab != 'character'}"><i class="mdi mdi-human"></i> Character</button>
        <button @click="tab = 'horse'" class="p-1 px-2 rounded" :class="{'bg-slate-700': tab == 'horse', 'hover:bg-slate-800': tab != 'horse'}"><i class="mdi mdi-horse"></i> Horse</button>
      </div>
      <div class="text-right w-96">
        <a href="https://www.github.com/vitruvianstudio" target="_blank" class="text-2xl"><i class="mdi mdi-github"></i></a>
      </div>
    </header>
    <div class="h-[0px]"></div>

    <character-view :class="{hidden: tab != 'character'}"></character-view>
    <horse-view :class="{hidden: tab != 'horse'}"></horse-view>

    <footer class="h-10 flex items-center justify-center bg-slate-800 text-slate-200 text-sm gap-5"><div>&copy; 2023 by napsio</div> <div class="font-bold text-red-600"><i class="mdi mdi-alert-outline text-yellow-300"></i> currently not suitable for productive use. in the future, many things may change and the savings may become invalid</div></footer>
  </div>
</template>

<style scoped>

</style>
