const ansi16 = [
  '#000000', '#800000', '#008000', '#808000',
  '#000080', '#800080', '#008080', '#c0c0c0',
  '#808080', '#ff0000', '#00ff00', '#ffff00',
  '#0000ff', '#ff00ff', '#00ffff', '#ffffff',
]

const levels = [0, 95, 135, 175, 215, 255]

function hex(value: number): string {
  return value.toString(16).padStart(2, '0')
}

export function xtermColor(index: number): string {
  if (!Number.isInteger(index) || index < 0 || index > 255) {
    throw new RangeError('Xterm color index must be between 0 and 255')
  }

  if (index < 16) {
    return ansi16[index]
  }

  if (index < 232) {
    const value = index - 16

    const r = levels[Math.floor(value / 36)]
    const g = levels[Math.floor(value / 6) % 6]
    const b = levels[value % 6]

    return `#${hex(r)}${hex(g)}${hex(b)}`
  }

  const gray = 8 + (index - 232) * 10

  return `#${hex(gray)}${hex(gray)}${hex(gray)}`
}

export const terminalColorIds = {
  background: 0,
  foreground: 255,
  bashPrompt: 141,
  fishPrompt: 83,
  fishUsername: 220,
  information: 39,
  magenta: 213,
  muted: 244,
} as const
