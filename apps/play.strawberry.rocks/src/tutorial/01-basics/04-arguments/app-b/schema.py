import strawberry


@strawberry.type
class Book:
    title: str
    author: str


BOOKS = [
    Book(title="The Great Gatsby", author="F. Scott Fitzgerald"),
    Book(title="Nineteen Eighty-Four", author="George Orwell"),
    Book(title="The Left Hand of Darkness", author="Ursula K. Le Guin"),
]


@strawberry.type
class Query:
    @strawberry.field
    def book(self, title: str) -> Book | None:
        for book in BOOKS:
            if book.title == title:
                return book

        return None

    @strawberry.field
    def books(self) -> list[Book]:
        return BOOKS


schema = strawberry.Schema(query=Query)
