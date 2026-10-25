---
title: Relay
---

[Relay](https://relay.dev/docs/guides/graphql-server-specification/) is a set
of conventions many GraphQL clients rely on: every object has a globally
unique ID, can be fetched again with a `node` query, and lists are paginated
with cursors in **connections**.

Pydantic types can implement `relay.Node` like regular Strawberry types. Mark
the field with the ID with `relay.NodeID`, and tell Strawberry how to fetch
books by ID with `resolve_nodes`:

```python
/// file: schema.py
+++from collections.abc import Iterable+++

import strawberry
from pydantic import BaseModel
+++from strawberry import relay+++


@strawberry.pydantic.type
class Book(BaseModel+++, relay.Node+++):
    id: +++relay.NodeID[+++int+++]+++
    title: str
    author: str

    +++@classmethod
    def resolve_nodes(
        cls,
        *,
        info: strawberry.Info,
        node_ids: Iterable[str],
        required: bool = False,
    ) -> list["Book | None"]:
        return [BOOKS_BY_ID.get(int(node_id)) for node_id in node_ids]+++
```

Then add the `node` field, and turn `books` into a connection:

```python
/// file: schema.py
@strawberry.type
class Query:
    +++node: relay.Node = relay.node()+++

    +++@relay.connection(relay.ListConnection[Book])+++
    def books(self) -> list[Book]:
        return BOOKS
```

`id` is now a global ID, like `Qm9vazox`: the type name and the ID, base64
encoded. Try the ID of another book in the **Variables**, and paginate with
`after: <endCursor>`.

That's the end of the tutorial, for now! Find out more in the
[Pydantic integration docs](https://strawberry.rocks/docs/integrations/pydantic).
