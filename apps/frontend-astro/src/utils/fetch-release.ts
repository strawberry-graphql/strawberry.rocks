const GetReleaseDocument = /* GraphQL */ `
  query GetRelease($tagName: String!) {
    repository(owner: "strawberry-graphql", name: "strawberry") {
      release(tagName: $tagName) {
        description
        name
        createdAt
      }
    }
  }
`;

export const fetchRelease = async (tagName: string) => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${import.meta.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: GetReleaseDocument,
      variables: {
        tagName,
      },
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

  return data.repository.release as {
    description: string;
    name: string;
    createdAt: string;
  };
};
