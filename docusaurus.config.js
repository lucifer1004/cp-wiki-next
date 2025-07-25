// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
module.exports = async function createConfigAsync() {
  const math = (await import('remark-math')).default;
  const katex = (await import('rehype-katex')).default;
  
  return {
    title: "CP Wiki",
    tagline: "lucifer1004的CP笔记",
    url: "https://cp-wiki-next.gabriel-wu.com",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "lucifer1004", // Usually your GitHub org/user name.
    projectName: "cp-wiki-next", // Usually your repo name.

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
      defaultLocale: "zh-Hans",
      locales: ["zh-Hans", "en"],
    },

    markdown: {
      mermaid: true,
    },

    presets: [
      [
        "classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve("./sidebars.js"),
            editUrl: "https://github.com/lucifer1004/cp-wiki-next",
            remarkPlugins: [math],
            rehypePlugins: [[katex, { strict: false }]],
            admonitions: {
              keywords: ["note", "tip", "info", "caution", "danger", "details"],
            },
          },
          blog: {
            showReadingTime: true,
            editUrl:
              "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          },
          theme: {
            customCss: require.resolve("./src/css/custom.css"),
          },
          gtag: {
            trackingID: "G-8T7HTXKTNG",
            anonymizeIP: false,
          },
        }),
      ],
    ],

    stylesheets: [
      {
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css",
        type: "text/css",
        integrity:
          "sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP",
        crossorigin: "anonymous",
      },
    ],

    plugins: ["docusaurus-plugin-google-adsense"],
    themes: ["@docusaurus/theme-mermaid", "@docusaurus/theme-live-codeblock"],
    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      {
        docs: {
          sidebar: {
            autoCollapseCategories: true,
          },
        },
        navbar: {
          title: "CP Wiki",
          logo: {
            alt: "CP Wiki Logo",
            src: "img/favicon.ico",
          },
          items: [
            {
              type: "dropdown",
              docId: "basic",
              position: "left",
              label: "专题",
              items: [
                {
                  type: "doc",
                  docId: "basic",
                  label: "基础",
                },
                {
                  type: "doc",
                  docId: "algebra",
                  label: "代数",
                },
                {
                  type: "doc",
                  docId: "data-structure",
                  label: "数据结构",
                },
                {
                  type: "doc",
                  docId: "graph",
                  label: "图论",
                },
                {
                  type: "doc",
                  docId: "dp",
                  label: "动态规划",
                },
                {
                  type: "doc",
                  docId: "geometry",
                  label: "计算几何",
                },
                {
                  type: "doc",
                  docId: "string",
                  label: "字符串",
                },
                {
                  type: "doc",
                  docId: "combinatorics",
                  label: "组合数学",
                },
                {
                  type: "doc",
                  docId: "misc",
                  label: "杂项",
                },
              ],
            },
            {
              type: "dropdown",
              docId: "basic",
              position: "left",
              label: "题解",
              items: [
                {
                  type: "doc",
                  docId: "codeforces",
                  label: "Codeforces",
                },
                {
                  type: "doc",
                  docId: "atcoder",
                  label: "AtCoder",
                },
                {
                  type: "doc",
                  docId: "leetcode",
                  label: "力扣",
                },
                {
                  type: "doc",
                  docId: "kick-start",
                  label: "Kick Start",
                },
                {
                  type: "doc",
                  docId: "project-euler",
                  label: "Project Euler",
                },
                {
                  type: "doc",
                  docId: "advent-of-code",
                  label: "Advent of Code",
                },
                {
                  type: "doc",
                  docId: "uoj",
                  label: "UOJ",
                },
                {
                  type: "doc",
                  docId: "others/HC2020-R2/README",
                  label: "其他比赛",
                },
              ],
            },
            {
              type: "dropdown",
              position: "left",
              label: "其他",
              items: [
                {
                  type: "doc",
                  docId: "tips",
                  label: "小贴士",
                },
                {
                  type: "doc",
                  docId: "jargon",
                  label: "黑话",
                },
                {
                  type: "doc",
                  docId: "hall-of-fame",
                  label: "名人堂",
                },
              ],
            },
            { to: "/blog", label: "博客", position: "right" },
            {
              type: "localeDropdown",
              position: "right",
            },
            {
              href: "https://github.com/lucifer1004/cp-wiki-next",
              label: "GitHub",
              position: "right",
            },
            {
              type: "search",
              position: "right",
            },
          ],
        },
        footer: {
          style: "dark",
          copyright: `版权所有 © 2020--${new Date().getFullYear()} CP Wiki。本站点使用 Docusaurus 构建。`,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
          additionalLanguages: [
            "csharp",
            "elixir",
            "java",
            "julia",
            "kotlin",
            "rust",
          ],
        },
        googleAdsense: {
          dataAdClient: "ca-pub-2391425047778930",
        },
        algolia: {
          // The application ID provided by Algolia
          appId: "LH2XHYLVIX",

          // Public API key: it is safe to commit it
          apiKey: "eaa5ce5f2c89967aff59b84cbfda7e98",

          indexName: "cp-wiki-next",

          // Optional: see doc section below
          contextualSearch: true,

          // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
          externalUrlRegex: "external\\.com|domain\\.com",

          // Optional: Algolia search parameters
          searchParameters: {},

          // Optional: path for search page that enabled by default (`false` to disable it)
          searchPagePath: "search",

          //... other Algolia params
        },
      },
  };
};
