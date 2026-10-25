---
title: Interfaces
---

The library lends magazines too. Books and magazines share some fields, and
clients want them in a single list, sorted by title.

A GraphQL **interface** describes the fields that several types have in
common. Make one with `@strawberry.pydantic.interface`, and implement it by
subclassing, like any Pydantic model: the fields are inherited.

```python
/// file: schema.py
+++@strawberry.pydantic.interface
class LibraryItem(BaseModel):
    id: strawberry.ID
    title: str+++


@strawberry.pydantic.type
class Book(+++LibraryItem+++):
    author: str


@strawberry.pydantic.type
class Magazine(+++LibraryItem+++):
    issue: int
```

Then add an `items` field to `Query` that returns both:

```python
/// file: schema.py
+++@strawberry.field
def items(self) -> list[LibraryItem]:
    return sorted([*BOOKS, *MAGAZINES], key=lambda item: item.title)+++
```

The query asks for the shared fields directly, and for the others with
`... on Book` and `... on Magazine`.

Pydantic types can implement regular `@strawberry.interface`s too, including
their fields with resolvers. List the interface after `BaseModel`, like
`class Book(BaseModel, Named)`, so Pydantic's `__init__` is kept.
