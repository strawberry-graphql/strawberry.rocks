import { AlgoliaDocsResult, DocResult } from "./types";
import { useHits } from "react-instantsearch-hooks-web";

export const useGroupedResults = () => {
  const { hits } = useHits<AlgoliaDocsResult>();

  const groups: {
    name: string;
    results: DocResult[];
  }[] = [];

  hits.forEach((hit) => {
    const groupName = hit.hierarchy.lvl1;

    let hitName = hit.hierarchy.lvl2;
    // @ts-ignore
    let html = hit._highlightResult?.hierarchy.lvl2?.value;

    if (!hitName) {
      hitName = hit.hierarchy.lvl1;

      // @ts-ignore
      html = hit._highlightResult?.hierarchy?.lvl1?.value;
    }

    if (!html && !hitName) {
      // TODO: maybe we should report these
      return;
    }

    html = (html || hitName) + " " + hit.url;

    const result = {
      name: hitName,
      id: hit.objectID,
      url: hit.url,
      html,
    };

    const group = groups.find((group) => group.name === groupName);

    if (group) {
      group.results.push(result);
    } else {
      groups.push({
        name: groupName,
        results: [result],
      });
    }
  });

  // remove duplicates by URL

  groups.forEach((group) => {
    const seen = new Set();

    group.results = group.results.filter((result) => {
      const duplicate = seen.has(result.url);
      seen.add(result.url);
      return !duplicate;
    });
  });

  return { groups };
};
