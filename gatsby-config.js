// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: `.env`,
});

let plugins = [];

if (process.env.DOCS_LOCAL_LOCATION) {
  // If a local directory for the docs has been defined then use it
  plugins.push({
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `strawberry-repo`,
      path: process.env.DOCS_LOCAL_LOCATION,
    },
  });
} else {
  // Otherwise get the docs from github
  plugins.push({
    resolve: `gatsby-source-git`,
    options: {
      name: `strawberry-repo`,
      remote:
        process.env.DOCS_GIT_REMOTE ||
        `https://github.com/strawberry-graphql/strawberry.git`,
      branch: process.env.DOCS_GIT_BRANCH || `master`,
      patterns: `docs/**`,
    },
  });
}

plugins = plugins.concat([
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `home`,
      path: `${__dirname}/content/home/`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `acknowledgements`,
      path: `${__dirname}/content/acknowledgements/`,
    },
  },
  {
    resolve: "gatsby-plugin-codegen",
    options: {},
  },
  "gatsby-plugin-theme-ui",
  "gatsby-theme-style-guide",
  {
    resolve: `gatsby-plugin-google-fonts`,
    options: {
      fonts: [`karla\:,400,400i,700`],
      display: "swap",
    },
  },
  {
    resolve: `gatsby-plugin-mdx`,
    options: {
      extensions: [`.mdx`, `.md`],
      gatsbyRemarkPlugins: [`gatsby-remark-autolink-headers`],
      plugins: [
        {
          resolve: `gatsby-remark-prismjs`,
          options: {
            classPrefix: "language-",
            aliases: { py: "python" },
            noInlineHighlight: false,
          },
        },
        {
          resolve: `gatsby-remark-images`,
          options: {
            maxWidth: 500,
          },
        },
        {
          resolve: `gatsby-remark-external-links`,
          options: {
            target: `_blank`,
            rel: `nofollow noopener noreferrer`,
          },
        },
        `gatsby-remark-responsive-iframe`,
      ],
    },
  },
  {
    resolve: "gatsby-source-graphql",
    options: {
      typeName: "GITHUB",
      fieldName: "github",
      url: "https://api.github.com/graphql",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    },
  },
  {
    resolve: `gatsby-source-github-contributors`,
    options: {
      repo: "strawberry-graphql/strawberry",
      token: process.env.GITHUB_TOKEN,
    },
  },
  `gatsby-plugin-typescript`,
  `gatsby-plugin-react-helmet`,
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,
  {
    resolve: `gatsby-plugin-favicon`,
    options: {
      logo: "./static/logo.png",

      // WebApp Manifest Configuration
      appName: "Strawberry GraphQL", // Inferred with your package.json
      appDescription: "A Python GraphQL Library",
      developerName: null,
      developerURL: null,
      dir: "auto",
      lang: "en-GB",
      background: "#fff",
      theme_color: "#fff",
      display: "standalone",
      orientation: "any",
      start_url: "/?homescreen=1",
      version: "1.0",

      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    },
  },
]);

module.exports = {
  siteMetadata: {
    title: `🍓 Strawberry GraphQL`,
    description: `Strawberry is Python library to build GraphQL APIs, built on top of dataclasses`,
    author: `patrick91`,
  },
  plugins,
};
