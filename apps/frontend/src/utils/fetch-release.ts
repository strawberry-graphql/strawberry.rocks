import { githubFetch } from "./github-fetch";

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
  const response = await githubFetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: GetReleaseDocument,
      variables: {
        tagName,
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

  return data.repository.release as {
    description: string;
    name: string;
    createdAt: string;
  };
};
