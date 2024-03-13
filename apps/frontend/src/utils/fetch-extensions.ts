import { githubFetch } from "./github-fetch";
import matter from "gray-matter";
const FetchTreeDocument = /* GraphQL */ `
  query extensionsPage($owner: String!, $name: String!, $expression: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: $expression) {
        __typename
        ... on Tree {
          __typename
          entries {
            __typename
            name
            path
            type
            object {
              ... on Blob {
                __typename
                text
              }
            }
          }
        }
      }
    }
  }
`;

const getExtension = (path: string, text: string) => {
  const { data } = matter(text);

  return {
    href: `/docs/extensions/${path.replace(".md", "")}`,
    title: data.title,
    summary: data.summary,
    tags: data.tags.split(","),
  } as {
    href: string;
    title: string;
    summary: string;
    tags: string[];
  };
};

export const fetchExtensions = async ({
  prNumber,
  repo = "strawberry-graphql/strawberry",
}: {
  prNumber?: string;
  repo?: string;
} = {}) => {
  const prefix = "main";

  const [owner, name] = repo.split("/");

  const filename = "docs/extensions";

  let expression = `${prefix}:${filename}`;

  if (prNumber) {
    expression = `pull/${prNumber}/head:${filename}`;
  }

  const response = await githubFetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: FetchTreeDocument,
      variables: { expression, owner, name },
    }),
  });

  const source = await response.json();

  const { data, errors } = source;

  if (errors) {
    throw new Error(errors[0].message);
  }

  if (!data || !data.repository.object) {
    console.log(filename, data);

    throw new Error("No data returned");
  }

  const extensions = data.repository.object.entries.filter(
    (entry: any) => !entry.name.startsWith("_"),
  );

  return extensions.map((extension: any) =>
    getExtension(extension.name, extension.object.text),
  ) as ReturnType<typeof getExtension>[];
};
