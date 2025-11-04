import { defineConfig } from 'vitepress'

// Google Analytics 4 Measurement ID
const GA_ID = process.env.VITE_GA_ID

export default defineConfig({
  title: 'Knowledge Go-To Docs',
  description: 'Reusable practices, sanitized for public use.',
  base: '/go-to-docs/',
  lastUpdated: true,
  head: [
    [
      'script',
      {
        async: '',
        src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      }
    ],
    [
      'script',
      {},
      `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', {
  page_path: window.location.pathname
});
  `
    ]
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Decision Spine', link: '/decision-spine' },
      { text: 'Facilitation', link: '/facilitation' },
      { text: 'Governance', link: '/governance' }
    ],
    sidebar: [
      {
        text: '📖 Public Knowledge',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/index' },
          { text: 'What is Band A', link: '/band-a' },
          { text: 'Decision Spine', link: '/decision-spine' },
          { text: 'Facilitation', link: '/facilitation' },
          { text: 'Answer Ledger', link: '/answer-ledger' },
          { text: 'Accessibility Quick Wins', link: '/accessibility-quick-wins' },
          { text: 'FAQ for New Joiners', link: '/faq-new-joiners' },
          { text: 'Monthly Release Process', link: '/monthly-release' },
          { text: 'Accessibility Audit', link: '/accessibility-audit' }
        ]
      },
      {
        text: '👥 Contributor Resources',
        collapsed: false,
        items: [
          { text: 'Sanitization Checklist', link: '/sanitization' },
          { text: 'Governance Policy', link: '/governance' },
          { text: 'API Guidelines', link: '/api-guidelines' }
        ]
      }
    ],
    footer: {
      message: 'Text © CC BY-NC 4.0 • Code samples MIT • Views are my own.'
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/lop-Louis/go-to-docs' }],
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/lop-Louis/go-to-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
