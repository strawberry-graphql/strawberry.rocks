# Strawberry GraphQL documentation tasks

# Fetch docs from the strawberry repository
fetch-docs:
    cd apps/frontend && ./fetch-docs.sh

# Generate sidebar configuration from README.mdx
generate-sidebar:
    cd apps/frontend && node generate-sidebar.js

# Install dependencies
install:
    pnpm install

# Run the frontend dev server
dev:
    cd apps/frontend && pnpm dev

# Build the frontend
build:
    cd apps/frontend && pnpm build
