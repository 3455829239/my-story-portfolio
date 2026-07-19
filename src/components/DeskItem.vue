<script setup>
import { pctBox } from '../data/sceneLayout'

const props = defineProps({
  item: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    class="desk-item group absolute z-10 cursor-pointer border-0 bg-transparent p-0 outline-none disabled:cursor-wait"
    :style="pctBox(item)"
    :disabled="disabled"
    :aria-label="item.label"
    @click="$emit('select', item)"
  >
    <img
      :src="item.src"
      :alt="item.label"
      class="desk-item__img h-full w-full object-contain select-none"
      draggable="false"
    />
  </button>
</template>

<style scoped>
.desk-item__img {
  transition:
    filter 0.3s ease,
    transform 0.3s ease;
}

.desk-item:hover:not(:disabled) .desk-item__img,
.desk-item:focus-visible .desk-item__img {
  filter:
    brightness(1.12)
    drop-shadow(0 0 14px rgba(255, 220, 120, 0.85))
    drop-shadow(0 0 28px rgba(255, 200, 80, 0.45));
  transform: scale(1.02);
}
</style>
