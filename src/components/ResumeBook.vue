<script setup>
import { pctStyle } from '../data/sceneLayout'

defineProps({
  track: { type: Object, required: true },
  layout: { type: Object, required: true },
})
</script>

<template>
  <div
    class="absolute overflow-hidden bg-[#f5f0e8] text-[#3a3028] shadow-lg"
    :style="pctStyle(layout)"
  >
    <div class="h-full overflow-auto p-5 md:p-6">
      <p class="text-[10px] tracking-[0.3em] text-[#8a7a6a]">{{ track.subtitle }}</p>
      <h2 class="mt-1 text-xl font-bold md:text-2xl">{{ track.label }}</h2>
      <p class="mt-3 text-xs leading-relaxed text-[#5a4a3a] md:text-sm">
        这里是简历主内容区域。摊开的书本承载你的核心经历，周围线索照片提供悬疑氛围。
      </p>
      <ul class="mt-4 space-y-2 text-xs md:text-sm">
        <li v-for="clue in track.clues" :key="clue.id" class="text-[#4a3a2a]">
          · {{ clue.title }} — {{ clue.desc }}
        </li>
      </ul>
    </div>
  </div>
</template>
