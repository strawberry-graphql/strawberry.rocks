import GitHub from "github-base";

// TODO: remove once slug page is refactored to use new api.ts.
export const getGithub = () =>
  new GitHub({
    token: process.env.GITHUB_TOKEN,
  });
