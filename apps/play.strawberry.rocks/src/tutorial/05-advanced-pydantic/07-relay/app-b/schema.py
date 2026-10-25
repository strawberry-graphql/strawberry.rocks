from collections.abc import Iterable

import strawberry
from pydantic import BaseModel
from strawberry import relay


@strawberry.pydantic.type
class Book(BaseModel, relay.Node):
    id: relay.NodeID[int]
    title: str
    author: str

    @classmethod
    def resolve_nodes(
        cls,
        *,
        info: strawberry.Info,
        node_ids: Iterable[str],
        required: bool = False,
    ) -> list["Book | None"]:
        return [BOOKS_BY_ID.get(int(node_id)) for node_id in node_ids]


BOOKS = [
    Book(id=1, title="The Great Gatsby", author="F. Scott Fitzgerald"),
    Book(id=2, title="Nineteen Eighty-Four", author="George Orwell"),
    Book(id=3, title="The Left Hand of Darkness", author="Ursula K. Le Guin"),
    Book(id=4, title="Dune", author="Frank Herbert"),
]
BOOKS_BY_ID = {book.id: book for book in BOOKS}


@strawberry.type
class Query:
    node: relay.Node = relay.node()

    @relay.connection(relay.ListConnection[Book])
    def books(self) -> list[Book]:
        return BOOKS


schema = strawberry.Schema(query=Query)
