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
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    const experiments = config.experiments || {};
    config.experiments = { ...experiments, asyncWebAssembly: true };
    config.output.assetModuleFilename = "static/[hash][ext]";
    config.output.publicPath = "/_next/";
    config.module.rules.push({
      test: /\.wasm/,
      type: "webassembly/async",
    });
    return config;
  },
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
    ];
  },
};

module.exports = nextConfig;
