export type CharacterType = "sukuna" | "yuji" | "yuta" | "toji" | "todo" | "gojo" | "kinjihakari" | "choso"

export interface CharacterTheme {
  id: CharacterType
  name: string
  japaneseName: string
  domain: string
  domainJapanese: string
  technique: string
  techniqueJapanese: string
  imagePath?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    glow: string
  }
  energy: {
    low: { r: number; g: number; b: number }
    mid: { r: number; g: number; b: number }
    high: { r: number; g: number; b: number }
  }
}

export const CHARACTERS: Record<CharacterType, CharacterTheme> = {
  sukuna: {
    id: "sukuna",
    name: "RYOMEN SUKUNA",
    japaneseName: "両面宿儺",
    domain: "Malevolent Shrine",
    domainJapanese: "伏魔御厨子",
    technique: "Cleave & Dismantle",
    techniqueJapanese: "解・捌",
    imagePath: "/characters/sukuna.png",
    colors: {
      primary: "#7e22ce",
      secondary: "#c026d3",
      accent: "#e879f9",
      glow: "#a855f7",
    },
    energy: {
      low: { r: 126 / 255, g: 34 / 255, b: 206 / 255 },
      mid: { r: 192 / 255, g: 38 / 255, b: 211 / 255 },
      high: { r: 232 / 255, g: 121 / 255, b: 249 / 255 },
    },
  },
  gojo: {
    id: "gojo",
    name: "SATORU GOJO",
    japaneseName: "五条悟",
    domain: "Unlimited Void",
    domainJapanese: "無量空処",
    technique: "Limitless",
    techniqueJapanese: "無下限呪術",
    imagePath: "/characters/gojo.png",
    colors: {
      primary: "#0ea5e9",
      secondary: "#f0f9ff",
      accent: "#38bdf8",
      glow: "#7dd3fc",
    },
    energy: {
      low: { r: 14 / 255, g: 165 / 255, b: 233 / 255 },
      mid: { r: 56 / 255, g: 189 / 255, b: 248 / 255 },
      high: { r: 240 / 255, g: 249 / 255, b: 255 / 255 },
    },
  },
  yuji: {
    id: "yuji",
    name: "YUJI ITADORI",
    japaneseName: "虎杖悠仁",
    domain: "None",
    domainJapanese: "なし",
    technique: "Black Flash",
    techniqueJapanese: "黒閃",
    imagePath: "/characters/yuji.png",
    colors: {
      primary: "#1a1a1a",
      secondary: "#ff69b4",
      accent: "#ffd700",
      glow: "#ff6b9d",
    },
    energy: {
      low: { r: 26 / 255, g: 26 / 255, b: 26 / 255 },
      mid: { r: 255 / 255, g: 105 / 255, b: 180 / 255 },
      high: { r: 255 / 255, g: 215 / 255, b: 0 / 255 },
    },
  },
  yuta: {
    id: "yuta",
    name: "YUTA OKKOTSU",
    japaneseName: "乙骨憂太",
    domain: "Authentic Mutual Love",
    domainJapanese: "真贋相愛",
    technique: "Copy",
    techniqueJapanese: "模倣",
    imagePath: "/characters/yuta.png",
    colors: {
      primary: "#1e1b4b",
      secondary: "#a5b4fc",
      accent: "#ffffff",
      glow: "#818cf8",
    },
    energy: {
      low: { r: 30 / 255, g: 27 / 255, b: 75 / 255 },
      mid: { r: 165 / 255, g: 180 / 255, b: 252 / 255 },
      high: { r: 255 / 255, g: 255 / 255, b: 255 / 255 },
    },
  },
  toji: {
    id: "toji",
    name: "TOJI FUSHIGURO",
    japaneseName: "伏黒甚爾",
    domain: "None",
    domainJapanese: "なし",
    technique: "Heavenly Restriction",
    techniqueJapanese: "天与呪縛",
    imagePath: "/characters/toji.png",
    colors: {
      primary: "#0f172a",
      secondary: "#475569",
      accent: "#94a3b8",
      glow: "#64748b",
    },
    energy: {
      low: { r: 15 / 255, g: 23 / 255, b: 42 / 255 },
      mid: { r: 71 / 255, g: 85 / 255, b: 105 / 255 },
      high: { r: 148 / 255, g: 163 / 255, b: 184 / 255 },
    },
  },
  todo: {
    id: "todo",
    name: "AOI TODO",
    japaneseName: "東堂葵",
    domain: "None",
    domainJapanese: "なし",
    technique: "Boogie Woogie",
    techniqueJapanese: "不義遊戯",
    imagePath: "/characters/todo.png",
    colors: {
      primary: "#78350f",
      secondary: "#a16207",
      accent: "#fbbf24",
      glow: "#d97706",
    },
    energy: {
      low: { r: 120 / 255, g: 53 / 255, b: 15 / 255 },
      mid: { r: 161 / 255, g: 98 / 255, b: 7 / 255 },
      high: { r: 251 / 255, g: 191 / 255, b: 36 / 255 },
    },
  },
  kinjihakari: {
    id: "kinjihakari",
    name: "KINJI HAKARI",
    japaneseName: "秤金次",
    domain: "Idle Death Gamble",
    domainJapanese: "坐殺博徒",
    technique: "Rough Energy",
    techniqueJapanese: "ラフエネルギー",
    imagePath: "/characters/kinjihakari.png",
    colors: {
      primary: "#06b6d4",
      secondary: "#0e7490",
      accent: "#fbbf24",
      glow: "#22d3ee",
    },
    energy: {
      low: { r: 6 / 255, g: 182 / 255, b: 212 / 255 },
      mid: { r: 34 / 255, g: 211 / 255, b: 238 / 255 },
      high: { r: 251 / 255, g: 191 / 255, b: 36 / 255 },
    },
  },
  choso: {
    id: "choso",
    name: "CHOSO",
    japaneseName: "脹相",
    domain: "None",
    domainJapanese: "なし",
    technique: "Blood Manipulation",
    techniqueJapanese: "赤血操術",
    imagePath: "/characters/choso.png",
    colors: {
      primary: "#450a0a",
      secondary: "#7f1d1d",
      accent: "#b91c1c",
      glow: "#dc2626",
    },
    energy: {
      low: { r: 69 / 255, g: 10 / 255, b: 10 / 255 },
      mid: { r: 127 / 255, g: 29 / 255, b: 29 / 255 },
      high: { r: 220 / 255, g: 38 / 255, b: 38 / 255 },
    },
  },
}
