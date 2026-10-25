export function TerminalWindow() {
  return (
    <section className="terminal" aria-label="Portfolio terminal">
      <header className="terminal__titlebar">
         <span>APATHBYTE // TTY0</span>
         <span>TERMINAL MODE</span>
      </header>

      <div className="terminal__body">
        <p className="terminal__muted">
          Apathbyte Terminal Portfolio v0.1
        </p>

        <h1>Welcome to my workspace.</h1>

        <p>
          Computer Science · Research · Software Engineering
        </p>

        <p>
          Explore my projects, research, education, and skills.
        </p>

        <p className="terminal__muted">
          Type <strong>help</strong> to explore.
        </p>

        <p className="terminal__prompt">
          <span>visitor@apathbyte</span>
          <span className="terminal__path">~</span>
          <span>$</span>
          <span className="terminal__cursor" aria-hidden="true" />
        </p>
      </div>
    </section>
  )
}