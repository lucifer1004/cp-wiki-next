/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  basicSidebar: [
    {
      type: 'category',
      label: '基础算法',
      link: { type: 'doc', id: 'basic' },
      items: [
        {
          type: 'autogenerated',
          dirName: 'basic',
        }
      ]
    }
  ],
  algebraSidebar: [
    {
      type: 'category',
      label: '代数',
      link: { type: 'doc', id: 'algebra' },
      items: [
        {
          type: 'autogenerated',
          dirName: 'algebra',
        }
      ]
    }
  ],
  dataStructureSidebar: [
    {
      type: 'category',
      label: '基础数据结构',
      link: { type: 'doc', id: 'data-structure' },
      items: ['data-structure/stack/README', 'data-structure/queue/README'],
    },
    {
      type: 'category',
      label: '进阶数据结构',
      items: ['data-structure/balanced-binary-search-tree/README', 'data-structure/disjoint-sets-union/README', 'data-structure/segment-tree/README']
    }
  ],
  graphSidebar: [{
    type: 'category',
    label: '图论',
    link: { type: 'doc', id: 'graph' },
    items: [
      {
        type: 'autogenerated',
        dirName: 'graph',
      }
    ]
  }],
  dpSidebar: [{
    type: 'category',
    label: '动态规划',
    link: { type: 'doc', id: 'dp' },
    items: [
      {
        type: 'autogenerated',
        dirName: 'dp',
      }
    ]
  }],
  geometrySidebar: [{
    type: 'category',
    label: '计算几何',
    link: { type: 'doc', id: 'geometry' },
    items: [
      {
        type: 'autogenerated',
        dirName: 'geometry',
      }
    ]
  }],
  stringSidebar: [{
    type: 'category',
    label: '字符串',
    link: { type: 'doc', id: 'string' },
    items: [
      {
        type: 'autogenerated',
        dirName: 'string',
      }
    ]
  }],
  combinatoricsSidebar: [{
    type: 'category',
    label: '组合数学',
    link: { type: 'doc', id: 'combinatorics' },
    items: [
      {
        type: 'autogenerated',
        dirName: 'combinatorics',
      }
    ]
  }],
  miscSidebar: [{
    type: 'category',
    label: '杂项',
    link: { type: 'doc', id: 'misc' },
    items: [
      {
        type: 'autogenerated',
        dirName: 'misc',
      }
    ]
  }],
  codeforcesSidebar: [{
    type: 'category',
    label: 'CodeForces',
    link: { type: 'doc', id: 'codeforces' },
    items: [
      {
        type: 'autogenerated',
        dirName: 'codeforces',
      }
    ]
  }],
  leetcodeSidebar: [{
    type: 'category',
    label: 'LeetCode',
    link: { type: 'doc', id: 'leetcode' },
    items: [
      {
        type: 'category',
        label: '特殊比赛',
        collapsed: true,
        items: [
          {
            type: 'autogenerated',
            dirName: 'leetcode/special',
          }
        ]
      },
      {
        type: 'category',
        label: '周赛',
        collapsed: true,
        items: [
          {
            type: 'autogenerated',
            dirName: 'leetcode/weekly',
          }
        ]
      },
      {
        type: 'category',
        label: '双周赛',
        collapsed: true,
        items: [
          {
            type: 'autogenerated',
            dirName: 'leetcode/bi-weekly',
          }
        ]
      },
    ]
  }],
  kickstartSidebar: [{
    type: 'category',
    label: 'Kick Start',
    link: { type: 'doc', id: 'kick-start' },
    items: [
      {
        type: 'autogenerated',
        dirName: 'kick-start',
      }
    ]
  }],
  adventOfCodeSidebar: [{
    type: 'category',
    label: 'Advent of Code',
    link: { type: 'doc', id: 'advent-of-code' },
    items: [
      {
        type: 'autogenerated',
        dirName: 'advent-of-code',
      }
    ]
  }],
};

module.exports = sidebars;
