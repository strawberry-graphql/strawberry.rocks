import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";

import { isCollaborator, isString } from "~/helpers/type-guards";
import { GithubCollaborator } from "~/types/api";

const customOctokit = Octokit.plugin(paginateRest);

const octokit = new customOctokit({
  auth: `${process.env.GITHUB_TOKEN}`,
});

/**
 * Contributor username/login to ignore as they are bots.
 */
const IGNORE_LIST = ["dependabot-preview[bot]", "dependabot-bot", "botberry"];

/**
 * fetchContributors uses the GitHub REST API for contributors as the GraphQL
 * API auth token needs push access. @octokit/plugin-paginate-rest gives us
 * support for paginatated responses. So if we ever get above 100 contributors
 * this should handle querying more pages for us.
 */
export const fetchContributors: () => Promise<
  GithubCollaborator[]
> = async () => {
  const contributors: string[] = await octokit.paginate(
    "GET /repos/{owner}/{repo}/contributors",
    { owner: "strawberry-graphql", repo: "strawberry", per_page: 100 },
    (response) =>
      response.data
        .filter((member) =>
          isString(member.login) ? !IGNORE_LIST.includes(member.login) : false
        )
        .map((member) => member.login)
        .filter(isString)
  );

  /**
   * Get a contributors name & blog. If the request errors then return undefined
   *  and filter item.
   */
  return Promise.all(
    contributors.map(async (username) => {
      try {
        const { data } = await octokit.request("GET /users/{username}", {
          username,
        });

        return {
          name: data.name,
          login: data.login,
          url: data.blog || data.html_url,
        };
      } catch {
        return;
      }
    })
  ).then((resolve) => resolve.filter(isCollaborator));
};
