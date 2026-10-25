from typing import Annotated

import strawberry
from pydantic import BaseModel, Field


@strawberry.pydantic.type
class Book(BaseModel):
    title: str
    isbn: Annotated[str, Field(description="The book's 13 digit ISBN")]
    isbn10: str


BOOKS = [
    Book(title="The Great Gatsby", isbn="9780743273565", isbn10="0743273567"),
    Book(title="Nineteen Eighty-Four", isbn="9780451524935", isbn10="0451524934"),
]


@strawberry.type
class Query:
    @strawberry.field
    def books(self) -> list[Book]:
        return BOOKS


schema = strawberry.Schema(query=Query)
