import { translate } from "@docusaurus/Translate";
import Giscus from "@giscus/react";
import React from "react";

export default function CommentSystem(): JSX.Element {
  return (
    <>
      <Giscus
        id="comments"
        repo="lucifer1004/cp-wiki-next"
        repoId="R_kgDOI0xGOQ"
        category="Announcements"
        categoryId="DIC_kwDOI0xGOc4CTxUn"
        mapping="pathname"
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
    </>
  );
}
