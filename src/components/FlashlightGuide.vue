<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'

const emit = defineEmits(['done'])

const active = ref(false)
const closing = ref(false)
const flashlightOn = ref(false)
const rootEl = ref(null)
const tip = ref(null)
const tipShown = ref(false)
const tipPos = ref(null)
const tipMode = ref('center') // center | anchor | bottom
const revealed = reactive({
  map: false,
  rule: false,
  fail: false,
  win: false,
})

let timers = []
let fading = false

const ORDER = ['map', 'rule', 'fail', 'win']
const FADE_MS = 1400
const EXIT_MS = 1100

const TIPS = {
  intro: {
    caseId: 'CASE FILE #001',
    lines: ['离 18:00 下班还有 3 分钟！', '先找「逃离工位的地图」'],
  },
  map: {
    caseId: 'CASE FILE #001',
    lines: ['发现逃生路线'],
  },
  rule: {
    caseId: 'CASE FILE #002',
    lines: ['超级恶厂规则手册', '开始越狱'],
  },
  fail: {
    caseId: 'CASE FILE #003',
    lines: ['抓捕归案：加班到死！'],
  },
  win: {
    caseId: 'CASE FILE #004',
    lines: ['成功逃脱'],
  },
  done: {
    simple: true,
    lines: ['已找完所有路径卡片'],
  },
}

function later(fn, ms) {
  const id = setTimeout(fn, ms)
  timers.push(id)
  return id
}

function delay(ms) {
  return new Promise((resolve) => later(resolve, ms))
}

function hitGuide(el) {
  if (!el) return null
  const node = el.closest?.('[data-guide]')
  return node?.getAttribute('data-guide') || null
}

function anchorNear(el) {
  const r = el.getBoundingClientRect()
  const tw = 300
  const th = 140
  let left = r.right + 14
  let top = r.top + r.height * 0.15
  if (left + tw > window.innerWidth - 12) left = Math.max(12, r.left - tw - 14)
  if (top + th > window.innerHeight - 12) top = Math.max(12, window.innerHeight - th - 12)
  if (top < 12) top = 12
  tipPos.value = { left, top }
}

async function showTip(key, el, mode = 'anchor') {
  while (fading) await delay(40)
  fading = true
  const fadeMs = mode === 'center' ? FADE_MS : 420
  if (tip.value && tipShown.value) {
    tipShown.value = false
    await delay(fadeMs)
  }
  tip.value = TIPS[key] || null
  tipMode.value = mode
  if (mode === 'anchor' && el) anchorNear(el)
  else tipPos.value = null
  await nextTick()
  requestAnimationFrame(() => {
    tipShown.value = true
    fading = false
  })
}

function reveal(key) {
  const next = ORDER.find((k) => !revealed[k])
  if (key !== next) return
  revealed[key] = true
  const target = document.querySelector(`[data-guide="${key}"]`)
  target?.classList.add('guide-lit')
  showTip(key, target, 'anchor')

  if (ORDER.every((k) => revealed[k])) {
    later(() => showTip('done', null, 'bottom'), 1200)
  }
}

function onMove(e) {
  const el = rootEl.value
  if (el) {
    el.style.setProperty('--fg-x', `${e.clientX}px`)
    el.style.setProperty('--fg-y', `${e.clientY}px`)
  }
  if (!flashlightOn.value || e.buttons !== 0 || closing.value) return
  const key = hitGuide(e.target)
  const next = ORDER.find((k) => !revealed[k])
  if (key && key === next) reveal(key)
}

function clearTimers() {
  timers.forEach(clearTimeout)
  timers = []
}

async function finish() {
  if (closing.value || !active.value) return
  closing.value = true
  tipShown.value = false
  clearTimers()
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('click', onClick)
  await delay(EXIT_MS)
  document.querySelectorAll('.guide-lit').forEach((el) => el.classList.remove('guide-lit'))
  active.value = false
  emit('done')
}

function onClick() {
  finish()
}

async function boot() {
  active.value = true
  tipMode.value = 'center'
  tip.value = TIPS.intro
  await nextTick()
  requestAnimationFrame(() => {
    tipShown.value = true
  })

  // 淡入后停留 → 慢速淡出（仍黑屏）→ 再淡入手电筒
  await delay(2800)
  tipShown.value = false
  await delay(FADE_MS)
  tip.value = null
  await delay(500)
  flashlightOn.value = true
}

onMounted(() => {
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('click', onClick)
  boot()
})

onUnmounted(() => {
  clearTimers()
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('click', onClick)
  document.querySelectorAll('.guide-lit').forEach((el) => el.classList.remove('guide-lit'))
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="active"
      ref="rootEl"
      class="fg-root"
      :class="{ 'is-closing': closing }"
      aria-live="polite"
      style="--fg-x: 35vw; --fg-y: 40vh"
    >
      <!-- 双层遮罩：用 opacity 过渡，避免 background 切换卡顿 -->
      <div class="fg-black" :class="{ 'is-out': flashlightOn }" />
      <div class="fg-beam" :class="{ 'is-on': flashlightOn }" />
      <div
        v-if="tip"
        class="fg-tip"
        :class="{
          'is-show': tipShown,
          'fg-tip--center': tipMode === 'center',
          'fg-tip--bottom': tipMode === 'bottom',
          'fg-tip--simple': tip.simple,
        }"
        :style="
          tipMode === 'anchor' && tipPos
            ? { left: tipPos.left + 'px', top: tipPos.top + 'px' }
            : null
        "
      >
        <template v-if="tip.simple">
          <p class="fg-line">{{ tip.lines[0] }}</p>
        </template>
        <template v-else>
          <p class="fg-case">{{ tip.caseId }}</p>
          <p v-for="(line, i) in tip.lines" :key="i" class="fg-line">{{ line }}</p>
          <p class="fg-hint">点击屏幕关闭手电筒</p>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style>
.fg-root {
  position: fixed;
  inset: 0;
  z-index: 80;
  pointer-events: none;
  opacity: 1;
  transition: opacity 1.1s ease;
}

.fg-root.is-closing {
  opacity: 0;
}

.fg-black,
.fg-beam {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.fg-black {
  background: rgba(4, 3, 2, 0.96);
  opacity: 1;
  transition: opacity 1.35s ease;
}

.fg-black.is-out {
  opacity: 0;
}

.fg-beam {
  background: radial-gradient(
    circle 130px at var(--fg-x) var(--fg-y),
    transparent 0%,
    transparent 28%,
    rgba(8, 6, 4, 0.55) 55%,
    rgba(5, 4, 3, 0.92) 100%
  );
  opacity: 0;
  transition: opacity 1.35s ease;
}

.fg-beam.is-on {
  opacity: 1;
}

.fg-tip {
  position: fixed;
  z-index: 81;
  width: min(320px, calc(100vw - 32px));
  padding: 18px 20px;
  border-radius: 14px;
  pointer-events: none;
  color: #fff6e8;
  background: linear-gradient(145deg, #5c3a1e 0%, #3d2412 100%);
  border: 1px solid #e8a04a;
  box-shadow:
    0 0 12px rgba(255, 140, 40, 0.55),
    0 0 28px rgba(255, 120, 20, 0.25),
    inset 0 1px 0 rgba(255, 220, 160, 0.25);
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", "Segoe UI", sans-serif;
  opacity: 0;
  transition: opacity 0.45s ease;
}

.fg-tip--center {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 1.4s ease;
}

.fg-tip--bottom {
  left: 50%;
  bottom: 36px;
  top: auto;
  transform: translateX(-50%);
  width: auto;
  max-width: min(360px, calc(100vw - 32px));
  padding: 12px 18px;
}

.fg-tip--simple .fg-line {
  margin: 0;
  text-align: center;
}

.fg-tip.is-show {
  opacity: 1;
}

.fg-case {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #ffb45a;
  text-shadow: 0 0 8px rgba(255, 160, 60, 0.55);
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.fg-line {
  margin: 0 0 8px;
  font-size: 16px;
  line-height: 1.55;
  font-weight: 600;
  color: #fff6e8;
  letter-spacing: 0.02em;
}

.fg-hint {
  margin: 12px 0 0;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: #d4b08a;
  font-weight: 500;
}

.guide-lit img {
  filter: grayscale(0) !important;
  opacity: 1 !important;
  transition: filter 0.55s ease, opacity 0.55s ease !important;
}
</style>
