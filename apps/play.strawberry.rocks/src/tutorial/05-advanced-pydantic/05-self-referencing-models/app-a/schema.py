import strawberry
from pydantic import BaseModel


@strawberry.pydantic.type
class Genre(BaseModel):
    name: str


GENRES = [
    Genre(name="Science fiction"),
    Genre(name="Fantasy"),
]


@strawberry.type
class Query:
    @strawberry.field
    def genres(self) -> list[Genre]:
        return GENRES


schema = strawberry.Schema(query=Query)
