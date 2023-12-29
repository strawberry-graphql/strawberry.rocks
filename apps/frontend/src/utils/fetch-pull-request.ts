import { githubFetch } from "./github-fetch";

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
  const response = await githubFetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: GetPRDocument,
      variables: {
        number: parseInt(number),
      },
    }),
  });

  const content = await response.json();

  const { data, errors } = content;

  if (errors) {
    throw new Error(errors[0].message);
  }

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
