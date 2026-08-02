<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const windows = reactive({
  database: false,
  report: false,
  mail: true,
  attachments: false,
  browser: false,
  gallery: false,
})

const zStack = reactive({
  database: 10,
  report: 8,
  mail: 15,
  attachments: 12,
  browser: 16,
  gallery: 17,
})
let zTop = 20

const winPos = reactive({
  database: { x: null, y: null },
  report: { x: null, y: null },
  mail: { x: null, y: null },
  attachments: { x: null, y: null },
  browser: { x: null, y: null },
  gallery: { x: null, y: null },
})

const dbView = ref('graph')
const activeDock = ref('mail')
const showDockGuide = ref(false)
let dockGuideTimer = null
const moveTip = reactive({ show: false, x: 0, y: 0 })

const termLines = ref([])
const termDone = ref(false)
const termAt = ref(0)
const bubbleShown = ref(0)

const TERM_PROMPT = 'PS D:\\Bonnie\\portfolio> '
const TERM_CMD = 'pnpm build --profile=life'
const TERM_SRC = [
  TERM_PROMPT + TERM_CMD,
  '',
  '> Building life-core v1.0.0...',
  '[ERROR] TIMELINE_DEADLOCK: 进度卡死 "等待完美时刻" (Error: 用长期目标强行阻断了短期行动)',
  '[ERROR] EXTERNAL_API_FAILED: 找不到方法 `.showToWorld()` (Reason: 外显能力缺失，输出通道未开启)',
  '',
  '[FATAL] BUILD_FAILED: 零产出状态无法上线，生命周期强行终止。',
]

const BUBBLE_SRC = [
  '审美是一种表达',
  '优秀的产品一定是“美”的',
  '他们在努力展示一个有思想有个性不随大流',
  '通过大量经历和经验',
  '反复塑造才成为的样子',
]

let drag = null
let termTimer = null
let bubbleTimer = null

function escTerm(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function paintTermLine(i, typed) {
  if (i === 0) {
    if (typed.length <= TERM_PROMPT.length) {
      return `<span class="term-prompt">${escTerm(typed)}</span>`
    }
    return `<span class="term-prompt">${escTerm(TERM_PROMPT)}</span><span class="term-cmd">${escTerm(typed.slice(TERM_PROMPT.length))}</span>`
  }
  if (i === 2) return `<span class="term-cmd">${escTerm(typed)}</span>`
  return escTerm(typed)
}

function stopTermType() {
  if (termTimer) {
    clearTimeout(termTimer)
    termTimer = null
  }
}

function startTermType() {
  stopTermType()
  termLines.value = TERM_SRC.map(() => '')
  termDone.value = false
  termAt.value = 0
  let li = 0
  let ci = 0
  const tick = () => {
    if (li >= TERM_SRC.length) {
      termDone.value = true
      termAt.value = TERM_SRC.length - 1
      termTimer = null
      return
    }
    termAt.value = li
    const full = TERM_SRC[li]
    if (!full) {
      termLines.value[li] = ''
      li += 1
      ci = 0
      termTimer = setTimeout(tick, 200)
      return
    }
    const left = full.length - ci
    const n = left <= 4 ? left : 1 + Math.floor(Math.random() * 3)
    ci += n
    termLines.value[li] = paintTermLine(li, full.slice(0, ci))
    if (ci >= full.length) {
      li += 1
      ci = 0
      termTimer = setTimeout(tick, 260)
    } else {
      termTimer = setTimeout(tick, 40 + Math.floor(Math.random() * 70))
    }
  }
  termTimer = setTimeout(tick, 120)
}

function stopBubbles() {
  if (bubbleTimer) {
    clearTimeout(bubbleTimer)
    bubbleTimer = null
  }
}

function startBubbles() {
  stopBubbles()
  bubbleShown.value = 0
  const tick = () => {
    if (bubbleShown.value >= BUBBLE_SRC.length) {
      bubbleTimer = null
      return
    }
    bubbleShown.value += 1
    bubbleTimer = setTimeout(tick, 480)
  }
  bubbleTimer = setTimeout(tick, 120)
}

function winStyle(id) {
  const p = winPos[id]
  const style = { zIndex: zStack[id] }
  if (p.x != null) style.left = `${p.x}px`
  if (p.y != null) style.top = `${p.y}px`
  if (p.x != null) {
    style.right = 'auto'
    style.transform = 'none'
  }
  return style
}

function startDrag(id, e) {
  if (e.button !== 0 || e.target.closest('.window-close, .term-tab-x')) return
  moveTip.show = false
  bringFront(id)
  const el = e.currentTarget.closest('.window')
  const r = el.getBoundingClientRect()
  const desk = el.offsetParent?.getBoundingClientRect?.() || { left: 0, top: 0 }
  winPos[id].x = r.left - desk.left
  winPos[id].y = r.top - desk.top
  drag = {
    id,
    ox: e.clientX - r.left,
    oy: e.clientY - r.top,
    desk,
  }
  e.preventDefault()
}

function onMove(e) {
  if (!drag) return
  winPos[drag.id].x = e.clientX - drag.desk.left - drag.ox
  winPos[drag.id].y = e.clientY - drag.desk.top - drag.oy
}

function onUp() {
  drag = null
}

const GRAPH_NODES = [
  {
    id: 'process',
    label: '有刺激/机会<br>↓<br>产生意义感<br>↓<br>高强度投入<br>↓<br>创造',
    x: 44,
    y: 52,
    active: true,
  },
  { id: 'joined', label: '(我参加了)', x: 14, y: 20 },
  { id: 'ccd', label: '中国大学生<br>计算机设计大赛', x: 16, y: 38, boxy: true },
  { id: 'robot', label: '2026机器人及<br>人工智能大赛', x: 12, y: 60, boxy: true },
  { id: 'hack', label: '黑客松', x: 26, y: 78 },
  { id: 'insight', label: '创造者和表达者最重要的是<br>ta对世界的洞察和敏锐感受', x: 80, y: 30, boxy: true, size: 'lg' },
  { id: 'express', label: '可是我拥有了洞察感受<br>却迟迟没有成为一个表达者…', x: 76, y: 68, boxy: true, size: 'sm' },
]

function bringFront(id) {
  zTop += 1
  zStack[id] = zTop
}

function toggleWindow(id, force) {
  const next = force !== undefined ? force : !windows[id]
  windows[id] = next
  if (next) {
    bringFront(id)
    if (['database', 'mail', 'attachments', 'report', 'browser', 'gallery'].includes(id)) {
      activeDock.value = id
    }
    if (id === 'browser') startTermType()
    if (id === 'gallery') startBubbles()
  } else if (activeDock.value === id) {
    activeDock.value = null
    if (id === 'browser') stopTermType()
    if (id === 'gallery') stopBubbles()
  }
}

function openFromDock(id) {
  if (windows[id]) {
    windows[id] = false
    if (activeDock.value === id) activeDock.value = null
    if (id === 'browser') stopTermType()
    if (id === 'gallery') stopBubbles()
    return
  }
  if (id === 'database') dbView.value = 'graph'
  windows[id] = true
  bringFront(id)
  activeDock.value = id
  if (id === 'browser') startTermType()
  if (id === 'gallery') startBubbles()
}

function onNodeClick(node) {
  if (node.id === 'mfi' || node.id === 'agri') dbView.value = 'article'
}

function goHome() {
  router.push({ name: 'home' })
}

function dismissDockGuide() {
  showDockGuide.value = false
}

function onHeaderTipMove(e) {
  if (drag || e.target.closest('.window-close, .term-tab-x')) {
    moveTip.show = false
    return
  }
  moveTip.show = true
  moveTip.x = e.clientX
  moveTip.y = e.clientY
}

function onHeaderTipLeave() {
  moveTip.show = false
}

function onKey(e) {
  if (e.key === 'Escape') goHome()
}

onMounted(() => {
  const fonts = [
    ['wqy-bitmap-song', 'https://fontsapi.zeoseven.com/10/main/result.css'],
    ['fira-code-font', 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap'],
  ]
  for (const [id, href] of fonts) {
    if (document.getElementById(id)) continue
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }
  window.addEventListener('keydown', onKey)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  dockGuideTimer = setTimeout(() => {
    showDockGuide.value = true
  }, 1000)
})
onUnmounted(() => {
  if (dockGuideTimer) clearTimeout(dockGuideTimer)
  stopTermType()
  stopBubbles()
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
})
</script>

<template>
  <div class="retro-desk">
    <div
      v-show="moveTip.show"
      class="win-move-bubble"
      :style="{ left: moveTip.x + 'px', top: moveTip.y + 'px' }"
    >
      可自由移动弹窗位置
    </div>
    <header class="top-menu">
      <div class="top-menu-left">
        <button type="button" class="menu-btn mushroom" aria-label="System">
          <i class="pix pix-mushroom" />
        </button>
        <button type="button" class="menu-btn">Save</button>
        <button type="button" class="menu-btn">Reload</button>
        <button type="button" class="menu-btn">Settings</button>
        <button type="button" class="menu-btn">Controls</button>
      </div>
      <button type="button" class="menu-btn" @click="goHome">Quit</button>
    </header>

    <div class="desktop">
      <section
        v-show="windows.database"
        class="window window-database"
        :style="winStyle('database')"
        @mousedown="bringFront('database')"
      >
        <div class="window-header win-move-tip" @mousemove="onHeaderTipMove" @mouseleave="onHeaderTipLeave" @mousedown="startDrag('database', $event)">
          <span class="window-title">Database</span>
          <button type="button" class="window-close" aria-label="Close" @click="toggleWindow('database', false)">
            <i class="pix pix-x" />
          </button>
        </div>

        <div class="window-body no-pad">
          <div v-show="dbView === 'article'" class="db-article">
            <button type="button" class="back-btn" @click="dbView = 'graph'">
              <i class="pix pix-back" />
            </button>
            <div class="db-article-layout">
              <div class="db-content">
                <h2>Modern Farming Initiative</h2>
                <p>
                  The Modern Farming Initiative was proposed by Mayor Jan Dragunov in 1991, to revise
                  Kozlovka's agricultural practices. It was approved by the Zarnavian government after
                  achieving independence in the same year.
                </p>
                <p>
                  The proposal involved Dr Casimir Ostrovsky, who was invited to the town to undergo
                  research. The proposal was ultimately scrapped in 1992.
                </p>
              </div>
              <aside class="db-image-box">
                <span class="ribbon" />
                <div class="scan-frame" />
                <div class="db-toolbar-btns">
                  <button type="button" class="pixel-btn"><i class="pix pix-expand" /></button>
                  <button type="button" class="pixel-btn" @click="openFromDock('attachments')">?</button>
                </div>
              </aside>
            </div>
          </div>

          <div v-show="dbView === 'graph'" class="db-graph">
            <aside class="sidebar">
              <div class="side-label">? Undiscovered Links</div>
              <div class="side-bookmarked">
                <span class="ribbon sm" />
                <span class="bm-text">Bookmarked</span>
                <button type="button" class="chev" aria-label="Expand">▾</button>
              </div>
              <ul class="side-list">
                <li>Draken Oak</li>
                <li>Perun's Mark</li>
              </ul>
            </aside>

            <div class="graph-pane">
              <div class="graph-canvas">
                <p class="graph-intro">这个作品集作为我给外界展示自己的第一媒介，</p>
                <p class="graph-process-lead">过去的半年，我让自己一直处于：</p>
                <svg class="graph-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <line x1="24" y1="38" x2="36" y2="44" />
                  <line x1="22" y1="60" x2="36" y2="52" />
                  <line x1="34" y1="76" x2="40" y2="62" />
                  <line x1="68" y1="34" x2="54" y2="42" />
                  <line x1="66" y1="66" x2="54" y2="56" />
                </svg>

                <button
                  v-for="node in GRAPH_NODES"
                  :key="node.id"
                  type="button"
                  class="graph-node"
                  :class="{ active: node.active, boxy: node.boxy, ['size-' + node.size]: node.size }"
                  :style="{ left: node.x + '%', top: node.y + '%' }"
                  @click="onNodeClick(node)"
                >
                  <span class="node-label" v-html="node.label" />
                </button>
              </div>

              <!-- 暂无：无交互占位按钮
              <button type="button" class="layers-btn" aria-label="Layers" title="Layers">
                <i class="pix pix-layers" />
              </button>
              <div class="graph-zoom">
                <button type="button" class="pixel-btn zoom">+</button>
                <button type="button" class="pixel-btn zoom">−</button>
              </div>
              -->
            </div>
          </div>
        </div>
      </section>

      <!-- 暂时隐藏：Report 弹窗（对应 Dock 最后一个按钮）
      <section
        v-show="windows.report"
        class="window window-report"
        :style="winStyle('report')"
        @mousedown="bringFront('report')"
      >
        <div class="window-header win-move-tip" @mousemove="onHeaderTipMove" @mouseleave="onHeaderTipLeave" @mousedown="startDrag('report', $event)">
          <span class="window-title">Report</span>
          <button type="button" class="window-close" @click="toggleWindow('report', false)"><i class="pix pix-x" /></button>
        </div>
        <div class="window-body report-body">
          <p>
            1990s, there were a string of disappearances, most notably
            <span class="hl">Atyla Dragunov</span>.
          </p>
          <p>
            Jan Dragunov was also a victim of the disappearance. It was because of this that the
            <span class="blank">----------</span> was scrapped.
          </p>
          <div class="report-actions">
            <button type="button" class="pixel-btn">Reset All</button>
            <button type="button" class="pixel-btn">?</button>
            <button type="button" class="pixel-btn fill">Submit Findings</button>
          </div>
        </div>
      </section>
      -->

      <section
        v-show="windows.mail"
        class="window window-mail"
        :style="winStyle('mail')"
        @mousedown="bringFront('mail')"
      >
        <div class="window-header win-move-tip" @mousemove="onHeaderTipMove" @mouseleave="onHeaderTipLeave" @mousedown="startDrag('mail', $event)">
          <span class="window-title">Mail</span>
          <button type="button" class="window-close" @click="toggleWindow('mail', false)"><i class="pix pix-x" /></button>
        </div>
        <div class="window-body mail-body">
          <p><strong>From:</strong> 3455829239@qq.com</p>
          <p><strong>Subject:</strong> 美学产品设计实习生</p>
          <hr />
          <p>
            两个月之前我第一次离开学校去上海找实习，接触到了很多在创业的朋友，听了很多表达者和创作者的故事，看他们从不同角度拆解同一个问题。这件事很有趣，因为同一个东西大家总能有不一样的点子，做成不一样的效果。
            这也是我站在前端×美学的交叉点的那一刻跟这个岗位产生强烈共鸣的原因。哪怕是AI时代也总有人在坚持独特的美和表达，当有人站起来修改视觉模板去做视觉决策的时候，我们才真正拿到了通过内容结构建立叙事的主动权，而非展示冰冷的组件。网页可以是每一种人生经历，引导各种人去拥有不同的体验。
          </p>
          <p>
            有人说创造者和表达者最重要的以及最吸引人的是这个人对世界的洞察和敏锐感受。可是我拥有了洞察感受却迟迟没有成为一个表达者…我说我希望我的作品是美的，又不希望它仅仅是个美丽废物，哪怕只是解决一个很小很小的问题。所以有了任务拆解ai，哪怕它还没有那么好看，但是我真正开始解决问题的第一步。然后有了“准点下班”的小游戏，如果大家在体验他的时候是放松的，视觉体验是舒适的，那它就有存在的意义。
          </p>
          <p>
            现在我开始成为一个观察者，表达者，评论者，所以希望有机会加入Copula Lab大家庭跟每一个特别的人共创一段特别的经历。
          </p>
        </div>
      </section>

      <!-- 暂时隐藏：Attachments 弹窗（对应 Dock 第 5 个按钮）
      <section
        v-show="windows.attachments"
        class="window window-attachments"
        :style="winStyle('attachments')"
        @mousedown="bringFront('attachments')"
      >
        <div class="window-header win-move-tip" @mousemove="onHeaderTipMove" @mouseleave="onHeaderTipLeave" @mousedown="startDrag('attachments', $event)">
          <span class="window-title">Attachments</span>
          <button type="button" class="window-close" @click="toggleWindow('attachments', false)"><i class="pix pix-x" /></button>
        </div>
        <div class="window-body attach-body">
          <p class="attach-title">INSTRUCTIONS</p>
          <ul class="attach-list">
            <li><i class="pix pix-globe lg" /><span>Use the hyperlinks to navigate around the database.</span></li>
            <li><i class="pix pix-docs lg" /><span><em class="hl">Drag</em> the right words into the report.</span></li>
            <li><i class="pix pix-search lg" /><span>When you are satisfied with your conclusion, submit the findings to me.</span></li>
          </ul>
        </div>
      </section>
      -->

      <!-- PowerShell 终端：第三个 Dock（Browser） -->
      <section
        v-show="windows.browser"
        class="window window-browser"
        :style="winStyle('browser')"
        @mousedown="bringFront('browser')"
      >
        <div class="term-chrome win-move-tip" @mousemove="onHeaderTipMove" @mouseleave="onHeaderTipLeave" @mousedown="startDrag('browser', $event)">
          <div class="term-tab">
            <span class="term-tab-ico" aria-hidden="true" />
            <span class="term-tab-title">Windows PowerShell</span>
            <button type="button" class="term-tab-x" @click="toggleWindow('browser', false)">×</button>
          </div>
          <div class="term-chrome-rest">
            <span class="term-plus">+</span>
          </div>
        </div>
        <div class="window-body term-body">
          <p v-for="(line, i) in termLines" :key="i">
            <span v-html="line" /><span v-if="termAt === i" class="term-cursor">▌</span>
          </p>
        </div>
      </section>

      <!-- 气泡对话：第四个 Dock（Gallery） -->
      <section
        v-show="windows.gallery"
        class="window window-gallery"
        :style="winStyle('gallery')"
        @mousedown="bringFront('gallery')"
      >
        <div class="im-nav win-move-tip" @mousemove="onHeaderTipMove" @mouseleave="onHeaderTipLeave" @mousedown="startDrag('gallery', $event)">
          <span class="im-nav-title">Messages</span>
          <button type="button" class="window-close" @click="toggleWindow('gallery', false)"><i class="pix pix-x" /></button>
        </div>
        <div class="window-body chat-body">
          <div
            v-for="(msg, i) in BUBBLE_SRC.slice(0, bubbleShown)"
            :key="i"
            class="im-row"
          >
            <div class="im-bubble">{{ msg }}</div>
          </div>
        </div>
        <div class="im-compose">
          <div class="im-field" aria-hidden="true" />
          <button type="button" class="im-send" tabindex="-1">Send</button>
        </div>
      </section>
    </div>

    <div class="dock-wrap">
      <div v-if="showDockGuide" class="dock-guide" role="dialog" aria-modal="true">
        <div class="dock-guide-bubble">
          <p>点击下方按钮查看 [运行结果][个人反思][聊天记录]</p>
          <button type="button" class="dock-guide-ok" @click="dismissDockGuide">确定</button>
        </div>
      </div>
      <nav class="dock" aria-label="Apps">
        <button type="button" class="dock-item" :class="{ on: windows.mail }" title="Mail" @click="openFromDock('mail')">
          <i class="pix pix-mail xl" />
        </button>
        <button type="button" class="dock-item" :class="{ on: windows.database }" title="Database" @click="openFromDock('database')">
          <i class="pix pix-search-doc xl" />
        </button>
        <button type="button" class="dock-item" :class="{ on: windows.browser }" title="Browser" @click="openFromDock('browser')">
          <i class="pix pix-globe xl" />
        </button>
        <button type="button" class="dock-item" :class="{ on: windows.gallery }" title="Gallery" @click="openFromDock('gallery')">
          <i class="pix pix-photo xl" />
        </button>
        <!-- 暂时隐藏：Dock 第 5 个按钮（Attachments / Help）
        <button type="button" class="dock-item" :class="{ on: windows.attachments }" title="Help" @click="openFromDock('attachments')">
          <i class="pix pix-help xl" />
        </button>
        -->
        <!-- 暂时隐藏：Dock 最后一个按钮（Report）
        <button type="button" class="dock-item" :class="{ on: windows.report }" title="Report" @click="openFromDock('report')">
          <i class="pix pix-docs xl" />
        </button>
        -->
      </nav>
      <div class="dock-bar" />
    </div>
  </div>
</template>

<style scoped>
.retro-desk {
  --ink: #1a1a1a;
  --paper: #e0e0de;
  --edge: #3a3a3a;
  --edge-soft: #5a5a5a;
  --hl: #c45a6a;
  --check: 9px;
  position: relative;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  color: var(--ink);
  font-family: 'Courier New', Courier, monospace;
  background-color: #2f2f2f;
  background-image: repeating-conic-gradient(#1a1a1a 0% 25%, #454545 0% 50%);
  background-size: var(--check) var(--check);
  image-rendering: pixelated;
  animation: photo-page-in 1.25s ease;
}

@keyframes photo-page-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.top-menu {
  position: relative;
  z-index: 100;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: var(--paper);
  border-bottom: 1px solid var(--edge);
  box-shadow: inset 0 -1px 0 var(--edge-soft);
  font-size: 13px;
  font-weight: 800;
}

.top-menu-left {
  display: flex;
  align-items: center;
  gap: 2px;
}

.menu-btn {
  border: 0;
  background: transparent;
  font: inherit;
  font-weight: 800;
  padding: 2px 6px;
  cursor: pointer;
}

.menu-btn:hover {
  background: #000;
  color: #fff;
}

.desktop {
  position: absolute;
  inset: 28px 0 96px;
}

.window {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #dbdbd9;
  border: 1px solid #b0b0b0;
  border-radius: 10px;
  box-shadow:
    inset 0 0 0 1px #e8e8e6,
    0 2px 8px rgba(0, 0, 0, 0.18);
  outline: none;
  min-width: 260px;
  overflow: hidden;
}

.window-database {
  width: min(660px, 78vw);
  height: min(470px, 64vh);
  top: 8px;
  left: 1.5%;
  transform: none;
}

.window-report {
  width: min(380px, 42vw);
  height: min(420px, 58vh);
  top: 40px;
  right: 24px;
}

.window-mail {
  width: min(560px, 72vw);
  height: auto;
  max-height: min(72vh, 640px);
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
}

.window-mail .mail-body {
  padding: 18px 24px 22px;
  font-family: 'Fira Code', 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', Consolas, monospace;
  font-size: 17px;
  line-height: 1.5;
  overflow: auto;
}

.window-mail .mail-body > p:nth-child(1),
.window-mail .mail-body > p:nth-child(2) {
  margin: 0 0 0.25em;
  text-indent: 0;
}

.window-mail .mail-body hr {
  margin: 1.15em 0;
  border: 0;
  border-top: 1px solid var(--edge);
}

.window-mail .mail-body hr ~ p {
  margin: 0 0 0.9em;
  text-indent: 2em;
}

.window-mail .mail-body hr ~ p:last-child {
  margin-bottom: 0;
}

.window-attachments {
  width: min(420px, 48vw);
  height: min(400px, 56vh);
  top: 44%;
  right: 2.5%;
  left: auto;
}

.window-browser {
  width: min(560px, 72vw);
  height: min(300px, 46vh);
  top: 50%;
  left: 2%;
  border: 1px solid #3c3c3c;
  border-radius: 10px 10px 6px 6px;
  background: #0c0c0c;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
  outline: none;
  overflow: hidden;
  image-rendering: pixelated;
}

.window-browser .window-body {
  background: #0c0c0c;
}

.window-gallery {
  width: min(380px, 48vw);
  height: min(460px, 64vh);
  top: 12px;
  left: auto;
  right: 2.5%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.term-chrome {
  position: relative;
  display: flex;
  align-items: flex-end;
  height: 34px;
  background: #f3f3f3;
  cursor: move;
  padding: 4px 6px 0;
  gap: 2px;
  border-bottom: 1px solid #2a2a2a;
}

.term-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0 10px 0 8px;
  background: #0c0c0c;
  color: #f3f3f3;
  border-radius: 8px 8px 0 0;
  font-size: 12px;
  font-weight: 600;
  min-width: 160px;
  max-width: 72%;
}

.term-tab-ico {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  background: #5391fe;
  box-shadow:
    2px 0 0 #5391fe,
    0 2px 0 #5391fe,
    2px 2px 0 #2b5cb8;
  image-rendering: pixelated;
}

.term-tab-title {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  letter-spacing: 0.02em;
}

.term-tab-x {
  border: 0;
  background: transparent;
  color: #c8c8c8;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
}

.term-tab-x:hover {
  color: #fff;
}

.term-chrome-rest {
  flex: 1;
  display: flex;
  align-items: center;
  height: 28px;
  padding-left: 6px;
  color: #666;
  font-size: 16px;
}

.term-plus {
  opacity: 0.7;
}

.term-body {
  position: relative;
  background: #0c0c0c;
  color: #ff4d4d;
  font-family: 'Fira Code', 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', Consolas, monospace;
  font-size: 15.5px;
  line-height: 1.3;
  letter-spacing: 0.02em;
  text-shadow:
    0 0 4px rgba(255, 70, 70, 0.55),
    0 0 10px rgba(255, 40, 40, 0.28);
  overflow: hidden;
}

.term-body::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.028) 0px,
    rgba(255, 255, 255, 0.028) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
  z-index: 1;
}

.term-body p {
  position: relative;
  z-index: 2;
  margin: 0 0 2px;
  min-height: 1.25em;
}

.term-body :deep(.term-prompt) {
  color: #8a8a8a;
  text-shadow: none;
}

.term-body :deep(.term-cmd) {
  color: #d4d4d4;
  text-shadow: 0 0 3px rgba(220, 220, 220, 0.2);
}

.term-cursor {
  display: inline-block;
  margin-left: 1px;
  animation: term-blink 1s steps(1) infinite;
}

@keyframes term-blink {
  50% {
    opacity: 0;
  }
}

.im-nav {
  position: relative;
  flex-shrink: 0;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  color: #fff;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.35);
  border-top: 1px solid #1a2a45;
  background: linear-gradient(180deg, #8ea4c4 0%, #6f88ad 42%, #5a7399 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    inset 0 -1px 0 #3d5270,
    0 1px 0 #eef2f7;
}

.im-nav-title {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.im-nav .window-close {
  top: 8px;
  right: 8px;
  border-color: #3d5270;
  background: linear-gradient(#f4f6f9, #c5ced9);
}

.im-compose {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px 9px;
  border-top: 1px solid #7a7a7a;
  background: linear-gradient(180deg, #f3f3f5 0%, #d8d8dc 55%, #c8c8ce 100%);
  box-shadow:
    inset 0 1px 0 #fff,
    inset 0 2px 0 rgba(0, 0, 0, 0.06);
}

.im-field {
  flex: 1;
  height: 28px;
  border: 1px solid #8e8e93;
  border-radius: 14px;
  background: #fff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.22);
}

.im-send {
  border: 1px solid #2f5bb8;
  border-radius: 6px;
  padding: 5px 10px;
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: default;
  background: linear-gradient(180deg, #7eb0ff 0%, #3b78e7 55%, #2f66d0 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.chat-body {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex: 1;
  min-height: 0;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.03) 0 1px,
      transparent 1px 3px
    ),
    #d6dde6;
  padding: 12px 12px 10px;
}

.im-row {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.im-bubble {
  position: relative;
  max-width: 90%;
  padding: 8px 14px 9px;
  color: #fff;
  font-family: 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 400;
  letter-spacing: 0.02em;
  text-align: left;
  border: 1px solid #1a56c4;
  border-radius: 16px;
  background: linear-gradient(180deg, #6eb6ff 0%, #2f7fff 48%, #1b6ef5 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 1px 2px rgba(0, 0, 0, 0.18);
  image-rendering: pixelated;
}

.window-header {
  position: relative;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #c8c8c8;
  /* 低对比灰条纹，参考 Aqua 标题栏 */
  background-color: #d8d8d8;
  background-image: repeating-linear-gradient(
    0deg,
    #d0d0d0 0 1px,
    #e2e2e2 1px 3px
  );
  cursor: move;
  border-radius: 9px 9px 0 0;
}

.win-move-bubble {
  position: fixed;
  z-index: 200;
  transform: translate(-50%, 14px);
  padding: 8px 14px;
  border-radius: 14px;
  background: #1a1a1a;
  color: #fff;
  font-family: 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.35;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.32);
}

.window-title {
  background: transparent;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 700;
  color: #333;
  z-index: 1;
}

.window-close {
  position: absolute;
  right: 8px;
  top: 5px;
  width: 18px;
  height: 18px;
  border: 1px solid #9a9a9a;
  border-radius: 50%;
  background: linear-gradient(#f2f2f2, #c8c8c8);
  padding: 0;
  cursor: pointer;
  display: grid;
  place-items: center;
  z-index: 2;
  box-shadow: none;
}

.window-close:hover {
  background: var(--edge);
}

.window-close:hover .pix {
  filter: invert(1);
}

.window-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px 14px;
  background: var(--paper);
}

.window-body.no-pad {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.db-graph {
  display: flex;
  height: 100%;
  min-height: 0;
}

.sidebar {
  width: 168px;
  flex-shrink: 0;
  border-right: 1px dotted var(--edge-soft);
  padding: 10px 8px;
  background: var(--paper);
  font-size: 12px;
}

.side-label {
  font-weight: 800;
  margin-bottom: 10px;
}

.side-bookmarked {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.bm-text {
  font-weight: 800;
  flex: 1;
}

.chev {
  width: 18px;
  height: 18px;
  border: 0;
  background: #000;
  color: #fff;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}

.side-list {
  list-style: none;
  margin: 0;
  padding: 0 0 0 4px;
  line-height: 1.8;
  font-weight: 700;
}

.graph-pane {
  position: relative;
  flex: 1;
  min-width: 0;
  background: #d4d4d1;
}

.graph-canvas {
  position: absolute;
  inset: 6px 6px 10px 6px;
  background-image: radial-gradient(rgba(90, 90, 90, 0.18) 1px, transparent 1.2px);
  background-size: 18px 18px;
  font-family: 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', 'Microsoft YaHei', sans-serif;
}

.graph-intro {
  position: absolute;
  top: 2%;
  left: 2%;
  right: 2%;
  transform: none;
  z-index: 2;
  margin: 0;
  width: auto;
  text-align: left;
  font-size: 15.5px;
  font-weight: 400;
  line-height: 1.35;
  pointer-events: none;
}

.graph-process-lead {
  position: absolute;
  top: 14%;
  left: 44%;
  transform: translateX(-50%);
  z-index: 2;
  margin: 0;
  width: max-content;
  max-width: 46%;
  text-align: center;
  font-size: 15.5px;
  font-weight: 400;
  line-height: 1.35;
  pointer-events: none;
}

.graph-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.graph-lines line {
  stroke: rgba(60, 60, 60, 0.45);
  stroke-width: 0.35;
  vector-effect: non-scaling-stroke;
}

.graph-node {
  position: absolute;
  transform: translate(-50%, -50%);
  border: 1.5px dashed var(--edge);
  border-radius: 12px;
  background: var(--paper);
  padding: 8px 10px;
  font: inherit;
  font-size: 15.5px;
  font-weight: 400;
  line-height: 1.3;
  cursor: pointer;
  text-align: center;
  white-space: normal;
  max-width: 8.5em;
  box-shadow: none;
}

.graph-node.boxy {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
  box-sizing: border-box;
}

.graph-node.boxy.size-lg,
.graph-node.boxy.size-sm {
  text-align: left;
  justify-content: flex-start;
  align-items: flex-start;
  width: max-content;
  max-width: none;
  min-width: 0;
  min-height: 0;
  aspect-ratio: auto;
  white-space: nowrap;
  font-size: 15.5px;
  padding: 12px 16px;
}

.graph-node.boxy.size-lg {
  padding: 14px 16px;
}

.graph-node.boxy.size-sm {
  padding: 12px 14px;
}

.graph-node.boxy:not(.size-lg):not(.size-sm) {
  max-width: 8.5em;
  min-width: 6.5em;
  min-height: 5em;
  aspect-ratio: 5 / 4;
  font-size: 15.5px;
}

.graph-node.active {
  background: var(--edge);
  color: #fff;
  border-style: dashed;
  max-width: 9em;
  padding: 12px 16px;
  font-size: 15.5px;
  font-weight: 400;
  line-height: 1.45;
}

.node-label {
  display: block;
}

.layers-btn {
  position: absolute;
  left: 10px;
  bottom: 8px;
  width: 44px;
  height: 44px;
  border: 1px solid var(--edge);
  border-radius: 3px;
  background: var(--edge);
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
}

.graph-zoom {
  position: absolute;
  right: 10px;
  bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pixel-btn {
  border: 2px solid #6a6a6a;
  border-radius: 999px;
  background: linear-gradient(#f5f5f5 0%, #cfcfcf 55%, #b8b8b8 100%);
  min-width: 30px;
  min-height: 28px;
  font: inherit;
  font-weight: 800;
  color: #222;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 1px 2px rgba(0, 0, 0, 0.18);
  display: inline-grid;
  place-items: center;
  padding: 3px 14px;
  image-rendering: pixelated;
}

.pixel-btn.zoom {
  width: 34px;
  height: 34px;
  font-size: 18px;
  padding: 0;
  border-radius: 8px;
}

.pixel-btn:active {
  transform: translate(1px, 1px);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

.pixel-btn.fill {
  background: linear-gradient(#e8e8e8 0%, #9a9a9a 55%, #7a7a7a 100%);
  color: #111;
  border-color: #555;
}

.db-article {
  padding: 10px 14px;
  height: 100%;
  overflow: auto;
}

.back-btn {
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0 0 8px;
}

.db-article-layout {
  display: flex;
  gap: 16px;
}

.db-content h2 {
  margin: 0 0 10px;
  font-size: 24px;
  border-bottom: 2px solid #000;
  padding-bottom: 6px;
  font-family: Georgia, serif;
}

.db-content p {
  font-size: 13px;
  line-height: 1.55;
}

.db-image-box {
  width: 170px;
  border: 1px solid var(--edge);
  border-radius: 2px;
  padding: 6px;
  background: #e8e8e4;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
  outline: 1px dotted var(--edge-soft);
  outline-offset: -3px;
}

.scan-frame {
  height: 200px;
  border: 1px dashed var(--edge-soft);
  border-radius: 2px;
  background:
    repeating-linear-gradient(0deg, transparent 0 10px, rgba(0, 0, 0, 0.1) 10px 11px),
    #cfcfc9;
}

.db-toolbar-btns {
  display: flex;
  justify-content: space-between;
}

.report-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 13px;
  line-height: 1.65;
}

.hl {
  color: var(--hl);
  border-bottom: 1px dotted var(--hl);
  font-style: normal;
  font-weight: 800;
}

.report-actions {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  border-top: 1px dotted var(--edge-soft);
  padding-top: 12px;
}

.attach-body {
  background-image: radial-gradient(#000 12%, transparent 13%);
  background-size: 3px 3px;
}

.attach-title {
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 900;
}

.attach-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.attach-list li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

hr {
  border: 0;
  border-top: 1px solid #000;
}

.ribbon {
  display: inline-block;
  width: 10px;
  height: 14px;
  background: var(--hl);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%);
  flex-shrink: 0;
}

.ribbon.sm {
  width: 9px;
  height: 12px;
}

.dock-wrap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 80;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.dock-guide {
  pointer-events: auto;
  margin-bottom: 18px;
  max-width: min(440px, 92vw);
}

.dock-guide-bubble {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px 10px 16px;
  color: #3a3a3a;
  font-family: 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  line-height: 1.35;
  font-weight: 400;
  letter-spacing: 0.02em;
  text-align: left;
  border: 1px solid #8a8a8a;
  border-radius: 16px;
  background: linear-gradient(180deg, #e6e6e6 0%, #d2d2d2 48%, #c0c0c0 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 1px 2px rgba(0, 0, 0, 0.18);
  image-rendering: pixelated;
}

.dock-guide-bubble p {
  margin: 0;
  flex: 1;
}

.dock-guide-ok {
  flex-shrink: 0;
  margin: 0;
  border: 1px solid #4a4a4a;
  border-radius: 10px;
  padding: 4px 14px;
  background: linear-gradient(180deg, #e8e8e8 0%, #bdbdbd 55%, #a0a0a0 100%);
  color: #222;
  font: inherit;
  font-size: 15px;
  cursor: pointer;
}

.dock {
  display: flex;
  gap: 6px;
  align-items: flex-end;
  pointer-events: auto;
  margin-bottom: -2px;
}

.dock-item {
  width: 72px;
  height: 78px;
  border: 0;
  background: var(--paper);
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
  image-rendering: pixelated;
  clip-path: polygon(
    0 10px,
    3px 10px,
    3px 6px,
    6px 6px,
    6px 3px,
    10px 3px,
    10px 0,
    calc(100% - 10px) 0,
    calc(100% - 10px) 3px,
    calc(100% - 6px) 3px,
    calc(100% - 6px) 6px,
    calc(100% - 3px) 6px,
    calc(100% - 3px) 10px,
    100% 10px,
    100% 100%,
    0 100%
  );
  box-shadow: inset 0 0 0 3px var(--edge);
}

.dock-item.on {
  background: #1f1f1f;
}

.dock-item.on .pix {
  filter: invert(1);
}

.dock-bar {
  width: 100%;
  height: 10px;
  background: var(--paper);
  border-top: 1px solid var(--edge);
}

.pix {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: center / contain no-repeat;
  image-rendering: pixelated;
}

.pix.xl {
  width: 40px;
  height: 40px;
}

.pix.lg {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.pix-mushroom {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' shape-rendering='crispEdges'%3E%3Crect x='5' y='2' width='6' height='2' fill='%23000'/%3E%3Crect x='3' y='4' width='10' height='2' fill='%23000'/%3E%3Crect x='2' y='6' width='12' height='3' fill='%23000'/%3E%3Crect x='6' y='9' width='4' height='5' fill='%23000'/%3E%3C/svg%3E");
}

.pix-x {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' shape-rendering='crispEdges'%3E%3Crect x='2' y='2' width='2' height='2' fill='%23000'/%3E%3Crect x='8' y='2' width='2' height='2' fill='%23000'/%3E%3Crect x='4' y='4' width='2' height='2' fill='%23000'/%3E%3Crect x='6' y='4' width='2' height='2' fill='%23000'/%3E%3Crect x='4' y='6' width='2' height='2' fill='%23000'/%3E%3Crect x='6' y='6' width='2' height='2' fill='%23000'/%3E%3Crect x='2' y='8' width='2' height='2' fill='%23000'/%3E%3Crect x='8' y='8' width='2' height='2' fill='%23000'/%3E%3C/svg%3E");
}

.pix-back {
  width: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='16' shape-rendering='crispEdges'%3E%3Cpath d='M10 2 L3 8 L10 14' stroke='%23000' stroke-width='2' fill='none'/%3E%3Crect x='3' y='7' width='14' height='2' fill='%23000'/%3E%3C/svg%3E");
}

.pix-expand {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' shape-rendering='crispEdges'%3E%3Cpath d='M3 9 V13 H7 M13 7 V3 H9' stroke='%23000' stroke-width='2' fill='none'/%3E%3C/svg%3E");
}

.pix-mail {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' shape-rendering='crispEdges'%3E%3Crect x='2' y='8' width='28' height='18' fill='%23000'/%3E%3Crect x='4' y='10' width='24' height='14' fill='%23fff'/%3E%3Crect x='4' y='10' width='2' height='2' fill='%23000'/%3E%3Crect x='6' y='12' width='2' height='2' fill='%23000'/%3E%3Crect x='8' y='14' width='2' height='2' fill='%23000'/%3E%3Crect x='10' y='16' width='2' height='2' fill='%23000'/%3E%3Crect x='12' y='18' width='2' height='2' fill='%23000'/%3E%3Crect x='14' y='20' width='4' height='2' fill='%23000'/%3E%3Crect x='18' y='18' width='2' height='2' fill='%23000'/%3E%3Crect x='20' y='16' width='2' height='2' fill='%23000'/%3E%3Crect x='22' y='14' width='2' height='2' fill='%23000'/%3E%3Crect x='24' y='12' width='2' height='2' fill='%23000'/%3E%3Crect x='26' y='10' width='2' height='2' fill='%23000'/%3E%3C/svg%3E");
}

.pix-search-doc {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' shape-rendering='crispEdges'%3E%3Crect x='10' y='2' width='16' height='22' fill='%23000'/%3E%3Crect x='12' y='4' width='12' height='18' fill='%23fff'/%3E%3Crect x='14' y='7' width='8' height='2' fill='%23000'/%3E%3Crect x='14' y='11' width='8' height='2' fill='%23000'/%3E%3Crect x='14' y='15' width='6' height='2' fill='%23000'/%3E%3Crect x='2' y='12' width='14' height='14' fill='%23000'/%3E%3Crect x='4' y='14' width='10' height='10' fill='%23fff'/%3E%3Crect x='6' y='16' width='6' height='6' fill='%23000'/%3E%3Crect x='8' y='18' width='2' height='2' fill='%23fff'/%3E%3Crect x='12' y='24' width='4' height='2' fill='%23000'/%3E%3Crect x='14' y='26' width='4' height='2' fill='%23000'/%3E%3Crect x='16' y='28' width='4' height='2' fill='%23000'/%3E%3C/svg%3E");
}

.pix-globe {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' shape-rendering='crispEdges'%3E%3Crect x='8' y='2' width='16' height='2' fill='%23000'/%3E%3Crect x='4' y='4' width='24' height='2' fill='%23000'/%3E%3Crect x='2' y='6' width='28' height='20' fill='%23000'/%3E%3Crect x='4' y='8' width='24' height='16' fill='%23fff'/%3E%3Crect x='14' y='8' width='4' height='16' fill='%23000'/%3E%3Crect x='4' y='12' width='24' height='2' fill='%23000'/%3E%3Crect x='4' y='18' width='24' height='2' fill='%23000'/%3E%3Crect x='6' y='8' width='2' height='16' fill='%23000'/%3E%3Crect x='24' y='8' width='2' height='16' fill='%23000'/%3E%3Crect x='4' y='26' width='24' height='2' fill='%23000'/%3E%3Crect x='8' y='28' width='16' height='2' fill='%23000'/%3E%3C/svg%3E");
}

.pix-photo {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' shape-rendering='crispEdges'%3E%3Crect x='2' y='6' width='24' height='20' fill='%23000'/%3E%3Crect x='4' y='8' width='20' height='16' fill='%23fff'/%3E%3Crect x='18' y='10' width='2' height='2' fill='%23000'/%3E%3Crect x='4' y='20' width='4' height='4' fill='%23000'/%3E%3Crect x='8' y='18' width='4' height='6' fill='%23000'/%3E%3Crect x='12' y='16' width='4' height='8' fill='%23000'/%3E%3Crect x='16' y='18' width='4' height='6' fill='%23000'/%3E%3Crect x='20' y='20' width='4' height='4' fill='%23000'/%3E%3Crect x='10' y='2' width='20' height='18' fill='none' stroke='%23000' stroke-width='3'/%3E%3C/svg%3E");
}

.pix-help {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' shape-rendering='crispEdges'%3E%3Crect x='6' y='2' width='20' height='2' fill='%23000'/%3E%3Crect x='4' y='4' width='24' height='24' fill='%23000'/%3E%3Crect x='6' y='6' width='20' height='20' fill='%23fff'/%3E%3Crect x='12' y='8' width='8' height='2' fill='%23000'/%3E%3Crect x='10' y='10' width='4' height='2' fill='%23000'/%3E%3Crect x='18' y='10' width='4' height='2' fill='%23000'/%3E%3Crect x='18' y='12' width='4' height='2' fill='%23000'/%3E%3Crect x='16' y='14' width='4' height='2' fill='%23000'/%3E%3Crect x='14' y='16' width='4' height='2' fill='%23000'/%3E%3Crect x='14' y='18' width='4' height='2' fill='%23000'/%3E%3Crect x='14' y='22' width='4' height='2' fill='%23000'/%3E%3Crect x='6' y='28' width='20' height='2' fill='%23000'/%3E%3C/svg%3E");
}

.pix-docs {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' shape-rendering='crispEdges'%3E%3Crect x='10' y='2' width='18' height='22' fill='%23000'/%3E%3Crect x='12' y='4' width='14' height='18' fill='%23fff'/%3E%3Crect x='4' y='8' width='18' height='22' fill='%23000'/%3E%3Crect x='6' y='10' width='14' height='18' fill='%23fff'/%3E%3Crect x='8' y='14' width='10' height='2' fill='%23000'/%3E%3Crect x='8' y='18' width='10' height='2' fill='%23000'/%3E%3Crect x='8' y='22' width='8' height='2' fill='%23000'/%3E%3C/svg%3E");
}

.pix-search {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' shape-rendering='crispEdges'%3E%3Ccircle cx='13' cy='13' r='8' fill='none' stroke='%23000' stroke-width='3'/%3E%3Crect x='19' y='19' width='8' height='3' fill='%23000' transform='rotate(45 23 20)'/%3E%3C/svg%3E");
}

.pix-layers {
  width: 28px;
  height: 28px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' shape-rendering='crispEdges'%3E%3Crect x='4' y='8' width='16' height='14' fill='none' stroke='%23fff' stroke-width='3'/%3E%3Crect x='8' y='4' width='16' height='14' fill='none' stroke='%23fff' stroke-width='3'/%3E%3C/svg%3E");
}

@media (max-width: 900px) {
  .window-database,
  .window-report,
  .window-mail,
  .window-attachments,
  .window-browser,
  .window-gallery {
    position: relative;
    left: auto;
    right: auto;
    top: auto;
    transform: none;
    width: min(100% - 16px, 520px);
    height: auto;
    max-height: 55vh;
    margin: 10px auto;
  }

  .desktop {
    overflow: auto;
  }

  .dock-item {
    width: 56px;
    height: 62px;
  }

  .pix.xl {
    width: 32px;
    height: 32px;
  }
}
</style>
