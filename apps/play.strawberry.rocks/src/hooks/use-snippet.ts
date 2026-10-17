import { DEFAULT_STRAWBERRY_VERSION } from "@/components/strawberry/strawberryVersion";
import { DEFAULT_EXAMPLE, findExample } from "@/examples";
import { useSuspenseQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

const GET_GIST = gql`
  query GetGist($id: ID!) {
    gist(id: $id) {
      id
      query
      code: schema
      variables
      requirements
    }
  }
`;

export const useSnippet = () => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const gistId = params.get("gist");
  // e.g. ?example=relay, see src/examples
  const example = findExample(params.get("example")) ?? DEFAULT_EXAMPLE;

  const { data } = useSuspenseQuery<{
    gist?: {
      code: string;
      query: string;
      variables: string;
      requirements: string;
    };
  }>({
    queryKey: ["gist", { gistId }],
    queryFn: async () =>
      gistId
        ? request("https://api.strawberry.rocks/graphql", GET_GIST, {
            id: gistId,
          })
        : Promise.resolve({ gist: undefined }),
  });

  let strawberryVersion = DEFAULT_STRAWBERRY_VERSION;

  if (data.gist?.requirements) {
    const match = data.gist.requirements.match(/strawberry-graphql==(.*)/);

    if (match) {
      strawberryVersion = match[1];
    }
  }

  const snippet = data.gist
    ? {
        code: data.gist.code,
        variables: data.gist.variables
          ? JSON.stringify(data.gist.variables, null, 2)
          : "{}",
        strawberryVersion,
        query: data.gist.query,
        // Gists don't store headers
        headers: "{}",
      }
    : {
        code: example.code,
        variables: example.variables,
        strawberryVersion,
        query: example.query,
        headers: example.headers,
      };

  return { snippet };
};
