<script setup>
import { getClueConnections, getCluePins } from '../data/sceneLayout'

const lines = getClueConnections()
const pins = getCluePins()
</script>

<template>
  <svg
    class="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <line
      v-for="(line, i) in lines"
      :key="`line-${i}`"
      :x1="line.x1"
      :y1="line.y1"
      :x2="line.x2"
      :y2="line.y2"
      stroke="#c41e3a"
      stroke-width="0.25"
      stroke-opacity="0.85"
    />
    <circle
      v-for="(pin, i) in pins"
      :key="`pin-${i}`"
      :cx="pin.x"
      :cy="pin.y"
      r="0.8"
      fill="#8b0000"
      stroke="#c41e3a"
      stroke-width="0.15"
    />
  </svg>
</template>
