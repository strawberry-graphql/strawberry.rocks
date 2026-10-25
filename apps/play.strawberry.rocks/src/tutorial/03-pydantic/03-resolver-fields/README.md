---
title: Fields with resolvers
---

Some fields need code to run when they're asked for, like looking up related
data. In a Pydantic model, add them with `@strawberry.pydantic.field`: Pydantic
doesn't allow `@strawberry.field` in a model, as it would see it as a field of
its own.

Authors are now a model of their own, and books point to them with a private
`author_id`. Add a `books` field to `Author`, with an optional argument:

```python
/// file: schema.py
@strawberry.pydantic.type
class Author(BaseModel):
    id: strawberry.ID
    name: str

    +++@strawberry.pydantic.field
    def books(self, published_before: int | None = None) -> list[Book]:
        return [
            book
            for book in BOOKS
            if book.author_id == self.id
            and (published_before is None or book.year < published_before)
        ]+++
```

It takes the same options as `strawberry.field`, like `description` or
`permission_classes`, and resolvers can be `async` and take `info` too. They
stay regular methods of the model, so your Python code can call them as well.

Try passing `publishedBefore: 1970` to `books` in the query.
