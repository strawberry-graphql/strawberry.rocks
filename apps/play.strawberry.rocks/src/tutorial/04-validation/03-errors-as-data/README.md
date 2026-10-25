---
title: Errors as data
---

Validation errors in `errors` are easy to miss, and clients have to dig
through `extensions` to show them next to a form. Many APIs return them as
part of the data instead, in the schema where clients can see them.

Strawberry has a `ValidationError` type for that. Add it to the mutation's
return type, and register `PydanticValidationErrorHandler` on the schema, so
validation errors become `ValidationError`s instead of GraphQL errors:

```python
/// file: schema.py
+++from strawberry.pydantic import PydanticValidationErrorHandler, ValidationError+++

...

@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_book(self, input: AddBookInput) -> Book +++| ValidationError+++:
        ...


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    +++exception_handlers=[PydanticValidationErrorHandler()],+++
)
```

`addBook` now returns a union, so the query asks for the fields of each type
with `... on`. The ISBN in the **Variables** is invalid, so the response has a
`ValidationError` with its `errors`. Fix it, and you get the `Book`.
