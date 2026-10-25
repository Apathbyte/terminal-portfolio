import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { HOME, promptPath} from '../terminal/filesystem'
import type { PortfolioLink } from '../data/portfolio'
import { type LogoName } from '../data/logos'
import { completeInput } from '../terminal/completion'
import { executeCommand } from '../terminal/executor'
import { parseCommand } from '../terminal/parser'
import { Neofetch } from './Neofetch'
import './TerminalWindow.css'

type TerminalProps = {
  onReboot: () => void
  onGui: () => void
}

type OutputEntry =
  | { kind: 'command'; text: string; cwd: string}
  | { kind: 'message'; text: string; links?: readonly PortfolioLink[] }

export function TerminalWindow({ onReboot, onGui }: TerminalProps) {
  const [input, setInput] = useState('')
  const [entries, setEntries] = useState<OutputEntry[]>([])
  const [logo, setLogo] = useState<LogoName>('apathbyte')
  const [cwd, setCwd] = useState(HOME)

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

  function handleInputKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
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

    const parsed = parseCommand(input)

    if (!parsed) return

    const updatedHistory = [...commandHistory, parsed.raw]

    setCommandHistory(updatedHistory)
    setHistoryIndex(null)
    savedDraft.current = ''
    setInput('')

    const result = executeCommand(parsed, {
      logo,
      history: updatedHistory,
      cwd,
    })

    if (result.type === 'navigate') {
      if (result.destination === 'gui') {
        onGui()
      } else {
        onReboot()
      }

      return
    }

    if (result.type === 'clear') {
      setEntries([])
      return
    }

    if (result.type === 'change-directory') {
      setEntries(previous => [
        ...previous,
        {
          kind: 'command',
          text: parsed.raw,
          cwd,
        },
      ])

      setCwd(result.path)
      return
    }

    if (result.type === 'set-logo') {
      setLogo(result.logo)
    }

    setEntries(previous => [
      ...previous,
      { kind: 'command', text: parsed.raw, cwd, },
      { kind: 'message', 
        text: result.text, 
        links: result.type == 'message' ? result.links: undefined,
      },
    ])
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
                      :{promptPath(entry.cwd)}]─[portfolio]
                    </span>
                  </div>

                  <div className="terminal-prompt__command">
                    <span className="shell-green">╰─❯</span>
                    <span>{entry.text}</span>
                  </div>
                </div>
              )
            }

            // return (
            //   <pre className="terminal-output" key={index}>
            //     {entry.text}
            //   </pre>
            // )

            return (
              <div className="terminal-response" key={index}>
                <pre className="terminal-output">
                  {entry.text}
                </pre>

                {entry.links && entry.links.length > 0 && (
                  <div className="terminal-output-links">
                    {entry.links.map(link => (
                      <a
                        key={`${link.label}-${link.url}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="terminal-output-link"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
              :{promptPath(cwd)}]─[portfolio]
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
              onKeyDown={handleInputKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
              aria-label="Terminal command"
            />
          </div>
        </form>
      </section>
    </main>
  )
}
