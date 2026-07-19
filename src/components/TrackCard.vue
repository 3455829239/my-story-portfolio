<script setup>
defineProps({
  track: { type: Object, required: true },
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    class="group relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 text-left transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      track.border,
      track.accent,
      active ? track.glow : 'hover:scale-[1.02] hover:border-white/30',
    ]"
    :disabled="disabled"
    @click="$emit('select', track)"
  >
    <span class="text-[10px] tracking-[0.3em] text-zinc-500">{{ track.subtitle }}</span>
    <h2 class="mt-3 text-xl font-semibold text-white">{{ track.label }}</h2>
    <p class="mt-2 text-xs text-zinc-400 group-hover:text-zinc-300">
      进入线索墙 →
    </p>
    <div
      class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5 blur-2xl transition group-hover:bg-white/10"
    />
  </button>
</template>