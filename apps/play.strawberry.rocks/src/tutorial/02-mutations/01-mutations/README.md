---
title: Mutations
---

Queries read data. To change it, GraphQL has **mutations**. They live on their
own `Mutation` type, and are defined with `@strawberry.mutation`. Like
queries, they take arguments and return a type, so the client can ask for the
fields it needs from the result.

Add a `Mutation` type with an `add_book` mutation that appends a book to
`BOOKS` and returns it, and pass it to the schema:

```python
/// file: schema.py
+++@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_book(self, title: str, author: str) -> Book:
        book = Book(title=title, author=author)
        BOOKS.append(book)

        return book+++


schema = strawberry.Schema(query=Query+++, mutation=Mutation+++)
```

Each run starts from a fresh server, so the new book is gone the next time
the code runs.
