
import type { ReactNode } from 'react'
import type { ShellMode } from '../terminal/shell'
import { promptPath } from '../terminal/filesystem'

type ShellPromptProps = {
  shell: ShellMode
  cwd: string
  children: ReactNode
}

export function ShellPrompt({
  shell,
  cwd,
  children,
}: ShellPromptProps) {
  if (shell === 'fish') {
    return (
      <div className="shell-prompt shell-prompt--fish">
        <div className="terminal-prompt__meta">
          <span className="shell-green">╭─[</span>
          <span className="shell-user">visitor@apathbyte</span>
          <span className="shell-green">
            :{promptPath(cwd)}]─[portfolio]
          </span>
        </div>

        <div className="terminal-prompt__command">
          <span className="shell-green" aria-hidden="true">
            ╰─❯
          </span>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="shell-prompt shell-prompt--bash">
      <span className="shell-prompt__bash-prefix" aria-hidden="true">
        visitor@apathbyte:{promptPath(cwd)}$
      </span>
      {children}
    </div>
  )
}
