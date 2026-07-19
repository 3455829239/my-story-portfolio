<script setup>
import { pctStyle } from '../data/sceneLayout'

const props = defineProps({
  clue: { type: Object, required: true },
  layout: { type: Object, required: true },
})

defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    class="absolute cursor-pointer border-4 border-white bg-neutral-500 grayscale transition hover:brightness-110"
    :style="pctStyle(layout)"
    @click="$emit('select', clue)"
  >
    <div class="flex h-full flex-col justify-between p-2">
      <span class="text-[9px] tracking-widest text-white/50">CLUE #{{ clue.id }}</span>
      <div class="bg-black/50 px-1 py-0.5">
        <p class="text-[10px] font-semibold text-white">{{ clue.title }}</p>
        <p class="line-clamp-2 text-[8px] text-white/70">{{ clue.desc }}</p>
      </div>
    </div>
  </button>
</template>
