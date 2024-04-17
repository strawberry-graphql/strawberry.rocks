import { useMemo } from "react";
// @ts-ignore
import semverSort from "semver-sort";
import useSWR from "swr";

// @ts-ignore
const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

export const usePackageVersions = (packageName: string) => {
  const { data } = useSWR(
    `https://pypi.org/pypi/${packageName}/json`,
    fetcher,
    { suspense: true }
  );

  const versions = useMemo(() => {
    const v = Object.keys(data?.releases || {});
    return semverSort.desc(v) as string[];
  }, [data]);

  return versions;
};
