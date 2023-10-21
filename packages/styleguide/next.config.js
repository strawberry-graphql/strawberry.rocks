/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["shiki", "vscode-oniguruma"],
  },
};

module.exports = nextConfig;
