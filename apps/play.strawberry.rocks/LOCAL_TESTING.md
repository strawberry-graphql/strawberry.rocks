# Testing JIT Locally in the Playground

This guide explains how to test your local Strawberry changes (including the JIT compiler) in the playground.

## Quick Start

Run the provided script:

```bash
cd /Users/patrick/github/strawberry/strawberry.rocks/apps/play.strawberry.rocks
./test-local.sh
```

This script will:

1. Build a wheel from your local Strawberry code
2. Start an HTTP server to serve the wheel (port 8001)
3. Start the playground dev server (port 5173)

Then:

1. Open http://localhost:5173
2. Select **"local"** from the version dropdown (top left)
3. Enable **"Use JIT Compiler ⚡"** checkbox (above Query editor)
4. Write a query and see the JIT in action!

## Manual Steps

If you prefer to run steps manually:

### 1. Build the Wheel

```bash
cd /Users/patrick/github/strawberry/strawberry
poetry build
```

This creates `dist/strawberry_graphql-0.284.1-py3-none-any.whl`

### 2. Serve the Wheel

Copy the wheel to the playground and serve it with CORS enabled:

```bash
mkdir -p /Users/patrick/github/strawberry/strawberry.rocks/apps/play.strawberry.rocks/public/dist
cp dist/strawberry_graphql-*.whl /Users/patrick/github/strawberry/strawberry.rocks/apps/play.strawberry.rocks/public/dist/

cd /Users/patrick/github/strawberry/strawberry.rocks/apps/play.strawberry.rocks/public/dist
python3 ../../cors_server.py
```

**Important:** You must use the `cors_server.py` script, not the standard `python3 -m http.server`, because browsers require CORS headers to fetch files from different origins.

Keep this terminal open (or run in background with `&`).

### 3. Start Playground Dev Server

In a new terminal:

```bash
cd /Users/patrick/github/strawberry/strawberry.rocks/apps/play.strawberry.rocks
npm run dev
```

### 4. Test in Browser

1. Open the URL shown (usually http://localhost:5173)
2. Select **"local"** from version dropdown
3. Wait for Pyodide to load (check browser console)
4. Enable **"Use JIT Compiler ⚡"** checkbox
5. Try a query like:

```graphql
query {
  user {
    name
    age
  }
}
```

## What to Look For

When JIT is enabled, you should see:

1. **"JIT Code ⚡" tab** - Shows the generated Python code
2. **Performance metrics** in status bar - "JIT: Xms | Standard: Yms (Zx faster)"
3. **Warning badge** if query uses @defer/@stream (JIT falls back to standard)

## Troubleshooting

### "local" version doesn't appear

- Refresh the page after modifying `version-selector.tsx`

### Wheel not loading

- Check that HTTP server is running on port 8001
- Check browser console for CORS errors
- Verify wheel filename matches in `pyodide.worker.js` (line 25)

### JIT not working

- Check browser console for Python errors
- Verify JIT checkbox is enabled
- Look for the "JIT Code ⚡" tab - if it doesn't appear, compilation failed

### Changes not reflected

- Rebuild the wheel: `poetry build`
- Reload the page in browser
- Select a different version, then back to "local" to force re-install

## Reverting Changes

To restore the original playground configuration:

```bash
cd /Users/patrick/github/strawberry/strawberry.rocks/apps/play.strawberry.rocks
mv public/js/pyodide.worker.js.bak public/js/pyodide.worker.js
git checkout src/components/version-selector.tsx
```

## Files Modified for Local Testing

- `public/js/pyodide.worker.js` - Added support for "local" version
- `src/components/version-selector.tsx` - Added "local" to version dropdown
- `test-local.sh` - Automated test script (new file)
- `LOCAL_TESTING.md` - This file (new)

**Note:** These changes are for local development only. Don't commit the pyodide.worker.js and version-selector.tsx changes to the repository!
