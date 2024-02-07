import parseLinkHeader from "parse-link-header";
import { githubFetch } from "./github-fetch";

// TODO: see if we can use the GraphQL API to get the names as well
export const fetchContributors = async () => {
  let url: string | undefined =
    "https://api.github.com/repos/strawberry-graphql/strawberry/contributors?per_page=100";

  let contributors = [] as {
    id: string;
    name: string;
    avatar: string;
    href: string;
    contributions: number;
  }[];

  while (url) {
    const response = await githubFetch(url, { method: "GET" });

    const data = await response.json();

    contributors = [
      ...contributors,
      ...data.map((contributor: any) => {
        return {
          id: contributor.login,
          name: contributor.name || contributor.login,
          avatar: contributor.avatar_url,
          href: contributor.html_url,
          contributions: contributor.contributions,
        };
      }),
    ];

    url = undefined;

    const link = response.headers.get("link");

    if (link) {
      const links = parseLinkHeader(link);

      if (links) {
        url = links.next?.url;
      }
    }
  }

  return contributors;
};
