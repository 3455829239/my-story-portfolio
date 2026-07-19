<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const mouseX = ref(50)
const mouseY = ref(50)

function updateMouse(e) {
  mouseX.value = (e.clientX / window.innerWidth) * 100
  mouseY.value = (e.clientY / window.innerHeight) * 100
}

onMounted(() => {
  window.addEventListener('mousemove', updateMouse)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
})
</script>

<template>
  <div
    class="spotlight-overlay"
    :style="{ '--mx': `${mouseX}%`, '--my': `${mouseY}%` }"
  />
</template>

<style scoped>
.spotlight-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.92);
  -webkit-mask-image: radial-gradient(
    circle 140px at var(--mx) var(--my),
    transparent 0%,
    rgba(0, 0, 0, 0.4) 55%,
    black 100%
  );
  mask-image: radial-gradient(
    circle 140px at var(--mx) var(--my),
    transparent 0%,
    rgba(0, 0, 0, 0.4) 55%,
    black 100%
  );
}
</style>
