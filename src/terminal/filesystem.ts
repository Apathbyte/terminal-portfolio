
import { portfolio } from '../data/portfolio'

export const HOME = '/home/visitor'

export type VirtualNode =
  | { type: 'file'; content: string }
  | { type: 'directory'; children: Record<string, VirtualNode> }

function file(content: string): VirtualNode {
  return { type: 'file', content }
}

function directory(children: Record<string, VirtualNode>): VirtualNode {
  return { type: 'directory', children }
}

const projectFiles: Record<string, VirtualNode> = {}

portfolio.projects.forEach((project, index) => {
  const slug = project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const filename = `${slug || `project-${index + 1}`}.md`

  projectFiles[filename] = file([
    `# ${project.title}`,
    '',
    project.description,
    '',
    `Stack: ${project.stack.join(', ')}`,
    '',
    ...project.links.map(link => `${link.label}: ${link.url}`),
  ].join('\n'))
})

const root: VirtualNode = directory({
  home: directory({
    visitor: directory({
      'README.md': file([
        `# ${portfolio.name} Portfolio`,
        '',
        portfolio.headline,
        '',
        'Use ls to explore the filesystem.',
        'Use cd to enter a directory.',
        'Use cat to read a file.',
        'Use tree to view the directory structure.',
      ].join('\n')),

      'about.txt': file([
        portfolio.name,
        portfolio.headline,
        '',
        ...portfolio.about,
      ].join('\n')),

      projects: directory({
        'README.md': file([
          '# Projects',
          '',
          ...portfolio.projects.map(
            project => `- ${project.title}: ${project.description}`
          ),
        ].join('\n')),
        ...projectFiles,
      }),

      research: directory({
        'README.md': file([
          '# Research',
          '',
          ...portfolio.researchAreas.map(area => `- ${area}`),
          '',
          '# Publications',
          '',
          ...(portfolio.publications.length
            ? portfolio.publications.map(
                paper => `${paper.title} — ${paper.venue} (${paper.year})`
              )
            : ['No publications added yet.']),
        ].join('\n')),
      }),

      education: directory({
        'README.md': file([
          '# Education',
          '',
          ...(portfolio.education.length
            ? portfolio.education.map(
                entry =>
                  `${entry.degree}\n${entry.institution}\n${entry.period}`
              )
            : ['No education entries added yet.']),
        ].join('\n\n')),
      }),

      skills: directory({
        'README.md': file([
          '# Skills',
          '',
          ...portfolio.skills.map(
            group =>
              `${group.category}:\n${group.items.map(
                item => `- ${item}`
              ).join('\n')}`
          ),
        ].join('\n\n')),
      }),

      experience: directory({
        'README.md': file([
          '# Experience',
          '',
          ...(portfolio.experience.length
            ? portfolio.experience.map(
                entry =>
                  `${entry.role} — ${entry.organization}\n${entry.period}\n${entry.description}`
              )
            : ['No experience entries added yet.']),
        ].join('\n\n')),
      }),

      contact: directory({
        'README.md': file([
          '# Contact',
          '',
          ...portfolio.contact.map(
            link => `${link.label}: ${link.url}`
          ),
        ].join('\n')),
      }),
    }),
  }),
})

export function resolveVirtualPath(
  cwd: string,
  target: string = '.'
): string {
  let source: string

  if (target === '~' || target.startsWith('~/')) {
    source = HOME + target.slice(1)
  } else if (target.startsWith('/')) {
    source = target
  } else {
    source = `${cwd}/${target}`
  }

  const parts: string[] = []

  for (const part of source.split('/')) {
    if (!part || part === '.') continue

    if (part === '..') {
      parts.pop()
    } else {
      parts.push(part)
    }
  }

  return '/' + parts.join('/')
}

export function getVirtualNode(path: string): VirtualNode | undefined {
  let current: VirtualNode = root

  if (path === '/') return current

  for (const part of path.split('/').filter(Boolean)) {
    if (current.type !== 'directory') return undefined

    const next: VirtualNode | undefined = current.children[part]

    if (!next) return undefined

    current = next
  }

  return current
}

export function listVirtualDirectory(node: VirtualNode): string {
  if (node.type !== 'directory') return ''

  return Object.entries(node.children)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, child]) =>
      child.type === 'directory' ? `${name}/` : name
    )
    .join('  ')
}

export function renderVirtualTree(
  node: VirtualNode,
  label: string
): string {
  const lines = [label]

  function visit(current: VirtualNode, prefix: string) {
    if (current.type !== 'directory') return

    const children = Object.entries(current.children)
      .sort(([a], [b]) => a.localeCompare(b))

    children.forEach(([name, child], index) => {
      const last = index === children.length - 1
      const branch = last ? '└── ' : '├── '

      lines.push(
        `${prefix}${branch}${name}${child.type === 'directory' ? '/' : ''}`
      )

      if (child.type === 'directory') {
        visit(child, prefix + (last ? '    ' : '│   '))
      }
    })
  }

  visit(node, '')

  return lines.join('\n')
}

export function promptPath(cwd: string): string {
  if (cwd === HOME) return '~'

  if (cwd.startsWith(HOME + '/')) {
    return '~' + cwd.slice(HOME.length)
  }

  return cwd
}
