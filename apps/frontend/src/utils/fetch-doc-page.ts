import { githubFetch } from "./github-fetch";

const isBot = (name: string) => {
  if (name.endsWith("[bot]")) {
    return true;
  }

  return ["botberry", "dependabot-support"].includes(name);
};

const GetFileDocument = `
query GetFile($expression: String!, $owner: String!, $name: String!, $path: String!) {
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
    object(expression: $expression) {
      ... on Blob {
        __typename
        text
        commitUrl
      }
    }
  }
}
`;

export const fetchDocPage = async ({
  filename,
  prNumber,
  repo = "strawberry-graphql/strawberry",
}: {
  filename: string;
  prNumber?: string;
  repo?: string;
}) => {
  const prefix = "main";

  const [owner, name] = repo.split("/");

  let expression = `${prefix}:${filename}`;

  if (prNumber) {
    expression = `pull/${prNumber}/head:${filename}`;
  }

  const response = await githubFetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: GetFileDocument,
      variables: { expression, owner, name, path: filename },
    }),
  });

  const source = await response.json();

  const { data, errors } = source;

  if (errors) {
    throw new Error(errors[0].message);
  }

  if (!data || !data.repository.object) {
    console.log(filename, data);

    throw new Error("No data returned");
  }

  const content = data.repository.object.text as string;

  const seenNames = new Set();

  const authors: Array<{
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
        authors.push({
          name: author.name,
          avatarUrl: author.avatarUrl,
          login: author.user?.login,
        });
      }
    });
  });

  return { content, authors };
};
