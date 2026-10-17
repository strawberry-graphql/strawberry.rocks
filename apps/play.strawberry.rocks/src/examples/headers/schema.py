import strawberry
from strawberry.permission import BasePermission

TOKENS = {"secret-token": "Patrick"}


def current_user(info: strawberry.Info) -> str | None:
    # The request headers are set in the Headers tab
    authorization = info.context["request"].headers.get("Authorization", "")
    token = authorization.removeprefix("Bearer ")

    return TOKENS.get(token)


class IsAuthenticated(BasePermission):
    message = "Send an Authorization header with a valid token"

    def has_permission(self, source, info: strawberry.Info, **kwargs) -> bool:
        return current_user(info) is not None


@strawberry.type
class Query:
    @strawberry.field
    def user_agent(self, info: strawberry.Info) -> str | None:
        return info.context["request"].headers.get("User-Agent")

    @strawberry.field(permission_classes=[IsAuthenticated])
    def me(self, info: strawberry.Info) -> str | None:
        # Response headers show up in the Response headers tab
        info.context["response"].headers["X-Logged-In-As"] = current_user(info)

        return current_user(info)


schema = strawberry.Schema(Query)
