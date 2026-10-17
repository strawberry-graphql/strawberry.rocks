from collections.abc import Iterable

import strawberry
from strawberry import relay


@strawberry.type
class Fruit(relay.Node):
    id: relay.NodeID[int]
    name: str
    color: str

    @classmethod
    def resolve_nodes(
        cls,
        *,
        info: strawberry.Info,
        node_ids: Iterable[str],
        required: bool = False,
    ):
        return [FRUITS.get(int(id)) for id in node_ids]


FRUITS = {
    1: Fruit(id=1, name="Strawberry", color="red"),
    2: Fruit(id=2, name="Banana", color="yellow"),
    3: Fruit(id=3, name="Kiwi", color="green"),
    4: Fruit(id=4, name="Blueberry", color="blue"),
}


@strawberry.type
class Query:
    # Fetches any node by its global id
    node: relay.Node = relay.node()

    @relay.connection(relay.ListConnection[Fruit])
    def fruits(self) -> Iterable[Fruit]:
        return FRUITS.values()


schema = strawberry.Schema(Query)
