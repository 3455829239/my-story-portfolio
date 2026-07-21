import bgFull from "../assets/images/background.jpg";
import bgLqip from "../assets/images/background-lqip.jpg";
import computerImg from "../assets/images/computer.png";
import photoImg from "../assets/images/photo.png";
import bookImg from "../assets/images/book.png";
import headphoneImg from "../assets/images/headphone.png";

import evidenceRule from "../assets/images/rule.jpg";
import evidenceWarzone from "../assets/images/war_zone.jpg";
import evidenceFailed from "../assets/images/failed.jpg";
import evidenceFailed2 from "../assets/images/failed2.jpg";
import evidenceFailed4 from "../assets/images/failed4.jpg";
import evidenceSucceed from "../assets/images/succeed.jpg";
import evidenceSucceed2 from "../assets/images/succeed2.jpg";
import evidenceSucceed4 from "../assets/images/succeed4.jpg";
import evidenceWarning1 from "../assets/images/warning1.jpg";
import evidenceWarning2 from "../assets/images/warning2.jpg";

export const DESK_ASPECT = 1707 / 1280;

export const deskBackground = {
  full: bgFull,
  lqip: bgLqip,
};

export const deskItems = [
  {
    id: "computer",
    track: "cs",
    label: "电脑",
    src: computerImg,
    x: -1,
    y: 20.5,
    w: 36,
    h: 54,
  },
  {
    id: "photo",
    track: "ops",
    label: "线索板",
    src: photoImg,
    x: 50,
    y: 4,
    w: 28.5 * DESK_ASPECT,
    h: 37.5,
  },
  {
    id: "book",
    track: "indie",
    label: "笔记本",
    src: bookImg,
    x: 42,
    y: 70,
    w: 40,
    h: 28,
  },
];

export const deskHotspots = deskItems;

/**
 * 4 张大卡、间距更紧（只定 x/y/w，高度按图比例自适应）
 * 布局：上排 3 张贴紧，下排成功页 + 右侧审美分析卡
 */
export const cluePositions = [
  // Top editorial row (lean columns for magazine masthead feel)
  { id: 1, x: 8, y: 6, w: 20, rotate: 0 },
  { id: 2, x: 32, y: 6, w: 20, rotate: 0 },
  { id: 3, x: 56, y: 6, w: 20, rotate: 0 },
  { id: 4, x: 80, y: 6, w: 18, rotate: 0 },

  // Left and right columns (balanced, vertical rhythm)
  { id: 5, x: 6, y: 28, w: 22, rotate: 0 },
  { id: 6, x: 76, y: 28, w: 22, rotate: 0 },
  { id: 7, x: 6, y: 52, w: 22, rotate: 0 },
  { id: 8, x: 76, y: 52, w: 22, rotate: 0 },

  // Bottom editorial row (anchor the spread)
  { id: 9, x: 28, y: 74, w: 26, rotate: 0 },
  { id: 10, x: 52, y: 74, w: 26, rotate: 0 },
];

/** 每张图旁边的审美分析卡位置（第 4 张默认常显） */
export const analysisCardLayouts = [
  // Editorial-style note placements: avoid overlapping hero, align to columns
  { id: 1, x: 30, y: 14, w: 20, h: 12, rotate: 0 },
  { id: 2, x: 64, y: 14, w: 20, h: 12, rotate: 0 },
  { id: 3, x: 30, y: 58, w: 20, h: 12, rotate: 0 },
  { id: 4, x: 64, y: 58, w: 20, h: 12, rotate: 0 },
];

export const resumeBookLayout = { x: 70, y: 72, w: 18, h: 14, rotate: -2 };

export const boardExtras = [
  {
    id: "terminal",
    label: "TERMINAL LOG",
    x: 66,
    y: 78,
    w: 20,
    h: 10,
    rotate: 1,
  },
  { id: "ticket", label: "4:20 PM", x: 1, y: 88, w: 8, h: 8, rotate: -2 },
];

export const boardLabels = [
  { id: "label-2", text: "LET THEM BE.", x: 78, y: 2, w: 14, h: 4, rotate: 5 },
  {
    id: "stamp",
    text: "TOP SECRET",
    x: 82,
    y: 12,
    w: 12,
    h: 5,
    rotate: -12,
    stamp: true,
  },
];

export const boardLineAnchors = {
  cassette: { x: 8, y: 6 },
  terminal: { x: 76, y: 80 },
};

export const scoreLabels = {
  visual: "视觉审美",
  interaction: "交互流利度",
  technical: "技术复杂度",
};

/** 四张证据（恶厂 / 战区 / 失败 / 成功）—— 各 track 共用同一套项目截图 */
const factoryEvidenceList = [
  {
    id: 1,
    title: "规则手册",
    desc: "超级恶厂 · 开局规则与 CTA",
    src: evidenceRule,
    pinAnalysis: false,
    spotColor: true,
    analysis: {
      summary:
        "高对比预警色（橙/红/绿）压在深色底上，形成“强制制度”压迫感；MUST READ 与红色警告框抢夺第一视线，再落到橙色主按钮。",
      verdict: "证据指向：主题统一、层级清楚，信息密度偏高但目标明确。",
      scores: { visual: 85, interaction: 90, technical: 60 },
      annotations: [
        {
          x: 8,
          y: 12,
          w: 84,
          h: 18,
          note: "审美：危险色强化“恶厂”叙事",
        },
        {
          x: 8,
          y: 72,
          w: 84,
          h: 14,
          note: "交互：主 CTA 足够醒目",
        },
      ],
    },
  },
  {
    id: 2,
    title: "战区地图",
    desc: "6×6 格子 · 语义色分区",
    src: evidenceWarzone,
    pinAnalysis: false,
    spotColor: true,
    analysis: {
      summary:
        "绿/橙/红格子完成规则可视化；中央掷骰弹层打断网格，形成“决策焦点”。图例与方向键把操作语义钉在底部。",
      verdict: "证据指向：系统可读性强，弹层与底图的对比还需再压一点。",
      scores: { visual: 78, interaction: 88, technical: 72 },
      annotations: [
        {
          x: 28,
          y: 30,
          w: 44,
          h: 36,
          note: "交互：弹层成为临时主焦点",
        },
      ],
    },
  },
  {
    id: 3,
    title: "加班失败",
    desc: "GAME OVER · 悔过书叙事",
    src: evidenceFailed,
    pinAnalysis: false,
    analysis: {
      summary:
        "红条警告 → 大标题宣判 → 白纸悔过书 → 黄条复活 CTA，失败链路完整；黑红黄对比制造“被抓现行”戏剧感。",
      verdict: "证据指向：情绪表达极强，长文卡片在证据墙上需靠自适应高度承载。",
      scores: { visual: 88, interaction: 82, technical: 58 },
      annotations: [
        {
          x: 10,
          y: 8,
          w: 80,
          h: 10,
          note: "审美：警戒条建立失败语境",
        },
        {
          x: 12,
          y: 78,
          w: 76,
          h: 12,
          note: "交互：复活按钮用高亮色拉回操作",
        },
      ],
    },
  },
  {
    id: 4,
    title: "完美逃脱",
    desc: "成功结算 · 战利品账单",
    src: evidenceSucceed,
    pinAnalysis: true, // 审美分析卡常显在照片旁
    analysis: {
      summary:
        "警戒条 + 青绿认证徽章 + 橙色主标题，成功态与失败态共用工业符号但色相反转；下方白底账单用收据隐喻让数据可读、可玩。",
      verdict:
        "证据指向：视觉仪式感强，中段留白突出“成功”情绪，适合作为结案展板。",
      scores: { visual: 90, interaction: 84, technical: 65 },
      annotations: [
        {
          x: 15,
          y: 18,
          w: 70,
          h: 16,
          note: "审美：成功色（橙/青）替换失败红",
        },
        {
          x: 12,
          y: 55,
          w: 76,
          h: 28,
          note: "叙事：账单隐喻降低数据枯燥感",
        },
      ],
    },
  },
  // {
  //   id: 5,
  //   title: "成功逃离",
  //   desc: "黑金胜利页面 · 追加证据",
  //   src: evidenceSucceed4,
  //   pinAnalysis: false,
  //   analysis: {
  //     summary:
  //       "黑底金字胜利屏增强结案感，可作为证据墙上更正式、情绪更强的“完成证明”。",
  //     verdict: "证据指向：加强“逃离成功”主题，适合与失败页形成对比。",
  //     scores: { visual: 82, interaction: 76, technical: 58 },
  //     annotations: [],
  //   },
  // },
  // {
  //   id: 6,
  //   title: "警告提示",
  //   desc: "红色警示 · 追加失败图",
  //   src: evidenceFailed4,
  //   pinAnalysis: false,
  //   analysis: {
  //     summary:
  //       "红黑警告信息强化“突然失败”氛围，可用于补完失败路径中的异常告警。",
  //     verdict: "证据指向：加强紧迫感，建议与其他证据错开排布。",
  //     scores: { visual: 79, interaction: 73, technical: 54 },
  //     annotations: [],
  //   },
  // },
  {
    id: 7,
    title: "警告弹窗 A",
    desc: "警告样式截图",
    src: evidenceWarning1,
    pinAnalysis: false,
    analysis: {
      summary: "警告对话框样式示例",
      verdict: "UI 警示样式",
      scores: { visual: 70, interaction: 60, technical: 40 },
      annotations: [],
    },
  },
  {
    id: 8,
    title: "警告弹窗 B",
    desc: "警告样式截图（变体）",
    src: evidenceWarning2,
    pinAnalysis: false,
    analysis: {
      summary: "警告对话框变体",
      verdict: "UI 警示样式",
      scores: { visual: 70, interaction: 60, technical: 40 },
      annotations: [],
    },
  },
  {
    id: 9,
    title: "悔过书扫描",
    desc: "文档类证据（悔过书）",
    src: evidenceFailed2,
    pinAnalysis: false,
    analysis: {
      summary: "悔过书文档样式",
      verdict: "叙事文本证据",
      scores: { visual: 68, interaction: 50, technical: 30 },
      annotations: [],
    },
  },
  {
    id: 10,
    title: "战利账单",
    desc: "结算账单样式",
    src: evidenceSucceed2,
    pinAnalysis: false,
    analysis: {
      summary: "账单/结算样式示例",
      verdict: "信息化展示",
      scores: { visual: 75, interaction: 60, technical: 45 },
      annotations: [],
    },
  },
];

export const clueEvidence = {
  cs: factoryEvidenceList,
  ops: factoryEvidenceList,
  indie: factoryEvidenceList,
};

export const additionalEvidence = [
  {
    id: 5,
    title: "逃离截图",
    desc: "胜利画面 · 逃离成功",
    src: evidenceSucceed4,
    pinAnalysis: false,
    analysis: {
      summary:
        "极简胜利页面，黑底金字强化结案仪式感，适合作为证据墙上的“成功归档”。",
      verdict: "证据指向：视觉冲击强，建议与失败页形成对比对照。",
      scores: { visual: 84, interaction: 78, technical: 60 },
      annotations: [],
    },
  },
  {
    id: 6,
    title: "警告报表",
    desc: "红色警示 · 触发失败反馈",
    src: evidenceFailed4,
    pinAnalysis: false,
    analysis: {
      summary: "红黑警示布局传达“加班失败”警戒感，可作为失败证据链的补充节点。",
      verdict: "证据指向：加强叙事氛围，但需与其他卡片错位排布避免重复。",
      scores: { visual: 80, interaction: 72, technical: 55 },
      annotations: [],
    },
  },
];

export const decorItems = [
  {
    id: "headphones",
    label: "耳机",
    src: headphoneImg,
    x: 25,
    y: 18,
    w: 15,
    h: 20,
    rotate: -12,
  },
  { id: "phone", label: "手机", x: 72, y: 40, w: 9, h: 16, rotate: 6 },
  { id: "capsule", label: "胶囊", x: 79, y: 68, w: 7, h: 7, rotate: 0 },
];

export function pctBox({ x, y, w, h }) {
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${w}%`,
    height: `${h}%`,
  };
}

export function pctStyle({ x, y, w, h, rotate = 0 }) {
  return {
    ...pctBox({ x, y, w, h }),
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
  };
}

export function clueCardStyle({ x, y, w, rotate = 0, aspectRatio }) {
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${w}%`,
    height: "auto",
    aspectRatio: aspectRatio ? String(aspectRatio) : undefined,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
  };
}

export function cluePin(clue) {
  return {
    x: clue.x + clue.w / 2,
    y: clue.y + 2,
  };
}

export function getClueConnections() {
  const pins = cluePositions.map(cluePin);
  const { cassette, terminal } = boardLineAnchors;
  return [
    { x1: cassette.x, y1: cassette.y, x2: pins[0].x, y2: pins[0].y },
    { x1: pins[0].x, y1: pins[0].y, x2: pins[1].x, y2: pins[1].y },
    { x1: pins[1].x, y1: pins[1].y, x2: pins[2].x, y2: pins[2].y },
    { x1: pins[2].x, y1: pins[2].y, x2: pins[3].x, y2: pins[3].y },
    { x1: pins[3].x, y1: pins[3].y, x2: terminal.x, y2: terminal.y },
  ];
}

export function getCluePins() {
  const pins = cluePositions.map(cluePin);
  const { cassette, terminal } = boardLineAnchors;
  return [cassette, ...pins, terminal];
}

export function getEvidenceItems(trackId) {
  return clueEvidence[trackId] ?? clueEvidence.cs
}