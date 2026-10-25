from datetime import date

import strawberry
from pydantic import BaseModel, HttpUrl, PastDate


@strawberry.pydantic.type
class Author(BaseModel):
    name: str
    website: str
    born: date


AUTHORS = [
    Author(
        name="George Orwell", website="https://www.orwell.ru/", born=date(1903, 6, 25)
    ),
]


@strawberry.pydantic.input
class AddAuthorInput(BaseModel):
    name: str
    website: HttpUrl
    born: PastDate


@strawberry.type
class Query:
    @strawberry.field
    def authors(self) -> list[Author]:
        return AUTHORS


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_author(self, input: AddAuthorInput) -> Author:
        author = Author(name=input.name, website=str(input.website), born=input.born)
        AUTHORS.append(author)

        return author


schema = strawberry.Schema(query=Query, mutation=Mutation)
