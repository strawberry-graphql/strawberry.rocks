# Strawberry GraphQL website

This is the repo for [https://strawberry.rocks](Strawberry GraphQL). If you want
to edit the documentation head to the
[main repository](https://github.com/strawberry-graphql/strawberry).

This repo only contains the template and design of the website.

## How to setup the project

Make sure to have `nodejs 12.18.0` (exact version shouldn't matter too much, you
can use [asdf](https://github.com/asdf-vm/asdf) to install it, in case).

You also need a GitHub token, this is used to fetch the list of contributors for
the repo, you can create one with the following scopes
`public_repo, read:packages, read:user, repo:status`, by following
[this guide](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).

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
fetch the documentation from in `gatsby-config.js`, find the following object:

```js
{
  resolve: `gatsby-source-git`,
  options: {
    name: `strawberry-repo`,
    remote: `https://github.com/strawberry-graphql/strawberry.git`,
    branch: `master`,
    patterns: `docs/**`,
  },
},
```

and change the remote and branch to point to your repository.

### Running the website

To run the website, you can use npm:

```sh
npm run start
```

This should start the server on [http://localhost:8000](http://localhost:8000)
