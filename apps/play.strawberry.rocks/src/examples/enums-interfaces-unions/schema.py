from enum import Enum
from typing import Annotated

import strawberry


@strawberry.enum
class Diet(Enum):
    HERBIVORE = "herbivore"
    CARNIVORE = "carnivore"
    OMNIVORE = "omnivore"


@strawberry.interface
class Animal:
    name: str
    diet: Diet


@strawberry.type
class Dog(Animal):
    good_boy: bool = True


@strawberry.type
class Cat(Animal):
    lives: int = 9


@strawberry.type
class Plant:
    species: str


# A union of types that don't share an interface
SearchResult = Annotated[Dog | Cat | Plant, strawberry.union("SearchResult")]


@strawberry.type
class Query:
    @strawberry.field
    def animals(self, diet: Diet | None = None) -> list[Animal]:
        animals = [
            Dog(name="Rex", diet=Diet.OMNIVORE),
            Cat(name="Tom", diet=Diet.CARNIVORE),
        ]

        return [animal for animal in animals if diet in (None, animal.diet)]

    @strawberry.field
    def search(self) -> list[SearchResult]:
        return [Dog(name="Rex", diet=Diet.OMNIVORE), Plant(species="Fragaria")]


schema = strawberry.Schema(Query, types=[Dog, Cat])
