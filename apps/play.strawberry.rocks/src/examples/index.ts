import type { EditorState } from "@/editor-state";

// Each example is a folder with schema.py, query.graphql and variables.json
const files = import.meta.glob<string>("./*/*", {
  query: "?raw",
  import: "default",
  eager: true,
});

const file = (slug: string, name: string) => {
  const content = files[`./${slug}/${name}`];

  if (content === undefined) {
    throw new Error(`Example ${slug} has no ${name}`);
  }

  return content.trimEnd();
};

export type Example = EditorState & {
  slug: string;
  title: string;
  description: string;
};

const example = (slug: string, title: string, description: string) => ({
  slug,
  title,
  description,
  code: file(slug, "schema.py"),
  query: file(slug, "query.graphql"),
  variables: file(slug, "variables.json"),
});

export const EXAMPLES: Example[] = [
  example("hello-world", "Hello world", "The smallest Strawberry schema"),
  example(
    "queries-and-arguments",
    "Queries and arguments",
    "Types, lists, optional fields and arguments"
  ),
  example("mutations", "Mutations", "Changing data with input types"),
  example(
    "enums-interfaces-unions",
    "Enums, interfaces and unions",
    "Types that can be one of many"
  ),
  example(
    "dataloaders",
    "DataLoaders",
    "Batching lookups with a loader per request"
  ),
  example(
    "permissions-and-errors",
    "Permissions and errors",
    "Permission classes and errors in resolvers"
  ),
  example("relay", "Relay", "Nodes, global ids and paginated connections"),
  example("custom-scalars", "Scalars", "Dates, decimals and a custom scalar"),
];

export const DEFAULT_EXAMPLE = EXAMPLES[0];

export const findExample = (slug: string | null) =>
  EXAMPLES.find((example) => example.slug === slug);
