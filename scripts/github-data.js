/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const fetch = require("isomorphic-unfetch");

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

async function main() {
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

  fs.writeFileSync(
    path.join(__dirname, "../", "github-data.json"),
    JSON.stringify(data)
  );
}

main();
