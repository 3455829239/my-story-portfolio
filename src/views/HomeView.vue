<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DeskItem from '../components/DeskItem.vue'
import { DESK_ASPECT, deskBackground, deskItems } from '../data/sceneLayout'
import { useBlurUp } from '../composables/useBlurUp'
import { useGameTransition } from '../composables/useGameTransition'

const router = useRouter()
const { isTransitioning, playExitToClueWall } = useGameTransition()
const { ready: bgReady } = useBlurUp(deskBackground.full)

const overlayRef = ref(null)

async function onSelectItem(item) {
  if (isTransitioning.value) return

  await playExitToClueWall({
    overlayRef: overlayRef.value,
    panelRef: null,
    onComplete: () => {
      router.push({ name: 'clue-wall', params: { track: item.track } })
    },
  })
}
</script>

<template>
  <div class="scene-canvas grid place-items-center bg-black">
    <!-- 等比画布：所有物品相对此容器用百分比定位 -->
    <div
      class="scene-frame relative overflow-hidden"
      :style="{
        aspectRatio: DESK_ASPECT,
        width: `min(100vw, calc(100vh * ${DESK_ASPECT}))`,
        height: `min(100vh, calc(100vw / ${DESK_ASPECT}))`,
      }"
    >
      <!-- Blur-up：低清先显示 -->
      <img
        :src="deskBackground.lqip"
        alt=""
        class="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover blur-md"
        aria-hidden="true"
      />
      <!-- 高清淡入 -->
      <img
        :src="deskBackground.full"
        alt="桌面场景"
        class="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
        :class="bgReady ? 'opacity-100' : 'opacity-0'"
      />

      <!-- 可点击物品层 -->
      <DeskItem
        v-for="item in deskItems"
        :key="item.id"
        :item="item"
        :disabled="isTransitioning"
        @select="onSelectItem"
      />

      <!-- 过渡遮罩（保留现有 GSAP 过渡） -->
      <div
        ref="overlayRef"
        class="pointer-events-none absolute inset-0 z-20 bg-black/70 opacity-0"
      />
    </div>
  </div>
</template>
