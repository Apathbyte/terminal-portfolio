import type { PortfolioLink } from '../data/portfolio'
import { executePortfolioCommand } from './portfolioCommands'
import { LOGOS, isLogoName, type LogoName } from '../data/logos'
import { COMMANDS, findCommand } from './commands'
import type { ParsedCommand } from './parser'
import {
  getVirtualNode,
  listVirtualDirectory,
  renderVirtualTree,
  resolveVirtualPath,
} from './filesystem'
import type { ShellMode } from './shell'

export type CommandContext = {
  logo: LogoName
  history: readonly string[]
  cwd: string
  shell: ShellMode
}

export type CommandResult =
  | { type: 'message'; text: string; links?: readonly PortfolioLink[]}
  | { type: 'clear' }
  | { type: 'set-logo'; logo: LogoName; text: string }
  | { type: 'navigate'; destination: 'gui' | 'boot' }
  | { type: 'change-directory'; path: string }
  | { type: 'set-shell'; shell: ShellMode; text: string }
| { type: 'show-palette' }

export function executeCommand(
  parsed: ParsedCommand,
  context: CommandContext
): CommandResult {
    if (parsed.error) {
  return {
    type: 'message',
    text: parsed.error,
  }
}
  const command = findCommand(parsed.name)

  if (!command) {
    return {
      type: 'message',
      text:
        `${context.shell}: Unknown command: ${parsed.name}\n` +
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


    case 'fish':
      return {
        type: 'set-shell',
        shell: 'fish',
        text: 'Switched to fish shell.',
      }

    case 'bash':
      return {
        type: 'set-shell',
        shell: 'bash',
        text: 'Switched to bash shell.',
      }

    case 'shell':
      return {
        type: 'message',
        text: `Active shell: ${context.shell}`,
      }

    case 'colors':
      return {
        type: 'show-palette',
      }

    case 'pwd':
      return {
        type: 'message',
        text: context.cwd,
      }

    case 'ls': {
      if (args.length > 1) {
        return {
          type: 'message',
          text: 'Usage: ls [path]',
        }
      }

      const target = args[0] ?? '.'
      const path = resolveVirtualPath(context.cwd, target)
      const node = getVirtualNode(path)

      if (!node) {
        return {
          type: 'message',
          text: `ls: cannot access '${target}': No such file or directory`,
        }
      }

      return {
        type: 'message',
        text: node.type === 'file'
          ? path.split('/').pop() ?? ''
          : listVirtualDirectory(node),
      }
    }

    case 'cd': {
      if (args.length > 1) {
        return {
          type: 'message',
          text: 'Usage: cd [path]',
        }
      }

      const target = args[0] ?? '~'
      const path = resolveVirtualPath(context.cwd, target)
      const node = getVirtualNode(path)

      if (!node) {
        return {
          type: 'message',
          text: `cd: ${target}: No such file or directory`,
        }
      }

      if (node.type !== 'directory') {
        return {
          type: 'message',
          text: `cd: ${target}: Not a directory`,
        }
      }

      return {
        type: 'change-directory',
        path,
      }
    }

    case 'cat': {
      if (args.length === 0) {
        return {
          type: 'message',
          text: 'Usage: cat FILE',
        }
      }

      const output = args.map(target => {
        const path = resolveVirtualPath(context.cwd, target)
        const node = getVirtualNode(path)

        if (!node) {
          return `cat: ${target}: No such file or directory`
        }

        if (node.type !== 'file') {
          return `cat: ${target}: Is a directory`
        }

        return node.content
      })

      return {
        type: 'message',
        text: output.join('\n\n'),
      }
    }

    case 'tree': {
      if (args.length > 1) {
        return {
          type: 'message',
          text: 'Usage: tree [path]',
        }
      }

      const target = args[0] ?? '.'
      const path = resolveVirtualPath(context.cwd, target)
      const node = getVirtualNode(path)

      if (!node) {
        return {
          type: 'message',
          text: `tree: ${target}: No such file or directory`,
        }
      }

      if (node.type !== 'directory') {
        return {
          type: 'message',
          text: `tree: ${target}: Not a directory`,
        }
      }

      const label = path === '/'
        ? '/'
        : `${path.split('/').pop()}/`

      return {
        type: 'message',
        text: renderVirtualTree(node, label),
      }
    }

    case 'echo':
      return {
        type: 'message',
        text: args.join(' '),
      }

    default: {
      const result = executePortfolioCommand(command.name)

      if (result) {
        return {
          type: 'message',
          text: result.text,
          links: result.links,
        }
      }

      return {
        type: 'message',
        text: `Command not implemented: ${command.name}`,
      }
    }
  }
}
