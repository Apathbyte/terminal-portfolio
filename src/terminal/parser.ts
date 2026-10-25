
export type ParsedCommand = {
  raw: string
  name: string
  args: string[]
  error?: string
}

export function parseCommand(input: string): ParsedCommand | null {
  const raw = input.trim()

  if (!raw) return null

  const tokens: string[] = []
  let current = ''
  let quote: '"' | "'" | null = null
  let escaped = false
  let started = false

  for (const char of raw) {
    if (escaped) {
      current += char
      escaped = false
      started = true
      continue
    }

    if (char === '\\' && quote !== "'") {
      escaped = true
      started = true
      continue
    }

    if (char === '"' || char === "'") {
      if (quote === char) {
        quote = null
        continue
      }

      if (quote === null) {
        quote = char
        started = true
        continue
      }
    }

    if (/\s/.test(char) && quote === null) {
      if (started) {
        tokens.push(current)
        current = ''
        started = false
      }
    } else {
      current += char
      started = true
    }
  }

  if (escaped) current += '\\'

  if (quote !== null) {
    return {
      raw,
      name: '',
      args: [],
      error: 'fish: Unterminated quoted string',
    }
  }

  if (started) tokens.push(current)

  const [name, ...args] = tokens

  if (!name) {
    return {
      raw,
      name: '',
      args: [],
      error: 'fish: Missing command',
    }
  }

  return {
    raw,
    name: name.toLowerCase(),
    args,
  }
}
