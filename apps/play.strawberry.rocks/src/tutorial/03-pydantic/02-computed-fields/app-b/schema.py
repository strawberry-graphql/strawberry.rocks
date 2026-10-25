from typing import Annotated

import strawberry
from pydantic import BaseModel, Field, computed_field


@strawberry.pydantic.type
class Book(BaseModel):
    title: str
    author: str
    year: Annotated[int, Field(description="The year the book was first published")]
    price_cents: strawberry.Private[int]

    @computed_field
    @property
    def price(self) -> str:
        """The price, ready to show to readers"""
        return f"${self.price_cents / 100:.2f}"


BOOKS = [
    Book(
        title="The Great Gatsby",
        author="F. Scott Fitzgerald",
        year=1925,
        price_cents=1099,
    ),
    Book(
        title="Nineteen Eighty-Four",
        author="George Orwell",
        year=1949,
        price_cents=1250,
    ),
    Book(
        title="The Left Hand of Darkness",
        author="Ursula K. Le Guin",
        year=1969,
        price_cents=1599,
    ),
]


@strawberry.type
class Query:
    @strawberry.field
    def books(self) -> list[Book]:
        return BOOKS


schema = strawberry.Schema(query=Query)
