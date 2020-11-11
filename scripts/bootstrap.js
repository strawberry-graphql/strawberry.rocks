/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const fetch = require("isomorphic-unfetch");
const globby = require("globby");
const matter = require("gray-matter");

// Fetch static Github data because NextJS doesn't support getStaticProps on a
// custom app.

const query = `
  query {
    repository(owner: "strawberry-graphql", name: "strawberry") {
      url
      releases(last: 1) {
        nodes {
          tagName
        }
      }
    }
  }
`;

async function getGithubData() {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  });

  if (response.status !== 200) {
    // eslint-disable-next-line
    console.error(await response.text());
    throw new Error("Request failed");
  }

  const { data } = await response.json();

  await fs.writeFile(
    path.join(__dirname, "../data/", "github-data.json"),
    JSON.stringify(data)
  );
}

async function getDocMetaData(filePath) {
  const source = await fs.readFile(filePath, "utf8");
  const { data } = matter(source);
  return data;
}

async function getDocData() {
  // Get all doc files and create a map of url paths to content
  const allDocs = (
    await globby(path.posix.join(process.env.DOCS_LOCAL_LOCATION, "/**/*.md"))
  ).filter((filePath) => !filePath.includes("index.md"));

  allDocs.sort();

  // Put index file at the front
  allDocs.unshift(`${process.env.DOCS_LOCAL_LOCATION}/index.md`);

  const sidebar = new Map();
  const routeMap = new Map();

  for (const filePath of allDocs) {
    // Read file contents
    const metadata = await getDocMetaData(filePath);

    // Populate sidebar section
    let section;
    if (filePath.includes("index.md")) {
      section = "docs";
    } else {
      section = filePath
        .replace(path.join(process.env.DOCS_LOCAL_LOCATION, "/"), "")
        .split("/")[0]
        .replace(/^[0-9]+_/, "");
    }
    if (!sidebar.has(section)) {
      sidebar.set(section, []);
    }

    // Remove any trailing slashes
    metadata.path = metadata.path.replace(/\/$/, "");
    sidebar.set(section, sidebar.get(section).concat([metadata]));

    // Populate route map
    routeMap.set(metadata.path, {
      filePath,
    });
  }

  await fs.writeFile(
    path.join(__dirname, "../data", "docs.json"),
    JSON.stringify({
      sidebar: [...sidebar],
      routeMap: [...routeMap],
    })
  );
}

async function main() {
  await getGithubData();
  await getDocData();
}

main();
