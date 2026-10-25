---
title: Pydantic's types
---

Authors now have a website and a birthday, and the mutation in the editor
adds one with neither: `ursulakleguin.com` isn't a URL, and nobody is born in 2929.

Pydantic has [types](https://docs.pydantic.dev/latest/api/types/) for values
like these, which validate them. GraphQL doesn't need new types for them:
they use the scalar they validate, so a `PastDate` is a `Date`, and a
`PositiveInt` an `Int`. URLs are strings. Use them in the input:

```python
/// file: schema.py
from datetime import date

import strawberry
from pydantic import BaseModel+++, HttpUrl, PastDate+++

...

@strawberry.pydantic.input
class AddAuthorInput(BaseModel):
    name: str
    website: ---str---+++HttpUrl+++
    born: ---date---+++PastDate+++
```

Both values are now rejected. Fix them in the **Variables**, with
`https://ursulakleguin.com` and `1929-10-21`: the response has
`https://ursulakleguin.com/`, as Pydantic normalizes URLs.

Look for `AddAuthorInput` in the **Schema** tab: `website` is a `String!`,
and `born` a `Date!`, like before. These types only change what's valid.
