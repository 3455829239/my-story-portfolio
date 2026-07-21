<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CluePhoto from '../components/CluePhoto.vue'
import { getEvidenceItems } from '../data/sceneLayout'
import { TRACKS } from '../data/tracks'
import failed3Img from '../assets/images/failed3.jpg'
import succeed3Img from '../assets/images/succeed3.jpg'
import paperTexture from '../assets/images/texture2.jpg'
import passedStamp from '../assets/images/passed.png'
import mudPrint from '../assets/images/footprint.png'

const TIMER_TOTAL = 3 * 60

const props = defineProps({
  track: { type: String, required: true },
})

const router = useRouter()
const selectedId = ref(null)
const remainingSec = ref(TIMER_TOTAL)
let timerId = null

const currentTrack = computed(() => TRACKS[props.track] ?? TRACKS.cs)
const evidenceItems = computed(() => getEvidenceItems(props.track))

const ruleBook = computed(() => evidenceItems.value.find((i) => i.id === 1))
const warMap = computed(() => evidenceItems.value.find((i) => i.id === 2))
const failCard = computed(() => evidenceItems.value.find((i) => i.id === 3))
const billCard = computed(() => evidenceItems.value.find((i) => i.id === 10))
const warnCards = computed(() =>
  evidenceItems.value.filter((i) => i.id === 7 || i.id === 8)
)

/** 粉色区：failed3；账单：succeed3 */
const failDoc = computed(() =>
  failCard.value ? { ...failCard.value, src: failed3Img, title: '加班失败' } : null
)
const lootBill = computed(() =>
  billCard.value ? { ...billCard.value, src: succeed3Img, title: '战利账单' } : null
)

const timerDisplay = computed(() => {
  const m = Math.floor(remainingSec.value / 60)
  const s = remainingSec.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

onMounted(() => {
  timerId = setInterval(() => {
    remainingSec.value = remainingSec.value <= 1 ? TIMER_TOTAL : remainingSec.value - 1
  }, 1000)
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})

function goBack() {
  router.push({ name: 'home' })
}

function onClueSelect(clue) {
  selectedId.value = selectedId.value === clue.id ? null : clue.id
}
</script>

<template>
  <div class="clue-desk h-full overflow-auto text-[#2c2822]">
    <div class="paper-stage mx-auto w-full max-w-[1680px] px-3 py-4 md:px-5">
      <div class="mb-3 flex items-center justify-between">
        <button
          type="button"
          class="border border-dashed border-[#5c5348] bg-[#e4dccf] px-2 py-0.5 text-[9px] tracking-widest text-[#3d3830] hover:bg-[#2c2822] hover:text-[#e4dccf]"
          @click="goBack"
        >
          ← 返回桌前
        </button>
        <p class="font-mono text-[9px] tracking-[0.25em] text-[#5c5348]">
          {{ currentTrack.subtitle }} · TWO-PAGE SPREAD
        </p>
      </div>

      <div class="spread">
        <img class="paper-fiber" :src="paperTexture" alt="" aria-hidden="true" />

        <!-- ========== 左页 ========== -->
        <section class="page page-left">
          <div
            class="col-span-6 flex items-center justify-between border-b border-dotted border-zinc-500 pb-1 font-mono text-[8px] tracking-widest text-zinc-500"
          >
            <span>Hawkins Post</span>
            <span>+</span>
            <span>No. 1183 Today's No. 01</span>
          </div>

          <!-- 地图主位 + 右侧竖列：倒计时 / LOG / 图例 / 方向 -->
          <div class="left-zone col-span-6">
            <img class="mud-print" :src="mudPrint" alt="" aria-hidden="true" />

            <!-- 顶栏通栏：填满标题与计时器之间的缝隙 -->
            <div class="left-top">
              <header
                class="group overflow-hidden border border-zinc-800 grayscale opacity-90 contrast-125 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
              >
                <div class="bg-zinc-900 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white">
                  STATUS: 倒计时 17:50
                </div>
                <div class="bg-black px-2 py-2.5">
                  <h1 class="text-2xl font-black leading-none text-white md:text-3xl">准点下班</h1>
                </div>
              </header>
              <div
                class="group flex flex-col justify-center border border-zinc-800 bg-black p-2 text-center grayscale opacity-90 contrast-125 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
              >
                <p class="font-mono text-[10px] text-zinc-400">距 18:00 还剩</p>
                <p
                  class="font-mono text-3xl font-bold tracking-wider text-zinc-200 transition-colors duration-300 group-hover:text-lime-400"
                >
                  {{ timerDisplay }}
                </p>
              </div>
            </div>

            <div class="left-zone-main">
              <article
                v-if="warMap"
                class="border border-zinc-800 bg-transparent"
                :class="selectedId === warMap.id ? 'outline outline-2 outline-zinc-500' : ''"
              >
                <div class="map-square bg-transparent">
                  <CluePhoto
                    :clue="warMap"
                    :active="selectedId === warMap.id"
                    :fill="true"
                    @select="onClueSelect"
                  />
                </div>
              </article>
            </div>

            <aside class="left-zone-side flex flex-col gap-0">
              <div
                class="border border-zinc-800 bg-zinc-900 p-2 font-mono text-[12px] leading-relaxed text-zinc-300 grayscale opacity-90 contrast-125 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
              >
                <p class="mb-1 font-bold tracking-widest text-white">EVENT LOG</p>
                <p>&gt; 倒计时已启动，准备开溜！</p>
                <p>&gt; 走到「茶水间」— 摸鱼中！</p>
                <p>&gt; 避开「老板室门口」</p>
                <p>&gt; 目标：电梯口</p>
              </div>

              <div
                class="border border-zinc-800 bg-[#d4d0c8] p-2 text-[12px] leading-snug grayscale opacity-90 contrast-125 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
              >
                <ul class="space-y-1">
                  <li class="font-mono text-[7px] font-bold tracking-widest text-zinc-600">LEGEND</li>
                  <li class="flex items-center gap-1.5">
                    <span class="inline-block h-2 w-2 shrink-0 border border-orange-500" />
                    起点 / 出口
                  </li>
                  <li class="flex items-center gap-1.5">
                    <span class="inline-block h-2 w-2 shrink-0 border border-zinc-500 bg-white" />
                    普通格
                  </li>
                  <li class="flex items-center gap-1.5">
                    <span class="inline-block h-2 w-2 shrink-0 bg-amber-400" />
                    拖延格
                  </li>
                  <li class="flex items-center gap-1.5">
                    <span class="inline-block h-2 w-2 shrink-0 bg-green-500" />
                    休息格（安全）
                  </li>
                  <li class="flex items-center gap-1.5">
                    <span class="inline-block h-2 w-2 shrink-0 bg-red-500" />
                    危险格（老板）
                  </li>
                </ul>
                <div class="mt-2 border-t border-zinc-500 pt-2">
                  <p class="mb-1.5 font-mono text-[8px] font-bold tracking-widest text-zinc-600">
                    DIRECTION
                  </p>
                  <div class="mx-auto grid w-[6.5rem] grid-cols-3 gap-1">
                    <span />
                    <button
                      type="button"
                      class="border border-zinc-700 bg-white py-2 text-base font-bold leading-none"
                    >
                      ↑
                    </button>
                    <span />
                    <button
                      type="button"
                      class="border border-zinc-700 bg-white py-2 text-base font-bold leading-none"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      class="border border-zinc-700 bg-white py-2 text-base font-bold leading-none"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      class="border border-zinc-700 bg-white py-2 text-base font-bold leading-none"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="border border-zinc-800 bg-[#f0ebe3] px-1.5 py-2 text-center text-[10px] font-black leading-snug tracking-wide"
              >
                开始越狱<br />CHIP & ROLL →
              </div>
            </aside>
          </div>

          <!-- 底部：规则手册 | 文字板块 并排自适应 -->
          <div class="bottom-pair col-span-6">
            <article
              v-if="ruleBook"
              class="border border-zinc-800 bg-transparent"
              :class="selectedId === ruleBook.id ? 'outline outline-2 outline-zinc-500' : ''"
            >
              <div class="rule-frame bg-transparent">
                <CluePhoto
                  :clue="ruleBook"
                  :active="selectedId === ruleBook.id"
                  :fill="false"
                  @select="onClueSelect"
                />
              </div>
            </article>
            <div class="p-2 font-mono text-[9px] leading-relaxed text-zinc-700">
              <p class="mb-1 text-[10px] font-bold tracking-widest text-zinc-500">
                网页设计理念分析
              </p>
              <div class="news-cols">
                <p>
                  设计决策：把“下班”这个普通场景游戏化，设计下班倒计时与各种奇怪的挑战，是一个模拟打工人生存的黑色幽默游戏系统。
                </p>
                <div>
                  <p class="mb-1">语义化颜色系统：</p>
                  <ul class="list-disc space-y-0.5 pl-4">
                    <li>主色：黑色 ▶ 创造-压迫感·工业感·游戏空间</li>
                    <li>强调色：红色 ▶ 危险-老板·加班·失败</li>
                    <li>黄色：任务·行动·警告</li>
                    <li>绿色：安全·成功·休息区</li>
                  </ul>
                </div>
                
              </div>
              <p class="mt-1.5 border-t border-dotted border-zinc-400 pt-1 text-[10px] text-zinc-500">
                模块来自游戏：最高摸鱼资产档案CONFIDENTIAL
              </p>
              <p class="mb-1">符合世界观，避免了 AI 生成网站中常见的模块化卡片堆叠，通过叙事化组件替代通用信息卡片。
              </p>
            </div>
          </div>
        </section>

        <!-- ========== 右页 ========== -->
        <section class="page page-right">
          <img class="stamp-passed" :src="passedStamp" alt="" aria-hidden="true" />

          <header class="col-span-6 border border-[#3a3530] bg-[#e0d8c8]/80 px-2 py-2 text-center">
            <h1 class="font-serif text-xl font-black tracking-[0.06em] md:text-2xl">
              THE EVIDENCE POST
            </h1>
            <p class="font-mono text-[8px] tracking-widest text-[#5c5348]">
              No. {{ currentTrack.id?.toUpperCase?.() || '01' }} · DIGITAL NEWSPAPER
            </p>
          </header>

          <!-- 警戒斜条纹（替代原 GAME OVER / ALERT 文字条） -->
          <div class="alert-stripe col-span-6" aria-hidden="true" />

          <section class="col-span-4 border border-[#3a3530] bg-black px-2.5 py-1.5 text-white">
            <h2 class="font-sans text-base font-black leading-tight md:text-lg">
              抓捕归案：加班到死！
            </h2>
            <p class="mt-1 font-sans text-[10px] leading-snug text-zinc-300">
              老板影子雷达于 17:59:58 锁定工位。差 2 秒，系统判定加班失败。
            </p>
          </section>
          <section class="col-span-2 border border-[#3a3530] bg-zinc-900 px-2.5 py-1.5 text-white">
            <h2 class="font-sans text-sm font-black">成功逃脱</h2>
            <p class="mt-1 font-sans text-[9px] text-zinc-400">同协议，对照结局。</p>
          </section>

          <article
            v-if="failDoc"
            class="col-span-4 w-full min-w-0 border border-[#3a3530] bg-transparent"
            :class="selectedId === failDoc.id ? 'outline outline-2 outline-zinc-500' : ''"
          >
            <div class="evidence-shot">
              <CluePhoto
                :clue="failDoc"
                :active="selectedId === failDoc.id"
                :fill="false"
                @select="onClueSelect"
              />
            </div>
          </article>

          <article
            v-if="lootBill"
            class="col-span-2 w-full min-w-0 border border-[#3a3530] bg-transparent"
            :class="selectedId === lootBill.id ? 'outline outline-2 outline-zinc-500' : ''"
          >
            <div class="evidence-shot">
              <CluePhoto
                :clue="lootBill"
                :active="selectedId === lootBill.id"
                :fill="false"
                @select="onClueSelect"
              />
            </div>
          </article>

          <!-- 底部三列：无外边框报纸栏 -->
          <div class="warn-row col-span-6">
            <aside class="px-1 font-mono text-[9px] leading-relaxed text-zinc-700">
              <p class="mb-1 text-[10px] font-bold tracking-widest text-zinc-500">用户路径设计：</p>
              <p>页面不是展示，而是“任务流程”</p>
              <p>
                流程：进入游戏➤选择区域➤执行行动➤触发事件➤结算让户成为参与者。将网页从静态信息展示转化为具有任务目标和反馈机制的体验流程。
              </p>
              <p class="mt-2 text-[8px] text-zinc-500">可改：archive · pantry · boss-door</p>
            </aside>

            <div class="warn-stack relative min-w-0">
              <article
                v-for="(item, i) in warnCards"
                :key="item.id"
                class="warn-card absolute w-[78%] border-2 border-zinc-900 bg-transparent transition-all duration-300 hover:z-20"
                :class="[
                  i === 0 ? 'warn-front' : 'warn-back',
                  selectedId === item.id ? 'outline outline-2 outline-zinc-500' : '',
                ]"
              >
                <div class="warn-frame overflow-hidden bg-transparent">
                  <CluePhoto
                    :clue="item"
                    :active="selectedId === item.id"
                    :fill="true"
                    @select="onClueSelect"
                  />
                </div>
              </article>
            </div>

            <aside class="px-1 font-mono text-[9px] leading-relaxed text-zinc-700">
              <p class="mb-1 text-[8px] font-bold tracking-widest text-zinc-500">FIELD NOTE R</p>
              <p>
                笔录右栏：两张巡视警告叠放。前卡「你们怎么…」，后卡露出「小张…」。加班延长 30
                秒。
              </p>
              <p class="mt-2 text-[8px] text-zinc-500">可改：patrol · overtime +30s</p>
            </aside>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 暗色桌面 + 泛黄新闻纸，降低刺眼对比 */
.clue-desk {
  background:
    radial-gradient(ellipse at 50% 30%, #4a433a 0%, #2a261f 55%, #1c1915 100%);
}

/* 入场：暗→亮、微缩放淡入 */
.paper-stage {
  animation: paper-in 0.6s ease-out forwards;
  transform-origin: 50% 40%;
}

@keyframes paper-in {
  from {
    opacity: 0;
    transform: scale(0.965);
    filter: brightness(0.45);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: brightness(1);
  }
}

.spread {
  position: relative;
  display: grid;
  grid-template-columns: 50fr 50fr;
  gap: 0;
  min-height: calc(100vh - 72px);
  isolation: isolate;
  overflow: hidden;
  border-radius: 2px;
  background: #e6dfd2;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 8px 20px rgba(0, 0, 0, 0.28),
    0 0 0 1px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 248, 230, 0.18);
}

/* 牛皮纸纤维 texture2：正片叠底 */
.paper-fiber {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85;
  mix-blend-mode: multiply;
  pointer-events: none;
  border-radius: inherit;
}

/* 半色调网点 + 细噪点 */
.spread::before {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 6;
  opacity: 0.2;
  mix-blend-mode: overlay;
  border-radius: inherit;
  background-image:
    radial-gradient(circle, rgba(0, 0, 0, 0.55) 0.55px, transparent 0.65px),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
  background-size:
    3px 3px,
    160px 160px;
}

/* 中缝折痕阴影 + 暗角（更柔和的 gutter） */
.spread::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 5;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      transparent 42%,
      rgba(30, 22, 14, 0.06) 47%,
      rgba(15, 10, 6, 0.28) 49.5%,
      rgba(10, 8, 5, 0.38) 50%,
      rgba(15, 10, 6, 0.28) 50.5%,
      rgba(30, 22, 14, 0.06) 53%,
      transparent 58%
    ),
    radial-gradient(ellipse at center, transparent 38%, rgba(20, 14, 10, 0.26) 100%);
}

.page {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  align-content: start;
  border: 1px dashed #5a534a;
  background: rgba(230, 223, 210, 0.4);
  padding: 10px;
  color: #2c2822;
  /* 铅字油墨渗化 */
  text-shadow:
    0 0 0.45px rgba(0, 0, 0, 0.55),
    0.35px 0.35px 0 rgba(40, 30, 20, 0.28);
}

.page-left {
  border-right: none;
  box-shadow: inset -14px 0 22px -10px rgba(0, 0, 0, 0.32);
}

.page-right {
  border-left: none;
  row-gap: 3px;
  column-gap: 8px;
  box-shadow: inset 14px 0 22px -10px rgba(0, 0, 0, 0.32);
}

/* 警戒斜条纹栏：紧贴下方标题 */
.alert-stripe {
  height: 12px;
  margin: 0;
  border: 1px dashed #3a3530;
  background: repeating-linear-gradient(
    -45deg,
    #1a1816 0 6px,
    #4a4540 6px 12px
  );
}

/* 柔化页内锌黑实线边框 → 复古灰 */
.page :deep([class*='border-zinc-800']),
.page :deep([class*='border-zinc-900']),
.page :deep([class*='border-black']) {
  border-color: #3a3530 !important;
}

.page :deep(h1),
.page :deep(h2),
.page :deep(h3) {
  text-shadow:
    0 0 0.55px rgba(0, 0, 0, 0.65),
    0.45px 0.45px 0 rgba(30, 22, 14, 0.32);
}

.left-zone {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(132px, 32%);
  gap: 0;
  align-items: start;
  padding-bottom: 8px;
  border-bottom: 1px dotted #6b6358;
}

.left-top {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(132px, 32%);
  gap: 0;
  align-items: stretch;
}

.left-zone-main {
  min-width: 0;
}

/* 泥泞鞋印：图2蓝框留白处，不挡交互 */
.mud-print {
  position: absolute;
  right: 30%;
  top: 42%;
  z-index: 4;
  width: min(120px, 28%);
  opacity: 0.28;
  mix-blend-mode: multiply;
  pointer-events: none;
  transform: rotate(-18deg);
}

/* PASSED 印章：黑底素材用 screen 去底 */
.stamp-passed {
  position: absolute;
  right: 4%;
  top: 36%;
  z-index: 8;
  width: min(160px, 42%);
  opacity: 0.82;
  mix-blend-mode: screen;
  pointer-events: none;
  transform: rotate(-15deg);
  filter: contrast(1.15) saturate(1.1);
}

.page :deep(.clue-photo img) {
  mix-blend-mode: multiply !important;
  background: transparent !important;
}

.map-square,
.rule-frame,
.evidence-shot,
.fail-frame,
.warn-frame,
.page :deep(.clue-photo),
.page :deep(.clue-photo > .relative),
.page :deep(.clue-photo > .shrink-0) {
  background: transparent !important;
}

.map-square {
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  overflow: hidden;
}

.map-square :deep(.clue-photo) {
  height: 100%;
  width: 100%;
}

.map-square :deep(.clue-photo > .shrink-0) {
  display: none;
}

.map-square :deep(img) {
  object-fit: cover !important;
  object-position: center 42%;
  width: 100%;
  height: 100%;
}

.rule-frame {
  position: relative;
  height: 100%;
  min-height: 140px;
  max-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.rule-frame :deep(.clue-photo) {
  height: 100%;
  width: 100%;
}

.rule-frame :deep(.clue-photo > .shrink-0) {
  display: none;
}

.rule-frame :deep(img) {
  object-fit: contain !important;
  object-position: center top;
  width: 100%;
  height: 100%;
  max-height: 220px;
}

/* 左页底：规则图 | 文字 并排自适应 */
.bottom-pair {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 8px;
  align-items: stretch;
  padding-top: 4px;
}

.bottom-pair > * {
  min-height: 0;
}

/* 右页底：FIELD NOTE L | 警告 | FIELD NOTE R */
.warn-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 10px;
  align-items: stretch;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dotted #6b6358;
}

.news-cols {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  text-align: justify;
}

.side-frame {
  height: 140px;
}

/* 右页证据图：与上方标题同列宽 100%，等比缩放 */
.evidence-shot {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: transparent;
}

.evidence-shot :deep(.clue-photo) {
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
}

.evidence-shot :deep(.clue-photo > .relative) {
  width: 100%;
  flex: none;
}

.evidence-shot :deep(.clue-photo > .shrink-0) {
  width: 100%;
}

.evidence-shot :deep(img) {
  display: block;
  width: 100% !important;
  height: auto !important;
  max-height: none;
  object-fit: contain !important;
  object-position: top center;
}

/* 加班失败图旧规则由 evidence-shot 接管 */
.fail-frame {
  max-height: 168px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: transparent;
}

.fail-frame :deep(.clue-photo) {
  height: auto;
  max-height: 168px;
  width: 100%;
}

.fail-frame :deep(.clue-photo > .shrink-0) {
  display: none;
}

.fail-frame :deep(img) {
  object-fit: contain !important;
  object-position: top center;
  width: 100%;
  max-height: 168px;
  height: auto;
}

.warn-stack {
  height: 200px;
  position: relative;
}

.warn-frame {
  position: relative;
  height: 148px;
  background: transparent;
}

/* 图片卡半色调网眼 */
.map-square::after,
.rule-frame::after,
.evidence-shot::after,
.warn-frame::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0.22;
  mix-blend-mode: overlay;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.5) 0.5px, transparent 0.65px);
  background-size: 2.5px 2.5px;
}

.warn-frame :deep(.clue-photo > .shrink-0) {
  display: none;
}

.warn-frame :deep(img) {
  object-fit: cover !important;
  object-position: center top;
  width: 100%;
  height: 100%;
}

.warn-back {
  left: 4%;
  top: 8px;
  transform: none;
  z-index: 1;
}

.warn-front {
  left: 18%;
  top: 36px;
  transform: none;
  z-index: 2;
}

.warn-card:hover {
  transform: translateY(-2px);
  z-index: 20;
}

.side-frame :deep(.clue-photo),
.warn-frame :deep(.clue-photo) {
  height: 100%;
}

@media (max-width: 1100px) {
  .spread {
    grid-template-columns: 1fr;
  }

  .spread::after {
    background: radial-gradient(ellipse at center, transparent 42%, rgba(20, 14, 10, 0.22) 100%);
  }

  .page-left,
  .page-right {
    box-shadow: none;
    border: 1px dashed #6b6358;
  }

  .left-zone,
  .bottom-pair,
  .warn-row {
    grid-template-columns: 1fr;
  }

  .news-cols {
    grid-template-columns: 1fr;
  }
}
</style>
