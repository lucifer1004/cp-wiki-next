---
published: 2023-01-24
authors: 
  - lucifer1004
tags:
  - static-site-generator
  - vuepress
  - docusaurus
description: 从 Vuepress 迁移到 Docusaurus。
---

# 从 Vuepress 到 Docusaurus

最近，我把 CP Wiki 从 [Vuepress](https://vuepress.vuejs.org/) 迁移到了 [Docusaurus](https://docusaurus.io/)。

<!--truncate-->

迁移的起因是 GitHub 上的 Dependabot 提示有很多安全漏洞——我原本使用的 Vuepress 1 已经停止维护了。我可以选择升级到 Vuepress 2，但经过尝试和对比之后，我发现升级到 Vuepress 2 的成本超出了预期，于是我决定迁移到 Docusaurus。

Docusaurus 对于我来说并不陌生——我也曾经用它开发过一些站点。它和 Vuepress 最大的区别在于：Docusaurus 是基于 [React](https://reactjs.org/) 的，而 Vuepress 是基于 [Vue](https://vuejs.org/) 的。在这两者之间，我还是更倾向于 React。

折腾了两天之后，各种功能都已经迁移完毕。看起来挺棒！现在的博客也是 Docusaurus 原生支持的，比我自己原来写的那个简陋版本要成熟得多。

另外，我还用 [Giscus](https://giscus.app/) 代替了 [Utterances](https://utteranc.es/)。用 Discussions 来当讨论区，显然要比用 Issues 更加合适。

欢迎大家来玩。
