import json

import pytest

from strawberry_rocks_api.schema import schema

pytestmark = pytest.mark.anyio

CREATE_GIST = """
mutation CreateGist($input: CreateGistInput!) {
  createGist(input: $input) { id }
}
"""

GET_GIST = """
query GetGist($id: ID!) {
  gist(id: $id) { id query schema variables requirements }
}
"""

SEND_FEEDBACK = """
mutation SendFeedback($input: SendFeedbackInput!) {
  sendFeedback(input: $input)
}
"""

GIST_INPUT = {
    "query": "{ hello }",
    "schema": "import strawberry",
    "variables": {"name": "Patrick"},
    "requirements": "strawberry-graphql==0.336.0",
}


async def test_created_gists_can_be_read_back(servers):
    created = await schema.execute(CREATE_GIST, {"input": GIST_INPUT})

    assert created.errors is None

    gist_id = created.data["createGist"]["id"]
    result = await schema.execute(GET_GIST, {"id": gist_id})

    assert result.errors is None
    assert result.data["gist"] == {"id": gist_id, **GIST_INPUT}


async def test_gists_are_private_and_authenticated(servers):
    await schema.execute(CREATE_GIST, {"input": GIST_INPUT})

    request = servers.requests[0]

    assert request.headers["Authorization"] == "Bearer test-token"
    assert json.loads(request.content)["public"] is False


async def test_missing_gists_are_null(servers):
    result = await schema.execute(GET_GIST, {"id": "missing"})

    assert result.errors is None
    assert result.data["gist"] is None


async def test_gists_of_other_users_are_null(servers):
    servers.gists["other"] = {
        "id": "other",
        "owner": {"login": "someone-else"},
        "files": {},
    }

    result = await schema.execute(GET_GIST, {"id": "other"})

    assert result.data["gist"] is None


async def test_gists_that_are_not_from_the_playground_are_null(servers):
    servers.gists["notes"] = {
        "id": "notes",
        "owner": {"login": "botberry"},
        "files": {"notes.md": {"content": "# Notes"}},
    }

    result = await schema.execute(GET_GIST, {"id": "notes"})

    assert result.errors is None
    assert result.data["gist"] is None


async def test_gists_can_be_read_without_a_token(servers, monkeypatch):
    created = await schema.execute(CREATE_GIST, {"input": GIST_INPUT})
    monkeypatch.delenv("GIST_TOKEN")

    result = await schema.execute(
        GET_GIST, {"id": created.data["createGist"]["id"]}
    )

    assert result.data["gist"]["query"] == "{ hello }"
    assert "Authorization" not in servers.requests[-1].headers


async def test_failing_to_create_a_gist_is_an_error(servers):
    servers.fail = True

    result = await schema.execute(CREATE_GIST, {"input": GIST_INPUT})

    assert result.errors[0].message == "Could not create the gist"


async def test_missing_token_is_an_error(servers, monkeypatch):
    monkeypatch.delenv("GIST_TOKEN")

    result = await schema.execute(CREATE_GIST, {"input": GIST_INPUT})

    assert result.errors[0].message == "GIST_TOKEN is not set"
    assert servers.requests == []


async def test_feedback_is_sent_to_the_webhook(servers):
    result = await schema.execute(
        SEND_FEEDBACK,
        {
            "input": {
                "sentiment": "happy",
                "feedback": "Nice docs",
                "url": "https://strawberry.rocks/docs",
            }
        },
    )

    assert result.errors is None
    assert result.data["sendFeedback"] is True

    payload = json.loads(servers.requests[0].content)

    assert payload["embeds"][0]["description"] == "Nice docs"


async def test_failing_to_send_feedback_is_an_error(servers):
    servers.fail = True

    result = await schema.execute(
        SEND_FEEDBACK,
        {"input": {"sentiment": "sad", "feedback": "", "url": "https://x"}},
    )

    assert result.errors[0].message == "Could not send the feedback"
