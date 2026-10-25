---
title: Sharing fields
---

`Book` and `BookInput` have the same fields, written twice. And the mobile
team wants `year` to be called `yearPublished`, in both, which the query
already uses.

A model can only have one GraphQL role, so the same class can't be a type and
an input. But both can extend an undecorated model with the shared fields:

```python
/// file: schema.py
+++class BookFields(BaseModel):
    title: Annotated[str, Field(min_length=1)]
    year: Annotated[int, strawberry.field(name="yearPublished")]+++


@strawberry.pydantic.type
class Book(+++BookFields+++):
    id: strawberry.ID


@strawberry.pydantic.input
class BookInput(+++BookFields+++):
    pass
```

`strawberry.field()` in `Annotated` customizes a field of a model: its `name`,
`description`, `deprecation_reason`, `permission_classes`, `directives` or
`graphql_type`. Customizations on a base model are inherited, so `yearPublished`
is the name in both types.

Pydantic aliases don't change GraphQL names: they're about how the model is
serialized, for example in a REST API, so the two can differ.
