
import { portfolio, type PortfolioLink } from '../data/portfolio'

export type PortfolioOutput = {
  text: string
  links: readonly PortfolioLink[]
}

function bulletList(items: readonly string[]): string {
  if (items.length === 0) {
    return '  No entries added yet.'
  }

  return items.map(item => `  - ${item}`).join('\n')
}

export function executePortfolioCommand(
  command: string
): PortfolioOutput | null {
  switch (command) {
    case 'about':
      return {
        text: [
          'ABOUT',
          '',
          portfolio.name,
          portfolio.headline,
          '',
          ...portfolio.about,
        ].join('\n'),
        links: [],
      }

    case 'projects':
      return {
        text: [
          'PROJECTS',
          '',
          portfolio.projects.length
            ? portfolio.projects.map((project, index) =>
                [
                  `${index + 1}. ${project.title}`,
                  `   ${project.description}`,
                  `   Stack: ${project.stack.join(', ')}`,
                ].join('\n')
              ).join('\n\n')
            : 'No projects added yet.',
        ].join('\n'),
        links: portfolio.projects.flatMap(project =>
          project.links.map(link => ({
            label: `${project.title} — ${link.label}`,
            url: link.url,
          }))
        ),
      }

    case 'research':
      return {
        text: [
          'RESEARCH',
          '',
          'Research interests:',
          bulletList(portfolio.researchAreas),
          '',
          'Publications:',
          portfolio.publications.length
            ? portfolio.publications.map((paper, index) =>
                `${index + 1}. ${paper.title}\n   ${paper.venue} (${paper.year})`
              ).join('\n\n')
            : '  No publications added yet.',
        ].join('\n'),
        links: portfolio.publications.flatMap(paper =>
          paper.links.map(link => ({
            label: `${paper.title} — ${link.label}`,
            url: link.url,
          }))
        ),
      }

    case 'education':
      return {
        text: [
          'EDUCATION',
          '',
          portfolio.education.length
            ? portfolio.education.map((entry, index) =>
                [
                  `${index + 1}. ${entry.degree}`,
                  `   ${entry.institution}`,
                  `   ${entry.period}`,
                ].join('\n')
              ).join('\n\n')
            : 'No education entries added yet.',
        ].join('\n'),
        links: [],
      }

    case 'experience':
      return {
        text: [
          'EXPERIENCE',
          '',
          portfolio.experience.length
            ? portfolio.experience.map((entry, index) =>
                [
                  `${index + 1}. ${entry.role}`,
                  `   ${entry.organization} | ${entry.period}`,
                  `   ${entry.description}`,
                ].join('\n')
              ).join('\n\n')
            : 'No experience entries added yet.',
        ].join('\n'),
        links: [],
      }

    case 'skills':
      return {
        text: [
          'TECHNICAL SKILLS',
          '',
          ...portfolio.skills.flatMap(group => [
            `${group.category}:`,
            bulletList(group.items),
            '',
          ]),
        ].join('\n'),
        links: [],
      }

    case 'contact':
      return {
        text: 'CONTACT\n\nProfessional profiles and links:',
        links: portfolio.contact,
      }

    case 'resume':
      return portfolio.resumeFile
        ? {
            text: 'RESUME\n\nYour résumé is available below.',
            links: [
              {
                label: 'Download résumé',
                url: `${import.meta.env.BASE_URL}${portfolio.resumeFile}`,
              },
            ],
          }
        : {
            text: 'RESUME\n\nNo résumé file uploaded yet.',
            links: [],
          }

    default:
      return null
  }
}
