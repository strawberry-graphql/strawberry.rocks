import { GraphQLClient } from "graphql-request";

import { graphql } from "~/types/graphql";

const FetchReleaseDocument = graphql(`
  query FetchRelease($version: String!) {
    repository(owner: "strawberry-graphql", name: "strawberry") {
      release(tagName: $version) {
        author {
          name
        }
        description
        mentions(first: 10) {
          nodes {
            login
          }
        }
        name
      }
    }
  }
`);

export const fetchRelease = async (version: string) => {
  const client = new GraphQLClient("https://api.github.com/graphql", {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  const data = await client.request(FetchReleaseDocument, {
    version,
  });

  if (!data.repository?.release) {
    return null;
  }

  return data.repository?.release;
};
