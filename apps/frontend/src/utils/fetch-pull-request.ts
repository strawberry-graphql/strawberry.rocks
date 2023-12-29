const GetPRDocument = /* GraphQL */ `
  query GetPR($number: Int!) {
    repository(owner: "strawberry-graphql", name: "strawberry") {
      pullRequest(number: $number) {
        labels(first: 100) {
          nodes {
            name
          }
        }
      }
    }
  }
`;

export const fetchPullRequest = async (number: string) => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${import.meta.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: GetPRDocument,
      variables: {
        number: parseInt(number),
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

  return data.repository.pullRequest as {
    labels: {
      nodes: {
        name: string;
      }[];
    };
  } | null;
};
