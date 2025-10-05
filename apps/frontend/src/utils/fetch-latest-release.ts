// Temporary fake data for latest release
export const fetchLatestRelease = async (): Promise<{
  href: string;
  name: string;
}> => {
  return {
    href: "https://github.com/strawberry-graphql/strawberry/releases/latest",
    name: "0.240.0",
  };
};
