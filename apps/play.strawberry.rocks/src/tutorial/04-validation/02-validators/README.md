---
title: Validators
---

Constraints cover the common cases. For anything else, Pydantic has
[validators](https://docs.pydantic.dev/latest/concepts/validators/): functions
that check a value, and can also clean it up.

Books now have an ISBN, but people type them in all sorts of ways, like the
one in the **Variables**. Add a field validator that removes the dashes and
spaces, and checks that 13 digits are left:

```python
/// file: schema.py
from pydantic import BaseModel, +++ConfigDict, +++Field+++, field_validator+++

...

@strawberry.pydantic.input
class AddBookInput(BaseModel):
    +++model_config = ConfigDict(str_strip_whitespace=True)+++

    title: Annotated[str, Field(min_length=1)]
    author: Annotated[str, Field(min_length=1)]
    year: Annotated[int, Field(ge=1450, le=date.today().year)]
    isbn: str

    +++@field_validator("isbn")
    @classmethod
    def normalize_isbn(cls, isbn: str) -> str:
        digits = isbn.replace("-", "").replace(" ", "")

        if not (digits.isdigit() and len(digits) == 13):
            raise ValueError("An ISBN has 13 digits")

        return digits+++
```

The response now has the cleaned up ISBN, and the title without the extra
spaces: `model_config` options like `str_strip_whitespace` apply to inputs as
well.

Try an ISBN that's too short: the message you raised is in the error, at the
location of the field.
