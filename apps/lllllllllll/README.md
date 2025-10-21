# strawberry.rocks

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Fetching Documentation and Data

To fetch the latest documentation from strawberry and strawberry-django repositories, along with sponsors, downloads, and other data, run:

```bash
./fetch-data.py
```

This script will:

- Clone and process docs from strawberry-graphql/strawberry and strawberry-graphql/strawberry-django
- Fetch sponsors from GitHub and OpenCollective
- Fetch download statistics from ClickHouse
- Fetch latest release info from GitHub
- Fetch contributors for all documentation files
- Save all data to the `data/` directory

**Requirements:**

- Python 3.11+ with `uv` installed
- Environment variables (create a `.env` file):
  - `GITHUB_TOKEN` - GitHub personal access token
  - `OPENCOLLECTIVE_TOKEN` - OpenCollective API token
  - `CLICKHOUSE_HOST` (optional) - ClickHouse host URL
  - `CLICKHOUSE_USERNAME` (optional) - ClickHouse username

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
