# /// script
# dependencies = [
#   "strawberry-graphql==0.257.0.dev.1735244504",
#   "rich",
# ]
# ///


import textwrap
from inspect import iscoroutinefunction
from typing import List, Optional, Tuple

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
    StrawberryContainer,
    StrawberryObjectDefinition,
    StrawberryOptional,
    StrawberryList,
    StrawberryType,
    get_object_definition,
)
from strawberry.types.union import StrawberryUnion
from typing_extensions import Protocol


class HasSelectionSet(Protocol):
    selection_set: Optional[SelectionSetNode]


def _generate_field_function(
    name: str,
    selection_set: SelectionSetNode,
    parent_type: StrawberryType,
    nodes: List[dict],
    edges: List[dict],
    schema: Schema,
    parent_node_id: Optional[str] = None,
) -> Tuple[str, List[str]]:
    function_code = f"async def {name}(parent, info):\n"
    sub_functions = []
    field_assignments = []
    return_fields = []

    for selection in selection_set.selections:
        if isinstance(selection, FieldNode):
            field_name = selection.name.value
            return_fields.append(field_name)
            field = next(
                (field for field in parent_type.fields if field.name == field_name),
                None,
            )

            if field is None:
                raise Exception(
                    f"Field {field_name} not found in {parent_type.name}"
                )

            field_index = parent_type.fields.index(field)
            field_type = field.type

            field_assignments.append(f"    # selection: {field_name}")
            field_assignments.append(
                f"    root_type = {parent_type.name}.__strawberry_definition__"
            )

            field_assignments.append(f"    field = root_type.fields[{field_index}]")
            field_assignments.append(
                f"    {field_name}_resolver_result = field._resolver(parent, info=None)"
            )

            if selection.selection_set:
                while isinstance(field_type, StrawberryList):
                    field_assignments.append("# this is a list!")

                    field_type = field_type.of_type

                nested_parent_type = get_object_definition(field_type, strict=True)

                # Generate subfunction for nested field
                sub_name = f"{name}_{field_name}"
                sub_code, nested_functions = _generate_field_function(
                    sub_name,
                    selection.selection_set,
                    nested_parent_type,
                    nodes,
                    edges,
                    schema,
                    parent_node_id=name,
                )
                sub_functions.extend(nested_functions)
                sub_functions.append(sub_code)
                field_assignments.append(
                    f"    {field_name}_result = await {sub_name}({field_name}_resolver_result, info)"
                )
            elif field.is_basic_field:
                field_assignments.append(f"    {field_name} = parent.{field_name}")
            else:
                nodes.append(
                    {"id": field_name, "data": {"label": field_name}, "type": "default"}
                )

                edges.append(
                    {
                        "id": f"{name}-{field_name}",
                        "source": name,
                        "target": field_name,
                        "type": "default",
                    }
                )

    # Add field assignments to function body
    function_code += "\n".join(field_assignments) + "\n\n"

    # Add return statement with all fields
    return_dict = (
        "{"
        + ", ".join(
            f'"{f}": {f}_result' if f"{f}_result" in function_code else f'"{f}": {f}'
            for f in return_fields
        )
        + "}"
    )
    function_code += f"    return {return_dict}\n"

    nodes.append({"id": name, "data": {"label": name}, "type": "default"})

    if parent_node_id:
        edges.append(
            {
                "id": f"{parent_node_id}-{name}",
                "source": parent_node_id,
                "target": name,
                "type": "default",
            }
        )

    return function_code, sub_functions


def compile(operation: str, schema: Schema) -> Tuple[str, dict]:
    ast = parse(operation)
    assert isinstance(ast, DocumentNode)
    definition = ast.definitions[0]
    assert isinstance(definition, OperationDefinitionNode)
    assert definition.operation == OperationType.QUERY

    nodes = []
    edges = []

    root_type = get_object_definition(schema.query, strict=True)
    root_function, sub_functions = _generate_field_function(
        "root", definition.selection_set, root_type, nodes, edges, schema
    )

    compiled_code = (
        "\n".join(sub_functions)
        + "\n\n"
        + root_function
        + "\n\n"
        + textwrap.dedent(
            """
            async def _compiled_operation(schema, root_value, variables):
                return await root(root_value, variables)
            """
        )
    )

    graph_data = {"nodes": nodes, "edges": edges}

    return compiled_code, graph_data


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

        @strawberry.field
        def example(self, info: strawberry.Info) -> str:
            return "example"

    schema = strawberry.Schema(Query)

    query = """
        query {
            example
            hello {
                articles {
                    id
                }
                name
            }
        }
    """
    variables = {}


compiled_operation, graph_data = compile(query, schema)
result = {"code": compiled_operation, "graph": graph_data}


try:
    import js
    from pyodide.ffi import to_js

except ImportError:
    import asyncio
    import sys

    from rich.console import Console
    from rich.syntax import Syntax

    console = Console()
    console.print(Syntax(result["code"], "python"))

    exec(compiled_operation, globals())

    operation_result = asyncio.run(_compiled_operation(schema, None, variables))
    result["data"] = {"data": operation_result, "jit": True}

    console.print(result.get("data", None))

    sys.exit(0)

try:
    exec(compiled_operation, globals())

    # REMOVE_THISoperation_result = await _compiled_operation(schema, None, variables)
except Exception as e:
    print("error", e)
    result["error"] = str(e)

result["data"] = {"data": operation_result, "jit": True}
to_js(result, dict_converter=js.Object.fromEntries)
