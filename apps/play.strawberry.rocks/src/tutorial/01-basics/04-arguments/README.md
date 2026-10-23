---
title: Arguments
---

Resolvers can take **arguments**. Add parameters to the method, with type
annotations, and Strawberry turns them into GraphQL arguments.

Change the `book` field so it takes a `title` and returns the matching book,
or `None` when there isn't one:

```python
/// file: schema.py
@strawberry.field
def book(self+++, title: str+++) -> Book +++| None+++:
    ---return BOOKS[0]---
    +++for book in BOOKS:
        if book.title == title:
            return book

    return None+++
```

The return type is `Book | None` now, because there might be no book with
that title. In GraphQL, that's a nullable `Book` instead of `Book!`.

The query passes the title in a variable: look at **Variables**, and try a
title that isn't in `BOOKS`.

Python's `snake_case` names become `camelCase` in the schema, so an argument
called `book_title` would be `bookTitle` in queries.
