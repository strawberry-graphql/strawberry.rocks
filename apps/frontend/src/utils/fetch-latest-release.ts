import { githubFetch } from "./github-fetch";

const OWNER = "strawberry-graphql";
const REPO = "strawberry";

export const fetchLatestRelease = async (): Promise<{
  href: string;
  name: string;
}> => {
  const response = await githubFetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`,
    { method: "GET" }
  );

  const data = await response.json();

  return {
    href: data.html_url as string,
    name: data.tag_name as string,
  };
};
