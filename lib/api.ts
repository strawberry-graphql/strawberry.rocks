import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { marked } from "marked";

import { DocsTree } from "~/components/docs-navigation";
import { urlToSlugs } from "~/helpers/params";
import { isCollaborator, isList, isString } from "~/helpers/type-guards";
import { GithubCollaborator, PagePath } from "~/types/api";
import {
  CodeOfConductQuery,
  DocPageQuery,
  ExtensionsPageQuery,
  FileQuery,
  LatestReleaseQuery,
  PullRequestQuery,
} from "~/types/graphql";

import { fetchDocPageLocal, fetchTableOfContentsLocal } from "./api-local";
import {
  getBlobText,
  getDocTree,
  getMDLinks,
  getTreeEntries,
} from "./doc-tree";

const customOctokit = Octokit.plugin(paginateRest);

const octokit = new customOctokit({
  auth: `${process.env.GITHUB_TOKEN}`,
});

export const OWNER = "strawberry-graphql";
export const REPO = "strawberry";
// default branch to query against.
export const REF = "main";
/**
 * Contributor username/login to ignore as they are bots.
 */
const IGNORE_LIST = [
  "dependabot-preview[bot]",
  "dependabot-bot",
  "dependabot[bot]",
  "precommit-ci[bot]",
  "botberry",
];

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
                  __typename
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
      .then((response) => getBlobText(response.repository?.object));
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

export const fetchLatestRelease = async (): Promise<string> => {
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
  if (process.env.LOCAL_REPO_PATH) {
    return fetchTableOfContentsLocal({ prefix });
  }

  try {
    const text = await fetchFile({
      filename: "docs/README.md",
      owner,
      repo,
      ref,
    });
    return getDocTree(text, prefix);
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
}): Promise<PagePath> => {
  const text = await fetchFile({
    filename: "docs/README.md",
    owner,
    repo,
    ref,
  });

  const paramSlugs: PagePath = [{ params: { slug: [] } }];

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

export const fetchExtensionsPaths = async ({
  ref = REF,
  owner = OWNER,
  repo = REPO,
}: {
  ref?: string;
  owner?: string;
  repo?: string;
}): Promise<PagePath> => {
  try {
    const response = await octokit.graphql<ExtensionsPageQuery>(
      /* GraphQL */
      `
        query extensionsPages(
          $owner: String!
          $repo: String!
          $filename: String!
        ) {
          repository(owner: $owner, name: $repo) {
            object(expression: $filename) {
              ... on Tree {
                __typename
                entries {
                  name
                  path
                }
              }
            }
          }
        }
      `,
      {
        owner,
        repo,
        filename: `${ref}:docs/extensions`,
      }
    );

    const extensions = getTreeEntries(response.repository?.object);
    if (extensions == null) {
      throw new Error("no extensions");
    }
    const paramSlugs: PagePath = [];
    extensions.forEach((extension) => {
      if (!extension.path) {
        return;
      }

      if (extension.name.startsWith("_")) {
        return;
      }

      paramSlugs.push({
        params: {
          slug: urlToSlugs(extension.path).slice(1),
        },
      });
    });

    return paramSlugs;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("fetchExtensions:", error);
    throw error;
  }
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

export class DocPageNotFound extends Error {
  filename: string;

  constructor(message: string, filename: string) {
    super(message);
    this.filename = filename;
  }
}

export const fetchDocPage = async ({
  prefix,
  filename,
  owner = OWNER,
  repo = REPO,
  ref = REF,
}: {
  prefix: string;
  filename: string;
  owner?: string;
  repo?: string;
  ref?: string;
}) => {
  if (process.env.LOCAL_REPO_PATH) {
    return fetchDocPageLocal({ prefix, filename });
  }

  try {
    const response = await octokit.graphql<DocPageQuery>(
      /* GraphQL */
      `
        query docPage(
          $owner: String!
          $repo: String!
          $filename: String!
          $tablecontent: String!
        ) {
          repository(owner: $owner, name: $repo) {
            object(expression: $filename) {
              ... on Blob {
                __typename
                text
              }
            }
            tableOfContents: object(expression: $tablecontent) {
              ... on Blob {
                __typename
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
        tablecontent: `${ref}:docs/README.md`,
      }
    );

    const pageText = getBlobText(response.repository?.object);
    const tableContentText = getBlobText(response.repository?.tableOfContents);
    if (pageText == null) {
      throw new DocPageNotFound("no pageText", filename);
    }
    return {
      page: pageText,
      tableContent:
        tableContentText != null
          ? await getDocTree(tableContentText, prefix)
          : null,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("fetchFile:", error);
    throw error;
  }
};

export const fetchExtensions = async ({
  prefix,
  owner = OWNER,
  repo = REPO,
  ref = REF,
}: {
  prefix: string;
  owner?: string;
  repo?: string;
  ref?: string;
}) => {
  try {
    const response = await octokit.graphql<ExtensionsPageQuery>(
      /* GraphQL */
      `
        query extensionsPage(
          $owner: String!
          $repo: String!
          $filename: String!
          $tablecontent: String!
        ) {
          repository(owner: $owner, name: $repo) {
            object(expression: $filename) {
              ... on Tree {
                __typename
                entries {
                  __typename
                  name
                  path
                  type
                  object {
                    ... on Blob {
                      __typename
                      text
                    }
                  }
                }
              }
            }
            tableOfContents: object(expression: $tablecontent) {
              ... on Blob {
                __typename
                text
              }
            }
          }
        }
      `,
      {
        owner,
        repo,
        filename: `${ref}:docs/extensions`,
        tablecontent: `${ref}:docs/README.md`,
      }
    );

    const extensions = getTreeEntries(response.repository?.object);
    if (extensions == null) {
      throw new Error("no extensions");
    }
    const tableContentText = getBlobText(response.repository?.tableOfContents);
    return {
      extensions,
      tableContent:
        tableContentText != null
          ? await getDocTree(tableContentText, prefix)
          : null,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("fetchFile:", error);
    throw error;
  }
};
