import fastapi
import js
import time
import warnings
from httpx import ASGITransport, AsyncClient
from pyodide.ffi import to_js
from strawberry.fastapi import GraphQLRouter
from strawberry.jit import compile_query

app = fastapi.FastAPI()

# {{ schema }}
# {{ variables }}
# {{ query }}
# {{ use_jit }}


async def _context_getter():
    try:
        return await context_getter()
    except NameError:
        pass

    return {}


router = GraphQLRouter(schema, path="/", context_getter=_context_getter)

app.include_router(router, prefix="")


async def handle_request():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        response = await client.post("/", json={"query": query, "variables": variables})

    return response.json(), response.status_code, response.headers.items()


# Execution with timing
jit_source = None
jit_warning = None
standard_time_ms = None
jit_time_ms = None

if use_jit:
    # Compile with JIT
    try:
        compile_start = time.perf_counter()
        with warnings.catch_warnings(record=True) as w:
            warnings.simplefilter("always")
            compiled = compile_query(schema, query)

            # Check for fallback warnings
            if w:
                jit_warning = str(w[0].message)

        compile_time = (time.perf_counter() - compile_start) * 1000

        # Get JIT source if available
        if hasattr(compiled, "_jit_source"):
            jit_source = compiled._jit_source

        # Execute with JIT (compiled function signature is: execute_query(root, context=None, variables=None))
        jit_start = time.perf_counter()
        jit_result = compiled(root=None, context=None, variables=variables)
        jit_time_ms = (time.perf_counter() - jit_start) * 1000

        # Also run standard for comparison
        standard_start = time.perf_counter()
        standard_result = await handle_request()
        standard_time_ms = (time.perf_counter() - standard_start) * 1000

        result = (jit_result, 200, {})
    except Exception as e:
        result = ({"errors": [{"message": f"JIT compilation error: {str(e)}"}]}, 500, {})
else:
    # Standard execution
    standard_start = time.perf_counter()
    result = await handle_request()
    standard_time_ms = (time.perf_counter() - standard_start) * 1000

result = {
    "data": result[0],
    "status_code": result[1],
    "headers": dict(result[2]),
    "schema": str(schema),
    "jit_source": jit_source,
    "jit_warning": jit_warning,
    "standard_time_ms": standard_time_ms,
    "jit_time_ms": jit_time_ms,
}


to_js(result, dict_converter=js.Object.fromEntries)
