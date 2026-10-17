import strawberry


@strawberry.type
class Todo:
    id: strawberry.ID
    text: str
    done: bool


TODOS: dict[str, Todo] = {
    "1": Todo(id=strawberry.ID("1"), text="Try Strawberry", done=True),
}


@strawberry.input
class AddTodoInput:
    text: str
    done: bool = False


@strawberry.type
class Query:
    @strawberry.field
    def todos(self) -> list[Todo]:
        return list(TODOS.values())


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_todo(self, input: AddTodoInput) -> Todo:
        id = strawberry.ID(str(len(TODOS) + 1))
        TODOS[id] = Todo(id=id, text=input.text, done=input.done)

        return TODOS[id]

    @strawberry.mutation
    def toggle_todo(self, id: strawberry.ID) -> Todo:
        todo = TODOS[id]
        todo.done = not todo.done

        return todo


schema = strawberry.Schema(query=Query, mutation=Mutation)
