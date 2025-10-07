# Strawberry GraphQL documentation tasks

# Fetch all data (docs, sponsors, downloads, release) and generate sidebar
fetch-data:
    cd apps/frontend && ./fetch-data.py

# Install dependencies
install:
    pnpm install

# Run the frontend dev server
dev:
    cd apps/frontend && pnpm dev

# Build the frontend
build:
    cd apps/frontend && pnpm build
