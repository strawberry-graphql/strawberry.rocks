---
title: Field permissions
---

Librarians need members' emails to remind them about late books, but nobody
else should see them. Strawberry's
[permissions](https://strawberry.rocks/docs/guides/permissions) work on
Pydantic types too.

`IsLibrarian` checks the request's `Authorization` header. Add it to the email
field with `strawberry.field()`, inside `Annotated` like other options. Make
the field nullable, so a denied email is `null` instead of failing the whole
member:

```python
/// file: schema.py
from typing import +++Annotated, +++Any

...

@strawberry.pydantic.type
class Member(BaseModel):
    name: str
    email: +++Annotated[
        +++str+++ | None,
        strawberry.field(permission_classes=[IsLibrarian]),
    ]+++
```

The emails are now `null`, with an error for each. Log in as a librarian by
adding the header in the **Headers** tab:

```json
/// file: headers.json
{
  "Authorization": "Bearer librarian"
}
```

Resolver fields take permissions as well:
`@strawberry.pydantic.field(permission_classes=[IsLibrarian])`.
