import httpx
import fastapi
from strawberry.fastapi import GraphQLRouter
import js
from pyodide.ffi import to_js

app = fastapi.FastAPI()

# {{ schema }}
# {{ variables }}
# {{ query }}


async def context_getter():
    return {}


router = GraphQLRouter(schema, path="/", context_getter=context_getter)

app.include_router(router, prefix="")


async def handle_request():
    async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.post("/", json={"query": query, "variables": variables})

    return response.json(), response.status_code, response.headers.items()


result = await handle_request()

result = {
    "data": result[0],
    "status_code": result[1],
    "headers": dict(result[2]),
}


to_js(result, dict_converter=js.Object.fromEntries)
