import { useSuspenseQuery } from "@tanstack/react-query";
// @ts-expect-error semver-sort has no type declarations
import semverSort from "semver-sort";

export const usePackageVersions = (packageName: string) => {
  const { data: versions } = useSuspenseQuery({
    queryKey: ["package-versions", packageName],
    queryFn: async () => {
      const response = await fetch(`https://pypi.org/pypi/${packageName}/json`);
      const data: { releases: Record<string, unknown> } = await response.json();

      return semverSort.desc(Object.keys(data.releases)) as string[];
    },
    staleTime: Infinity,
  });

  return versions;
};
