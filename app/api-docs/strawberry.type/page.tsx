import * as wasm from "rusty-docs";

import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

import components from "~/components/mdx";

const code = `
from typing import Optional, TypeVar, Sequence, Union, Callable

T = TypeVar("T")

def type(
    cls: Optional[T],
    *,
    name: Optional[str],
    is_input: bool = False,
    is_interface: bool = False,
    description: Optional[str] = None,
    directives: Optional[Sequence[object]] = (),
    extend: bool = False,
) -> Union[T, Callable[[T], T]]:
    """Annotates a class as a GraphQL type.

    You can use it like this:

    >>> @strawberry.type:
    >>> class X:
    >>>     field_abc: str = "ABC"

    Or like this:

    >>> @strawberry.type(name="GraphQLName"):
    >>> class X:
    >>>     field_abc: str = "ABC"

    Arguments:
        cls: the class you want to wrap
        name:
            an optional name, this will be used in the GraphQL schema
        description:
            an optional description, this will be used in the GraphQL schema
        directives:
            a Sequence of schema directives, this will be outputted in the schema
            when printing it.
        extend:
            if set to True, the type will be marked as an extension type.
            This is only used for Apollo Federation at the moment.

    Private arguments:
        is_input:
            a flag to indicate if the type is an input type
        is_interface:
            a flag to indicate if the type is an interface


    Returns:
        A decorated version of the passed class, which can be used anywhere you
        need to use GraphQL types.
    """

    ...
`;

export default async function Page() {
  const content = wasm.get_markdown(code);

  const source = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
    },
  });

  return <MDXRemote {...source} components={components} />;
}
