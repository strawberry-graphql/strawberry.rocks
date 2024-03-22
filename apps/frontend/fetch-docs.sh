function clone_docs_from_repo() {
    working_dir=$(pwd)

    repo=$1
    destination=$working_dir/src/content/$2

    echo "Cloning docs from $repo to $destination"

    # move to a temporary directory
    cd $(mktemp -d)

    git clone -n --depth=1 --filter=tree:0 "$repo" > /dev/null 2>&1

    basename="$(basename "$repo")"
    cd "$basename"

    git sparse-checkout set --no-cone docs > /dev/null 2>&1
    git checkout > /dev/null 2>&1

    mkdir -p $destination

    mv docs/* $destination

    cd $working_dir
}

rm -rf src/content/docs

clone_docs_from_repo "https://github.com/strawberry-graphql/strawberry" "docs"
clone_docs_from_repo "https://github.com/strawberry-graphql/strawberry-django" "docs/django"

# rename all .md files in the docs folder to have a .mdx extension

find src/content/docs -type f -name "*.md" -exec bash -c 'mv "$1" "${1%.md}.mdx"' _ {} \;
