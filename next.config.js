/**
 * @type {import('next').NextConfig}
 */

const { join } = require("path");
const { symlink, access } = require("fs/promises");

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
  webpack: (config, { isServer }) => {
    config.experiments = Object.assign(config.experiments || {}, {
      asyncWebAssembly: true,
    });

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // TODO: cleanup -> track https://github.com/vercel/next.js/issues/25852
    if (isServer) {
      config.output.webassemblyModuleFilename =
        "./../static/wasm/[modulehash].wasm";
    } else {
      config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    }

    config.plugins.push(
      new (class {
        apply(compiler) {
          compiler.hooks.afterEmit.tapPromise(
            "SymlinkWebpackPlugin",
            async (compiler) => {
              if (isServer) {
                const from = join(compiler.options.output.path, "../static");
                const to = join(compiler.options.output.path, "static");

                try {
                  await access(from);
                  console.log(`${from} already exists`);
                  return;
                } catch (error) {
                  if (error.code === "ENOENT") {
                    // No link exists
                  } else {
                    throw error;
                  }
                }

                await symlink(to, from, "junction");
                console.log(`created symlink ${from} -> ${to}`);
              }
            }
          );
        }
      })()
    );

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
