import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";
import type { Configuration } from "webpack";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "./addon-darkmode/register",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },

  staticDirs: [
    {
      from: "../src/fonts",
      to: "/fonts",
    },
    "../public",
  ],

  webpackFinal: async (config: Configuration) => {
    config.module!.rules!.push({
      test: /\.css$/i,
      use: [
        {
          loader: "postcss-loader",
          options: { implementation: require.resolve("postcss") },
        },
      ],
      include: path.resolve(__dirname, "../"),
    });
    // Return the altered config
    return config;
  },
};

export default config;
