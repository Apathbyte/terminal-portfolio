import type { PortfolioLink } from '../data/portfolio'
import { executePortfolioCommand } from './portfolioCommands'
import { LOGOS, isLogoName, type LogoName } from '../data/logos'
import { COMMANDS, findCommand } from './commands'
import type { ParsedCommand } from './parser'

export type CommandContext = {
  logo: LogoName
  history: readonly string[]
}

export type CommandResult =
  | { type: 'message'; text: string; links?: readonly PortfolioLink[]}
  | { type: 'clear' }
  | { type: 'set-logo'; logo: LogoName; text: string }
  | { type: 'navigate'; destination: 'gui' | 'boot' }

export function executeCommand(
  parsed: ParsedCommand,
  context: CommandContext
): CommandResult {
  const command = findCommand(parsed.name)

  if (!command) {
    return {
      type: 'message',
      text:
        `fish: Unknown command: ${parsed.name}\n` +
        "Type 'help' for available commands.",
    }
  }

  const args = parsed.args

  switch (command.name) {
    case 'help': {
      const descriptions = COMMANDS.map(
        item =>
          `  ${item.usage.padEnd(25)} ${item.description}`
      )

      return {
        type: 'message',
        text: ['Available commands:', '', ...descriptions].join('\n'),
      }
    }

    case 'history':
      return {
        type: 'message',
        text: context.history
          .map((item, index) => `${index + 1}  ${item}`)
          .join('\n'),
      }

    case 'whoami':
      return {
        type: 'message',
        text: 'visitor — exploring the Apathbyte portfolio',
      }

    case 'clear':
      return { type: 'clear' }

    case 'gui':
      return {
        type: 'navigate',
        destination: 'gui',
      }

    case 'reboot':
      return {
        type: 'navigate',
        destination: 'boot',
      }

    case 'fastfetch': {
      if (args.length === 0) {
        return {
          type: 'message',
          text: `Active system logo: ${context.logo}`,
        }
      }

      if (args.length === 1 && args[0] === '--list-logos') {
        return {
          type: 'message',
          text:
            'Available logos:\n\n' +
            Object.keys(LOGOS)
              .map(name => `  ${name}`)
              .join('\n'),
        }
      }

      if (
        args.length === 2 &&
        (args[0] === '-l' || args[0] === '--logo')
      ) {
        const logoName = args[1].toLowerCase()

        if (isLogoName(logoName)) {
          return {
            type: 'set-logo',
            logo: logoName,
            text: `System logo changed to: ${logoName}`,
          }
        }

        return {
          type: 'message',
          text:
            `fastfetch: Unknown logo: ${args[1]}\n` +
            'Run fastfetch --list-logos to see available logos.',
        }
      }

      return {
        type: 'message',
        text:
          'Usage: fastfetch -l <logo>\n' +
          'Run fastfetch --list-logos to see available logos.',
      }
    }

    default: {
        const result = executePortfolioCommand(command.name)

        if (result){
            return {
                type: 'message',
                text: result.text,
                links: result.links,
            }
        }
    }
      return {
        type: 'message',
        text: `Command not implemented: ${command.name}`,
        }
  }
}
