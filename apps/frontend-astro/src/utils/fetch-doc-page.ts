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

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${import.meta.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: GetFileDocument,
      variables: { expression, owner, name },
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const content = await response.json();

  const { data } = content;

  if (!data) {
    throw new Error("No data returned");
  }

  return data.repository.object.text as string;
};
