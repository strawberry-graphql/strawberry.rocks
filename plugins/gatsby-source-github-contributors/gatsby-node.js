const util = require("util");
const contributors = require("github-contributors");
const fetch = require("node-fetch");
const fetchContributors = util.promisify(contributors);
const camelcaseKeys = require("camelcase-keys");

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const token = process.env.GITHUB_TOKEN;

  const data = await fetchContributors("strawberry-graphql/strawberry", {
    token,
  });

  const allUrls = data.map(node => node.url);

  const profiles = await Promise.all(
    allUrls.map(url =>
      fetch(url, { headers: { Authorization: `token ${token}` } }).then(x =>
        x.json()
      )
    )
  );

  const loginToProfile = Object.fromEntries(
    profiles.map(profile => [profile.login, profile])
  );

  data.forEach(node => {
    const profile = loginToProfile[node.login];

    return actions.createNode({
      ...camelcaseKeys(node),
      name: profile.name,
      url: profile.blog || profile.html_url,
      id: createNodeId(node.id),
      internal: {
        type: "GitHubContributor",
        contentDigest: createContentDigest(node.id),
      },
    });
  });
};
