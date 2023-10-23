import { ApolloClient, InMemoryCache } from "@apollo/client";

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

// TODO: maybe move this to use hooks and useSuspenseQuery
export const fetchRelease = async (version: string) => {
  const client = new ApolloClient({
    uri: "https://api.github.com/graphql",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: FetchReleaseDocument,
    variables: {
      version,
    },
  });

  return data;
};
