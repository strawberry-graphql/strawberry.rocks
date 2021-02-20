const withTM = require("next-transpile-modules")(["react-use-mailchimp"]);
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

module.exports = withTM(
  withMDX({
    pageExtensions: ["js", "jsx", "tsx", "md", "mdx"],
    async redirects() {
      return [
        {
          source: "/discord",
          destination: "https://discord.gg/3uQ2PaY",
          permanent: true,
        },
      ];
    },
    images: {
      domains: ["github.com", "raw.githubusercontent.com"],
    },
  })
);
