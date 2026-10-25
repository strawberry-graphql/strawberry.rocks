---
title: Defaults and optional fields
---

Searching for books takes an input with the text to look for, how many books
to return, and an optional author. Clients rarely care about the limit, but
they have to send it, as every field of the input is required.

Give the limit a default, and keep it reasonable with a constraint:

```python
/// file: schema.py
+++from typing import Annotated+++

import strawberry
from pydantic import BaseModel+++, Field+++

...

@strawberry.pydantic.input
class SearchInput(BaseModel):
    text: str
    limit: +++Annotated[+++int+++, Field(ge=1, le=10)] = 2+++
    author: str | None+++ = None+++
```

The query works without a limit now. In the **Schema** tab, the default is
part of the input, `limit: Int! = 2`, so clients can see it.

`author` could already be left out, as GraphQL makes nullable input fields
optional. Pydantic gets `None` for it then, as if the client had sent `null`.
Its default makes the model work the same way outside of GraphQL.

Defaults from a `default_factory` aren't in the schema: Pydantic calls the
factory when the field is left out, so the field is nullable in GraphQL.
