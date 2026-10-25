---
title: Nested inputs
---

Members can now borrow several books at once. `BorrowInput` holds a list of
`LoanInput`s, one for each book, and Pydantic validates the whole tree
together.

Loans last up to four weeks. Add that constraint to `weeks`:

```python
/// file: schema.py
+++from typing import Annotated, Self+++

import strawberry
from pydantic import BaseModel+++, Field, model_validator+++

...

@strawberry.pydantic.input
class LoanInput(BaseModel):
    isbn: str
    weeks: +++Annotated[int, Field(ge=1, le=4)]+++ = 2
```

The **Variables** have two invalid loans, and the response reports both at
once, each with its full location, like `["input", "items", "1", "weeks"]`.

Some rules are about the input as a whole. A
[model validator](https://docs.pydantic.dev/latest/concepts/validators/#model-validators)
sees all the fields: make sure nobody borrows the same book twice.

```python
/// file: schema.py
@strawberry.pydantic.input
class BorrowInput(BaseModel):
    member: str
    items: list[LoanInput]

    +++@model_validator(mode="after")
    def check_duplicates(self) -> Self:
        isbns = [item.isbn for item in self.items]

        if len(isbns) != len(set(isbns)):
            raise ValueError("Each book can only be borrowed once")

        return self+++
```

`after` validators run once the fields are valid, so fix the weeks first. The
error of a model validator is located at the model: here that's `["input"]`.
