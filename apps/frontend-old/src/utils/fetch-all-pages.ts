export const fetchAllPages = async () => {
  const url = `https://api.github.com/repos/strawberry-graphql/strawberry/git/trees/main?recursive=1`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3.raw",
      Authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
    },
  });

  const data = await response.json();

  const docs = data.tree.filter(
    (item: any) => item.path.startsWith("docs/") && item.path.endsWith(".md")
  );

  return docs.map((item: any) => item.path) as string[];
};
