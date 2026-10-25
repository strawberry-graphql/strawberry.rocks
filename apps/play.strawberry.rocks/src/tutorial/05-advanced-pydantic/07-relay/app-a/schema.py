import strawberry
from pydantic import BaseModel


@strawberry.pydantic.type
class Book(BaseModel):
    id: int
    title: str
    author: str


BOOKS = [
    Book(id=1, title="The Great Gatsby", author="F. Scott Fitzgerald"),
    Book(id=2, title="Nineteen Eighty-Four", author="George Orwell"),
    Book(id=3, title="The Left Hand of Darkness", author="Ursula K. Le Guin"),
    Book(id=4, title="Dune", author="Frank Herbert"),
]
BOOKS_BY_ID = {book.id: book for book in BOOKS}


@strawberry.type
class Query:
    @strawberry.field
    def books(self) -> list[Book]:
        return BOOKS


schema = strawberry.Schema(query=Query)
