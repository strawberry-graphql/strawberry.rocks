import strawberry
from pydantic import BaseModel, computed_field


@strawberry.pydantic.type
class Book(BaseModel):
    title: str


@strawberry.pydantic.type
class Author(BaseModel):
    name: str


@strawberry.pydantic.type
class BookPage(BaseModel):
    items: list[Book]
    total: int
    offset: int

    @computed_field
    @property
    def has_more(self) -> bool:
        return self.offset + len(self.items) < self.total


BOOKS = [
    Book(title=title)
    for title in [
        "A Wizard of Earthsea",
        "Animal Farm",
        "Dune",
        "Nineteen Eighty-Four",
        "The Dispossessed",
    ]
]
AUTHORS = [
    Author(name=name)
    for name in ["Frank Herbert", "George Orwell", "Ursula K. Le Guin"]
]


@strawberry.type
class Query:
    @strawberry.field
    def books(self, offset: int = 0, limit: int = 2) -> BookPage:
        return BookPage(
            items=BOOKS[offset : offset + limit], total=len(BOOKS), offset=offset
        )


schema = strawberry.Schema(query=Query)
