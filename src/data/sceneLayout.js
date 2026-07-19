import bgFull from '../assets/images/background.jpg'
import bgLqip from '../assets/images/background-lqip.jpg'
import computerImg from '../assets/images/computer.png'
import photoImg from '../assets/images/photo.png'
import bookImg from '../assets/images/book.png'

/** 背景原图比例 1707×1280 */
export const DESK_ASPECT = 1707 / 1280

export const deskBackground = {
  full: bgFull,
  lqip: bgLqip,
}

/**
 * 相对背景画布的百分比定位（x/y/w/h 均为 %）
 * 坐标按 background.jpg 上对应物体区域校准；微调只改这里。
 */
export const deskItems = [
  {
    id: 'computer',
    track: 'cs',
    label: '电脑',
    src: computerImg,
    x: -1,
    y: 20.5,
    w: 36,
    h: 54,
  },
  {
    id: 'photo',
    track: 'ops',
    label: '线索板',
    src: photoImg,
    x: 50,
    y: 4,
    w: 28.5 * DESK_ASPECT,
    h: 37.5,
  },
  {
    id: 'book',
    track: 'indie',
    label: '笔记本',
    src: bookImg,
    x: 42,
    y: 70,
    w: 40,
    h: 28,
  },
]

/** @deprecated 兼容旧引用，请用 deskItems */
export const deskHotspots = deskItems

export const cluePositions = [
  { id: 1, x: 6, y: 10, w: 15, h: 19, rotate: -6 },
  { id: 2, x: 4, y: 38, w: 17, h: 21, rotate: 8 },
  { id: 3, x: 8, y: 66, w: 13, h: 17, rotate: -4 },
]

export const resumeBookLayout = { x: 36, y: 26, w: 44, h: 54, rotate: 2 }

export const decorItems = [
  { id: 'headphones', label: '耳机', x: 28, y: 18, w: 15, h: 10, rotate: -12 },
  { id: 'phone', label: '手机', x: 72, y: 40, w: 9, h: 16, rotate: 6 },
  { id: 'capsule', label: '胶囊', x: 79, y: 68, w: 7, h: 7, rotate: 0 },
]

export function pctBox({ x, y, w, h }) {
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${w}%`,
    height: `${h}%`,
  }
}

export function pctStyle({ x, y, w, h, rotate = 0 }) {
  return {
    ...pctBox({ x, y, w, h }),
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
  }
}

export function cluePin(clue) {
  return {
    x: clue.x + clue.w / 2,
    y: clue.y + 2,
  }
}

export function getClueConnections() {
  const pins = cluePositions.map(cluePin)
  return [
    { x1: pins[0].x, y1: pins[0].y, x2: pins[1].x, y2: pins[1].y },
    { x1: pins[1].x, y1: pins[1].y, x2: pins[2].x, y2: pins[2].y },
    { x1: pins[0].x, y1: pins[0].y, x2: pins[2].x, y2: pins[2].y },
  ]
}

export function getCluePins() {
  return cluePositions.map(cluePin)
}
