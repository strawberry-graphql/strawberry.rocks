export type EditorState = {
  code: string;
  query: string;
  variables: string;
  /** Request headers, as a JSON object */
  headers: string;
};
