# Strawberry GraphQL website

This is the repo for [Strawberry GraphQL](https://strawberry.rocks). If you want
to edit the documentation head to the
[main repository](https://github.com/strawberry-graphql/strawberry).

This repo only contains the template and design of the website.

## Docs

**This shows the latest released version and not the master branch docs.**

#### `https://strawberry.rocks/docs`

Shows the latest
[release](https://github.com/strawberry-graphql/strawberry/releases) from
[Strawberry Graphql Repo]. These pages are rendered at build time and
revalidated after 60 seconds. When a new release of Strawberry Graphql is done
then the site should update [Strawberry GraphQL](https://strawberry.rocks) site
by itself. Not requiring a re-deployment.

### Pull Requests

#### `https://strawberry.rocks/docs/pr/:pull-request-number`

Pull requests on [Strawberry Graphql Repo] with a label of
[ok-to-preview](https://github.com/strawberry-graphql/strawberry/pulls?q=is%3Apr+is%3Aopen+label%3Aok-to-preview)
can be viewed. Theses are rendered on-demand and cached. They will be
revalidated after 60 seconds.

### Version Releases

#### `https://strawberry.rocks/docs/tag/:release-tag`

[Releases](https://github.com/strawberry-graphql/strawberry/releases) of
Strawberry Graphql can be viewed. Theses are rendered on-demand and cached. But
are not revalidated on the server unless a new deployment is done.

## How to setup the project

Make sure to have `nodejs 14.16.0` (exact version shouldn't matter too much, you
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
/* GraphQL */ `query GoesHere {}`;
```

### Debugging

To run the website in debug mode:

```sh
npm run dev:inspect
```

See next.js docs on the different ways to
[connect to the debugger](https://nextjs.org/docs/advanced-features/debugging#step-2-connect-to-the-debugger).

[strawberry graphql repo]: https://github.com/strawberry-graphql/strawberry/

---

Powered by
<svg className="inline-block h-4 ml-1" viewBox="0 0 4438 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2223.75 250C2051.25 250 1926.87 362.5 1926.87 531.25C1926.87 700
2066.72 812.5 2239.38 812.5C2343.59 812.5 2435.47 771.25 2492.34 701.719L2372.81
632.656C2341.25 667.188 2293.28 687.344 2239.38 687.344C2164.53 687.344 2100.94
648.281 2077.34 585.781H2515.16C2518.59 568.281 2520.63 550.156 2520.63
531.094C2520.63 362.5 2396.41 250 2223.75 250ZM2076.09 476.562C2095.62 414.219
2149.06 375 2223.75 375C2298.59 375 2352.03 414.219 2371.41
476.562H2076.09ZM2040.78 78.125L1607.81 828.125L1174.69 78.125H1337.03L1607.66
546.875L1878.28 78.125H2040.78ZM577.344 0L1154.69 1000H0L577.344 0ZM3148.75
531.25C3148.75 625 3210 687.5 3305 687.5C3369.38 687.5 3417.66 658.281 3442.5
610.625L3562.5 679.844C3512.81 762.656 3419.69 812.5 3305 812.5C3132.34 812.5
3008.13 700 3008.13 531.25C3008.13 362.5 3132.5 250 3305 250C3419.69 250 3512.66
299.844 3562.5 382.656L3442.5 451.875C3417.66 404.219 3369.38 375 3305
375C3210.16 375 3148.75 437.5 3148.75 531.25ZM4437.5
78.125V796.875H4296.88V78.125H4437.5ZM3906.25 250C3733.75 250 3609.38 362.5
3609.38 531.25C3609.38 700 3749.38 812.5 3921.88 812.5C4026.09 812.5 4117.97
771.25 4174.84 701.719L4055.31 632.656C4023.75 667.188 3975.78 687.344 3921.88
687.344C3847.03 687.344 3783.44 648.281 3759.84 585.781H4197.66C4201.09 568.281
4203.12 550.156 4203.12 531.094C4203.12 362.5 4078.91 250 3906.25 250ZM3758.59
476.562C3778.13 414.219 3831.41 375 3906.25 375C3981.09 375 4034.53 414.219
4053.91 476.562H3758.59ZM2961.25 265.625V417.031C2945.63 412.5 2929.06 409.375
2911.25 409.375C2820.47 409.375 2755 471.875 2755
565.625V796.875H2614.38V265.625H2755V409.375C2755 330 2847.34 265.625 2961.25
265.625Z" fill="white"/></svg>
