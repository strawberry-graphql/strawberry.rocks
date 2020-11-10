import fetch from "isomorphic-unfetch";

const ENDPOINT = "https://api.github.com/graphql";
const REPO = "strawberry";
const OWNER = "strawberry-graphql";

export type GithubCollaborator = {
  name: string | null;
  login: string;
  websiteUrl: string | null;
  url: string;
};

export async function getCollaborators(): Promise<GithubCollaborator[]> {
  const query = `
    query CollaboratorsQuery($repo: String!, $owner: String!) {
      repository(name: $repo, owner: $owner) {
        collaborators(affiliation: ALL) {
          edges {
            node {
              name
              login
              websiteUrl
              url
            }
          }
        }
      }
    }
  `;

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        repo: REPO,
        owner: OWNER,
      },
    }),
  });

  if (response.status !== 200) {
    // eslint-disable-next-line
    console.error(await response.text());
    throw new Error("Request failed");
  }

  const { data } = await response.json();
  return data.repository.collaborators.edges.map(
    ({ node }: { node: GithubCollaborator }) => node
  );
}
