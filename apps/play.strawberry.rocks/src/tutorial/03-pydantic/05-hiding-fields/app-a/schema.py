import strawberry
from pydantic import BaseModel, field_serializer


@strawberry.pydantic.type
class Member(BaseModel):
    name: str
    email: str
    password_hash: str

    @field_serializer("email")
    def mask_email(self, email: str) -> str:
        name, domain = email.split("@")
        return f"{name[0]}***@{domain}"


MEMBERS = [
    Member(name="Ada", email="ada@example.com", password_hash="pbkdf2:4f9a1c"),
    Member(name="Grace", email="grace@example.com", password_hash="pbkdf2:b2e8d0"),
]


@strawberry.type
class Query:
    @strawberry.field
    def members(self) -> list[Member]:
        return MEMBERS


schema = strawberry.Schema(query=Query)
