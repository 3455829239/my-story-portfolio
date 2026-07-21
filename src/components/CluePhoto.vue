<script setup>
defineProps({
  clue: { type: Object, required: true },
  active: { type: Boolean, default: false },
  /** 大格铺满：cover；小格可自然比例 */
  fill: { type: Boolean, default: true },
})

defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    class="group clue-photo flex h-full w-full flex-col border-0 bg-transparent p-0 text-left outline-none"
    @click="$emit('select', clue)"
  >
    <div class="relative min-h-0 flex-1 overflow-hidden bg-transparent">
      <img
        v-if="clue.src"
        :src="clue.src"
        :alt="clue.title"
        class="select-none bg-transparent mix-blend-multiply grayscale opacity-90 contrast-125 transition-all duration-300 ease-in-out group-hover:grayscale-0 group-hover:opacity-100 group-focus-visible:grayscale-0 group-focus-visible:opacity-100"
        :class="
          fill
            ? 'h-full w-full object-cover object-top'
            : 'h-auto max-h-full w-full object-contain object-top'
        "
        draggable="false"
      />
      <div
        v-else
        class="flex h-full min-h-[120px] items-center justify-center text-[9px] text-zinc-500"
      >
        NO IMAGE
      </div>

      <template v-if="active && clue.analysis?.annotations?.length">
        <div
          v-for="(ann, i) in clue.analysis.annotations"
          :key="i"
          class="pointer-events-none absolute border border-zinc-500 bg-zinc-500/15"
          :style="{
            left: `${ann.x}%`,
            top: `${ann.y}%`,
            width: `${ann.w}%`,
            height: `${ann.h}%`,
          }"
        >
          <span
            class="absolute left-0 top-0 max-w-full bg-zinc-700 px-0.5 text-[7px] font-bold text-white"
          >
            {{ ann.note }}
          </span>
        </div>
      </template>
    </div>

    <div class="shrink-0 border-t border-black/10 bg-transparent px-1.5 py-1">
      <p class="font-mono text-[8px] text-zinc-600">#{{ clue.id }}</p>
      <p class="text-[11px] font-bold leading-tight text-[#1a1a1a]">{{ clue.title }}</p>
    </div>
  </button>
</template>
