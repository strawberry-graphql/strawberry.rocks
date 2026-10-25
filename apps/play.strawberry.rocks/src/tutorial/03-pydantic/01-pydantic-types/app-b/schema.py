from typing import Annotated

import strawberry
from pydantic import BaseModel, Field


@strawberry.pydantic.type
class Book(BaseModel):
    title: str
    author: str
    year: Annotated[int, Field(description="The year the book was first published")]


BOOKS = [
    Book(title="The Great Gatsby", author="F. Scott Fitzgerald", year=1925),
    Book(title="Nineteen Eighty-Four", author="George Orwell", year=1949),
    Book(title="The Left Hand of Darkness", author="Ursula K. Le Guin", year=1969),
]


@strawberry.type
class Query:
    @strawberry.field
    def books(self) -> list[Book]:
        return BOOKS


schema = strawberry.Schema(query=Query)
