import strawberry
from strawberry.dataloader import DataLoader

USERS = {1: "Patrick", 2: "Marco"}


@strawberry.type
class User:
    id: int
    name: str


async def load_users(ids: list[int]) -> list[User]:
    # Called once with all the ids, see the Console tab
    print(f"Loading users {ids}")

    return [User(id=id, name=USERS[id]) for id in ids]


@strawberry.type
class Post:
    title: str
    author_id: strawberry.Private[int]

    @strawberry.field
    async def author(self, info: strawberry.Info) -> User:
        return await info.context["user_loader"].load(self.author_id)


@strawberry.type
class Query:
    @strawberry.field
    def posts(self) -> list[Post]:
        return [
            Post(title="Hello", author_id=1),
            Post(title="Dataloaders", author_id=2),
            Post(title="Again", author_id=1),
        ]


# The playground calls this for every request, so each request gets its
# own loader and cache
async def context_getter():
    return {"user_loader": DataLoader(load_fn=load_users)}


schema = strawberry.Schema(Query)
