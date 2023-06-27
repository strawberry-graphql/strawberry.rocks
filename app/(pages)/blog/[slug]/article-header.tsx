import { Octokit } from "@octokit/core";
import { Heading } from "@strawberry-graphql/styleguide";
import { parseISO, format } from "date-fns";

const getAuthorInfo = async (username: string) => {
  const octokit = new Octokit();

  const res = await octokit.request("GET /users/{username}", {
    username,
  });

  return res.data;
};

export const ArticleHeader = async ({ author }: { author: string }) => {
  const authorInfo = await getAuthorInfo(author);

  return (
    <header className="space-y-48">
      <div className="flex space-x-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={authorInfo.avatar_url}
          className="w-64 h-64 rounded-full"
          alt={authorInfo.name || authorInfo.login}
        />

        <div className="relative flex-1">
          <h2 className="typography-heading-4">{authorInfo.name}</h2>

          <div className="flex space-x-8 items-center md:space-x-0">
            <div className="typography-label-2 md:absolute top-0 right-0">
              25 June 2023
            </div>
            <div className="w-4 h-4 rounded-full bg-black dark:bg-white md:hidden"></div>
            <div className="typography-caption uppercase">20 minutes read</div>
          </div>
        </div>
      </div>

      <Heading>Title</Heading>
    </header>
  );
};
