import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent,} from 'react'
import { completeInput } from '../terminal/completion'
import { LOGOS, isLogoName, type LogoName } from '../data/logos'
import { Neofetch } from './Neofetch'
import './TerminalWindow.css'

type TerminalProps = {
  onReboot: () => void
  onGui: () => void
}

type OutputEntry =
  | { kind: 'command'; text: string }
  | { kind: 'message'; text: string }

const helpText = [
  'Available commands:',
  '',
  '  help                    Show available commands',
  '  fastfetch               Show current logo information',
  '  fastfetch -l NAME       Change the system logo',
  '  fastfetch --list-logos  List available logos',
  '  neofetch                Show current logo information',
  '  whoami                  Display user information',
  '  clear                   Clear terminal output',
  '  gui                     Switch to graphical interface',
  '  reboot                  Return to the boot manager',
].join('\n')

export function TerminalWindow({ onReboot, onGui }: TerminalProps) {
  const [input, setInput] = useState('')
  const [entries, setEntries] = useState<OutputEntry[]>([])
  const [logo, setLogo] = useState<LogoName>('apathbyte')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const savedDraft = useRef('')

  const sessionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const session = sessionRef.current

    if (session) {
      session.scrollTop = session.scrollHeight
    }
  }, [entries])

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setInput(current => completeInput(current))
      return
    }

    if (event.key === 'ArrowUp') {
      if (commandHistory.length === 0) return

      event.preventDefault()

      const nextIndex =
        historyIndex === null
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1)

      if (historyIndex === null) {
        savedDraft.current = input
      }

      setHistoryIndex(nextIndex)
      setInput(commandHistory[nextIndex])
      return
    }

    if (event.key === 'ArrowDown' && historyIndex !== null) {
      event.preventDefault()

      const nextIndex = historyIndex + 1

      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null)
        setInput(savedDraft.current)
      } else {
        setHistoryIndex(nextIndex)
        setInput(commandHistory[nextIndex])
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const command = input.trim()
    if (!command) return

    setCommandHistory(previous => [...previous, command])
    setHistoryIndex(null)
    savedDraft.current = ''
    setInput('')
    const args = command.toLowerCase().split(/\s+/)
    const name = args[0]

    if (name === 'reboot') {
      onReboot()
      return
    }

    if (name === 'gui') {
      onGui()
      return
    }

    if (name === 'clear') {
      setEntries([])
      return
    }

    if (name === 'fastfetch' || name === 'neofetch') {
      let response = ''

      if (args.length === 1) {
        response = `Active system logo: ${logo}`
      } else if (
        args.length === 2 &&
        args[1] === '--list-logos'
      ) {
        response = `Available logos:\n\n${Object.keys(LOGOS)
          .map(name => `  ${name}`)
          .join('\n')}`
      } else if (
        args.length === 3 &&
        (args[1] === '-l' || args[1] === '--logo') &&
        isLogoName(args[2])
      ) {
        setLogo(args[2])
        response = `System logo changed to: ${args[2]}`
      } else {
        response = [
          'Usage: fastfetch -l <logo>',
          '',
          'Run fastfetch --list-logos to see available logos.',
        ].join('\n')
      }

      setEntries(previous => [
        ...previous,
        { kind: 'command', text: command },
        { kind: 'message', text: response },
      ])

      return
    }

    const nextEntries: OutputEntry[] = [
      { kind: 'command', text: command },
    ]

    switch (name) {
      case 'help':
        nextEntries.push({
          kind: 'message',
          text: helpText,
        })
        break

      case 'whoami':
        nextEntries.push({
          kind: 'message',
          text: 'visitor — exploring the Apathbyte portfolio',
        })
        break

      default:
        nextEntries.push({
          kind: 'message',
          text: `fish: Unknown command: ${name}\nType 'help' for available commands.`,
        })
        break
    }

    setEntries(previous => [...previous, ...nextEntries])
  }

  return (
    <main className="terminal-screen">
      <header className="terminal-system-header">
        <Neofetch logo={logo} />
      </header>

      <section
        className="terminal-session"
        ref={sessionRef}
        aria-label="Terminal session"
      >
        <div
          className="terminal-history"
          role="log"
          aria-live="polite"
        >
          {entries.map((entry, index) => {
            if (entry.kind === 'command') {
              return (
                <div className="terminal-echo" key={index}>
                  <div className="terminal-prompt__meta">
                    <span className="shell-green">╭─[</span>
                    <span className="shell-user">
                      visitor@apathbyte
                    </span>
                    <span className="shell-green">
                      :~]─[portfolio]
                    </span>
                  </div>

                  <div className="terminal-prompt__command">
                    <span className="shell-green">╰─❯</span>
                    <span>{entry.text}</span>
                  </div>
                </div>
              )
            }

            return (
              <pre className="terminal-output" key={index}>
                {entry.text}
              </pre>
            )
          })}
        </div>

        <form
          className="terminal-prompt"
          onSubmit={handleSubmit}
        >
          <div className="terminal-prompt__meta">
            <span className="shell-green">╭─[</span>
            <span className="shell-user">
              visitor@apathbyte
            </span>
            <span className="shell-green">
              :~]─[portfolio]
            </span>
          </div>

          <div className="terminal-prompt__command">
            <label
              htmlFor="shell-input"
              className="shell-green"
            >
              ╰─❯
            </label>

            <input
              id="shell-input"
              type="text"
              value={input}
              onChange={event => setInput(event.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
              aria-label="Terminal command"
              onKeyDown={handleInputKeyDown}
            />
          </div>
        </form>
      </section>
    </main>
  )
}
