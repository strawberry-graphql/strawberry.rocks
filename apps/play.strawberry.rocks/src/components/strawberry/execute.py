import ast
import contextlib
import inspect
import io
import json
import linecache
import logging
import os
import sys
import traceback
import types

import fastapi
import js
import pyodide_js
from graphql import GraphQLError
from httpx import ASGITransport, AsyncClient
from pyodide.ffi import to_js
from strawberry.fastapi import GraphQLRouter

# `schema_code`, `query` and `variables` are passed in as globals by the
# playground.

SCHEMA_MODULE = "schema"
SCHEMA_FILENAME = "schema.py"


def format_exception(exc):
    """Formats an exception, keeping only the frames from the user's code."""

    frames = [
        frame
        for frame in traceback.extract_tb(exc.__traceback__)
        if frame.filename == SCHEMA_FILENAME
    ]
    line = frames[-1].lineno if frames else None

    if isinstance(exc, SyntaxError) and exc.filename == SCHEMA_FILENAME:
        line = exc.lineno

    formatted = "".join(traceback.format_exception_only(type(exc), exc))

    if frames:
        formatted = (
            "Traceback (most recent call last):\n"
            + "".join(traceback.format_list(frames))
            + formatted
        )

    return {
        "type": type(exc).__name__,
        "message": str(exc),
        "traceback": formatted,
        "line": line,
    }


class LogCollector(logging.Handler):
    def __init__(self):
        super().__init__(level=logging.INFO)
        self.logs = []

    def emit(self, record):
        entry = {
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "error": None,
            "graphql_message": None,
            "path": None,
        }

        # Strawberry logs each execution error with the GraphQLError as the
        # message and the original exception as exc_info
        if isinstance(record.msg, GraphQLError):
            entry["graphql_message"] = record.msg.message
            entry["path"] = record.msg.path

        if record.exc_info and record.exc_info[1]:
            entry["error"] = format_exception(record.exc_info[1])

        self.logs.append(entry)


def is_schema_file(path):
    return os.path.abspath(path) == os.path.abspath(SCHEMA_FILENAME)


async def strawberry_exception_details(exc):
    """Details of Strawberry's own exceptions, e.g. a missing annotation,
    including the location of the code that caused them."""

    try:
        from strawberry.exceptions import StrawberryException
    except ImportError:
        return None

    if not isinstance(exc, StrawberryException):
        return None

    # Only needed for these errors, so they're loaded on demand
    await pyodide_js.loadPackage(["libcst", "rich"])

    from rich.text import Text

    def plain(markup):
        return Text.from_markup(markup).plain if markup else None

    try:
        source = exc.exception_source
    except Exception:
        source = None

    location = None
    snippet = []

    if source is not None and is_schema_file(source.path):
        # Strawberry's columns are 0-based
        location = {
            "line": source.error_line,
            "column": source.error_column + 1,
            "end_column": source.error_column_end + 1,
        }

        lines = schema_code.splitlines()
        first = max(1, source.error_line - 2)
        last = min(len(lines), source.error_line + 2)
        snippet = [
            {"line": number, "text": lines[number - 1]}
            for number in range(first, last + 1)
        ]

    return {
        "title": plain(getattr(exc, "rich_message", None)) or str(exc),
        "annotation": getattr(exc, "annotation_message", None),
        "suggestion": plain(getattr(exc, "suggestion", None)),
        "documentation_url": getattr(exc, "documentation_url", None),
        "location": location,
        "snippet": snippet,
    }


async def load_schema():
    await pyodide_js.loadPackagesFromImports(schema_code)

    # Run the code as a real module, as Strawberry looks up types through
    # sys.modules[cls.__module__]
    module = types.ModuleType(SCHEMA_MODULE)
    module.__file__ = SCHEMA_FILENAME
    sys.modules[SCHEMA_MODULE] = module

    # Strawberry's exceptions find where they come from by reading the
    # module's file with libcst, so the code needs to exist on disk too
    # (Pyodide's in-memory filesystem)
    with open(SCHEMA_FILENAME, "w") as file:
        file.write(schema_code)

    # Lets tracebacks show the source of each line
    linecache.cache[SCHEMA_FILENAME] = (
        len(schema_code),
        None,
        schema_code.splitlines(keepends=True),
        SCHEMA_FILENAME,
    )
    namespace = module.__dict__

    code = compile(
        schema_code,
        SCHEMA_FILENAME,
        "exec",
        flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT,
    )
    result = eval(code, namespace)

    if inspect.iscoroutine(result):
        await result

    if "schema" not in namespace:
        raise NameError("The code must define a Strawberry schema named `schema`")

    return namespace["schema"], namespace


async def execute(variables):
    schema, namespace = await load_schema()
    user_context_getter = namespace.get("context_getter")

    async def context_getter():
        if user_context_getter:
            return await user_context_getter()

        return {}

    app = fastapi.FastAPI()
    app.include_router(
        GraphQLRouter(schema, path="/", context_getter=context_getter), prefix=""
    )

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as client:
        response = await client.post(
            "/", json={"query": query, "variables": variables}
        )

    return {
        # Parsed in JavaScript: to_js would turn nulls into undefined, which
        # JSON.stringify then leaves out
        "response": response.text,
        "status_code": response.status_code,
        "headers": dict(response.headers.items()),
        "schema": str(schema),
    }


async def main():
    stdout = io.StringIO()
    collector = LogCollector()
    root_logger = logging.getLogger()
    root_logger.addHandler(collector)

    result = {
        "response": None,
        "status_code": None,
        "headers": {},
        "schema": None,
        "error": None,
    }

    try:
        parsed_variables = json.loads(variables) if variables.strip() else {}
    except json.JSONDecodeError as exc:
        parsed_variables = None
        result["error"] = {
            "type": "InvalidVariables",
            "message": f"Variables are not valid JSON: {exc}",
            "traceback": None,
            "line": None,
        }

    try:
        if parsed_variables is not None:
            with contextlib.redirect_stdout(stdout):
                result.update(await execute(parsed_variables))
    except Exception as exc:
        result["error"] = format_exception(exc)
        details = await strawberry_exception_details(exc)

        if details:
            result["error"]["strawberry"] = details

            if details["location"]:
                result["error"]["line"] = details["location"]["line"]
    finally:
        root_logger.removeHandler(collector)

    result["stdout"] = stdout.getvalue()
    result["logs"] = collector.logs

    return to_js(result, dict_converter=js.Object.fromEntries)


await main()
