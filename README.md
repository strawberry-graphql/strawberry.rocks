# Strawberry GraphQL website

This is the repo for [Strawberry GraphQL](https://strawberry.rocks). If you want
to edit the documentation head to the
[main repository](https://github.com/strawberry-graphql/strawberry).

This repo only contains the template and design of the website.

## How to setup the project

Make sure to have `nodejs 12.18.0` (exact version shouldn't matter too much, you
can use [asdf](https://github.com/asdf-vm/asdf) to install it, in case).

You also need a GitHub token, this is used to fetch the list of contributors for
the repo, you can create one with the following scopes
`public_repo, read:packages, read:user, repo:status`, following
[this guide](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)
or by clicking
[this link](https://github.com/settings/tokens/new?description=Strawberry%20Docs&scopes=repo:status,public_repo,read:user,repo:status,read:packages)
directly (notice it will ask you for a password).

The token needs to be stored in a `.env` file, like this:

```env
GITHUB_TOKEN=123123123
```

### Installing the dependencies

We are using npm to manage dependencies, so can install the dependencies by
running

```sh
npm install
```

### Configuration

If you want to test a documentation change, you can change the repo where we
fetch the documentation from by specifying `DOCS_GIT_REMOTE` and
`DOCS_GIT_BRANCH` in your `.env` file. For example:

```env
DOCS_GIT_REMOTE=https://github.com/strawberry-graphql/strawberry.git
DOCS_GIT_BRANCH=test-branch
```

### Running the website

To run the website, you can use npm:

```sh
npm run dev
```

This should start the server on [http://localhost:3000](http://localhost:3000)

### Debugging 

To run the website in debug mode:

```sh
npm run dev:inspect
```

See next.js docs on the different ways to [connect to the debugger](https://nextjs.org/docs/advanced-features/debugging#step-2-connect-to-the-debugger).