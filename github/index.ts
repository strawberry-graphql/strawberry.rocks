import fetch from "isomorphic-unfetch";

const ENDPOINT = "https://api.github.com/graphql";

export async function githubQuery(
  query: string,
  variables: { [key: string]: string } = {}
) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("`GITHUB_TOKEN` is missing from the `.env` file");
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status !== 200) {
    // eslint-disable-next-line
    console.error(await response.text());
    throw new Error("Request failed");
  }

  const { data } = await response.json();
  return data;
}
