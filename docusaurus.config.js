// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CP Wiki',
  tagline: 'lucifer1004的CP笔记',
  url: 'https://cp-wiki-next.gabriel-wu.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lucifer1004', // Usually your GitHub org/user name.
  projectName: 'cp-wiki-next', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  markdown: {
    mermaid: true,
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/lucifer1004/cp-wiki-next',
          remarkPlugins: [math],
          rehypePlugins: [katex],
          admonitions: {
            tag: ':::',
            keywords: ['note', 'tip', 'info', 'caution', 'danger', 'details'],
          },
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-8T7HTXKTNG',
          anonymizeIP: false,
        },
      }),
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  plugins: ['docusaurus-plugin-google-adsense'],
  themes: ['@docusaurus/theme-mermaid', '@docusaurus/theme-live-codeblock'],
  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  {
    navbar: {
      title: 'CP Wiki',
      logo: {
        alt: 'CP Wiki Logo',
        src: 'img/favicon.ico',
      },
      items: [
        {
          type: 'dropdown',
          docId: 'basic',
          position: 'left',
          label: '专题',
          items: [
            {
              type: 'doc',
              docId: 'basic',
              label: '基础',
            },
            {
              type: 'doc',
              docId: 'algebra',
              label: '代数',
            },
            {
              type: 'doc',
              docId: 'data-structure',
              label: '数据结构'
            },
            {
              type: 'doc',
              docId: 'graph',
              label: '图论'
            },
            {
              type: 'doc',
              docId: 'dp',
              label: '动态规划'
            },
            {
              type: 'doc',
              docId: 'geometry',
              label: '计算几何'
            },
            {
              type: 'doc',
              docId: 'string',
              label: '字符串'
            },
            {
              type: 'doc',
              docId: 'combinatorics',
              label: '组合数学'
            },
            {
              type: 'doc',
              docId: 'misc',
              label: '杂项'
            }
          ],
        },
        {
          type: 'dropdown',
          docId: 'basic',
          position: 'left',
          label: '题解',
          items: [
            {
              type: 'doc',
              docId: 'codeforces',
              label: 'Codeforces'
            },
            {
              type: 'doc',
              docId: 'leetcode',
              label: '力扣'
            },
            {
              type: 'doc',
              docId: 'kick-start',
              label: 'Kick Start'
            }
          ]
        },
        {
          type: 'dropdown',
          position: 'left',
          label: '其他',
          items: [{
            type: 'doc',
            docId: 'tips',
            label: '小贴士'
          }, {
            type: 'doc',
            docId: 'jargon',
            label: '黑话'
          }, {
            type: 'doc',
            docId: 'hall-of-fame',
            label: '名人堂'
          }]
        },
        { to: '/blog', label: '博客', position: 'right' },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/lucifer1004/cp-wiki-next',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `版权所有 © 2020--${new Date().getFullYear()} CP Wiki。本站点使用 Docusaurus 构建。`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['csharp', 'elixir', 'java', 'julia', 'kotlin', 'rust'],
    },
    googleAdsense: {
      dataAdClient: 'ca-pub-2391425047778930',
    },
  },
};

module.exports = config;
