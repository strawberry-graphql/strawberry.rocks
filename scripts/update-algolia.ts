import algoliasearch from "algoliasearch";

import docs from "../data/docs-nav.json";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_PRIVATE_API_KEY
);
const index = client.initIndex("docs");

const pages = docs.sections.flatMap(({ title, pages }) =>
  pages.map((page) => ({
    sectionTitle: title,
    ...page,
  }))
);

index
  .saveObjects(pages, {
    autoGenerateObjectIDIfNotExist: true,
  })
  .then(({ objectIDs }) => {
    console.log(objectIDs);
  });
