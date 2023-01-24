import DocItem from "@theme-original/DocItem";
import React from "react";
import CommentSystem from "../../components/CommentSystem";

export default function DocItemWrapper(props) {
  return (
    <>
      <DocItem {...props} />
      <CommentSystem />
    </>
  );
}
