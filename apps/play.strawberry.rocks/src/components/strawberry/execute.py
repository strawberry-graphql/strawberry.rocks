import fastapi
import js
from httpx import ASGITransport, AsyncClient
from pyodide.ffi import to_js
from strawberry.fastapi import GraphQLRouter

app = fastapi.FastAPI()

# {{ schema }}
# {{ variables }}
# {{ query }}


async def _context_getter():
    try:
        return await context_getter()
    except NameError:
        pass

    return {}


router = GraphQLRouter(schema, path="/", context_getter=_context_getter)

app.include_router(router, prefix="")


async def handle_request():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost") as client:
        response = await client.post("/", json={"query": query, "variables": variables})

    return response.json(), response.status_code, response.headers.items()


result = await handle_request()

result = {
    "data": result[0],
    "status_code": result[1],
    "headers": dict(result[2]),
    "schema": str(schema),
}


to_js(result, dict_converter=js.Object.fromEntries)
