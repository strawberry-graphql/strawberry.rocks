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
import { GithubCollaborator } from "~/types/api";

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

// TODO: implement usage.
export const fetchPullRequest = async (
  pull_number: number,
  owner = OWNER,
  repo = REPO
) => {
  try {
    const pull = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}",
      { owner, repo, pull_number }
    );
    return {
      pull_number: pull.data.number,
      owner: pull.data.user?.login,
      repo: pull.data.head.repo.name,
      branch: pull.data.head.ref,
      pull,
      safeToPreview:
        pull.data.state === "open" &&
        pull.data.labels.find((label) => label.name === "ok-to-preview") !==
          undefined,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("fetchPullRequest", error);
    throw error;
  }
};

export const fetchFile = async (
  path: string,
  owner = OWNER,
  repo = REPO,
  ref = REF
): Promise<string> => {
  try {
    const file = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path,
        ref,
      }
    );

    // @ts-ignore
    const content = Buffer.from(file.data.content, "base64");
    return content.toString();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("fetchFile:", error);
    throw error;
  }
};

export const fetchLatestRelease = async (): Promise<string> => {
  try {
    const latest = await octokit.request(
      "GET /repos/{owner}/{repo}/releases/latest",
      {
        owner: OWNER,
        repo: REPO,
      }
    );

    return latest.data.tag_name;
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

export const fetchTableOfContents = async (
  prefix: string,
  ref = REF,
  owner = OWNER,
  repo = REPO
): Promise<DocsTree | null> => {
  try {
    const sections: DocsTree = {};

    const text = await fetchFile("docs/README.md", owner, repo, ref);

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

export const fetchTableOfContentsPaths = async (
  ref = REF,
  owner = OWNER,
  repo = REPO
): Promise<{ params: { slug: string[] } }[]> => {
  const text = await fetchFile("docs/README.md", owner, repo, ref);
  const tokens = marked.lexer(text);

  const paramSlugs: { params: { slug: string[] } }[] = [
    { params: { slug: [] } },
  ];

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
