import React from 'react';
import Footer from '@theme-original/Footer';
import Giscus from '@giscus/react';
import { translate } from '@docusaurus/Translate';

export default function FooterWrapper(props) {
  return (
    <>
      <Giscus
        id="comments"
        repo="lucifer1004/cp-wiki-next"
        repoId="R_kgDOI0xGOQ"
        category="Announcements"
        categoryId="DIC_kwDOI0xGOc4CTxUn"
        mapping="pathname"
        // term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang={translate({
          message: "zh-CN",
          id: "theme.Giscus.lang",
        })}
        loading="lazy"
      />
      <Footer {...props} />
    </>
  );
}
