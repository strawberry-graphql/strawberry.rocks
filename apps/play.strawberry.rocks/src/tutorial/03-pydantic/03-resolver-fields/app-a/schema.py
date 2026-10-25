import strawberry
from pydantic import BaseModel


@strawberry.pydantic.type
class Book(BaseModel):
    title: str
    year: int
    author_id: strawberry.Private[strawberry.ID]


@strawberry.pydantic.type
class Author(BaseModel):
    id: strawberry.ID
    name: str


AUTHORS = [
    Author(id=strawberry.ID("1"), name="Ursula K. Le Guin"),
    Author(id=strawberry.ID("2"), name="George Orwell"),
]

BOOKS = [
    Book(title="A Wizard of Earthsea", year=1968, author_id="1"),
    Book(title="The Left Hand of Darkness", year=1969, author_id="1"),
    Book(title="The Dispossessed", year=1974, author_id="1"),
    Book(title="Animal Farm", year=1945, author_id="2"),
    Book(title="Nineteen Eighty-Four", year=1949, author_id="2"),
]


@strawberry.type
class Query:
    @strawberry.field
    def authors(self) -> list[Author]:
        return AUTHORS


schema = strawberry.Schema(query=Query)
