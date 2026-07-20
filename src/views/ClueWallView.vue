<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import CluePhoto from "../components/CluePhoto.vue";
import ConnectionLines from "../components/ConnectionLines.vue";
import ResumeBook from "../components/ResumeBook.vue";
import {
  boardExtras,
  boardLabels,
  getEvidenceItems,
  pctStyle,
  resumeBookLayout,
  scoreLabels,
} from "../data/sceneLayout";
import { TRACKS } from "../data/tracks";

const props = defineProps({
  track: { type: String, required: true },
});

const router = useRouter();
const selectedId = ref(null);

const currentTrack = computed(() => TRACKS[props.track] ?? TRACKS.cs);
const evidenceItems = computed(() => getEvidenceItems(props.track));

const hoveredId = ref(null);
const showAllNotes = ref(false);
const selected = computed(
  () => evidenceItems.value.find((e) => e.id === selectedId.value) ?? null,
);

const scoreEntries = computed(() => {
  if (!selected.value?.analysis?.scores) return [];
  return Object.entries(selected.value.analysis.scores).map(([key, value]) => ({
    key,
    label: scoreLabels[key] ?? key,
    value,
  }));
});

function goBack() {
  router.push({ name: "home" });
}

function onClueSelect(clue) {
  selectedId.value = selectedId.value === clue.id ? null : clue.id;
}

function onClueHover(clue) {
  hoveredId.value = clue?.id ?? null;
}

function toggleShowAllNotes() {
  showAllNotes.value = !showAllNotes.value;
}

// Clear hoveredId when pointer leaves the scene or moves away from any card
function handlePointerMove(e) {
  // If hovering over an element with class "clue-photo-wrapper", keep hoveredId.
  // Otherwise clear hoveredId so notes disappear when pointer moves away.
  const el = e.target.closest?.('.clue-photo-wrapper')
  if (!el) hoveredId.value = null
}

// Note-specific style: keep left/width/transform but allow height to auto-size
// and nudge the top a little to avoid tight overlap with the card.
function pctStyleNote(layout) {
  if (!layout) return undefined
  const base = pctStyle(layout)
  // nudge down by 2 percentage points to reduce overlap
  const topPct = parseFloat(layout.y || 0) + 2
  return {
    ...base,
    top: `${topPct}%`,
    height: 'auto',
  }
}
</script>

<template>
  <div class="scene-canvas relative overflow-hidden">
    <!-- L0 原有深色 -->
    <div class="absolute inset-0 bg-[#1a1510]" />
    <div class="absolute inset-y-0 left-0 w-[38%] bg-[#3d2e1f]" />
    <div class="absolute inset-y-0 left-[38%] right-0 bg-[#4a3f35]" />

    <div
      class="pointer-events-none absolute inset-0 opacity-25"
      style="
        background-image:
          linear-gradient(rgba(0, 0, 0, 0.35) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.35) 1px, transparent 1px);
        background-size: 56px 32px;
      "
    />

    <!-- 调查板 -->
    <div class="absolute inset-0 z-10" @pointermove="handlePointerMove">
      <ConnectionLines />

      <CluePhoto
        v-for="item in evidenceItems"
        :key="item.id"
        :clue="item"
        :layout="item.layout"
        @hover="onClueHover"
      />

      <template v-for="noteItem in evidenceItems" :key="`note-${noteItem.id}`">
        <div
          v-if="noteItem.analysisLayout && (showAllNotes || hoveredId === noteItem.id)"
          class="absolute z-30 w-[270px] rounded-sm bg-[#fbf8ef] p-3 text-xs leading-relaxed text-[#2c2c2c] shadow-[2px_4px_12px_rgba(0,0,0,0.18)] pointer-events-none transition-all duration-300"
          :style="noteItem.analysisLayout ? pctStyleNote(noteItem.analysisLayout) : undefined"
        >
          <!-- 顶部的拟真半透明胶带 -->
          <div
            class="absolute -top-2 left-1/2 h-3 w-10 -translate-x-1/2 bg-white/50 backdrop-blur-[1px] rotate-1 shadow-sm"
          ></div>

          <!-- 极简标头 -->
          <div
            class="flex items-center justify-between border-b border-black/5 pb-1 mb-1.5 font-mono text-[9px] tracking-widest text-zinc-400"
          >
            <span>NOTE #0{{ noteItem.id }}</span>
            <span class="font-bold text-amber-600"
              >SCORE: {{ noteItem.analysis?.scores?.visual || "--" }}</span
            >
          </div>

          <!-- 分析摘要（自动换行、高度自动撑开） -->
          <p
            class="text-[11px] font-sans font-normal text-[#333] mb-1.5 whitespace-normal break-words"
          >
            {{ noteItem.analysis?.summary }}
          </p>

          <!-- 结论/证据指向 -->
          <p
            class="text-[10px] font-mono text-rose-600/90 font-medium whitespace-normal break-words"
          >
            {{ noteItem.analysis?.verdict }}
          </p>
        </div>
      </template>

      <div class="relative z-20">
        <ResumeBook :track="currentTrack" :layout="resumeBookLayout" />
      </div>

      <div
        v-for="extra in boardExtras"
        :key="extra.id"
        class="pointer-events-none absolute z-10 flex items-center justify-center border-2 border-black bg-[#12121a]/90 text-[9px] tracking-widest text-zinc-400 shadow-lg"
        :style="pctStyle(extra)"
      >
        {{ extra.label }}
      </div>

      <div
        v-for="label in boardLabels"
        :key="label.id"
        class="pointer-events-none absolute z-10 flex items-center justify-center px-1 text-center text-[9px] font-bold tracking-wider shadow"
        :class="
          label.stamp
            ? 'border-2 border-black bg-transparent text-[#ff3366]'
            : 'bg-[#f5f0e8] text-[#3a3028]'
        "
        :style="pctStyle(label)"
      >
        {{ label.text }}
      </div>
    </div>

    <!-- 返回 -->
    <div class="absolute left-0 top-0 z-[60] p-4">
      <button
        type="button"
        class="rounded border-2 border-black bg-black/40 px-3 py-1.5 text-xs tracking-widest text-zinc-400 backdrop-blur-sm transition hover:border-black/60 hover:text-white"
        @click="goBack"
      >
        ← 返回桌前
      </button>
      <button
        type="button"
        class="mt-3 rounded border-2 border-black bg-white/90 px-3 py-1.5 text-xs tracking-widest text-[#111] transition hover:border-black/60 hover:bg-[#f3f0e4]"
        @click="toggleShowAllNotes"
      >
        {{ showAllNotes ? '隐藏所有便利贴' : '显示所有便利贴' }}
      </button>
      <p class="mt-3 text-[10px] tracking-[0.35em] text-zinc-500">
        {{ currentTrack.subtitle }} · EVIDENCE MAPPING
      </p>
      <h1 class="mt-1 text-lg font-bold text-white/85">
        {{ currentTrack.label }}
      </h1>
      <p class="mt-2 text-[10px] text-zinc-600">点击线索卡 · 展开破案式审计</p>
    </div>
  </div>
</template>
