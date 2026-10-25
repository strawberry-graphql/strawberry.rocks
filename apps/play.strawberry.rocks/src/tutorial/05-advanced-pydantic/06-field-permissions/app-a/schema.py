from typing import Any

import strawberry
from pydantic import BaseModel
from strawberry.permission import BasePermission


class IsLibrarian(BasePermission):
    message = "Only librarians can see this"

    def has_permission(self, source: Any, info: strawberry.Info, **kwargs: Any) -> bool:
        request = info.context["request"]

        return request.headers.get("Authorization") == "Bearer librarian"


@strawberry.pydantic.type
class Member(BaseModel):
    name: str
    email: str


MEMBERS = [
    Member(name="Ada", email="ada@example.com"),
    Member(name="Grace", email="grace@example.com"),
]


@strawberry.type
class Query:
    @strawberry.field
    def members(self) -> list[Member]:
        return MEMBERS


schema = strawberry.Schema(query=Query)
