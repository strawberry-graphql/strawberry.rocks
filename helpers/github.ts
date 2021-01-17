import GitHub from "github-base";

export const getGithub = () =>
  new GitHub({
    token: process.env.GITHUB_TOKEN,
  });
