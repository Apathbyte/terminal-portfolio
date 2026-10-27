
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

  {
    name: 'about',
    description: 'Display professional introduction',
    usage: 'about',
    aliases: ['bio', 'descript'],
  },
  {
    name: 'projects',
    description: 'Display software projects',
    usage: 'projects',
    aliases: ['proj'],
  },
  {
    name: 'research',
    description: 'Display research interests and publications',
    usage: 'research',
    aliases: ['papers'],
  },
  {
    name: 'education',
    description: 'Display academic qualifications',
    usage: 'education',
    aliases: ['edu'],
  },
  {
    name: 'skills',
    description: 'Display technical skills',
    usage: 'skills',
    aliases: ['skill'],
  },
  {
    name: 'experience',
    description: 'Display professional experience',
    usage: 'experience',
    aliases: ['exp'],
  },
  {
    name: 'contact',
    description: 'Display professional contact links',
    usage: 'contact',
    aliases: ['links'],
  },
  {
    name: 'resume',
    description: 'Access downloadable résumé',
    usage: 'resume',
    aliases: ['cv'],
  },
  {
    name: 'pwd',
    description: 'Print the current working directory',
    usage: 'pwd',
    aliases: [],
  },
  {
    name: 'ls',
    description: 'List files and directories',
    usage: 'ls [path]',
    aliases: [],
  },
  {
    name: 'cd',
    description: 'Change the working directory',
    usage: 'cd [path]',
    aliases: [],
  },
  {
    name: 'cat',
    description: 'Display file contents',
    usage: 'cat FILE',
    aliases: [],
  },
  {
    name: 'tree',
    description: 'Display the directory tree',
    usage: 'tree [path]',
    aliases: [],
  },
  {
    name: 'echo',
    description: 'Print text to the terminal',
    usage: 'echo [text]',
    aliases: [],
  },

  {
    name: 'fish',
    description: 'Switch to the Fish-style shell',
    usage: 'fish',
    aliases: [],
  },
  {
    name: 'bash',
    description: 'Switch to the Bash-style shell',
    usage: 'bash',
    aliases: [],
  },
  {
    name: 'shell',
    description: 'Display the active shell',
    usage: 'shell',
    aliases: [],
  },
  {
    name: 'colors',
    description: 'Display the Xterm-256 color palette',
    usage: 'colors',
    aliases: ['palette'],
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
