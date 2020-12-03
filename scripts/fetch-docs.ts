import { promises as fs } from "fs";
import fetch from "node-fetch";

const url =
  "https://api.github.com/repos/strawberry-graphql/strawberry/git/trees/master?recursive=1";

const OUTPUT_PATH = __dirname + "/../data/docs-tree.json";

const getDocs = async () => {
  const response = await fetch(url).then((x) => x.json());

  const docs = response.tree.filter(
    (file) => file.path.startsWith("docs/") && file.path.endsWith(".md")
  );

  return docs;
};
const getDefaultSlug = (path: string) =>
  path
    .replace(/^docs\//, "")
    .replace(/\.md$/, "")
    .replace(/\d+_/g, "");

const invertObject = (o: { [path: string]: string }) =>
  Object.fromEntries(Object.entries(o).map(([a, b]) => [b, a]));

const updateTree = (
  tree: { [path: string]: string },
  docs: { path: string }[]
) => {
  // for every document path we check if we already have an entry in our tree
  // if not, we add a new one

  docs.forEach(({ path }) => {
    tree[path] = tree[path] || getDefaultSlug(path);
  });
};

const getExistingTree = async () => {
  // our docs tree is stored as slug -> path, so we want to invert it

  let tree: { [path: string]: string };
  try {
    tree = JSON.parse(
      // @ts-ignore JSON.parse accepts a buffer in node
      await fs.readFile(OUTPUT_PATH)
    );
  } catch {
    tree = {};
  }

  return invertObject(tree);
};

const process = async () => {
  const existingTree = await getExistingTree();
  const docs = await getDocs();

  updateTree(existingTree, docs);

  const updatedTree = invertObject(existingTree);

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(updatedTree, null, 4));
};

process().then((result) => console.log("All done"));
