import strawberry


@strawberry.type
class Query:
    @strawberry.field
    def hello(self, info: strawberry.Info) -> str:
        return "world"


schema = strawberry.Schema(Query)
