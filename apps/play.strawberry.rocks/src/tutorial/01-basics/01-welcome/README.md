---
title: Welcome to Strawberry
---

Welcome to the Strawberry tutorial! You'll learn how to build GraphQL APIs in
Python, one small step at a time.

Every lesson comes with a running Strawberry server, right here in your
browser:

- **schema.py** is your Python code. It defines the schema: the types, fields
  and operations your API exposes.
- **Query** is the GraphQL query sent to it, with its **Variables** and
  **Headers** next to it.
- **Response** shows what the server sent back. It updates as you type.

Try it now: change `"world"` in `schema.py` to your name, and watch the
response change.

```python
/// file: schema.py
@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return +++"Strawberry"+++
```

When a lesson asks you to change something, you can press **Solve** at the top
to see the answer, and **Reset** to start over. Press **Next** when you're
ready.
