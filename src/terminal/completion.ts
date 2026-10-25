
import { LOGOS } from '../data/logos'

export const COMMANDS = [
  'help',
  'history',
  'whoami',
  'clear',
  'fastfetch',
  'neofetch',
  'gui',
  'reboot',
] as const

export function completeInput(input: string): string {
  const logoMatch = input.match(
    /^(fastfetch|neofetch)(\s+)(-l|--logo)(\s+)([a-z]*)$/i
  )

  if (logoMatch) {
    const prefix = logoMatch[5].toLowerCase()

    const matches = Object.keys(LOGOS).filter(name =>
      name.startsWith(prefix)
    )

    if (matches.length === 1) {
      return `${logoMatch[1]}${logoMatch[2]}${logoMatch[3]}${logoMatch[4]}${matches[0]}`
    }

    return input
  }

  if (/\s/.test(input)) return input

  const matches = COMMANDS.filter(command =>
    command.startsWith(input.toLowerCase())
  )

  return matches.length === 1 ? matches[0] : input
}
