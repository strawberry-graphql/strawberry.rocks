import { useSuspenseQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

const STARTER_CODE = `
import strawberry

@strawberry.type
class Query:
    @strawberry.field
    def hello(self, info: strawberry.Info) -> str:
        return "world"

schema = strawberry.Schema(Query)
`.trim();

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

  const { data } = useSuspenseQuery<{
    gist?: {
      code: string;
      query: string;
      variables: string;
    };
  }>({
    queryKey: ["gist", { gistId }],
    queryFn: async () =>
      request("https://api.strawberry.rocks/graphql", GET_GIST, { id: gistId }),
  });

  const snippet = {
    code: data.gist?.code || STARTER_CODE,
    variables: data.gist?.variables
      ? JSON.stringify(data.gist.variables, null, 2)
      : "",
    strawberryVersion: "latest",
    query: data.gist?.query || "{ hello }",
  };

  return { snippet };
};
