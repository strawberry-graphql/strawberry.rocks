import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import marked, { Tokens } from "marked";

import { DocsTree } from "~/components/docs-navigation";
import { addHrefPrefix, urlToSlugs } from "~/helpers/params";
import {
  isCollaborator,
  isHeading,
  isLink,
  isList,
  isListItemWithTokens,
  isString,
  isTextWithTokens,
} from "~/helpers/type-guards";
import { GithubCollaborator, TableOfContentsPath } from "~/types/api";
import {
  CodeOfConductQuery,
  FileQuery,
  LatestReleaseQuery,
  PullRequestQuery,
} from "~/types/graphql";

const customOctokit = Octokit.plugin(paginateRest);

const octokit = new customOctokit({
  auth: `${process.env.GITHUB_TOKEN}`,
});

export const OWNER = "strawberry-graphql";
export const REPO = "strawberry";
// default branch to query against.
export const REF = "master";
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
    { owner: OWNER, repo: REPO, per_page: 100 },
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
          url: data.blog ?? data.html_url,
        };
      } catch {
        return;
      }
    })
  ).then((resolve) => resolve.filter(isCollaborator));
};

export const fetchPullRequest = async ({
  pull_number,
  owner = OWNER,
  repo = REPO,
}: {
  pull_number: number;
  owner?: string;
  repo?: string;
}) => {
  try {
    const pull = await octokit
      .graphql<PullRequestQuery>(
        /* GraphQL */
        `
          query pullRequest(
            $owner: String!
            $repo: String!
            $pull_number: Int!
          ) {
            repository(owner: $owner, name: $repo) {
              pullRequest(number: $pull_number) {
                state
                number
                headRepositoryOwner {
                  login
                }
                repository {
                  name
                }
                headRefName
                url
                labels(first: 10) {
                  nodes {
                    name
                  }
                }
              }
            }
          }
        `,
        { owner, repo, pull_number }
      )
      .then((response) => response.repository?.pullRequest);

    const safeToPreview: boolean =
      pull?.state === "OPEN" &&
      pull?.labels?.nodes?.find((label) => label?.name === "ok-to-preview") !==
        undefined;

    if (!safeToPreview) {
      // TODO: we might want to show a message to the users that a pull request needs the label of "ok-to-preview" instead of throwing an error which 404s.
      throw new Error("not safe to preview");
    }

    return {
      pull_number: pull?.number,
      owner: pull?.headRepositoryOwner?.login,
      repo: pull?.repository?.name,
      branch: pull?.headRefName,
      html_url: pull?.url,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("fetchPullRequest", error);
    throw error;
  }
};

export const fetchFile = async ({
  filename,
  owner = OWNER,
  repo = REPO,
  ref = REF,
}: {
  filename: string;
  owner?: string;
  repo?: string;
  ref?: string;
}) => {
  try {
    const text = await octokit
      .graphql<FileQuery>(
        /* GraphQL */
        `
          query file($owner: String!, $repo: String!, $filename: String!) {
            repository(owner: $owner, name: $repo) {
              object(expression: $filename) {
                ... on Blob {
                  text
                }
              }
            }
          }
        `,
        {
          owner,
          repo,
          filename: `${ref}:${filename}`,
        }
      )
      .then((response) => response.repository?.object?.text);
    if (text == null) {
      throw new Error("no text");
    }
    return text;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("fetchFile:", error);
    throw error;
  }
};

export const fetchLatestRelease = async (): Promise<string | undefined> => {
  try {
    const latest = await octokit
      .graphql<LatestReleaseQuery>(
        /* GraphQL */
        `
          query latestRelease($owner: String!, $repo: String!) {
            repository(owner: $owner, name: $repo) {
              latestRelease {
                tagName
              }
            }
          }
        `,
        { owner: OWNER, repo: REPO }
      )
      .then((response) => response.repository);

    return latest?.latestRelease?.tagName;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("fetchLatestRelease", error);
    throw error;
  }
};

const getMDLinks = (items: Tokens.ListItem[]): Tokens.Link[] =>
  items.filter(isListItemWithTokens).flatMap((item) =>
    item.tokens
      .filter(isTextWithTokens)
      .flatMap((t) => t.tokens)
      .filter(isLink)
  );

export const fetchTableOfContents = async ({
  prefix,
  ref = REF,
  owner = OWNER,
  repo = REPO,
}: {
  prefix: string;
  ref?: string;
  owner?: string;
  repo?: string;
}): Promise<DocsTree | null> => {
  try {
    const sections: DocsTree = {};

    const text = await fetchFile({
      filename: "docs/README.md",
      owner,
      repo,
      ref,
    });

    const tokens = marked.lexer(text);

    let currentSection = "Docs";

    tokens.forEach((token) => {
      if (isHeading(token) && token.depth === 2) {
        currentSection = token.text;
      }

      if (isList(token)) {
        if (typeof sections[currentSection] === "undefined") {
          sections[currentSection] = {
            name: currentSection,
            links: [],
          };
        }

        const links: Tokens.Link[] = getMDLinks(token.items);
        sections[currentSection].links = links.map((link) => ({
          href: addHrefPrefix(link.href, prefix),
          text: link.text,
        }));
      }
    });
    return sections;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("fetchTableOfContents", error);
    return null;
  }
};

export const fetchTableOfContentsPaths = async ({
  ref = REF,
  owner = OWNER,
  repo = REPO,
}: {
  ref?: string;
  owner?: string;
  repo?: string;
}): Promise<TableOfContentsPath> => {
  const text = await fetchFile({
    filename: "docs/README.md",
    owner,
    repo,
    ref,
  });

  const paramSlugs: TableOfContentsPath = [{ params: { slug: [] } }];

  if (text == null) {
    return paramSlugs;
  }

  const tokens = marked.lexer(text);

  tokens.forEach((token) => {
    if (isList(token)) {
      getMDLinks(token.items).map((item) =>
        paramSlugs.push({
          params: {
            slug: urlToSlugs(item.href),
          },
        })
      );
    }
  });
  return paramSlugs;
};

export const fetchCodeOfConduct = async () =>
  await octokit
    .graphql<CodeOfConductQuery>(
      /* GraphQL */
      `
        query codeOfConduct($owner: String!, $repo: String!) {
          repository(owner: $owner, name: $repo) {
            codeOfConduct {
              body
            }
            latestRelease {
              tagName
            }
          }
        }
      `,
      { owner: OWNER, repo: REPO }
    )
    .then((response) => response.repository);
