module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "tsx"],
  images: {
    domains: ["strawberry.rock", "github.com"],
  },
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/3uQ2PaY",
        permanent: true,
      },
    ];
  },
};
