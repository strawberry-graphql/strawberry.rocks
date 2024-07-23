# /// script
# dependencies = [
#    "griffe",
#    "griffe-typingdoc",
# ]
# requires-python = ">=3.11"
# ///

import os
import shutil
import subprocess
import tempfile
import griffe
from pathlib import Path


def fetch_api_docs(repo: str, package_name: str, branch: str = "main") -> None:
    working_dir = Path.cwd()
    destination = working_dir / "src" / "content" / "api"

    tmpdirname = Path("/tmp/griffe")
    tmpdirname.mkdir(exist_ok=True)
    shutil.rmtree(tmpdirname / "strawberry", ignore_errors=True)

    os.chdir(tmpdirname)

    subprocess.run(["git", "clone", "--depth", "1", "-b", branch, repo], check=True)

    repo_name = os.path.basename(repo)
    os.chdir(repo_name)

    data = griffe.load(package_name, docstring_parser="google")

    os.makedirs(destination, exist_ok=True)

    with (destination / f"{package_name}.json").open("w") as f:
        f.write(data.as_json(indent=2, full=True, sort_keys=True))


def clone_docs_from_repo(repo: str, destination_subpath: str, branch="main") -> None:
    working_dir = os.getcwd()
    destination = os.path.join(working_dir, "src", "content", destination_subpath)

    print(f"Cloning docs from {repo} to {destination} on branch {branch}")

    with tempfile.TemporaryDirectory() as tmpdirname:
        os.chdir(tmpdirname)

        subprocess.run(
            ["git", "clone", "-n", "--depth=1", "--filter=tree:0", "-b", branch, repo],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        repo_name = os.path.basename(repo)
        os.chdir(repo_name)

        subprocess.run(
            ["git", "sparse-checkout", "set", "--no-cone", "docs"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        subprocess.run(
            ["git", "checkout"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )

        os.makedirs(destination, exist_ok=True)

        for item in os.listdir("docs"):
            s = os.path.join("docs", item)
            d = os.path.join(destination, item)
            if os.path.isdir(s):
                shutil.copytree(s, d, dirs_exist_ok=True)
            else:
                shutil.copy2(s, d)

    os.chdir(working_dir)


# Remove existing docs directory
shutil.rmtree("src/content/docs", ignore_errors=True)

# Clone docs from repository
clone_docs_from_repo("https://github.com/strawberry-graphql/strawberry", "docs")
clone_docs_from_repo(
    "https://github.com/strawberry-graphql/strawberry-django",
    "docs/django",
    "feature/new-docs",
)

# fetch_api_docs("https://github.com/strawberry-graphql/strawberry", "strawberry")


# Rename all .md files to .mdx in the docs folder
for root, _, files in os.walk("src/content/docs"):
    for file in files:
        if file.endswith(".md"):
            file_path = os.path.join(root, file)
            new_file_path = os.path.splitext(file_path)[0] + ".mdx"
            os.rename(file_path, new_file_path)
