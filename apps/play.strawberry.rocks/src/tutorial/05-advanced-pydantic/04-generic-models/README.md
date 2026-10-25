---
title: Generic models
---

Lists grow, so the API returns them a page at a time. `BookPage` works for
books, but authors need pages too, and copying the class for every type
doesn't scale.

Pydantic models can be [generic](https://docs.pydantic.dev/latest/concepts/models/#generic-models),
and so can Strawberry types. Replace `BookPage` with a generic `Page`:

```python
/// file: schema.py
+++@strawberry.pydantic.type
class Page[T](BaseModel):
    items: list[T]
    total: int
    offset: int

    @computed_field
    @property
    def has_more(self) -> bool:
        return self.offset + len(self.items) < self.total+++
```

Then use `Page[Book]` and `Page[Author]` as return types, and create pages with
them, like `Page[Book](items=..., total=..., offset=...)`.

Each parametrization is a GraphQL type of its own, named after its type
argument: look for `BookPage` and `AuthorPage` in the **Schema** tab. To pick
another name, decorate a subclass, like `class Shelf(Page[Book])`.
