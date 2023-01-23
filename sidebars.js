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
  ]
};

module.exports = sidebars;
