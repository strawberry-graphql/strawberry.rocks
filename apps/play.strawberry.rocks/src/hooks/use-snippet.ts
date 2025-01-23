import { useSuspenseQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

const STARTER_CODE = `
import strawberry

@strawberry.type
class Article:
    id: str

@strawberry.type
class User:
    name: str
    age: int
    articles: list[Article]

@strawberry.type
class Query:
    @strawberry.field
    def example(self, info: strawberry.Info) -> str:
        return "example"

    @strawberry.field
    def hello(self, info: strawberry.Info) -> User:
        return User(
            name="patrick",
            age=20,
            articles=[Article(id="1"), Article(id="2")],
        )

schema = strawberry.Schema(Query)
`.trim();

const STARTER_QUERY = `
query {
  hello {
    name
  }
}
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

  let strawberryVersion = "latest";

  if (data.gist?.requirements) {
    const match = data.gist.requirements.match(/strawberry-graphql==(.*)/);

    if (match) {
      strawberryVersion = match[1];
    }
  }

  const snippet = {
    code: data.gist?.code || STARTER_CODE,
    variables: data.gist?.variables
      ? JSON.stringify(data.gist.variables, null, 2)
      : "{}",
    strawberryVersion,
    query: data.gist?.query || STARTER_QUERY,
  };

  return { snippet };
};
