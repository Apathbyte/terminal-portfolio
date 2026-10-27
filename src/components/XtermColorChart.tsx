
import { xtermColor } from '../terminal/xterm256'

const groups = [
  { title: 'ANSI SYSTEM COLORS', start: 0, end: 15 },
  { title: '6×6×6 RGB COLOR CUBE', start: 16, end: 231 },
  { title: 'GRAYSCALE', start: 232, end: 255 },
]

function foreground(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return brightness > 145 ? '#101010' : '#ffffff'
}

export function XtermColorChart() {
  return (
    <div className="xterm-chart">
      <h2>XTERM-256 COLOR CHART</h2>

      {groups.map(group => (
        <section className="xterm-chart__group" key={group.title}>
          <h3>{group.title}</h3>

          <div className="xterm-chart__scroll">
            <div className="xterm-chart__grid">
              {Array.from(
                { length: group.end - group.start + 1 },
                (_, index) => group.start + index
              ).map(index => {
                const color = xtermColor(index)

                return (
                  <span
                    key={index}
                    className="xterm-chart__swatch"
                    style={{
                      backgroundColor: color,
                      color: foreground(color),
                    }}
                    title={`Index ${index}: ${color}`}
                  >
                    {index}
                  </span>
                )
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
