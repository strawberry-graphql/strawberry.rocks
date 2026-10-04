import { githubFetch } from "./github-fetch";

const OWNER = "strawberry-graphql";
const REPO = "strawberry";
const RELEASE_CACHE_MS = 60_000;

let latestReleaseRequest: ReturnType<typeof requestLatestRelease> | undefined;
let latestReleaseExpiresAt = 0;

const requestLatestRelease = async (): Promise<{
  href: string;
  name: string;
}> => {
  if (process.env.LOCAL === "true") {
    return { href: "#", name: "999" };
  }

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

export const fetchLatestRelease = () => {
  if (!latestReleaseRequest || Date.now() >= latestReleaseExpiresAt) {
    latestReleaseExpiresAt = Infinity;

    latestReleaseRequest = requestLatestRelease().then(
      (release) => {
        latestReleaseExpiresAt = Date.now() + RELEASE_CACHE_MS;

        return release;
      },
      (error) => {
        latestReleaseRequest = undefined;
        latestReleaseExpiresAt = 0;

        throw error;
      }
    );
  }

  return latestReleaseRequest;
};
