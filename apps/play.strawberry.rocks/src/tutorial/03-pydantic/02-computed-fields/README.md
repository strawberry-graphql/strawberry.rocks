---
title: Computed and private fields
---

Models often hold data that shouldn't be in the API as it is. Our books now
have a price, stored in cents to avoid rounding errors, which clients
shouldn't have to format themselves.

Fields marked with `strawberry.Private` stay in the model, so your code can
use them, but they're left out of the schema. Pydantic's
[computed fields](https://docs.pydantic.dev/latest/concepts/fields/#the-computed_field-decorator)
are part of the GraphQL type, like they're part of `model_dump()`.

Hide `price_cents`, and add a `price` computed field that formats it:

```python
/// file: schema.py
from pydantic import BaseModel, Field+++, computed_field+++

...

@strawberry.pydantic.type
class Book(BaseModel):
    title: str
    author: str
    year: Annotated[int, Field(description="The year the book was first published")]
    price_cents: +++strawberry.Private[+++int+++]+++

    +++@computed_field
    @property
    def price(self) -> str:
        """The price, ready to show to readers"""
        return f"${self.price_cents / 100:.2f}"+++
```

The docstring becomes the field's description. Fields excluded from
serialization with `Field(exclude=True)` are left out of the schema too.
