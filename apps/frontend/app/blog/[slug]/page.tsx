// @ts-ignore
import { cache } from "react";
import getReadingTime from "reading-time";

import { notFound } from "next/navigation";

import { fetchAllBlogPosts, getAuthorInfo } from "../data";
import { compile } from "./mdx";

import { ArticleHeader } from "@strawberry-graphql/styleguide";

export const fetchBlogPost = cache(async (slug: string) => {
  const allPosts = await fetchAllBlogPosts();

  return allPosts.find((post: any) => post.slug === slug);
});

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const data = await fetchBlogPost(slug);

  if (!data) {
    throw notFound();
  }

  const content = await compile({ source: data.content });
  const readingTime = getReadingTime(data.content);
  const authorInfo = await getAuthorInfo(data.author);

  return (
    <article className="p-16 md:px-40 mx-auto max-w-4xl">
      <ArticleHeader
        author={authorInfo}
        title={data.title}
        duration={readingTime.text}
        date={new Date()}
      />

      <div className="docs-content !p-0">{content}</div>
    </article>
  );
}
