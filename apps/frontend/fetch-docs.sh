#!/usr/bin/env bash

# Fetch docs from strawberry and strawberry-django repositories
# This script downloads the latest docs folder from the main branch
# and places them in the content/docs directory with .mdx extensions

set -e

# Save the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to process a repository
process_repo() {
    local REPO_URL=$1
    local DOCS_PATH=$2
    local TARGET_DIR=$3
    local TEMP_DIR=$(mktemp -d)

    echo "Fetching latest docs from $REPO_URL..."

    # Clone only the docs folder with depth 1 (latest commit only)
    cd "$TEMP_DIR"
    git clone --depth 1 --filter=blob:none --sparse "$REPO_URL" repo
    cd repo
    git sparse-checkout set "$DOCS_PATH"

    # Remove existing docs (keep any non-docs files)
    echo "Removing existing docs in $TARGET_DIR..."
    if [ -d "$TARGET_DIR" ]; then
        find "$TARGET_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -delete
        find "$TARGET_DIR" -type d -empty -delete
    fi

    # Create target directory if it doesn't exist
    mkdir -p "$TARGET_DIR"

    # Copy docs and rename .md to .mdx
    echo "Copying docs and renaming to .mdx..."
    cd "$TEMP_DIR/repo/$DOCS_PATH"
    find . -type f -name "*.md" | while read -r file; do
        # Get the directory path
        dir=$(dirname "$file")
        # Get the filename without extension
        filename=$(basename "$file" .md)
        # Create target directory
        mkdir -p "$TARGET_DIR/$dir"
        # Copy and rename
        cp "$file" "$TARGET_DIR/$dir/$filename.mdx"
    done

    # Copy any other files (images, etc.)
    find . -type f ! -name "*.md" | while read -r file; do
        dir=$(dirname "$file")
        mkdir -p "$TARGET_DIR/$dir"
        cp "$file" "$TARGET_DIR/$dir/"
    done

    # Remove HTML comments from .mdx files (Astro doesn't support them)
    echo "Removing HTML comments..."
    find "$TARGET_DIR" -name "*.mdx" -type f -exec sed -i 's/<!--.*-->//g' {} +

    # Fix markdown links - remove .md extensions and handle /index
    echo "Fixing markdown links..."
    find "$TARGET_DIR" -name "*.mdx" -type f -exec sed -i 's/\.md)/)/g' {} +
    find "$TARGET_DIR" -name "*.mdx" -type f -exec sed -i 's/(\.\/index)/(./g' {} +
    find "$TARGET_DIR" -name "*.mdx" -type f -exec sed -i 's/(\.\.\/index)/(..\//g' {} +
    find "$TARGET_DIR" -name "*.mdx" -type f -exec sed -i 's/(\.\.\/index#)/(..#/g' {} +

    # Remove first heading and add component imports
    echo "Processing MDX files..."
    find "$TARGET_DIR" -name "*.mdx" -type f | while read -r file; do
        needs_imports=false
        imports=""

        # Check which components are used
        if grep -q "<Note" "$file"; then
            needs_imports=true
            imports="${imports}import Note from '@/components/Pages/Callout/Note.astro';\n"
        fi
        if grep -q "<Tip" "$file"; then
            needs_imports=true
            imports="${imports}import Tip from '@/components/Pages/Callout/Tip.astro';\n"
        fi
        if grep -q "<Warning" "$file"; then
            needs_imports=true
            imports="${imports}import Warning from '@/components/Pages/Callout/Warning.astro';\n"
        fi
        if grep -q "<CodeGrid" "$file"; then
            needs_imports=true
            imports="${imports}import CodeGrid from '@/components/CodeGrid.astro';\n"
        fi
        if grep -q "<ExtensionsList" "$file"; then
            needs_imports=true
            imports="${imports}import ExtensionsList from '@/components/ExtensionsList.astro';\n"
        fi

        # Process file: add imports and remove first heading
        awk -v imports="$imports" -v needs_imports="$needs_imports" '
            /^---$/ {
                count++
                print
                if (count == 2) {
                    if (needs_imports == "true") {
                        printf "\n"
                        printf imports
                    }
                    first_heading_removed = 0
                }
                next
            }
            # Remove first h1 heading after frontmatter
            count >= 2 && /^# / && first_heading_removed == 0 {
                first_heading_removed = 1
                next
            }
            { print }
        ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    done

    # Cleanup
    rm -rf "$TEMP_DIR"
}

# Process strawberry main docs
process_repo \
    "https://github.com/strawberry-graphql/strawberry" \
    "docs" \
    "$SCRIPT_DIR/src/content/docs/strawberry"

# Process strawberry-django docs
process_repo \
    "https://github.com/strawberry-graphql/strawberry-django" \
    "docs" \
    "$SCRIPT_DIR/src/content/docs/django"

echo "Done! Docs fetched and renamed to .mdx"
