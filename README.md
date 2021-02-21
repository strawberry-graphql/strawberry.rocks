# Strawberry GraphQL website

This is the repo for [Strawberry GraphQL](https://strawberry.rocks). If you want
to edit the documentation head to the
[main repository](https://github.com/strawberry-graphql/strawberry).

This repo only contains the template and design of the website.

## Docs

**This shows the latest released version and not the master branch docs.**
#### `https://strawberry.rocks/docs`

Shows the latest [release](https://github.com/strawberry-graphql/strawberry/releases) from [Strawberry Graphql Repo]. These pages are rendered at build time and revalidated after 30 seconds. When a new release of Strawberry Graphql is done then the site should update [Strawberry GraphQL](https://strawberry.rocks) site by itself. Not requiring a re-deployment. 

### Pull Requests

#### `https://strawberry.rocks/docs/pr/:pull-request-number`

Pull requests on [Strawberry Graphql Repo] with a label of [ok-to-preview](https://github.com/strawberry-graphql/strawberry/pulls?q=is%3Apr+is%3Aopen+label%3Aok-to-preview) can be viewed. Theses are rendered on-demand and cached. They will be revalidated after 30 seconds.

### Version Releases

#### `https://strawberry.rocks/docs/tag/:release-tag`

[Releases](https://github.com/strawberry-graphql/strawberry/releases) of Strawberry Graphql can be viewed. Theses are rendered on-demand and cached. But are not revalidated on the server unless a new deployment is done.

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

### Running the website

To run the website, you can use npm:

```sh
npm run dev
```

This should start the server on [http://localhost:3000](http://localhost:3000)

### GraphQL TypeScript Typings

We generate the TypeScript typings for any GraphQL queries using. 
- [@octokit/graphql-schema](https://github.com/octokit/graphql-schema)
- [GraphQL Code Generator](https://graphql-code-generator.com/)

Outputted to [`./types/graphql.d.ts`](./types/graphql.d.ts)

To update them run.

```sh
npm run codegen
```

Any new GraphQL query will need a comment before it to generate theses typings.
```ts
/* GraphQL */ `query GoesHere {}`
```

### Debugging 

To run the website in debug mode:

```sh
npm run dev:inspect
```

See next.js docs on the different ways to [connect to the debugger](https://nextjs.org/docs/advanced-features/debugging#step-2-connect-to-the-debugger).


[Strawberry Graphql Repo]: https://github.com/strawberry-graphql/strawberry/