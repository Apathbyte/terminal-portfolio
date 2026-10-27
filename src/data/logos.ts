
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
    colors: [45, 51, 141],
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
    colors: [39, 33, 75],
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
    colors: [39, 45, 32],
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
    colors: [32, 39, 117],
  },
} as const

export type LogoName = keyof typeof LOGOS

export function isLogoName(value: string): value is LogoName {
  return Object.prototype.hasOwnProperty.call(LOGOS, value)
}
