const GetReleaseDocument = /* GraphQL */ `
  query {
    repository(owner: "strawberry-graphql", name: "strawberry") {
      releases(first: 100) {
        nodes {
          tagName
        }
      }
    }
  }
`;

export const fetchReleases = async () => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${import.meta.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: GetReleaseDocument,
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

  return data.repository.releases.nodes.map(
    (release: any) => release.tagName,
  ) as string[];
};
