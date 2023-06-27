import { Octokit } from "@octokit/core";
import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";
import { cache } from "react";
import getReadingTime from "reading-time";

import { notFound } from "next/navigation";

import { compile } from "./mdx";

import { ArticleHeader } from "@strawberry-graphql/styleguide";

const getAuthorInfo = async (username: string) => {
  const octokit = new Octokit({
    auth: `${process.env.GITHUB_TOKEN}`,
  });

  const res = await octokit.request("GET /users/{username}", {
    username,
  });

  return res.data;
};

export const fetchAllBlogPosts = cache(async () => {
  const postsDirectory = path.join(process.cwd(), "blog-posts");

  const allPosts = await fs.readdir(postsDirectory);

  return await Promise.all(
    allPosts.map(async (filename) => {
      const filePath = path.join(process.cwd(), "blog-posts", filename);

      const fileContent = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(fileContent);

      return {
        ...data,
        content,
      } as {
        title: string;
        slug: string;
        content: string;
        author: string;
        tags: string[];
        excerpt: string;
      };
    })
  );
});

export const fetchBlogPost = cache(async (slug: string) => {
  const allPosts = await fetchAllBlogPosts();

  return allPosts.find((post) => post.slug === slug);
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
      <p>{content}</p>
    </article>
  );
}
