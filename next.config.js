/* eslint-disable @typescript-eslint/no-var-requires */

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
  })
);
