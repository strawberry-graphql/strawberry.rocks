import { SplitCodeView } from "./split-code-view";

export const GraphQLExample = ({
  query,
  response,
}: {
  query: string;
  response: string;
}) => {
  const res = JSON.parse(response);

  return (
    <SplitCodeView
      leftHeader="Query"
      leftLanguage="graphql"
      leftCode={query}
      rightHeader="Result"
      rightLanguage="json"
      rightCode={JSON.stringify(res, null, "  ")}
    />
  );
};
