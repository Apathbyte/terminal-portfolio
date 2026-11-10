import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type CSSProperties,
} from 'react'
import { HOME} from '../terminal/filesystem'
import type { PortfolioLink } from '../data/portfolio'
import { type LogoName } from '../data/logos'
import { completeInput } from '../terminal/completion'
import { executeCommand } from '../terminal/executor'
import { parseCommand } from '../terminal/parser'
import { Neofetch } from './Neofetch'
import './TerminalWindow.css'
import { DEFAULT_SHELL, type ShellMode } from '../terminal/shell'
import { terminalColorIds, xtermColor } from '../terminal/xterm256'
import { ShellPrompt } from './ShellPrompt'
import { XtermColorChart } from './XtermColorChart'

type TerminalProps = {
  onReboot: () => void
  onGui: () => void
}

// type OutputEntry =
//   | { kind: 'command'; text: string; cwd: string}
//   | { kind: 'message'; text: string; links?: readonly PortfolioLink[] }

type OutputEntry =
  | {
      kind: 'command'
      text: string
      cwd: string 
      shell: ShellMode
    }
  | {
      kind: 'message'
      text: string
      links?: readonly PortfolioLink[]
    }
  | {
      kind: 'palette'
    }


const terminalStyle = {
  '--term-bg': xtermColor(terminalColorIds.background),
  '--term-fg': xtermColor(terminalColorIds.foreground),
  '--term-bash': xtermColor(terminalColorIds.bashPrompt),
  '--term-green': xtermColor(terminalColorIds.fishPrompt),
  '--term-gold': xtermColor(terminalColorIds.fishUsername),
  '--term-blue': xtermColor(terminalColorIds.information),
  '--term-magenta': xtermColor(terminalColorIds.magenta),
  '--term-muted': xtermColor(terminalColorIds.muted),
} as CSSProperties

export function TerminalWindow({ onReboot, onGui }: TerminalProps) {
  const [input, setInput] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [inputScrollLeft, setInputScrollLeft] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [entries, setEntries] = useState<OutputEntry[]>([])
  const [logo, setLogo] = useState<LogoName>('apathbyte')
  const [cwd, setCwd] = useState(HOME)
  const [shell, setShell] = useState<ShellMode>(DEFAULT_SHELL)
  const [accentIndex, setAccentIndex] = useState<number>(terminalColorIds.bashPrompt)
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
      const completed = completeInput(input)
      setInput(completed)
      setCursorPosition(completed.length)
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
      setCursorPosition(commandHistory[nextIndex].length)
      return
    }

    if (event.key === 'ArrowDown' && historyIndex !== null) {
      event.preventDefault()

      const nextIndex = historyIndex + 1

      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null)
        setInput(savedDraft.current)
        setCursorPosition(savedDraft.current.length)
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
    setCursorPosition(0)
    setInputScrollLeft(0)

    const result = executeCommand(parsed, {
      logo,
      history: updatedHistory,
      cwd,
      shell,
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
          shell,
        },
      ])

      setCwd(result.path)
      return
    }

    if (result.type === 'show-palette') {
      setEntries(previous => [
        ...previous,
        {
          kind: 'command',
          text: parsed.raw,
          cwd,
          shell,
        },
        { kind: 'palette' },
      ])

      return
    }

    if (result.type === 'set-logo') {
      setLogo(result.logo)
    }

    if (result.type === 'set-shell') {
      setShell(result.shell)
    }

    if (result.type === 'message' || result.type === 'set-logo' || result.type === 'set-shell') {
      setEntries(previous => [
        ...previous,
        {
          kind: 'command',
          text: parsed.raw,
          cwd,
          shell,
        },
        {
          kind: 'message',
          text: result.text,
          links: result.type === 'message' ? result.links : undefined,
        },
      ])
    }
  }

  // return (
  //   <main className="terminal-screen" style = {terminalStyle}>
  return (
  <div className="crt-room">
    <div className="crt-monitor">
      <div className="crt-bezel">
        <div className="crt-screen">
          <main
            className="terminal-screen"
            style={{...terminalStyle,'--term-accent': xtermColor(accentIndex),} as CSSProperties}
            onClick={event => {
              const target = event.target as HTMLElement
              if (target.closest('a, button, input, textarea, select')) {
                return
              }
              if (window.getSelection()?.toString()) {
                return
              }
              inputRef.current?.focus({ preventScroll: true })
            }}
          >
      <header className="terminal-system-header">
          <Neofetch
            logo={logo}
            shell={shell}
            accentIndex={accentIndex}
            onAccentChange={index => {setAccentIndex(index)
            inputRef.current?.focus({ preventScroll: true })}}
          />
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
                  <ShellPrompt shell={entry.shell} cwd={entry.cwd}>
                      <span>{entry.text}</span>
                  </ShellPrompt>
                </div>
              )
            }
            if (entry.kind === 'palette') {
              return <XtermColorChart key={index} />
            }

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

        <form className="terminal-prompt" onSubmit={handleSubmit}>
            <ShellPrompt shell={shell} cwd={cwd}>
              <div className="terminal-input-wrap">
                <input
                  ref={inputRef}
                  id="shell-input"
                  type="text"
                  value={input}
                  onChange={event => {
                    setInput(event.target.value)
                    setCursorPosition(
                      event.target.selectionStart ?? event.target.value.length
                    )
                    setInputScrollLeft(event.target.scrollLeft)
                  }}
                  onSelect={event => {
                    setCursorPosition(event.currentTarget.selectionStart ?? 0)
                    setInputScrollLeft(event.currentTarget.scrollLeft)
                  }}
                  onScroll={event => {
                    setInputScrollLeft(event.currentTarget.scrollLeft)
                  }}
                  onKeyDown={handleInputKeyDown}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  autoFocus
                  aria-label="Terminal command"
                />
                <span
                  className="terminal-block-cursor"
                  style={{
                    left: `calc(${cursorPosition}ch - ${inputScrollLeft}px)`,
                  }}
                  aria-hidden="true"
                />
              </div>
            </ShellPrompt>
        </form>
      </section>
          </main>
        </div>
      </div>
    </div>
  </div>
)
}
