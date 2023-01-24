import BlogPostItem from "@theme-original/BlogPostItem";
import React from "react";
import CommentSystem from "../../components/CommentSystem";

export default function BlogPostItemWrapper(props) {
  return (
    <>
      <BlogPostItem {...props} />
      <CommentSystem />
    </>
  );
}
