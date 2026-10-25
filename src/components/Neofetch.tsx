
const asciiLogo = String.raw`
           /\
          /  \
         / /\ \
        / /  \ \
       / /____\ \
      / ________ \
     / /        \ \
    /_/          \_\

        APATHBYTE
`.trim()

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

const palette = [
  '#242424', '#e64c4c', '#4bc96a', '#e2bd41',
  '#3ab7ec', '#a06ad8', '#36c8ba', '#eeeeee',
]

export function Neofetch() {
  return (
    <section className="neofetch" aria-label="Portfolio system info">
      <pre className="neofetch__logo" aria-hidden="true">
        {asciiLogo}
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
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="neofetch__palette" aria-label="ANSI color palette">
          {palette.map(color => (
            <span
              key={color}
              className="neofetch__color"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
