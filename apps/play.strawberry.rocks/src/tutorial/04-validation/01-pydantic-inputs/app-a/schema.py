import strawberry
from pydantic import BaseModel


@strawberry.pydantic.type
class Book(BaseModel):
    title: str
    author: str
    year: int


BOOKS = [
    Book(title="The Great Gatsby", author="F. Scott Fitzgerald", year=1925),
    Book(title="Nineteen Eighty-Four", author="George Orwell", year=1949),
]


@strawberry.input
class AddBookInput:
    title: str
    author: str
    year: int


@strawberry.type
class Query:
    @strawberry.field
    def books(self) -> list[Book]:
        return BOOKS


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_book(self, input: AddBookInput) -> Book:
        book = Book(title=input.title, author=input.author, year=input.year)
        BOOKS.append(book)

        return book


schema = strawberry.Schema(query=Query, mutation=Mutation)
