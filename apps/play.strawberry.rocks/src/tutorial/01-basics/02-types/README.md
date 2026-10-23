---
title: Types and fields
---

A schema is made of **types**, and each type has **fields**. In Strawberry, a
type is a Python class decorated with `@strawberry.type`, and its fields are
its type annotations. Add a `Book` type with a `title` and an `author`:

```python
/// file: schema.py
import strawberry


+++@strawberry.type
class Book:
    title: str
    author: str+++


@strawberry.type
class Query:
```

Strawberry reads the annotations to build the GraphQL type, so a `str`
becomes a `String!`. Fields are required unless you say otherwise.

`Query` is a type too: it's where every query starts. The query in this lesson
asks for a `book`, but `Query` has no such field yet, so the response is an
error. Add a `book` field that returns one:

```python
/// file: schema.py
@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "world"

    +++@strawberry.field
    def book(self) -> Book:
        return Book(title="The Great Gatsby", author="F. Scott Fitzgerald")+++
```

Open the **Schema** tab to see the GraphQL types Strawberry made from your
classes.
