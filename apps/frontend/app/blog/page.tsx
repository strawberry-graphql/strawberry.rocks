import getReadingTime from "reading-time";

import { fetchAllBlogPosts, getAuthorInfo } from "./data";

import { ArticleGrid } from "@strawberry-graphql/styleguide";

export default async function BlogPage() {
  const blogPosts = await fetchAllBlogPosts();

  const articles = await Promise.all(
    blogPosts.map(async (post: any) => {
      const readingTime = getReadingTime(post.content);
      const authorInfo = await getAuthorInfo(post.author);

      return {
        ...post,
        href: `/blog/${post.slug}`,
        readingTime: readingTime.text,
        author: authorInfo,
      };
    })
  );

  return (
    <div className="p-16 md:px-40 mx-auto max-w-4xl">
      <ArticleGrid articles={articles} />
    </div>
  );
}
