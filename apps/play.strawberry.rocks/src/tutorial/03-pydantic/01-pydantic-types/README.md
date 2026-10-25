---
title: Pydantic models
---

Many Python apps describe their data with [Pydantic](https://docs.pydantic.dev)
models. Exposing them in a GraphQL API used to mean writing every field twice:
once in the model, and once in a Strawberry type, with code to copy the data
from one to the other. That's what `schema.py` does now.

Strawberry can use Pydantic models as GraphQL types directly. Delete
`BookType`, decorate the model with `@strawberry.pydantic.type`, and return the
books as they are:

```python
/// file: schema.py
+++@strawberry.pydantic.type+++
class Book(BaseModel):
    title: str
    author: str
    year: Annotated[int, Field(description="The year the book was first published")]


---@strawberry.type
class BookType:
    ...---


@strawberry.type
class Query:
    @strawberry.field
    def books(self) -> list[+++Book+++]:
        +++return BOOKS+++
```

The response is the same, with half the code. `Book` is still a regular
Pydantic model: you create and validate it like before, and its fields become
GraphQL fields, following the same rules as `@strawberry.type`.

Pydantic's field descriptions are kept too: open the **Schema** tab to see the
description of `year`.
