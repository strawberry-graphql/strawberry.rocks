import strawberry


@strawberry.type
class Author:
    name: str


@strawberry.type
class Book:
    title: str
    author: Author
    year: int
    # Optional fields are nullable in the schema
    subtitle: str | None = None


BOOKS = [
    Book(title="The Great Gatsby", author=Author(name="F. Scott Fitzgerald"), year=1925),
    Book(title="Dune", author=Author(name="Frank Herbert"), year=1965),
    Book(
        title="Frankenstein",
        subtitle="The Modern Prometheus",
        author=Author(name="Mary Shelley"),
        year=1818,
    ),
]


@strawberry.type
class Query:
    @strawberry.field(description="All the books, optionally after a given year")
    def books(self, published_after: int | None = None) -> list[Book]:
        if published_after is None:
            return BOOKS

        return [book for book in BOOKS if book.year > published_after]

    @strawberry.field
    def book(self, title: str) -> Book | None:
        return next((book for book in BOOKS if book.title == title), None)


schema = strawberry.Schema(Query)
