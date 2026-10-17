import datetime
from decimal import Decimal
from typing import NewType

import strawberry

# A scalar that's serialized as a string, like "#f7393d"
Color = strawberry.scalar(
    NewType("Color", str),
    description="A color in hex notation",
    serialize=lambda value: value.lower(),
    parse_value=lambda value: value if value.startswith("#") else f"#{value}",
)


@strawberry.type
class Event:
    name: str
    # Dates, times, decimals and UUIDs are built in
    starts_at: datetime.datetime
    price: Decimal
    color: Color


@strawberry.type
class Query:
    @strawberry.field
    def event(self, color: Color = Color("#F7393D")) -> Event:
        return Event(
            name="PyCon",
            starts_at=datetime.datetime(2026, 5, 13, 9, 30),
            price=Decimal("249.99"),
            color=color,
        )


schema = strawberry.Schema(Query)
