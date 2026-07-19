export const TRACKS = {
    cs: {
      id: 'cs',
      label: '计算机专业',
      subtitle: 'COMPUTER SCIENCE',
      accent: 'from-cyan-500/20 to-blue-600/10',
      border: 'border-cyan-400/40',
      glow: 'shadow-[0_0_30px_rgba(0,245,212,0.25)]',
      clues: [
        { id: 1, title: '算法战场', desc: 'LeetCode / 竞赛 / 项目中的复杂度与取舍' },
        { id: 2, title: '系统架构', desc: '后端、数据库、分布式与性能调优' },
        { id: 3, title: '全栈交付', desc: 'Vue、Node、DevOps 与可维护代码' },
      ],
    },
    ops: {
      id: 'ops',
      label: '活动运营',
      subtitle: 'EVENT OPERATIONS',
      accent: 'from-amber-500/20 to-orange-600/10',
      border: 'border-amber-400/40',
      glow: 'shadow-[0_0_30px_rgba(245,197,66,0.25)]',
      clues: [
        { id: 1, title: '策划落地', desc: '主题、流程、预算与风险预案' },
        { id: 2, title: '增长拉新', desc: '渠道、转化、复盘与数据驱动' },
        { id: 3, title: '现场统筹', desc: '供应商、物料、志愿者与应急预案' },
      ],
    },
    indie: {
      id: 'indie',
      label: '独立开发者',
      subtitle: 'INDIE DEVELOPER',
      accent: 'from-fuchsia-500/20 to-purple-600/10',
      border: 'border-fuchsia-400/40',
      glow: 'shadow-[0_0_30px_rgba(217,70,239,0.25)]',
      clues: [
        { id: 1, title: '产品从 0 到 1', desc: '需求验证、MVP、用户反馈闭环' },
        { id: 2, title: '设计与体验', desc: 'UI、动效、品牌与叙事一致性' },
        { id: 3, title: '发布与变现', desc: '商店、订阅、开源与社区运营' },
      ],
    },
  }
  
  export const TRACK_LIST = Object.values(TRACKS)