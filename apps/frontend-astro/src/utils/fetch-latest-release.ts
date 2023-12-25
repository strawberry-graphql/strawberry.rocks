const OWNER = "strawberry-graphql";
const REPO = "strawberry";

export const fetchLatestRelease = async (): Promise<{
  href: string;
  name: string;
}> => {
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`,
  );

  if (!response.ok) {
    throw new Error(
      `fetchLatestRelease: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  return {
    href: data.html_url as string,
    name: data.tag_name as string,
  };
};
