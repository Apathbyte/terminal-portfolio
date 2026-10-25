
export type CommandDefinition = {
  name: string
  description: string
  usage: string
  aliases: readonly string[]
}

export const COMMANDS: readonly CommandDefinition[] = [
  {
    name: 'help',
    description: 'Display available commands',
    usage: 'help',
    aliases: [],
  },
  {
    name: 'history',
    description: 'Show command history',
    usage: 'history',
    aliases: [],
  },
  {
    name: 'whoami',
    description: 'Display user information',
    usage: 'whoami',
    aliases: [],
  },
  {
    name: 'clear',
    description: 'Clear the terminal output',
    usage: 'clear',
    aliases: [],
  },
  {
    name: 'fastfetch',
    description: 'Display or change system logo',
    usage: 'fastfetch -l NAME',
    aliases: ['neofetch'],
  },
  {
    name: 'gui',
    description: 'Switch to graphical interface',
    usage: 'gui',
    aliases: [],
  },
  {
    name: 'reboot',
    description: 'Return to boot manager',
    usage: 'reboot',
    aliases: [],
  },
]

export function findCommand(name: string) {
  const normalized = name.toLowerCase()

  return COMMANDS.find(
    command =>
      command.name === normalized ||
      command.aliases.includes(normalized)
  )
}
