import { SplitCodeView } from "./split-code-view";

export const SchemaExample = ({
  python,
  schema,
}: {
  python: string;
  schema: string;
}) => {
  return (
    <SplitCodeView
      leftHeader="Python"
      leftLanguage="python"
      leftCode={python}
      rightHeader="Schema"
      rightLanguage="graphql"
      rightCode={schema}
    />
  );
};
