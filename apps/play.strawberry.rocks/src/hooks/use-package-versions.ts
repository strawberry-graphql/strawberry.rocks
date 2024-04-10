import semverSort from "semver-sort";
import useSWR from "swr";

const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

export const usePackageVersions = (packageName: string) => {
  const { data } = useSWR(
    `https://pypi.org/pypi/${packageName}/json`,
    fetcher,
    { suspense: true }
  );

  const versions = Object.keys(data?.releases || {});

  return semverSort.desc(versions) as string[];
};
