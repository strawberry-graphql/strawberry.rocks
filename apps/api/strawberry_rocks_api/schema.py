import json
import logging
from typing import Any

import httpx
import strawberry
from strawberry.scalars import JSON

from .config import optional_setting, setting

logger = logging.getLogger(__name__)

# Gists are created by this account, and only its gists can be read back
GIST_OWNER = "botberry"

GIST_FILES = {
    "query": "query.graphql",
    "schema": "schema.py",
    "variables": "variables.json",
    "requirements": "requirements.txt",
}


def create_client(**kwargs: Any) -> httpx.AsyncClient:
    """Replaced in tests, so no real requests are made"""
    return httpx.AsyncClient(timeout=10, **kwargs)


def github_client(token: str | None) -> httpx.AsyncClient:
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    # Gists can be read without a token, but with a much lower rate limit
    if token:
        headers["Authorization"] = f"Bearer {token}"

    return create_client(base_url="https://api.github.com", headers=headers)


@strawberry.type
class Gist:
    id: strawberry.ID
    query: str
    schema: str
    variables: JSON
    requirements: str


@strawberry.input
class SendFeedbackInput:
    sentiment: str
    feedback: str
    url: str


@strawberry.input
class CreateGistInput:
    query: str
    schema: str
    variables: JSON
    requirements: str


@strawberry.type
class Query:
    @strawberry.field
    async def gist(self, id: strawberry.ID) -> Gist | None:
        async with github_client(optional_setting("GIST_TOKEN")) as client:
            response = await client.get(f"/gists/{id}")

        if response.status_code != 200:
            return None

        data = response.json()

        if data["owner"]["login"] != GIST_OWNER:
            return None

        try:
            files = {
                field: data["files"][filename]["content"]
                for field, filename in GIST_FILES.items()
            }
        except KeyError:
            # Not a playground gist
            return None

        return Gist(
            id=id,
            query=files["query"],
            schema=files["schema"],
            variables=json.loads(files["variables"]),
            requirements=files["requirements"],
        )

    @strawberry.field
    def hello(self) -> str:
        return "Hello 🍓"


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def send_feedback(self, input: SendFeedbackInput) -> bool:
        payload = {
            "content": f"New feedback received on {input.url}",
            "embeds": [
                {
                    "title": f"Sentiment: {input.sentiment}",
                    "description": input.feedback,
                    "url": input.url,
                    "color": 5814783,
                }
            ],
        }

        async with create_client() as client:
            response = await client.post(setting("WEBHOOK_URL"), json=payload)

        if not response.is_success:
            logger.error("Webhook failed: %s %s", response.status_code, response.text)
            raise Exception("Could not send the feedback")

        return True

    @strawberry.mutation
    async def create_gist(self, input: CreateGistInput) -> Gist:
        async with github_client(setting("GIST_TOKEN")) as client:
            response = await client.post(
                "/gists",
                json={
                    "description": "https://play.strawberry.rocks",
                    "public": False,
                    "files": {
                        GIST_FILES["query"]: {"content": input.query},
                        GIST_FILES["schema"]: {"content": input.schema},
                        GIST_FILES["variables"]: {
                            "content": json.dumps(input.variables)
                        },
                        GIST_FILES["requirements"]: {"content": input.requirements},
                    },
                },
            )

        if response.status_code != 201:
            logger.error(
                "Creating a gist failed: %s %s", response.status_code, response.text
            )
            raise Exception("Could not create the gist")

        return Gist(
            id=response.json()["id"],
            query=input.query,
            schema=input.schema,
            variables=input.variables,
            requirements=input.requirements,
        )


schema = strawberry.Schema(query=Query, mutation=Mutation)
