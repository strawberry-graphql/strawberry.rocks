module.exports = {
  pageExtensions: ["js", "jsx", "tsx"],
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
