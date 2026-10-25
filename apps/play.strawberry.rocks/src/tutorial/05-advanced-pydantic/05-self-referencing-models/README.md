---
title: Self-referencing models
---

The library sorts its books into genres, and genres have subgenres: science
fiction has space opera and cyberpunk, and so on. Genres are a tree, so the
model needs to reference itself.

Add a list of subgenres to `Genre`. The class isn't defined yet while its
fields are, so the type is a string, like in any Pydantic model:

```python
/// file: schema.py
@strawberry.pydantic.type
class Genre(BaseModel):
    name: str
    +++subgenres: list["Genre"] = []+++
```

Then give science fiction its subgenres:

```python
/// file: schema.py
GENRES = [
    Genre(
        name="Science fiction",
        +++subgenres=[
            Genre(name="Space opera"),
            Genre(name="Cyberpunk", subgenres=[Genre(name="Biopunk")]),
        ],+++
    ),
    Genre(name="Fantasy"),
]
```

Models defined later in the same module work the same way. For models in
another module, which may import this one, use
[`strawberry.lazy()`](https://strawberry.rocks/docs/types/lazy).

GraphQL queries can't be recursive: clients ask for each level they want, like
the query does.
