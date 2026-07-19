<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CluePhoto from '../components/CluePhoto.vue'
import ConnectionLines from '../components/ConnectionLines.vue'
import ResumeBook from '../components/ResumeBook.vue'
import SpotlightOverlay from '../components/SpotlightOverlay.vue'
import { cluePositions, decorItems, pctStyle, resumeBookLayout } from '../data/sceneLayout'
import { TRACKS } from '../data/tracks'

const props = defineProps({
  track: { type: String, required: true },
})

const router = useRouter()

const currentTrack = computed(() => TRACKS[props.track] ?? TRACKS.cs)

const clueItems = computed(() =>
  currentTrack.value.clues.map((clue, index) => ({
    clue,
    layout: cluePositions[index] ?? cluePositions[0],
  }))
)

function goBack() {
  router.push({ name: 'home' })
}

function onClueSelect(clue) {
  console.log('线索点击:', clue.title)
}
</script>

<template>
  <div class="scene-canvas relative">
    <!-- L0 场景分区占位 -->
    <div class="absolute inset-0 bg-[#1a1510]" />
    <div class="absolute inset-y-0 left-0 w-[38%] bg-[#3d2e1f]" />
    <div class="absolute inset-y-0 right-0 left-[38%] bg-[#4a3f35]" />

    <!-- 左墙标注 -->
    <div class="pointer-events-none absolute left-4 top-4 z-[1]">
      <p class="text-[10px] tracking-[0.35em] text-white/25">CLUE WALL</p>
    </div>

    <!-- L1 红线 + 图钉 -->
    <ConnectionLines />

    <!-- L2 墙上线索照片 -->
    <CluePhoto
      v-for="item in clueItems"
      :key="item.clue.id"
      :clue="item.clue"
      :layout="item.layout"
      @select="onClueSelect"
    />

    <!-- L3 中间简历书 -->
    <ResumeBook :track="currentTrack" :layout="resumeBookLayout" />

    <!-- L4 桌面装饰物 -->
    <div
      v-for="decor in decorItems"
      :key="decor.id"
      class="pointer-events-none absolute flex items-center justify-center border border-dashed border-white/20 bg-white/10"
      :style="pctStyle(decor)"
    >
      <span class="text-[9px] text-white/50">{{ decor.label }}</span>
    </div>

    <!-- L5 聚光灯暗层 -->
    <SpotlightOverlay />

    <!-- L6 UI（不受聚光灯影响，置于最上层） -->
    <div class="absolute left-0 top-0 z-[60] p-4">
      <button
        type="button"
        class="rounded border border-white/20 bg-black/40 px-3 py-1.5 text-xs tracking-widest text-white/70 backdrop-blur-sm transition hover:border-white/40 hover:text-white"
        @click="goBack"
      >
        ← 返回桌前
      </button>
      <p class="mt-3 text-[10px] tracking-[0.3em] text-white/40">
        {{ currentTrack.subtitle }}
      </p>
      <h1 class="mt-1 text-lg font-bold text-white/80">{{ currentTrack.label }}</h1>
    </div>
  </div>
</template>
