import { githubFetch } from "./github-fetch";

const isBot = (name: string) => {
  if (name.endsWith("[bot]")) {
    return true;
  }

  return ["botberry", "dependabot-support"].includes(name);
};

const GetFileDocument = `
query GetFile($owner: String!, $name: String!, $path: String!) {
  repository(owner: $owner, name: $name) {
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: 100, path: $path) {
            nodes {
              authors(first: 100) {
                nodes {
                  name
                  user { login }
                  avatarUrl
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const fetchPageContributors = async ({
  filename,
  repo = "strawberry-graphql/strawberry",
}: {
  filename: string;
  prNumber?: string;
  repo?: string;
}) => {
  if (process.env.LOCAL === "true") {
    return [];
  }

  const [owner, name] = repo.split("/");

  const response = await githubFetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: GetFileDocument,
      variables: { owner, name, path: filename },
    }),
  });

  const source = await response.json();

  const { data, errors } = source;

  if (errors) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error(
      `No data found for ${filename}, data: ${JSON.stringify(data)}`
    );
  }

  const seenNames = new Set();

  const contributors: Array<{
    name: string;
    avatarUrl: string;
    login: string | null;
  }> = [];

  data.repository.defaultBranchRef.target.history.nodes.forEach((node: any) => {
    node.authors.nodes.forEach((author: any) => {
      if (isBot(author.name)) {
        return;
      }

      if (!seenNames.has(author.name)) {
        seenNames.add(author.name);
        contributors.push({
          name: author.name,
          avatarUrl: author.avatarUrl,
          login: author.user?.login,
        });
      }
    });
  });

  return contributors;
};
