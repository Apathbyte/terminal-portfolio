
import { useEffect, useState } from 'react'
import './BootMenu.css'

export type BootTarget = 'terminal' | 'gui'

type BootMenuProps = {
  onBoot: (target: BootTarget) => void
}

const BOOT_TIMEOUT_SECONDS = 10

const bootEntries: { id: BootTarget; label: string }[] = [
  { id: 'terminal', label: 'Apathbyte Linux — Terminal' },
  { id: 'gui', label: 'Apathbyte Desktop — GUI' },
]

export function BootMenu({ onBoot }: BootMenuProps) {
  const [selected, setSelected] = useState<BootTarget>('terminal')

  const [remaining, setRemaining] = useState(BOOT_TIMEOUT_SECONDS)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()

        setSelected(current =>
          current === 'terminal' ? 'gui' : 'terminal'
        )

        setRemaining(BOOT_TIMEOUT_SECONDS)
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        onBoot(selected)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selected, onBoot])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemaining(current => Math.max(0, current - 1))
    }, 1000)

    const timeoutId = window.setTimeout(() => {
      onBoot(selected)
    }, BOOT_TIMEOUT_SECONDS * 1000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [selected, onBoot])

  return (
    <main className="boot-screen">
      <div className="boot-panel">
        <h1>APATHBYTE // BOOT MANAGER</h1>

        <p>Select an operating environment:</p>

        <ul className="boot-options">
          {bootEntries.map(entry => (
            <li key={entry.id}>
              <button
                type="button"
                className={
                  selected === entry.id
                    ? 'boot-option boot-option--selected'
                    : 'boot-option'
                }
                aria-current={
                  selected === entry.id ? 'true' : undefined
                }
                onClick={() => onBoot(entry.id)}
              >
                {selected === entry.id ? '❯ ' : '  '}
                {entry.label}
              </button>
            </li>
          ))}
        </ul>

        <p className="boot-instructions">
          Use ↑ and ↓ to select an entry.
          Press Enter to boot.
        </p>
      </div>

      <p className="boot-countdown">
        The highlighted entry will boot automatically in{' '}
        {remaining} seconds.
      </p>
    </main>
  )
}
