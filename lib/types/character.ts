export type CharacterType = "sukuna" | "yuji" | "yuta" | "toji" | "todo" | "gojo"

export interface CharacterTheme {
  id: CharacterType
  name: string
  japaneseName: string
  domain: string
  domainJapanese: string
  technique: string
  techniqueJapanese: string
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
    colors: {
      primary: "#8a0093",
      secondary: "#9333ea",
      accent: "#ff3c8f",
      glow: "#9333ea",
    },
    energy: {
      low: { r: 90 / 255, g: 0, b: 120 / 255 },
      mid: { r: 147 / 255, g: 51 / 255, b: 234 / 255 },
      high: { r: 255 / 255, g: 120 / 255, b: 255 / 255 },
    },
  },
  gojo: {
    id: "gojo",
    name: "Satoru Gojo",
    japaneseName: "五条 悟",
    domain: "Unlimited Void",
    domainJapanese: "無量空処",
    technique: "Hollow Technique: Purple",
    techniqueJapanese: "虚式・茈",
    colors: {
      primary: "#27254C", // Space Cadet (Dark Blue Uniform/Blindfold)
      secondary: "#F2ECF8", // Anti-Flash White (Hair/Infinity)
      accent: "#45B0D2", // Maximum Blue (Six Eyes)
      glow: "#9B8AB4", // Lavender Purple (Hollow Purple energy)
    },
    energy: {
      low: { r: 39 / 255, g: 37 / 255, b: 76 / 255 }, // Deep dark blue (Idle state)
      mid: { r: 69 / 255, g: 176 / 255, b: 210 / 255 }, // Bright Cyan (Six Eyes active)
      high: { r: 155 / 255, g: 138 / 255, b: 180 / 255 }, // Purple/White (Domain/Purple activation)
    },
  },
  yuji: {
    id: "yuji",
    name: "YUJI ITADORI",
    japaneseName: "虎杖悠仁",
    domain: "Unknown Domain",
    domainJapanese: "未知の領域",
    technique: "Divergent Fist",
    techniqueJapanese: "逕庭拳",
    colors: {
      primary: "#dc2626",
      secondary: "#991b1b",
      accent: "#fca5a5",
      glow: "#dc2626",
    },
    energy: {
      low: { r: 139 / 255, g: 0, b: 0 },
      mid: { r: 220 / 255, g: 38 / 255, b: 38 / 255 },
      high: { r: 252 / 255, g: 165 / 255, b: 165 / 255 },
    },
  },
  yuta: {
    id: "yuta",
    name: "YUTA OKKOTSU",
    japaneseName: "乙骨憂太",
    domain: "Authentic Mutual Love",
    domainJapanese: "真贋相愛",
    technique: "Rika's Curse",
    techniqueJapanese: "里香の呪い",
    colors: {
      primary: "#2563eb",
      secondary: "#60a5fa",
      accent: "#dbeafe",
      glow: "#3b82f6",
    },
    energy: {
      low: { r: 37 / 255, g: 99 / 255, b: 235 / 255 },
      mid: { r: 96 / 255, g: 165 / 255, b: 250 / 255 },
      high: { r: 219 / 255, g: 234 / 255, b: 254 / 255 },
    },
  },
  toji: {
    id: "toji",
    name: "TOJI FUSHIGURO",
    japaneseName: "伏黒甚爾",
    domain: "No Domain",
    domainJapanese: "領域なし",
    technique: "Heavenly Restriction",
    techniqueJapanese: "天与呪縛",
    colors: {
      primary: "#059669",
      secondary: "#065f46",
      accent: "#6ee7b7",
      glow: "#10b981",
    },
    energy: {
      low: { r: 5 / 255, g: 150 / 255, b: 105 / 255 },
      mid: { r: 16 / 255, g: 185 / 255, b: 129 / 255 },
      high: { r: 110 / 255, g: 231 / 255, b: 183 / 255 },
    },
  },
  todo: {
    id: "todo",
    name: "AOI TODO",
    japaneseName: "東堂葵",
    domain: "My Best Friend",
    domainJapanese: "俺の親友",
    technique: "Boogie Woogie",
    techniqueJapanese: "不義遊戯",
    colors: {
      primary: "#ea580c",
      secondary: "#c2410c",
      accent: "#fed7aa",
      glow: "#f97316",
    },
    energy: {
      low: { r: 234 / 255, g: 88 / 255, b: 12 / 255 },
      mid: { r: 249 / 255, g: 115 / 255, b: 22 / 255 },
      high: { r: 254 / 255, g: 215 / 255, b: 170 / 255 },
    },
  },
}
