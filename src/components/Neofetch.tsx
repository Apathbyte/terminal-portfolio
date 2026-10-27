import { LOGOS, type LogoName } from '../data/logos'
import type { ShellMode } from '../terminal/shell'
import { xtermColor } from '../terminal/xterm256'

const systemInfo = [
  { label: 'OS', value: 'Apathbyte Linux (Web Edition)' },
  { label: 'Host', value: 'GitHub Pages' },
  { label: 'Shell', value: 'fish-inspired portfolio shell' },
  { label: 'Terminal', value: 'Apathbyte TTY' },
  { label: 'Environment', value: 'Browser / React' },
  { label: 'Languages', value: 'C/C++, Python, TypeScript' },
  { label: 'Focus', value: 'AI, Quantum Computing, Systems' },
  { label: 'Interface', value: 'Terminal' },
  { label: 'Status', value: 'Online' },
]

const palette = [196, 46, 226, 39, 201, 51, 255, 244]

type NeofetchProps = {
  logo: LogoName
  shell: ShellMode
}

export function Neofetch({ logo, shell}: NeofetchProps) {
  return (
    <section className="neofetch" aria-label="Portfolio system info">
        <pre className="neofetch__logo" aria-hidden="true">
        {LOGOS[logo].lines.map((line, index) => {
            const colors = LOGOS[logo].colors

            return (
            <span
                key={index}
                style={{ color: xtermColor(colors[index % colors.length]) }}
            >
                {line}{'\n'}
            </span>
            )
        })}
        </pre>
        
      <div className="neofetch__details">
        <div className="neofetch__identity">
          visitor@apathbyte
        </div>

        <div className="neofetch__separator">
          ---------------------
        </div>

        <dl className="neofetch__facts">
          {systemInfo.map(item => (
            <div className="neofetch__fact" key={item.label}>
              <dt>{item.label}:</dt>
              <dd>
                {item.label === 'Shell'
                  ? `${shell} (portfolio simulator)`
                  : item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="neofetch__palette" aria-label="ANSI color palette">
          {palette.map(color => (
            <span
              key={color}
              className="neofetch__color"
              style={{ backgroundColor: xtermColor(color) }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
