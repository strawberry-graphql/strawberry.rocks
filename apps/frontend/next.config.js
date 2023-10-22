/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "tsx"],
  images: {
    domains: ["strawberry.rocks", "github.com"],
  },
  transpilePackages: ["@strawberry-graphql/styleguide"],
  async rewrites() {
    return [
      {
        source: "/js/script.js",
        destination: "https://plausible.io/js/plausible.js",
      },
      {
        source: "/api/event",
        destination: "https://plausible.io/api/event",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/3uQ2PaY",
        permanent: true,
      },
      {
        source: "/changelog",
        destination:
          "https://github.com/strawberry-graphql/strawberry/blob/main/CHANGELOG.md",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
