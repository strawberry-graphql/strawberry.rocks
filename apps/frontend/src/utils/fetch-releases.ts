import { githubFetch } from "./github-fetch";

const GetReleaseDocument = /* GraphQL */ `
  query {
    repository(owner: "strawberry-graphql", name: "strawberry") {
      releases(first: 10) {
        nodes {
          tagName
        }
      }
    }
  }
`;

export const fetchReleases = async () => {
  const response = await githubFetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: GetReleaseDocument,
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

  return data.repository.releases.nodes.map(
    (release: any) => release.tagName,
  ) as string[];
};
