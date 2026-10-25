from typing import Annotated

import strawberry
from pydantic import BaseModel, Field


class BookFields(BaseModel):
    title: Annotated[str, Field(min_length=1)]
    year: Annotated[int, strawberry.field(name="yearPublished")]


@strawberry.pydantic.type
class Book(BookFields):
    id: strawberry.ID


@strawberry.pydantic.input
class BookInput(BookFields):
    pass


BOOKS = [Book(id="1", title="The Great Gatsby", year=1925)]


@strawberry.type
class Query:
    @strawberry.field
    def books(self) -> list[Book]:
        return BOOKS


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_book(self, input: BookInput) -> Book:
        book = Book(id=str(len(BOOKS) + 1), **input.model_dump())
        BOOKS.append(book)

        return book


schema = strawberry.Schema(query=Query, mutation=Mutation)
