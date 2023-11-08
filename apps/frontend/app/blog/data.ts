import { Octokit } from "@octokit/core";
import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";
// @ts-ignore
import { cache } from "react";

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
        date: Date;
      };
    })
  );
});

export const getAuthorInfo = async (username: string) => {
  const octokit = new Octokit({
    auth: `${process.env.GITHUB_TOKEN}`,
  });

  const res = await octokit.request("GET /users/{username}", {
    username,
  });

  return res.data;
};
