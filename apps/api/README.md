# strawberry.rocks API

The GraphQL API behind [strawberry.rocks](https://strawberry.rocks) and
[play.strawberry.rocks](https://play.strawberry.rocks), served at
`https://api.strawberry.rocks/graphql`. It's a Strawberry app on Starlette:

- `gist` and `createGist` read and create the playground's share links. Each
  link is a secret GitHub gist owned by
  [botberry](https://github.com/botberry), with `schema.py`, `query.graphql`,
  `variables.json` and `requirements.txt` files.
- `sendFeedback` posts the feedback from the docs pages to a Discord webhook.

## Running it locally

```shell
uv run uvicorn main:app --reload
```

GraphiQL is then at http://localhost:8000/graphql. Without any settings, share
links can be read but not created, and feedback can't be sent.

```shell
uv run pytest
```

The tests don't call GitHub or Discord.

## Settings

| Environment variable | Used for                                                                              |
| -------------------- | ------------------------------------------------------------------------------------- |
| `GIST_TOKEN`         | Creating gists. A fine-grained token of botberry with read and write access to gists. |
| `WEBHOOK_URL`        | Sending feedback. A Discord webhook URL.                                              |

Reading gists uses `GIST_TOKEN` when it's set, for GitHub's higher rate limit.

## Deployment

The API is deployed on Vercel as its own project, with `apps/api` as the root
directory. Vercel loads `app` from `main.py` (see `tool.vercel` in
`pyproject.toml`) and installs the dependencies from `uv.lock`.

The origins that can call the API from a browser are listed in `main.py`.
