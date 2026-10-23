---
title: Input types
---

As mutations grow, their argument lists get long. GraphQL **input types**
group arguments into one object. They're defined like types, with
`@strawberry.input`, and fields with a default value are optional:

```python
/// file: schema.py
+++@strawberry.input
class AddBookInput:
    title: str
    author: str
    year: int | None = None+++
```

Input types can only be used as arguments, and regular types can only be
returned: that's why they're separate.

Change `add_book` to take a single `input` argument. `Book` needs a `year`
field too, so it can be returned:

```python
/// file: schema.py
@strawberry.type
class Book:
    title: str
    author: str
    +++year: int | None = None+++


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_book(self, ---title: str, author: str--- +++input: AddBookInput+++) -> Book:
        book = Book(+++title=input.title, author=input.author, year=input.year+++)
```
