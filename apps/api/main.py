"""The API for strawberry.rocks and play.strawberry.rocks

Vercel loads `app` from this file, see README.md
"""

from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Route
from strawberry.asgi import GraphQL

from strawberry_rocks_api.schema import schema

ALLOWED_ORIGINS = [
    "https://strawberry.rocks",
    "https://play.strawberry.rocks",
    # Local dev servers of the site and the playground
    "http://localhost:3000",
    "http://localhost:4321",
    "http://localhost:5173",
    "http://localhost:5174",
]

app = Starlette(
    routes=[Route("/graphql", GraphQL(schema))],
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_methods=["POST"],
            allow_headers=["content-type"],
            allow_origins=ALLOWED_ORIGINS,
            # Vercel previews of the site and the playground
            allow_origin_regex=r"https://[a-z0-9-]+-strawberry-graphql\.vercel\.app",
        )
    ],
)
