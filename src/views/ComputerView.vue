<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import mePhoto from '../assets/images/me.jpg'

const router = useRouter()
const activeKey = ref(null)
const showGuide = ref(false)
const isGuiding = ref(true)
const pageReady = ref(false)
const photoCanvas = ref(null)
const photoBox = ref(null)
const bottomDash = '-'.repeat(320)

let photoRo = null
let photoImg = null

const MODALS = {
  profile: {
    title: 'PROFESSIONAL PROFILE',
    html: `<p>计算机专业背景，专注 Vue3 前端开发，具备独立完成页面开发、接口联调及基础工程问题排查能力。关注 AI 产品体验与创意交互方向，具备 Web 视觉设计与交互探索经验。</p>`,
  },
  projects: {
    title: 'KEY PROJECTS',
    html: `<p class="m-name">AI任务自动拆解工具</p><p class="m-role">独立开发 & 开源维护</p><p><span class="m-label">技术栈：</span>Vue3 + Vite + Pinia + Vue-Router + Axios + Node.js</p><p><span class="m-label">项目描述：</span>针对用户面对复杂目标难以拆解的问题，开发 AI 任务规划工具，通过树形任务结构帮助用户理解目标与执行路径。</p><ul><li>基于 Vue3 完成任务管理、Dashboard 等核心页面开发，并拆分 TaskTree、TaskCard 等组件</li><li>针对 AI 返回非结构化数据，设计数据转换层，将结果转换为树形结构，并使用递归组件实现多级任务展示</li><li>使用 Pinia 管理任务状态，Axios 封装接口请求流程，实现 loading、异常处理等通用逻辑</li><li>基于 Express 搭建接口层，对 AI 输出进行格式化处理，提高前后端数据稳定性</li></ul><p class="m-name" style="margin-top:24px">图书管理系统（前后端分离）</p><p><span class="m-label">技术栈：</span>Vue3 + TypeScript + Node.js + Express + MySQL</p><ul><li>使用 Vue3 + 完成列表、新增、编辑等核心功能开发</li><li>基于 Axios 封装请求模块，实现接口统一管理和错误处理</li><li>使用 Node.js + Express + MySQL 完成 CRUD 接口及数据存储设计</li></ul>`,
  },
  skills: {
    title: 'TECHNICAL SKILLS',
    html: `<p><span class="m-label">Frontend:</span> Vue3 / JavaScript / HTML5 / CSS3 / Pinia / Axios</p><p><span class="m-label">Backend:</span> Node.js / Express / MySQL</p><p><span class="m-label">Engineering:</span> Git / 接口调试 / 浏览器 DevTools</p>`,
  },
  edu: {
    title: 'EDUCATION',
    html: `<p><span class="m-label">山东工商学院</span></p><p>2023.09 - 至今</p><p>人工智能专业</p><p>本科大四在读</p>`,
  },
  more: {
    title: 'MORE+',
    html: `<div class="m-more"><p class="m-label">CONTACT</p><p>Tel. 13709190612</p><p>Email 3455829239@qq.com</p><p>Loc. 济南（可立刻到岗）</p><p class="m-label m-role-label">ROLE</p><p class="m-glow">Frontend Developer</p></div>`,
  },
}

const MODAL_KEYS = ['profile', 'projects', 'skills', 'edu', 'more']

const activeModal = computed(() => (activeKey.value ? MODALS[activeKey.value] : null))

function dismissGuide() {
  showGuide.value = false
  isGuiding.value = false
}

function openModal(key) {
  showGuide.value = false
  isGuiding.value = false
  activeKey.value = key
}

function closeModal() {
  activeKey.value = null
}

function nextModal() {
  const i = MODAL_KEYS.indexOf(activeKey.value)
  if (i < 0) return
  activeKey.value = MODAL_KEYS[(i + 1) % MODAL_KEYS.length]
}

function prevModal() {
  const i = MODAL_KEYS.indexOf(activeKey.value)
  if (i < 0) return
  activeKey.value = MODAL_KEYS[(i - 1 + MODAL_KEYS.length) % MODAL_KEYS.length]
}

function goHome() {
  router.push({ name: 'home' })
}

function onKey(e) {
  if (e.key === 'Escape') {
    if (activeKey.value) closeModal()
    else if (showGuide.value || isGuiding.value) dismissGuide()
    else goHome()
  }
}

/** 按亮度绘制青色竖线肖像（非简单滤镜） */
function renderScanPortrait() {
  const canvas = photoCanvas.value
  const box = photoBox.value
  if (!canvas || !box || !photoImg?.complete) return

  const w = Math.max(1, Math.floor(box.clientWidth))
  const h = Math.max(1, Math.floor(box.clientHeight))
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`

  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, w, h)

  // 先按 cover 画到离屏，再采样亮度
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const octx = off.getContext('2d')
  const iw = photoImg.naturalWidth
  const ih = photoImg.naturalHeight
  const scale = Math.max(w / iw, h / ih)
  const dw = iw * scale
  const dh = ih * scale
  const dx = (w - dw) / 2
  const dy = (h - dh) / 2 - h * 0.06
  octx.drawImage(photoImg, dx, dy, dw, dh)
  const { data } = octx.getImageData(0, 0, w, h)
  const cx = w * 0.5
  const cy = h * 0.38
  const rx = w * 0.4
  const ry = h * 0.5

  const step = 3
  for (let x = 0; x < w; x += step) {
    for (let y = 0; y < h; y++) {
      const i = (y * w + x) * 4
      const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
      const inSub = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1
      if (!inSub && lum < 0.3) continue
      if (inSub && lum < 0.11) continue
      const thick = Math.max(0.6, lum * (step - 0.4))
      const alpha = 0.25 + lum * 0.75
      ctx.fillStyle = `rgba(0, 232, 198, ${alpha})`
      ctx.fillRect(x + (step - thick) / 2, y, thick, 1)
    }
  }
}

function setupPhotoArt() {
  photoImg = new Image()
  photoImg.decoding = 'async'
  photoImg.onload = () => {
    renderScanPortrait()
    if (photoBox.value && !photoRo) {
      photoRo = new ResizeObserver(() => renderScanPortrait())
      photoRo.observe(photoBox.value)
    }
  }
  photoImg.src = mePhoto
}

onMounted(() => {
  const id = 'wqy-bitmap-song'
  if (!document.getElementById(id)) {
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = 'https://fontsapi.zeoseven.com/10/main/result.css'
    document.head.appendChild(link)
  }
  window.addEventListener('keydown', onKey)
  nextTick(setupPhotoArt)
  requestAnimationFrame(() => {
    pageReady.value = true
  })
  setTimeout(() => {
    showGuide.value = true
  }, 700)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  photoRo?.disconnect()
})
</script>

<template>
  <div class="computer-bios-page" :class="{ 'is-guiding': isGuiding, 'is-ready': pageReady }">
    <button type="button" class="bios-back glitch-text" @click="goHome">← ESC 返回桌面</button>

    <div class="bios-wrapper">
      <div class="nav-bar">
        <div class="nav-item" @click="openModal('profile')">PROFILE</div>
        <div class="nav-item" @click="openModal('projects')">PROJECTS</div>
        <div class="nav-item" @click="openModal('skills')">SKILLS</div>
        <div class="nav-item" @click="openModal('edu')">EDU</div>
        <div class="nav-item" @click="openModal('more')">MORE+</div>
      </div>

      <div class="main-content">
        <div class="left-panel">
          <div class="section-title">PROFESSIONAL PROFILE</div>
          <div class="panel-text">
            计算机专业背景，专注 Vue3 前端开发，具备独立完成页面开发、接口联调及基础工程问题排查能力。关注 AI 产品体验与创意交互方向，具备 Web 视觉设计与交互探索经验。
          </div>

          <div class="section-title">KEY PROJECTS</div>

          <div class="project-block">
            <div class="project-name">AI任务自动拆解工具</div>
            <div class="project-role">独立开发 &amp; 开源维护</div>
            <div class="project-desc">
              <span class="label">技术栈：</span>Vue3 + Vite + Pinia + Vue-Router + Axios + Node.js
            </div>
            <div class="project-desc">
              <span class="label">项目描述：</span>针对用户面对复杂目标难以拆解的问题，开发 AI 任务规划工具，通过树形任务结构帮助用户理解目标与执行路径。
            </div>
            <ul class="dot-list">
              <li>基于 Vue3 完成任务管理、Dashboard 等核心页面开发，并拆分 TaskTree、TaskCard 等组件</li>
              <li>针对 AI 返回非结构化数据，将结果转换为树形结构，使用递归组件实现多级任务展示</li>
              <li>使用 Pinia 管理任务状态，Axios 封装接口请求，实现 loading、异常处理等通用逻辑</li>
              <li>基于 Express 搭建接口层，对 AI 输出进行格式化处理，提高前后端数据稳定性</li>
            </ul>
          </div>

          <div class="project-block" style="margin-top: 14px">
            <div class="project-name">图书管理系统（前后端分离）</div>
            <div class="project-desc" style="margin-top: 2px">
              <span class="label">技术栈：</span>Vue3 + TypeScript + Node.js + Express + MySQL
            </div>
            <ul class="dot-list" style="margin-top: 2px">
              <li>使用 Vue3 完成列表、新增、编辑等核心功能开发</li>
              <li>基于 Axios 封装请求模块，实现接口统一管理和错误处理</li>
              <li>使用 Node.js + Express + MySQL 完成 CRUD 接口及数据存储设计</li>
            </ul>
          </div>

          <div class="section-title">TECHNICAL SKILLS</div>
          <div class="project-desc">
            <span class="label">Frontend:</span> Vue3 / JavaScript / HTML5 / CSS3 / Pinia / Axios
          </div>
          <div class="project-desc">
            <span class="label">Backend:</span> Node.js / Express / MySQL
          </div>
          <div class="project-desc">
            <span class="label">Engineering:</span> Git / 接口调试 / 浏览器 DevTools
          </div>
        </div>

        <div class="right-panel">
          <div ref="photoBox" class="photo-box">
            <canvas ref="photoCanvas" class="photo-scan" aria-label="证件照" />
          </div>

          <div class="edu-contact-container">
            <div class="edu-column">
              <div class="right-section-title">EDUCATION</div>
              <div class="right-section-content edu-text">
                <span class="bright">山东工商学院</span><br />
                <span class="edu-line">2023.09 - 至今</span><br />
                <span class="edu-line">人工智能专业·大四在读</span><br />
              </div>
            </div>
            <div class="contact-column">
              <div class="right-section-title">CONTACT</div>
              <div class="right-section-content contact-text">
                <span class="bright">Tel.</span> 13709190612<br />
                <span class="bright">Email</span> 3455829239@qq.com<br />
                <span class="bright">Loc.</span> 济南（可立刻到岗）
              </div>
            </div>
          </div>

          <div class="ascii-art-box">
            <div class="ascii-art">
              <p>Frontend</p>
              <p>Developer</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-section">
        <div class="bottom-dash" aria-hidden="true">{{ bottomDash }}</div>
        <div class="bottom-row">
          <div class="corner-title">
            <span class="resume-cn">杜欣宜</span>
            <span class="resume-en">RESUME</span>
          </div>

          <div class="bank-section">
            <div class="bank-row">
              <div class="bank-label">BANK 01</div>
              <div class="bank-items">
                <span class="bank-item glitch-text">BUILD → CREATE → DEBUG → REPEAT</span>
                
              </div>
            </div>
            <div class="bank-row">
              <div class="bank-label">BANK 02</div>
              <div class="bank-items">
                <span class="bank-item glitch-text">THINK → DESIGN → ITERATE →  AGAIN</span>
                
              </div>
            </div>
          </div>

          <pre class="info-box">BIOS INFORMATION
------------------
SYSTEM: RESUME BIOS v1.03
DATE: 2025-01-15
STATUS: OPERATIONAL

MEMORY TEST: 640K OK
CPU: FRONTEND DEV
CLOCK: 3.50GHz</pre>
        </div>

        <div class="nakz-design">NCREATE YOUR OWN MAP</div>
      </div>
    </div>

    <Transition name="bios-fade">
      <div v-if="showGuide" class="bios-modal-mask guide-mask">
        <div class="bios-modal guide-tip" role="dialog" aria-modal="true">
          <div class="bios-modal-titlebar">
            <span class="bios-modal-title">SYSTEM GUIDE</span>
            <button type="button" class="bios-modal-close" aria-label="关闭" @click="dismissGuide">×</button>
          </div>
          <div class="bios-modal-body">
            <p><span class="m-label">MISSION:</span> 点击顶部菜单查看详情</p>
            <p>[ PROFILE ] 个人简介</p>
            <p>[ PROJECTS ] 项目经历</p>
            <p>[ SKILLS ] 技术栈</p>
            <p>[ EDU ] 教育背景</p>
            <p>[ MORE+ ] 联系方式</p>
          </div>
          <div class="bios-modal-actions">
            <button type="button" class="bios-win-btn" @click="dismissGuide">OK</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="bios-fade">
      <div v-if="activeModal" class="bios-modal-mask" @click.self="closeModal">
        <div class="bios-modal" role="dialog" aria-modal="true">
          <div class="bios-modal-titlebar">
            <span class="bios-modal-title">{{ activeModal.title }}</span>
            <button type="button" class="bios-modal-close" aria-label="关闭" @click="closeModal">×</button>
          </div>
          <div class="bios-modal-body" v-html="activeModal.html" />
          <div class="bios-modal-actions">
            <button type="button" class="bios-win-btn" @click="prevModal">Back</button>
            <button type="button" class="bios-win-btn" @click="closeModal">OK</button>
            <button type="button" class="bios-win-btn" @click="nextModal">Next</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
@import url('https://fontsapi.zeoseven.com/10/main/result.css');

.computer-bios-page {
  --cyan: #00e8c6;
  --cyan-dim: #00b89a;
  --cyan-dark: #008f78;
  --bg: #050807;

  box-sizing: border-box;
  height: 100%;
  min-height: 100%;
  overflow: auto;
  background: var(--bg);
  color: var(--cyan);
  font-family: 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', 'Microsoft YaHei',
    'PingFang SC', monospace;
  font-size: 17px;
  line-height: 1.2;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  opacity: 0;
  transition: opacity 1.1s ease;
}

.computer-bios-page.is-ready {
  opacity: 1;
}

.computer-bios-page *,
.computer-bios-page *::before,
.computer-bios-page *::after {
  box-sizing: border-box;
}

.bios-back {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;
  border: none;
  background: transparent;
  color: var(--cyan);
  font-family: inherit;
  font-size: 16px;
  letter-spacing: 1px;
  padding: 4px 0;
  cursor: pointer;
  text-shadow: 0 0 6px var(--cyan);
}

.bios-back:hover {
  color: #fff;
}

.bios-wrapper {
  width: min(1100px, 100%);
  margin: 0 auto;
  background: #0a0f0d;
  border: 2px solid var(--cyan-dark);
  padding: 8px;
  box-shadow: 0 0 40px rgba(0, 232, 198, 0.08);
  position: relative;
}

.bios-wrapper::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1000;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
  font-size: 15px;
  letter-spacing: 2px;
  border-bottom: 1px solid var(--cyan-dark);
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.top-bar span {
  white-space: nowrap;
}

.nav-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 6px 0;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 3px;
  cursor: pointer;
  transition: background 0.2s, text-shadow 0.2s;
}

.nav-item::before {
  content: '[ ';
}

.nav-item::after {
  content: ' ]';
}

.nav-item:hover {
  background: rgba(0, 232, 198, 0.1);
  text-shadow: 0 0 8px var(--cyan);
}

/* 首次进入：压暗其它区域，只亮顶部导航；点 OK 后缓慢亮起 */
.computer-bios-page .bios-back,
.computer-bios-page .main-content,
.computer-bios-page .bottom-section {
  transition: opacity 1.1s ease, filter 1.1s ease;
}

.computer-bios-page.is-guiding .bios-back,
.computer-bios-page.is-guiding .main-content,
.computer-bios-page.is-guiding .bottom-section {
  opacity: 0.34;
  pointer-events: none;
  filter: brightness(0.55);
}

.computer-bios-page.is-guiding .nav-bar {
  position: relative;
  z-index: 1200;
  text-shadow:
    0 0 8px var(--cyan),
    0 0 18px rgba(0, 232, 198, 0.55);
}

.guide-mask {
  align-items: flex-start;
  padding-top: 96px;
  background: transparent;
  pointer-events: none;
}

.guide-mask .bios-modal {
  pointer-events: auto;
}

.guide-tip {
  max-width: min(420px, 90vw);
}

.bios-fade-enter-active,
.bios-fade-leave-active {
  transition: opacity 0.95s ease;
}

.bios-fade-enter-from,
.bios-fade-leave-to {
  opacity: 0;
}

/* 双栏：固定比例，禁止被 ASCII 撑塌 */
.main-content {
  display: flex;
  gap: 8px;
  border: none;
  padding: 0;
  margin-bottom: 6px;
  width: 100%;
  min-width: 0;
}

.left-panel {
  flex: 1.5 1 0;
  width: 0;
  border: 0;
  padding: 8px 10px;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.right-panel {
  flex: 0.9 1 0;
  width: 0;
  border: 1px solid var(--cyan-dark);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  margin: 8px 0 4px;
  padding-bottom: 0;
  border-bottom: none;
  color: var(--cyan);
  text-transform: uppercase;
}

.section-title::after {
  content: '========';
  display: block;
  margin-top: 2px;
  color: var(--cyan-dark);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 1px;
}

.section-title:first-child {
  margin-top: 0;
}

.panel-text {
  font-size: 17px;
  line-height: 1.2;
  color: var(--cyan-dim);
}

.dot-list {
  list-style: none;
  margin: 0;
  padding-left: 0;
  font-size: 17px;
  line-height: 1.2;
  color: var(--cyan-dim);
}

.dot-list li {
  margin-bottom: 2px;
  padding-left: 14px;
  position: relative;
}

.dot-list li::before {
  content: '>';
  position: absolute;
  left: 0;
  color: var(--cyan);
}

.project-block {
  margin-bottom: 6px;
}

.project-name {
  font-size: 16px;
  font-weight: bold;
  color: var(--cyan);
  margin-bottom: 1px;
}

.project-role {
  font-size: 14px;
  color: var(--cyan-dark);
  margin-bottom: 2px;
}

.project-desc {
  font-size: 17px;
  line-height: 1.2;
  color: var(--cyan-dim);
  margin-bottom: 2px;
}

.project-desc .label {
  color: var(--cyan);
  font-weight: bold;
}

.photo-box {
  position: relative;
  width: 100%;
  height: 380px;
  border: 0;
  overflow: hidden;
  flex-shrink: 0;
  background: #000;
}

.photo-scan {
  width: 100%;
  height: 100%;
  display: block;
}

.bottom-dash {
  margin: 0 0 6px;
  overflow: hidden;
  white-space: nowrap;
  color: var(--cyan-dark);
  font-size: 11px;
  letter-spacing: 0;
  line-height: 1;
  font-family: Consolas, 'WenQuanYi Bitmap Song 16px', monospace;
}

.edu-contact-container {
  display: flex;
  border-top: 1px solid var(--cyan-dark);
  padding-top: 6px;
  gap: 8px;
  min-width: 0;
}

.edu-column,
.contact-column {
  flex: 1;
  min-width: 0;
}

.contact-column {
  border-left: 1px solid var(--cyan-dark);
  padding-left: 8px;
}

.right-section-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--cyan);
  letter-spacing: 1px;
  margin-bottom: 2px;
  border-bottom: none;
  padding-bottom: 0;
}

.right-section-title::after {
  display: block;
  margin-top: 2px;
  color: var(--cyan-dark);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0;
}

.edu-column .right-section-title::after {
  content: '=========';
}

.contact-column .right-section-title::after {
  content: '=======';
}

.right-section-content {
  font-size: 13px;
  line-height: 1.3;
  color: var(--cyan-dim);
  overflow-wrap: anywhere;
}

.right-section-content.edu-text,
.right-section-content.contact-text {
  font-size: 16px;
  line-height: 1.25;
  overflow-wrap: normal;
}

.right-section-content .edu-line {
  white-space: nowrap;
}

.right-section-content .bright {
  color: var(--cyan);
}

.ascii-art-box {
  border-top: 1px solid var(--cyan-dark);
  padding-top: 4px;
  padding-bottom: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #050a07;
  flex: 1;
  min-height: 80px;
  min-width: 0;
  overflow: hidden;
}

.ascii-art {
  margin: 0;
  text-align: center;
  font-family: 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', Consolas, monospace;
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.06em;
  color: var(--cyan);
  text-shadow:
    0 0 6px var(--cyan),
    0 0 14px rgba(0, 232, 198, 0.45);
}

.ascii-art p {
  margin: 0;
}

.scan-text {
  color: transparent;
  background-image: repeating-linear-gradient(
    180deg,
    var(--cyan) 0 2px,
    rgba(0, 232, 198, 0.15) 2px 3px
  );
  -webkit-background-clip: text;
  background-clip: text;
  filter: drop-shadow(0 0 6px rgba(0, 232, 198, 0.55));
}

.corner-title {
  flex: 1 1 180px;
  min-width: 160px;
  min-height: 72px;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.45em;
  padding: 10px 4px;
  background: transparent;
}

.resume-cn,
.resume-en {
  color: var(--cyan);
  font-weight: 700;
  font-size: clamp(44px, 5.6vw, 64px);
  letter-spacing: 0.06em;
  line-height: 1.1;
  text-shadow:
    0 0 6px var(--cyan),
    0 0 14px rgba(0, 232, 198, 0.45);
}

.resume-cn {
  font-family: 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', 'Microsoft YaHei', monospace;
}

.resume-en {
  font-family: 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', Consolas, monospace;
}

.bottom-section {
  border: 0;
  padding: 8px;
}

.bottom-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  min-width: 0;
  flex-wrap: wrap;
}

.bottom-text-block {
  font-size: 13px;
  line-height: 1.3;
  color: var(--cyan-dark);
  white-space: pre-wrap;
  flex: 1 1 220px;
  min-width: 0;
  overflow-wrap: anywhere;
}

.bottom-text-block .highlight {
  color: var(--cyan);
}

.bank-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 200px;
  min-width: 0;
}

.bank-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.bank-label {
  font-size: 13px;
  color: var(--cyan-dark);
  min-width: 40px;
}

.bank-items {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.bank-item {
  font-size: 15px;
  letter-spacing: 1px;
  color: var(--cyan);
  text-shadow: 0 0 6px var(--cyan);
}

.info-box {
  margin: 0;
  border: 0;
  padding: 4px 6px;
  font-size: 12px;
  line-height: 1.3;
  color: var(--cyan-dark);
  max-width: 160px;
  white-space: pre;
  font-family: inherit;
  flex: 0 0 auto;
}

.nakz-design {
  font-size: 36px;
  letter-spacing: 6px;
  text-align: center;
  color: var(--cyan);
  text-shadow:
    0 0 8px var(--cyan),
    0 0 16px var(--cyan-dim);
  margin-top: 6px;
  font-family: 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', 'Microsoft YaHei', monospace;
  position: relative;
}

.nakz-design::after {
  content: '(c)';
  font-size: 10px;
  position: absolute;
  right: -20px;
  bottom: 5px;
  letter-spacing: 0;
}

.glitch-text {
  animation: bios-glitch 3s infinite;
}

@keyframes bios-glitch {
  0%,
  90%,
  100% {
    opacity: 1;
  }
  92% {
    opacity: 0.3;
  }
  94% {
    opacity: 1;
  }
  96% {
    opacity: 0.5;
  }
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }

  .left-panel,
  .right-panel {
    width: auto;
    flex: 1 1 auto;
  }

  .bottom-row {
    flex-direction: column;
  }
}

.bios-modal-mask {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.bios-modal {
  position: relative;
  width: fit-content;
  min-width: 280px;
  max-width: min(520px, 92vw);
  max-height: min(80vh, 900px);
  display: flex;
  flex-direction: column;
  aspect-ratio: auto;
  overflow: hidden;
  background: rgba(0, 15, 10, 0.95);
  color: var(--cyan-dim);
  border: none;
  border-top: 4px solid var(--cyan);
  box-shadow:
    0 3px 0 rgba(0, 184, 154, 0.4),
    0 0 24px rgba(0, 232, 198, 0.28),
    0 0 48px rgba(0, 232, 198, 0.12),
    0 16px 48px rgba(0, 0, 0, 0.5);
  padding: 0;
  font-family: 'Microsoft YaHei', Tahoma, 'MS Sans Serif', sans-serif;
}

.bios-modal::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.14) 0px,
    rgba(0, 0, 0, 0.14) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1;
}

.bios-modal-titlebar,
.bios-modal-body,
.bios-modal-actions {
  position: relative;
  z-index: 2;
}

.bios-modal-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: rgba(0, 28, 20, 0.55);
  color: var(--cyan);
  border-bottom: 1px dashed rgba(0, 184, 154, 0.45);
  padding: 6px 8px 6px 12px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  user-select: none;
  text-shadow:
    0 0 6px var(--cyan),
    0 0 14px rgba(0, 232, 198, 0.45);
}

.bios-modal-title {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bios-modal-close {
  width: 20px;
  height: 18px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 1px solid var(--cyan-dark);
  background: #0a0f0d;
  color: var(--cyan);
  font-size: 14px;
  line-height: 1;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.bios-modal-close:hover {
  background: #16201b;
  color: #fff;
}

.bios-modal-body {
  margin: 10px 12px 0;
  padding: 14px 16px;
  overflow: auto;
  flex: 0 1 auto;
  min-height: 0;
  background: transparent;
  color: var(--cyan-dim);
  border: none;
  font-family: 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', 'Microsoft YaHei', monospace;
  font-size: 17px;
  line-height: 1.25;
  text-shadow: 0 0 6px rgba(0, 232, 198, 0.35);
}

.bios-modal-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 12px;
}

.bios-win-btn {
  min-width: 72px;
  padding: 5px 14px;
  background: #0a0f0d;
  color: var(--cyan);
  border: 1px solid var(--cyan-dark);
  font-size: 14px;
  font-family: inherit;
  letter-spacing: 0.04em;
  cursor: pointer;
  text-shadow: 0 0 6px rgba(0, 232, 198, 0.4);
}

.bios-win-btn:hover {
  border-color: var(--cyan);
  background: #121a16;
  text-shadow: 0 0 10px var(--cyan);
}

.bios-win-btn:active {
  background: #050807;
}

.bios-modal-body p {
  margin: 0 0 4px;
}

.bios-modal-body ul {
  margin: 0 0 6px;
  padding-left: 0;
  list-style: none;
}

.bios-modal-body li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 2px;
}

.bios-modal-body li::before {
  content: '>';
  position: absolute;
  left: 0;
  color: var(--cyan);
}

.bios-modal-body .m-name {
  color: var(--cyan);
  font-weight: 700;
  margin-top: 8px;
  text-shadow:
    0 0 6px var(--cyan),
    0 0 14px rgba(0, 232, 198, 0.45);
}

.bios-modal-body .m-role {
  color: var(--cyan-dark);
  font-size: 15px;
}

.bios-modal-body .m-label {
  color: var(--cyan);
  font-weight: 700;
  text-shadow: 0 0 8px rgba(0, 232, 198, 0.5);
}

.bios-modal-body .m-more {
  font-size: 17px;
  line-height: 1.3;
}

.bios-modal-body .m-more p {
  margin: 0 0 4px;
}

.bios-modal-body .m-more .m-role-label {
  margin-top: 12px;
}

.bios-modal-body .m-glow {
  margin: 6px 0 0;
  text-align: center;
  font-size: clamp(22px, 4vw, 30px);
  letter-spacing: 0.12em;
  color: var(--cyan);
  font-family: 'WenQuanYi Bitmap Song 16px', 'WenQuanYi Bitmap Song', 'Microsoft YaHei', monospace;
  text-shadow:
    0 0 6px var(--cyan),
    0 0 14px var(--cyan),
    0 0 28px rgba(0, 232, 198, 0.55);
  position: relative;
  isolation: isolate;
}

.bios-modal-body .m-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.28) 0px,
    rgba(0, 0, 0, 0.28) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
}
</style>
