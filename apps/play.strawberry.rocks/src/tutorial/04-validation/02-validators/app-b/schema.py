from datetime import date
from typing import Annotated

import strawberry
from pydantic import BaseModel, ConfigDict, Field, field_validator


@strawberry.pydantic.type
class Book(BaseModel):
    title: str
    author: str
    year: int
    isbn: str


BOOKS = [
    Book(
        title="The Great Gatsby",
        author="F. Scott Fitzgerald",
        year=1925,
        isbn="9780743273565",
    ),
]


@strawberry.pydantic.input
class AddBookInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: Annotated[str, Field(min_length=1)]
    author: Annotated[str, Field(min_length=1)]
    year: Annotated[int, Field(ge=1450, le=date.today().year)]
    isbn: str

    @field_validator("isbn")
    @classmethod
    def normalize_isbn(cls, isbn: str) -> str:
        digits = isbn.replace("-", "").replace(" ", "")

        if not (digits.isdigit() and len(digits) == 13):
            raise ValueError("An ISBN has 13 digits")

        return digits


@strawberry.type
class Query:
    @strawberry.field
    def books(self) -> list[Book]:
        return BOOKS


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_book(self, input: AddBookInput) -> Book:
        book = Book(**input.model_dump())
        BOOKS.append(book)

        return book


schema = strawberry.Schema(query=Query, mutation=Mutation)
