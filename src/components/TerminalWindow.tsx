
import { useState, type FormEvent } from 'react'
import { Neofetch } from './Neofetch'
import './TerminalWindow.css'

type TerminalProps = {
  onReboot: () => void
  onGui: () => void
}

type OutputEntry =
  | { kind: 'neofetch' }
  | { kind: 'command'; text: string }
  | { kind: 'message'; text: string }

const helpText = [
  'Available commands:',
  '',
  '  help       Show available commands',
  '  neofetch   Display system information',
  '  whoami     Display user information',
  '  clear      Clear terminal output',
  '  gui        Switch to graphical interface',
  '  reboot     Return to the boot manager',
].join('\n')

export function TerminalWindow({ onReboot, onGui }: TerminalProps) {
  const [input, setInput] = useState('')
  const [entries, setEntries] = useState<OutputEntry[]>([
    { kind: 'neofetch' },
  ])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const command = input.trim()
    if (!command) return

    setInput('')

    const name = command.toLowerCase().split(/\s+/)[0]

    // Commands that change the active environment.
    if (name === 'reboot') {
      onReboot()
      return
    }

    if (name === 'gui') {
      onGui()
      return
    }

    // Clear removes previously rendered output.
    if (name === 'clear') {
      setEntries([])
      return
    }

    const nextEntries: OutputEntry[] = [
      { kind: 'command', text: command },
    ]

    switch (name) {
      case 'help':
        nextEntries.push({ kind: 'message', text: helpText })
        break

      case 'neofetch':
        nextEntries.push({ kind: 'neofetch' })
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
    }

    setEntries(previous => [...previous, ...nextEntries])
  }

  return (
    <main className="terminal-screen">
      <div className="terminal-history" role="log" aria-live="polite">
        {entries.map((entry, index) => {
          if (entry.kind === 'neofetch') {
            return <Neofetch key={index} />
          }

          if (entry.kind === 'command') {
            return (
              <div className="terminal-echo" key={index}>
                <div className="terminal-prompt__meta">
                  <span className="shell-green">╭─[</span>
                  <span className="shell-user">visitor@apathbyte</span>
                  <span className="shell-green">:~]─[portfolio]</span>
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

      <form className="terminal-prompt" onSubmit={handleSubmit}>
        <div className="terminal-prompt__meta">
          <span className="shell-green">╭─[</span>
          <span className="shell-user">visitor@apathbyte</span>
          <span className="shell-green">:~]─[portfolio]</span>
        </div>

        <div className="terminal-prompt__command">
          <label htmlFor="shell-input" className="shell-green">
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
          />
        </div>
      </form>
    </main>
  )
}
