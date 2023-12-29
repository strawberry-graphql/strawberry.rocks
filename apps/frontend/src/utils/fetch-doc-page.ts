import { githubFetch } from "./github-fetch";

const GetFileDocument = `
    query GetFile($expression: String!, $owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: $expression) {
        ... on Blob {
          __typename
          text
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
      variables: { expression, owner, name },
    }),
  });

  const content = await response.json();

  const { data } = content;

  if (!data) {
    throw new Error("No data returned");
  }

  return data.repository.object.text as string;
};
