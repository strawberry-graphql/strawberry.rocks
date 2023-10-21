export type AlgoliaDocsResult = {
  objectID: string;
  url: string;
  hierarchy: {
    // usually "Documentation"
    lvl0: string;
    lvl1: string;
    lvl2: string;
  };
};

export type DocResult = {
  name: string;
  id: string;
  url: string;
  html: string;
};
