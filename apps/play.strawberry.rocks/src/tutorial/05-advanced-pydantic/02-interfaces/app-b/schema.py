import strawberry
from pydantic import BaseModel


@strawberry.pydantic.interface
class LibraryItem(BaseModel):
    id: strawberry.ID
    title: str


@strawberry.pydantic.type
class Book(LibraryItem):
    author: str


@strawberry.pydantic.type
class Magazine(LibraryItem):
    issue: int


BOOKS = [
    Book(id="book-1", title="The Dispossessed", author="Ursula K. Le Guin"),
    Book(id="book-2", title="Animal Farm", author="George Orwell"),
]

MAGAZINES = [
    Magazine(id="magazine-1", title="National Geographic", issue=1024),
    Magazine(id="magazine-2", title="The New Yorker", issue=5112),
]


@strawberry.type
class Query:
    @strawberry.field
    def books(self) -> list[Book]:
        return BOOKS

    @strawberry.field
    def magazines(self) -> list[Magazine]:
        return MAGAZINES

    @strawberry.field
    def items(self) -> list[LibraryItem]:
        return sorted([*BOOKS, *MAGAZINES], key=lambda item: item.title)


schema = strawberry.Schema(query=Query)
