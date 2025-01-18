# /// script
# dependencies = [
#   "strawberry-graphql==0.257.0.dev.1735244504",
#   "rich",
# ]
# ///


import textwrap
from inspect import iscoroutinefunction
from typing import List, Optional, Tuple
from typing_extensions import Protocol

from graphql import (
    ArgumentNode,
    DocumentNode,
    FieldNode,
    IntValueNode,
    OperationDefinitionNode,
    SelectionSetNode,
    StringValueNode,
    VariableNode,
)
from graphql.language import OperationType
from graphql.language.parser import parse

from strawberry.scalars import is_scalar
from strawberry.schema import Schema
from strawberry.types.base import (
    StrawberryList,
    StrawberryObjectDefinition,
    StrawberryOptional,
    StrawberryType,
    get_object_definition,
)
from strawberry.types.union import StrawberryUnion


class HasSelectionSet(Protocol):
    selection_set: Optional[SelectionSetNode]


def _get_arguments(arguments: Tuple[ArgumentNode, ...]) -> List[str]:
    body = []

    body.append("arguments = {}")

    for argument in arguments:
        if isinstance(argument.value, StringValueNode):
            body.append(
                f"arguments['{argument.name.value}'] = '{argument.value.value}'"
            )
        if isinstance(argument.value, IntValueNode):
            body.append(f"arguments['{argument.name.value}'] = {argument.value.value}")
        elif isinstance(argument.value, VariableNode):
            body.append(
                f"arguments['{argument.name.value}'] = variables['{argument.value.name.value}']"
            )
        else:
            raise NotImplementedError(f"Argument {argument.value} not supported")

    return body


def _recurse(
    definition: HasSelectionSet,
    root_type: StrawberryType,
    schema: Schema,
    path: List[str],
    level: int = 0,
    indent: int = 1,
    root_value_variable: str = "root_value",
    parent_result_variable: Optional[str] = None,
) -> str:
    body = []

    if hasattr(root_type, "__strawberry_definition__"):
        root_type = root_type.__strawberry_definition__  # type: ignore

    if isinstance(root_type, StrawberryList):
        result = "[]"
        body.append(f"{parent_result_variable} = {result}")
        body.append(f"for item in value_{level - 1}:")

        of_type = root_type.of_type

        body.append(
            _recurse(
                definition,
                of_type,
                level=level + 1,
                indent=1,
                path=path,
                schema=schema,
                root_value_variable="item",
                parent_result_variable=parent_result_variable,
            )
        )

        # TODO: I HATE THIS :'D
        body.append(f"    results_{level}.append(results_{level+1})")
        body.append(f"results_{level-1}['{definition.name.value}'] = results_{level}")
        body.append("")

    elif isinstance(root_type, StrawberryUnion):
        body.append("# TODO: unions")

    elif isinstance(root_type, StrawberryObjectDefinition):
        body.append(f"# Object: {root_type.name}")
        result = "{}"
        body.append(f"results_{level} = {result}")

        info_value = "None"

        body.append(f"root_type_{level} = {root_type.name}.__strawberry_definition__")
        body.append(f"# {'.'.join(path)}")

        if not definition.selection_set:
            raise ValueError("This shouldn't happen")

        for selection in definition.selection_set.selections:
            body.append(f"# {'.'.join(path)}.{selection.name.value}")
            assert isinstance(selection, FieldNode)

            # get arguments
            body.extend(_get_arguments(selection.arguments))

            field_name = selection.name.value

            field = next(
                (field for field in root_type.fields if field.name == field_name), None
            )

            if not field:
                body.append(
                    f"# Field {field_name} not found in {root_type.name} {level}"
                )
                continue

            index = root_type.fields.index(field)
            resolver = field._resolver

            body.append(f"field = root_type_{level}.fields[{index}]")

            # append arguments
            if iscoroutinefunction(resolver):
                body.append(
                    f"value_{level} = await field._resolver({root_value_variable}, {info_value}, **arguments)"
                )
            else:
                if field.is_basic_field:
                    body.append(f"value_{level} = {root_value_variable}.{field_name}")
                else:
                    body.append(
                        f"value_{level} = field._resolver({root_value_variable}, {info_value}, **arguments)"
                    )

            body.append(f"print('value_{level}', value_{level})")

            body.append(
                _recurse(
                    selection,
                    field.type,
                    root_value_variable=f"value_{level}",
                    level=level + 1,
                    indent=0,
                    path=[*path, field_name],
                    schema=schema,
                    parent_result_variable=f"results_{level}",
                )
            )

        # TODO: this is wrong?
        # test with more nesting :')
        if level > 2:
            body.append(
                f"results_{level - 1}['{definition.name.value}'] = results_{level}"
            )

    elif is_scalar(root_type, schema.schema_converter.scalar_registry):
        body.append(f"# Scalar: {root_type}")
        body.append(
            f"{parent_result_variable}['{definition.name.value}'] = value_{level - 1}"
        )

    else:
        raise NotImplementedError(f"Type {root_type} not supported")

    return textwrap.indent("\n".join(body), "    " * indent).strip()


def compile(operation: str, schema: Schema) -> ...:
    ast = parse(operation)

    assert isinstance(ast, DocumentNode)

    # assuming only one definition (for now)

    definition = ast.definitions[0]

    assert isinstance(definition, OperationDefinitionNode)

    # TODO: this is an assumption, but we go with query for now
    # Mutations and subscriptions are also possible, but they need to be handled differently
    # mutation are serial, subscriptions are more complex

    assert definition.operation == OperationType.QUERY

    root_type = get_object_definition(schema.query, strict=True)

    # TODO: we might want to think about root values too

    function = textwrap.dedent(
        """
        async def _compiled_operation(schema, root_value, variables):
        __BODY__
            print('results_0', results_0)
            return results_0
        """
    )

    function = function.replace(
        "__BODY__",
        _recurse(
            definition,
            root_type,
            schema=schema,
            path=["Query"],
            parent_result_variable="results_0",
        ),
    ).strip()

    return function

schema = None
query = None

# {{ schema }}
# {{ query }}


if schema is None:
    import strawberry

    @strawberry.type
    class Article:
        id: str

    @strawberry.type
    class User:
        name: str

        articles: list[Article]

    @strawberry.type
    class Query:
        @strawberry.field
        def hello(self, info: strawberry.Info) -> User:
            return User(name="patrick", articles=[])

    schema = strawberry.Schema(Query)

    query = """
        query {
            hello {
                name
            }
        }
    """


compiled_operation = compile(query, schema)

result = {"code": compiled_operation}

import asyncio


try:
    exec(compiled_operation, globals())

    operation_result = asyncio.run(_compiled_operation(schema, None, variables))

    result["data"] = {"data": operation_result, "jit": True}
except Exception as e:
    print("error", e)
    result["error"] = str(e)


try:
    import js
    from pyodide.ffi import to_js

    to_js(result, dict_converter=js.Object.fromEntries)
except ImportError:
    from rich.syntax import Syntax
    from rich.console import Console

    console = Console()
    console.print(Syntax(result["code"], "python"))
