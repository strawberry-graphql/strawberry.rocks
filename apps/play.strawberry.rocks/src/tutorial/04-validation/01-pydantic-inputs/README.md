---
title: Inputs and validation
---

GraphQL checks that inputs have the right types, but not that they make
sense. The mutation in this lesson happily adds a book without a title,
published a thousand years from now: look at the **Variables**.

Pydantic models can be inputs too, with `@strawberry.pydantic.input`, and
Strawberry validates them with Pydantic before calling your resolver. Turn
`AddBookInput` into a Pydantic input with some
[constraints](https://docs.pydantic.dev/latest/concepts/fields/#field-constraints):

```python
/// file: schema.py
+++from datetime import date
from typing import Annotated+++

import strawberry
from pydantic import BaseModel+++, Field+++

...

+++@strawberry.pydantic.input
class AddBookInput(BaseModel):
    title: Annotated[str, Field(min_length=1)]
    author: Annotated[str, Field(min_length=1)]
    year: Annotated[int, Field(ge=1450, le=date.today().year)]+++
```

The response is now an error, with every problem in its `validationErrors`
extension. Each one has the `location` of the value, using the names the
client sent, a `message`, and the
[Pydantic error type](https://docs.pydantic.dev/latest/errors/validation_errors/)
in `type`.

Fix the variables, and the book is added. As the input is a model, the
resolver can build the book with `Book(**input.model_dump())`.
