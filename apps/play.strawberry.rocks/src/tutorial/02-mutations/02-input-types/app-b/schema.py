import strawberry


@strawberry.type
class Book:
    title: str
    author: str
    year: int | None = None


BOOKS = [
    Book(title="The Great Gatsby", author="F. Scott Fitzgerald", year=1925),
    Book(title="Nineteen Eighty-Four", author="George Orwell", year=1949),
    Book(title="The Left Hand of Darkness", author="Ursula K. Le Guin", year=1969),
]


@strawberry.input
class AddBookInput:
    title: str
    author: str
    year: int | None = None


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


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_book(self, input: AddBookInput) -> Book:
        book = Book(title=input.title, author=input.author, year=input.year)
        BOOKS.append(book)

        return book


schema = strawberry.Schema(query=Query, mutation=Mutation)
