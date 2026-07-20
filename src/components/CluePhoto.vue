<script setup>
import { ref } from 'vue'
import { clueCardStyle } from '../data/sceneLayout'

const props = defineProps({
  clue: { type: Object, required: true },
  layout: { type: Object, required: true },
  active: { type: Boolean, default: false },
})

defineEmits(['hover'])

/** 按原图像素自适应，避免拉伸 / 大留白 */
const aspectRatio = ref(4 / 3)

function onImgLoad(e) {
  const { naturalWidth, naturalHeight } = e.target
  if (naturalWidth && naturalHeight) {
    aspectRatio.value = naturalWidth / naturalHeight
  }
}
</script>

<template>
  <button
    type="button"
    class="clue-photo-wrapper absolute block cursor-pointer border-0 bg-transparent p-0 text-left outline-none transition duration-300"
    :class="active ? 'z-50 brightness-110' : 'z-30 hover:z-40 hover:brightness-110'"
    :style="clueCardStyle({ ...layout, aspectRatio })"
    @pointerenter="$emit('hover', clue)"
    @pointerleave="$emit('hover', null)"
  >
    <!-- 拍立得外框（已改为黑底） -->
    <div
      class="relative w-full overflow-hidden bg-black p-2 pb-8 border-2 border-black shadow-[2px_4px_8px_rgba(0,0,0,0.35)] transition-all duration-200"
        :class="active ? 'shadow-[0_0_18px_rgba(255,51,102,0.75)] scale-105 z-50' : ''"
    >
      <div class="relative w-full overflow-hidden bg-black">
        <img
          v-if="clue.src"
          :src="clue.src"
          :alt="clue.title"
          class="block w-full h-auto object-contain select-none"
          draggable="false"
          @load="onImgLoad"
        />
        <div
          v-else
          class="flex aspect-[4/3] items-center justify-center bg-neutral-600 text-[10px] text-white/50"
        >
          NO IMAGE
        </div>

        <!-- 动态标注：仅选中时显示 -->
        <template v-if="active && clue.analysis?.annotations?.length">
          <div
            v-for="(ann, i) in clue.analysis.annotations"
            :key="i"
            class="pointer-events-none absolute border-2 border-[#ff3366] bg-[#ff3366]/10"
            :style="{
              left: `${ann.x}%`,
              top: `${ann.y}%`,
              width: `${ann.w}%`,
              height: `${ann.h}%`,
            }"
          >
            <span
              class="absolute -top-5 left-0 max-w-[180px] whitespace-nowrap bg-[#ff3366] px-1.5 py-0.5 text-[8px] font-bold text-white shadow"
            >
              {{ ann.note }}
            </span>
          </div>
        </template>
      </div>

      <div class="mt-2 px-1">
        <p class="text-[9px] tracking-widest text-white/60">EVIDENCE #{{ clue.id }}</p>
        <p class="text-[11px] font-semibold text-white">{{ clue.title }}</p>
      </div>

      <!-- 图钉 -->
      <span
        class="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#c41e3a] shadow"
      />
    </div>
  </button>
</template>