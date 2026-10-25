import strawberry
from pydantic import BaseModel


@strawberry.pydantic.type
class Book(BaseModel):
    title: str
    author: str


BOOKS = [
    Book(title="A Wizard of Earthsea", author="Ursula K. Le Guin"),
    Book(title="The Left Hand of Darkness", author="Ursula K. Le Guin"),
    Book(title="The Dispossessed", author="Ursula K. Le Guin"),
    Book(title="The Great Gatsby", author="F. Scott Fitzgerald"),
    Book(title="The Old Man and the Sea", author="Ernest Hemingway"),
]


@strawberry.pydantic.input
class SearchInput(BaseModel):
    text: str
    limit: int
    author: str | None


@strawberry.type
class Query:
    @strawberry.field
    def search_books(self, input: SearchInput) -> list[Book]:
        books = [
            book
            for book in BOOKS
            if input.text.lower() in book.title.lower()
            and (input.author is None or book.author == input.author)
        ]

        return books[: input.limit]


schema = strawberry.Schema(query=Query)
