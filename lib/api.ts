import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { marked } from "marked";

import { urlToSlugs } from "~/helpers/params";
import { isList, isString } from "~/helpers/type-guards";
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
import { getOpenCollectiveSponsors } from "./api/opencollective";
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
  "pre-commit-ci[bot]",
  "dependabot-support",
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
    contributors
      .map(async (username) => {
        try {
          const { data } = await octokit.request("GET /users/{username}", {
            username,
          });

          let url = data.blog ?? data.html_url;

          if (!url) {
            url = `https://github.com/${data.login}`;
          } else if (!url.startsWith("http")) {
            url = `https://${url}`;
          }

          return {
            name: data.name ?? data.login,
            url,
            avatarUrl: data.avatar_url,
          };
        } catch {
          return;
        }
      })
      .filter(Boolean) as Promise<GithubCollaborator>[]
  );
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

export const fetchLatestRelease = async (): Promise<{
  href: string;
  name: string;
}> => {
  if (process.env.LOCAL_REPO_PATH) {
    return {
      href: "/",
      name: "local",
    };
  }

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

    const tagName = latest?.latestRelease?.tagName;

    return {
      href: `https://github.com/${OWNER}/${REPO}/releases/tag/${tagName}`,
      name: tagName || "unknown",
    };
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
}) => {
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
  forceRemote = false,
}: {
  prefix: string;
  filename: string;
  owner?: string;
  repo?: string;
  ref?: string;
  forceRemote?: boolean;
}) => {
  if (process.env.LOCAL_REPO_PATH && !forceRemote) {
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

export const fetchSponsors = async () => {
  try {
    const response = await octokit.graphql<any>(
      /* GraphQL */
      `
        {
          organization(login: "strawberry-graphql") {
            sponsors(first: 100) {
              nodes {
                __typename
                ... on User {
                  login
                  name
                  avatarUrl
                }
                ... on Organization {
                  login
                  name
                  avatarUrl
                }
              }
            }
          }
        }
      `
    );

    return response.organization.sponsors.nodes;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("fetchSponsors:", error);
    throw error;
  }
};

export const fetchSponsorsForHomepage = async () => {
  if (process.env.LOCAL_REPO_PATH) {
    return [
      {
        id: "moving-content",
        name: "Moving Content AG",
        logo: "https://avatars.githubusercontent.com/u/1352964?v=4",
        href: "https://github.com/moving-content",
        sponsorship: { name: "$100 a month", monthlyPriceInDollars: 100 },
      },
      {
        id: "xoflare",
        name: "ExoFlare",
        logo: "https://avatars.githubusercontent.com/u/74335107?v=4",
        href: "https://www.exoflare.com/",
        sponsorship: { name: "$100 a month", monthlyPriceInDollars: 100 },
      },
      {
        id: "wedgworth",
        name: "Wedgworth's, Inc",
        logo: "https://avatars.githubusercontent.com/u/120101163?v=4",
        href: "https://wedgworth.com/",
        sponsorship: { name: "$100 a month", monthlyPriceInDollars: 100 },
      },
      {
        id: "cinder",
        name: "Cinder",
        logo: "https://images.opencollective.com/cinder/c477685/logo.png",
        href: "https://cinder.co",
        sponsorship: { monthlyPriceInDollars: 100 },
      },
    ];
  }

  const sponsors = await fetchSponsors();

  const getQuery = (alias: string, typename: string, login: string) => {
    const rootField = typename === "User" ? "user" : "organization";

    return /* GraphQL */ `${alias}: ${rootField}(login: "${login}") {
      login
      name
      logo: avatarUrl
      websiteUrl
      url
      ... on Sponsorable {
        sponsorshipsAsSponsor(first: 100) {
          nodes {
            sponsorable {
              __typename
              ... on Organization {
                login
              }
              ... on User {
                login
              }
            }
            tier {
              name
              monthlyPriceInDollars
            }
          }
        }
      }
    }`;
  };

  const queries = sponsors.map((sponsor: any, index: number) => {
    const { __typename, login } = sponsor;

    return getQuery(`sponsor${index}`, __typename, login);
  });

  const query = `query {
    ${queries.join("\n")}
    }`;

  const response = await octokit.graphql<any>(query);

  const githubSponsors = Object.keys(response).map((key) => {
    const sponsor = response[key];

    return {
      id: sponsor.login,
      name: sponsor.name,
      logo: sponsor.logo,
      href: sponsor.websiteUrl || sponsor.url,
      sponsorship: sponsor.sponsorshipsAsSponsor.nodes.find((node: any) => {
        const { sponsorable } = node;

        return sponsorable.login === OWNER;
      }).tier,
    };
  });

  const openCollectiveSponsors = await getOpenCollectiveSponsors();

  const allSponsor = [...githubSponsors, ...openCollectiveSponsors];

  return allSponsor.filter(
    (sponsor: any) =>
      sponsor && sponsor.sponsorship.monthlyPriceInDollars >= 100
  );
};
