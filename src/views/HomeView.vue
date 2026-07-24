<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DeskItem from '../components/DeskItem.vue'
import { DESK_ASPECT, deskBackground, deskItems } from '../data/sceneLayout'
import { useBlurUp } from '../composables/useBlurUp'
import { useGameTransition } from '../composables/useGameTransition'

const router = useRouter()
const { isTransitioning, playExitToClueWall } = useGameTransition()
const { ready: bgReady } = useBlurUp(deskBackground.full)

const overlayRef = ref(null)
const sceneLit = ref(false)
const tipsIn = ref(false)
const secretTipOut = ref(false)
let tipTimer = null

async function onSelectItem(item) {
  if (isTransitioning.value) return

  await playExitToClueWall({
    overlayRef: overlayRef.value,
    panelRef: null,
    duration: item.id === 'photo' ? 1.2 : undefined,
    onComplete: () => {
      if (item.id === 'book') {
        router.push({ name: 'clue-wall', params: { track: item.track } })
      } else if (item.id === 'computer') {
        router.push({ name: 'computer' })
      } else if (item.id === 'photo') {
        router.push({ name: 'photo-board' })
      }
    },
  })
}

function onDeskEnter(item) {
  if (item.id === 'photo') secretTipOut.value = true
}

onMounted(() => {
  requestAnimationFrame(() => {
    sceneLit.value = true
  })
  tipTimer = setTimeout(() => {
    tipsIn.value = true
  }, 950)
})

onUnmounted(() => {
  if (tipTimer) clearTimeout(tipTimer)
})
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
        @mouseenter="onDeskEnter(item)"
      />

      <!-- 开屏提示：本子附近居中 -->
      <div
        class="home-tip home-tip--center"
        :class="{ in: tipsIn }"
        aria-hidden="true"
      >
        移动鼠标寻找线索
      </div>
      <!-- 开屏提示：照片旁（渐显 / 悬停照片后渐隐） -->
      <div
        class="home-tip home-tip--photo"
        :class="{ in: tipsIn, out: secretTipOut }"
        aria-hidden="true"
      >
        这里有秘密
      </div>

      <!-- 开屏黑幕：由黑渐亮 -->
      <div class="scene-veil" :class="{ out: sceneLit }" aria-hidden="true" />

      <!-- 过渡遮罩（保留现有 GSAP 过渡） -->
      <div
        ref="overlayRef"
        class="pointer-events-none absolute inset-0 z-20 bg-black/70 opacity-0"
      />
    </div>
  </div>
</template>

<style scoped>
.scene-veil {
  position: absolute;
  inset: 0;
  z-index: 25;
  background: #000;
  opacity: 1;
  pointer-events: none;
  transition: opacity 2s ease;
}

.scene-veil.out {
  opacity: 0;
}

.home-tip {
  position: absolute;
  z-index: 15;
  pointer-events: none;
  padding: 10px 16px;
  border-radius: 14px;
  font-size: clamp(13px, 1.5vw, 16px);
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.35;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 1.35s ease,
    transform 1.35s ease;
}

.home-tip.in {
  opacity: 1;
  transform: translateY(0);
}

.home-tip--center {
  left: 48%;
  top: 79%;
  transform: translate(-50%, 8px);
  color: #fff;
  background: rgba(78, 44, 28, 0.86);
  border: 1px solid rgba(210, 150, 100, 0.28);
  box-shadow:
    inset 0 1px 0 rgba(255, 220, 180, 0.18),
    0 0 10px rgba(200, 110, 55, 0.4),
    0 0 22px rgba(160, 80, 35, 0.28),
    0 4px 14px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(10px) saturate(1.1);
  -webkit-backdrop-filter: blur(10px) saturate(1.1);
}

.home-tip--center.in {
  transform: translate(-50%, 0);
}

.home-tip--photo {
  left: 78%;
  top: 16%;
  color: rgba(28, 28, 28, 0.88);
  background: rgba(245, 245, 245, 0.38);
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 4px 18px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(12px) saturate(1.15);
  -webkit-backdrop-filter: blur(12px) saturate(1.15);
}

.home-tip--photo.out {
  opacity: 0;
  transform: translateY(-4px);
  transition:
    opacity 1.1s ease,
    transform 1.1s ease;
}
</style>
