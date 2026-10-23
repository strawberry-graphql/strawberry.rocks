import strawberry


@strawberry.type
class Book:
    title: str
    author: str


@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "world"

    @strawberry.field
    def book(self) -> Book:
        return Book(title="The Great Gatsby", author="F. Scott Fitzgerald")


schema = strawberry.Schema(query=Query)
