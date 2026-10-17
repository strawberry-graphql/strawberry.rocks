import strawberry
from strawberry.permission import BasePermission

# Set this to a name to log in
CURRENT_USER: str | None = None


class IsAuthenticated(BasePermission):
    message = "You need to log in to see this"

    def has_permission(self, source, info: strawberry.Info, **kwargs) -> bool:
        return info.context["user"] is not None


@strawberry.type
class Query:
    @strawberry.field
    def public_message(self) -> str:
        return "Anyone can see this"

    # Nullable, so a denied permission only nulls this field and not the
    # whole response
    @strawberry.field(permission_classes=[IsAuthenticated])
    def me(self, info: strawberry.Info) -> str | None:
        return info.context["user"]

    @strawberry.field
    def broken(self) -> str | None:
        # Errors in a resolver don't fail the whole query: the field is null
        # and the error is in the response, with its traceback
        raise ValueError("Something went wrong")


async def context_getter():
    return {"user": CURRENT_USER}


schema = strawberry.Schema(Query)
