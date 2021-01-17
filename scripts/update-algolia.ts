import algoliasearch from "algoliasearch";

const docs = { sections: [] };

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_PRIVATE_API_KEY
);
const index = client.initIndex("docs");

index.setSettings({
  distinct: true,
  attributeForDistinct: "sectionTitle",
});

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
