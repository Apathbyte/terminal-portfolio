
export const LOGOS = {
  apathbyte: {
    lines: [
      '          /\\',
      '         /  \\',
      '        / /\\ \\',
      '       / /  \\ \\',
      '      / /____\\ \\',
      '     /__________\\',
      '',
      '       APATHBYTE',
    ],
    colors: ['#40c9f0', '#68d4f5', '#9d88ff'],
  },

  fedora: {
    lines: [
      '       ██████████',
      '     ████      ██',
      '   ███    ████',
      '  ███     ██',
      '  ███   ██████',
      '  ███     ██',
      '   ███    ██',
      '     ███████',
      '       FEDORA',
    ],
    colors: ['#51b9f4', '#348ed8', '#77d1ff'],
  },

  windows: {
    lines: [
      '████████   ████████',
      '████████   ████████',
      '████████   ████████',
      '',
      '████████   ████████',
      '████████   ████████',
      '████████   ████████',
      '',
      '      WINDOWS',
    ],
    colors: ['#00a4ef', '#34c4ff', '#008bd2'],
  },

  arch: {
    lines: [
      '           /\\',
      '          /  \\',
      '         /\\   \\',
      '        /  __  \\',
      '       /  (  )  \\',
      '      /__/    \\__\\',
      '',
      '          ARCH',
    ],
    colors: ['#1793d1', '#46c3ff', '#8bddff'],
  },
} as const

export type LogoName = keyof typeof LOGOS

export function isLogoName(value: string): value is LogoName {
  return Object.prototype.hasOwnProperty.call(LOGOS, value)
}
