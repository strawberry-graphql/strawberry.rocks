# /// script
# dependencies = [
#    "griffe",
#    "griffe-typingdoc",
#    "mistune",
#    "python-frontmatter",
# ]
# requires-python = ">=3.11"
# ///

import os
import shutil
import json
import subprocess
import tempfile
import griffe
from griffe import JSONEncoder
import frontmatter
import textwrap

import mistune
from mistune.renderers.markdown import MarkdownRenderer
from mistune.util import unescape
import re

from pathlib import Path


def _get_one_of(data: dict, keys: list[str]) -> str:
    for key in keys:
        if key in data:
            return data[key]

    raise KeyError(f"Could not find any of the keys {keys} in {data}")


def _sort_dict(data):
    if "members" in data:
        data["members"] = sorted(
            data["members"],
            key=lambda x: str(_get_one_of(x, ["filepath", "path", "name"])),
        )

        for member in data["members"]:
            member = _sort_dict(member)

    return data


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

    data = _sort_dict(data.as_dict(full=True))

    with (destination / f"{package_name}.json").open("w") as f:
        json.dump(data, f, indent=2, cls=JSONEncoder, full=True)


def clone_docs_from_repo(repo: str, destination_subpath: str, branch="main") -> None:
    working_dir = Path.cwd()
    destination = working_dir / "src" / "content" / destination_subpath

    class StrawberryRenderer(MarkdownRenderer):
        def __init__(self, file_path: Path) -> None:
            self.file_path = file_path

            super().__init__()

        def block_quote(self, token, state) -> str:
            text = self.render_children(token, state)
            text = textwrap.indent(text, "> ", lambda _: True)
            text = text + "\n\n"

            return text

        def codespan(self, token, state) -> str:
            # TODO: not sure what is escaping the code blocks
            return "`" + unescape(token["raw"]) + "`"

        def _fix_url(self, url: str | None) -> str | None:
            if not url:
                return url

            if url.startswith("/"):
                return url

            if url.startswith("http"):
                return url

            url, hash = url.split("#") if "#" in url else (url, None)

            if not url.endswith(".md"):
                return url

            destination_path = self.file_path.relative_to(working_dir).parent / Path(
                url
            )

            # TODO: would be nice to check if the file exists

            new_url = (
                (working_dir / destination_path)
                .resolve()
                .relative_to(working_dir / "src" / "content")
            )

            new_url = new_url.with_suffix("")

            if new_url.name == "index":
                new_url = new_url.parent

            suffix = f"#{hash}" if hash else ""

            return "/" + str(new_url) + suffix

        def link(self, token, state):
            url = token["attrs"].get("url")
            url = self._fix_url(url)

            # copied from https://github.com/lepture/mistune/blob/231df0141c8a9006df8c0e49f6b7463afdcfb2bd/src/mistune/renderers/markdown.py
            # and modified to remove the conversion from [link](link) to <link>
            label = token.get("label")
            text = self.render_children(token, state)
            out = "[" + text + "]"

            if label:
                return out + "[" + label + "]"

            attrs = token["attrs"]
            title = attrs.get("title")

            out += "("

            if "(" in url or ")" in url:
                out += "<" + url + ">"
            else:
                out += url
            if title:
                out += ' "' + title + '"'

            return out + ")"

    with tempfile.TemporaryDirectory() as tmpdirname:
        os.chdir(tmpdirname)

        subprocess.run(
            ["git", "clone", "-n", "--depth=1", "--filter=tree:0", "-b", branch, repo],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        repo_name = repo.split("/")[-1]

        os.chdir(repo_name)

        subprocess.run(
            ["git", "sparse-checkout", "set", "--no-clone", "docs"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        subprocess.run(
            ["git", "checkout"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )

        destination.mkdir(parents=True, exist_ok=True)

        for item in os.listdir("docs"):
            s = os.path.join("docs", item)
            d = os.path.join(destination, item)
            if os.path.isdir(s):
                shutil.copytree(s, d, dirs_exist_ok=True)
            else:
                shutil.copy2(s, d)

        for file in destination.rglob("*.md"):
            new_file_name = file.with_suffix(".mdx")

            renderer = StrawberryRenderer(file)
            markdown = mistune.create_markdown(renderer=renderer)

            content = file.read_text()

            post = frontmatter.loads(content)
            text = post.content

            processed_content = markdown(text)

            post.content = processed_content

            output = frontmatter.dumps(post)
            new_file_name.write_text(output)

            file.unlink()

        os.chdir(working_dir)


# Remove existing docs directory
shutil.rmtree("src/content/docs", ignore_errors=True)

# Clone docs from repository
clone_docs_from_repo("https://github.com/strawberry-graphql/strawberry", "docs")
clone_docs_from_repo(
    "https://github.com/strawberry-graphql/strawberry-django", "docs/django"
)

# fetch_api_docs("https://github.com/strawberry-graphql/strawberry", "strawberry")
