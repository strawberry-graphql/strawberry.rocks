import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as wasm from "rusty-docs";

import { FeedbackForm } from "~/components/feedback-form";
import { Header } from "~/components/header";
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

  const version = "0.0.0";
  const versionHref = "/";

  return (
    <>
      <Header version={version} versionHref={versionHref} />

      <main className="flex mx-auto w-full max-w-7xl flex-1 text-lg">
        <div className="px-8 pb-12 w-0 flex-1" id="docs-content">
          <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>

          <FeedbackForm />
        </div>
      </main>
    </>
  );
}
