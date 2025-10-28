#!/bin/bash

# Script to test playground with local Strawberry build
# Usage: ./test-local.sh

set -e

echo "🍓 Testing Strawberry Playground with Local Build"
echo ""

# Step 1: Build the wheel
echo "1️⃣  Building Strawberry wheel..."
cd /Users/patrick/github/strawberry/strawberry
poetry build

# Step 2: Copy wheel to playground public directory
echo ""
echo "2️⃣  Copying wheel to playground..."
WHEEL_FILE=$(ls dist/strawberry_graphql-*.whl | tail -1)
mkdir -p /Users/patrick/github/strawberry/strawberry.rocks/apps/play.strawberry.rocks/public/dist
cp "$WHEEL_FILE" /Users/patrick/github/strawberry/strawberry.rocks/apps/play.strawberry.rocks/public/dist/

# Step 3: Start a CORS-enabled HTTP server for the wheel on port 8001
echo ""
echo "3️⃣  Starting CORS-enabled HTTP server on http://localhost:8001..."
cd /Users/patrick/github/strawberry/strawberry.rocks/apps/play.strawberry.rocks/public/dist
python3 ../../cors_server.py &
SERVER_PID=$!
echo "   Server PID: $SERVER_PID"

# Step 4: Start the playground dev server
echo ""
echo "4️⃣  Starting playground dev server..."
cd /Users/patrick/github/strawberry/strawberry.rocks/apps/play.strawberry.rocks
npm run dev &
DEV_PID=$!
echo "   Dev server PID: $DEV_PID"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Instructions:"
echo "   1. Open http://localhost:5173 (or the URL shown above)"
echo "   2. Select 'local' from the version dropdown"
echo "   3. Enable 'Use JIT Compiler ⚡' checkbox"
echo "   4. Write a GraphQL query and see the JIT in action!"
echo ""
echo "🛑 To stop servers:"
echo "   kill $SERVER_PID $DEV_PID"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for Ctrl+C
trap "kill $SERVER_PID $DEV_PID 2>/dev/null; echo ''; echo '🛑 Servers stopped'; exit" INT
wait
