<script setup>
import { getClueConnections, getCluePins } from '../data/sceneLayout'

const lines = getClueConnections()
const pins = getCluePins()

// central anchor (matches ClueWallView centerpiece position)
const center = { x: 50, y: 40 }

// pick two important pins (first and fourth clue) to connect from center
// getCluePins returns [cassette, ...pins, terminal] so index 1 maps to first clue
const highlightIndexes = [1, 4]
const highlightPins = highlightIndexes.map(i => pins[i]).filter(Boolean)

function makeCurvePath(from, to) {
  // create a smooth slightly sagging cubic Bezier path from `from` to `to`
  const dx = (to.x - from.x) * 0.32
  const midY = (from.y + to.y) / 2
  const sag = Math.max(4, Math.abs(to.y - from.y) * 0.18)
  const c1x = from.x + dx
  const c1y = midY + sag
  const c2x = to.x - dx
  const c2y = midY + sag
  return `M ${from.x} ${from.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${to.x} ${to.y}`
}
</script>

<template>
  <svg
    class="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <!-- structural lines (subtle, de-emphasized) -->
    <line
      v-for="(line, i) in lines"
      :key="`line-${i}`"
      :x1="line.x1"
      :y1="line.y1"
      :x2="line.x2"
      :y2="line.y2"
      stroke="#4a2b2b"
      stroke-width="0.12"
      stroke-opacity="0.22"
    />

    <!-- a couple of crimson strings to the most relevant pins (curved paths) -->
    <g stroke="#c41e3a" stroke-opacity="0.95" fill="none">
      <path
        v-for="(pin, i) in highlightPins"
        :key="`center-path-${i}`"
        :d="makeCurvePath(center, pin)"
        stroke-width="0.28"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- pin anchors -->
    <circle
      v-for="(pin, i) in pins"
      :key="`pin-${i}`"
      :cx="pin.x"
      :cy="pin.y"
      r="0.9"
      fill="#8b0000"
      stroke="#c41e3a"
      stroke-width="0.18"
    />
  </svg>
</template>
