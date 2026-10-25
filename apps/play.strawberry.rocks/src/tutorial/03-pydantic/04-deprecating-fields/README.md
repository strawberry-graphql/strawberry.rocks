---
title: Deprecating fields
---

APIs change, but clients don't all update at once. Our books have an
`isbn10`, from before ISBNs had 13 digits. New clients should use `isbn`,
but removing `isbn10` would break the old ones.

GraphQL lets you mark a field as deprecated instead: it keeps working, but
it's flagged in the schema, so editors and tools can warn the people who use
it. The query also asks GraphQL about `Book`'s fields, so you can see what
changes.

Pydantic has its own way to deprecate fields, and Strawberry uses it for the
schema too. Deprecate `isbn10`:

```python
/// file: schema.py
@strawberry.pydantic.type
class Book(BaseModel):
    title: str
    isbn: Annotated[str, Field(description="The book's 13 digit ISBN")]
    isbn10: +++Annotated[+++str+++, Field(deprecated="Use isbn")]+++
```

`isbn10` now has `isDeprecated: true`, and the reason. In the **Schema** tab
it has a `@deprecated` directive.

Pydantic also warns when your code reads the field, including when GraphQL
resolves it, which helps finding the code that still uses it.

Inputs can deprecate fields as well, as long as clients can leave them out:
the field needs a default, or to be nullable.
