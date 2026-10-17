import pytest
from starlette.testclient import TestClient

from main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_graphql_endpoint(client):
    response = client.post("/graphql", json={"query": "{ hello }"})

    assert response.status_code == 200
    assert response.json() == {"data": {"hello": "Hello 🍓"}}


@pytest.mark.parametrize(
    "origin",
    [
        "https://strawberry.rocks",
        "https://play.strawberry.rocks",
        "http://localhost:5173",
        "https://play-strawberry-rocks-git-some-branch-strawberry-graphql.vercel.app",
    ],
)
def test_allowed_origins(client, origin):
    response = client.options(
        "/graphql",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.headers["access-control-allow-origin"] == origin


@pytest.mark.parametrize(
    "origin",
    [
        "https://example.com",
        "https://strawberry.rocks.example.com",
        "https://strawberry-graphql.vercel.app.example.com",
    ],
)
def test_other_origins_are_not_allowed(client, origin):
    response = client.options(
        "/graphql",
        headers={"Origin": origin, "Access-Control-Request-Method": "POST"},
    )

    assert "access-control-allow-origin" not in response.headers
