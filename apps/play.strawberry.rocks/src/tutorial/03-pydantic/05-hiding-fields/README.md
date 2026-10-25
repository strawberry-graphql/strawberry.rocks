---
title: Hiding fields
---

The library's members come from a model that's also used by a REST API. It
masks emails with a
[field serializer](https://docs.pydantic.dev/latest/concepts/serialization/#field-serializers),
and it has a password hash that should never leave the server.

GraphQL doesn't serialize models with `model_dump()`: fields are read from the
model, so serializers wouldn't apply. As they're often used to hide or redact
values, Strawberry raises an error instead of exposing the email as it is.

Hide the email with `strawberry.Private`, and show the masked version with a
resolver field. Leave out the password hash with `Field(exclude=True)`, which
also leaves it out of `model_dump()`:

```python
/// file: schema.py
+++from typing import Annotated+++

import strawberry
from pydantic import BaseModel, +++Field, +++field_serializer


@strawberry.pydantic.type
class Member(BaseModel):
    name: str
    email: +++strawberry.Private[+++str+++]+++
    password_hash: +++Annotated[+++str+++, Field(exclude=True)]+++

    @field_serializer("email")
    def mask_email(self, email: str) -> str:
        name, domain = email.split("@")
        return f"{name[0]}***@{domain}"

    +++@strawberry.pydantic.field
    def masked_email(self) -> str:
        return self.mask_email(self.email)+++
```

Serializers on fields that aren't exposed are fine, so the REST API keeps
working as before.

Pydantic's `SecretStr` is exposed with its masked value, `"**********"`, but
secrets rarely belong in a schema: mark them as private too.
