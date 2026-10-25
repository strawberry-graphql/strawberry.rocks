import strawberry
from pydantic import BaseModel


@strawberry.pydantic.type
class Genre(BaseModel):
    name: str
    subgenres: list["Genre"] = []


GENRES = [
    Genre(
        name="Science fiction",
        subgenres=[
            Genre(name="Space opera"),
            Genre(name="Cyberpunk", subgenres=[Genre(name="Biopunk")]),
        ],
    ),
    Genre(name="Fantasy"),
]


@strawberry.type
class Query:
    @strawberry.field
    def genres(self) -> list[Genre]:
        return GENRES


schema = strawberry.Schema(query=Query)
