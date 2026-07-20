<script setup>
import { pctStyle } from '../data/sceneLayout'

const props = defineProps({
  label: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  w: { type: Number, required: true },
  h: { type: Number, required: true },
})

defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    class="absolute cursor-pointer border-2 border-dashed border-black bg-transparent transition-colors hover:bg-black/10"
    :style="pctStyle(props)"
    @click="$emit('select')"
  >
    <span class="p-1 text-xs text-white/70">{{ label }}</span>
  </button>
</template>
