---
title: Lists
---

One book isn't much of a library. Fields can return lists too: annotate them
with `list[...]`, and they become GraphQL lists.

There's now a `BOOKS` list in `schema.py`. Add a `books` field to `Query` that
returns it, so the query works:

```python
/// file: schema.py
@strawberry.type
class Query:
    @strawberry.field
    def book(self) -> Book:
        return BOOKS[0]

    +++@strawberry.field
    def books(self) -> list[Book]:
        return BOOKS+++
```

Notice how the query picks the fields it wants for every book in the list.
Try removing `author` from it: the server only sends back what you ask for.

```graphql
/// file: Query
{
  books {
    title
    ---author---
  }
}
```
