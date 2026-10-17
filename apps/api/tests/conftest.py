import json

import httpx
import pytest

from strawberry_rocks_api import schema as schema_module


class FakeServers:
    """Stands in for GitHub and the feedback webhook"""

    def __init__(self) -> None:
        self.requests: list[httpx.Request] = []
        self.gists: dict[str, dict] = {}
        self.fail = False

    def handle(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)

        if self.fail:
            return httpx.Response(500, json={"message": "Server Error"})

        if request.url.host == "webhook.example.com":
            return httpx.Response(204)

        if request.method == "POST" and request.url.path == "/gists":
            id = f"gist{len(self.gists) + 1}"
            self.gists[id] = {
                "id": id,
                "owner": {"login": "botberry"},
                "files": json.loads(request.content)["files"],
            }

            return httpx.Response(201, json=self.gists[id])

        id = request.url.path.removeprefix("/gists/")

        if request.method == "GET" and id in self.gists:
            return httpx.Response(200, json=self.gists[id])

        return httpx.Response(404, json={"message": "Not Found"})


@pytest.fixture
def servers(monkeypatch: pytest.MonkeyPatch) -> FakeServers:
    servers = FakeServers()

    monkeypatch.setenv("GIST_TOKEN", "test-token")
    monkeypatch.setenv("WEBHOOK_URL", "https://webhook.example.com/hook")
    monkeypatch.setattr(
        schema_module,
        "create_client",
        lambda **kwargs: httpx.AsyncClient(
            transport=httpx.MockTransport(servers.handle), **kwargs
        ),
    )

    return servers


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"
