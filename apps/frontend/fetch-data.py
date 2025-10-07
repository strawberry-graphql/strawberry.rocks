#!/usr/bin/env -S uv run
# /// script
# dependencies = [
#     "httpx",
#     "clickhouse-connect",
#     "python-dotenv",
# ]
# requires-python = ">=3.11"
# ///

"""
Fetch all data needed for the Strawberry GraphQL website.

This script:
- Fetches docs from strawberry and strawberry-django repositories
- Fetches sponsors from GitHub and OpenCollective
- Fetches download statistics from ClickHouse
- Fetches latest release info from GitHub
- Saves data as JSON for build-time consumption
"""

import hashlib
import json
import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import httpx
import clickhouse_connect
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
OPENCOLLECTIVE_TOKEN = os.getenv("OPENCOLLECTIVE_TOKEN")
CLICKHOUSE_HOST = os.getenv("CLICKHOUSE_HOST", "https://sql-clickhouse.clickhouse.com")
CLICKHOUSE_USER = os.getenv("CLICKHOUSE_USERNAME", "demo")


def check_environment():
    """Check that required environment variables are set."""
    missing = []

    if not GITHUB_TOKEN:
        missing.append("GITHUB_TOKEN")
    if not OPENCOLLECTIVE_TOKEN:
        missing.append("OPENCOLLECTIVE_TOKEN")

    if missing:
        print("❌ Error: Missing required environment variables:")
        for var in missing:
            print(f"   - {var}")
        print("\nPlease set these environment variables and try again.")
        exit(1)

SCRIPT_DIR = Path(__file__).parent
CONTENT_DIR = SCRIPT_DIR / "src" / "content"
DATA_DIR = SCRIPT_DIR / "src" / "data"

# Ensure data directory exists
DATA_DIR.mkdir(parents=True, exist_ok=True)


def process_repo(repo_url: str, docs_path: str, target_dir: Path) -> None:
    """
    Clone and process documentation from a repository.

    Args:
        repo_url: Git repository URL
        docs_path: Path to docs folder in the repo
        target_dir: Where to save the processed docs
    """
    print(f"Fetching latest docs from {repo_url}...")

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)

        # Clone only the docs folder with depth 1
        subprocess.run(
            ["git", "clone", "--depth", "1", "--filter=blob:none", "--sparse", repo_url, "repo"],
            cwd=temp_path,
            check=True,
            capture_output=True,
        )

        repo_dir = temp_path / "repo"
        subprocess.run(
            ["git", "sparse-checkout", "set", docs_path],
            cwd=repo_dir,
            check=True,
            capture_output=True,
        )

        # Remove existing docs
        print(f"Removing existing docs in {target_dir}...")
        if target_dir.exists():
            for item in target_dir.glob("**/*.md"):
                item.unlink()
            for item in target_dir.glob("**/*.mdx"):
                item.unlink()
            # Remove empty directories
            for item in sorted(target_dir.glob("**/*"), reverse=True):
                if item.is_dir() and not any(item.iterdir()):
                    item.rmdir()

        # Create target directory
        target_dir.mkdir(parents=True, exist_ok=True)

        # Copy docs and rename .md to .mdx
        print("Copying docs and renaming to .mdx...")
        docs_source = repo_dir / docs_path

        for md_file in docs_source.rglob("*.md"):
            rel_path = md_file.relative_to(docs_source)
            target_file = target_dir / rel_path.with_suffix(".mdx")
            target_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(md_file, target_file)

        # Copy other files (images, etc.)
        for file in docs_source.rglob("*"):
            if file.is_file() and file.suffix != ".md":
                rel_path = file.relative_to(docs_source)
                target_file = target_dir / rel_path
                target_file.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(file, target_file)

        # Process MDX files
        print("Processing MDX files...")
        for mdx_file in target_dir.rglob("*.mdx"):
            content = mdx_file.read_text()

            # Remove HTML comments
            content = re.sub(r"<!--.*?-->", "", content, flags=re.DOTALL)

            # Fix markdown links
            content = re.sub(r"\.md\)", ")", content)
            content = re.sub(r"\(\./index\)", "(.", content)
            content = re.sub(r"\(\.\./index\)", "(../", content)
            content = re.sub(r"\(\.\./index#\)", "(..#", content)

            # Process frontmatter and add component imports
            imports = []
            if "<Note" in content:
                imports.append("import Note from '@/components/Pages/Callout/Note.astro';")
            if "<Tip" in content:
                imports.append("import Tip from '@/components/Pages/Callout/Tip.astro';")
            if "<Warning" in content:
                imports.append("import Warning from '@/components/Pages/Callout/Warning.astro';")
            if "<CodeGrid" in content:
                imports.append("import CodeGrid from '@/components/CodeGrid.astro';")
            if "<ExtensionsList" in content:
                imports.append("import ExtensionsList from '@/components/ExtensionsList.astro';")

            # Split frontmatter and content
            parts = content.split("---", 2)
            if len(parts) >= 3:
                frontmatter = parts[1]
                body = parts[2]

                # Remove slug from frontmatter (let Astro generate it)
                frontmatter = re.sub(r"^slug:.*$", "", frontmatter, flags=re.MULTILINE)

                # Clean up extra blank lines in frontmatter
                frontmatter = re.sub(r"\n\n+", "\n", frontmatter)

                # Remove first h1 heading (with optional leading whitespace)
                body = re.sub(r"^\s*#\s+.+\n", "", body, count=1)

                # Reconstruct file
                if imports:
                    content = f"---{frontmatter}---\n\n" + "\n".join(imports) + "\n" + body
                else:
                    content = f"---{frontmatter}---" + body

            mdx_file.write_text(content)


def fetch_github_sponsors() -> list[dict[str, Any]]:
    """Fetch sponsors from GitHub."""
    print("Fetching GitHub sponsors...")

    # First, get list of sponsors
    query = """
    query {
      organization(login: "strawberry-graphql") {
        sponsors(first: 100) {
          nodes {
            __typename
            ... on User {
              login
              name
              avatarUrl
            }
            ... on Organization {
              login
              name
              avatarUrl
            }
          }
        }
      }
    }
    """

    with httpx.Client() as client:
        response = client.post(
            "https://api.github.com/graphql",
            json={"query": query},
            headers={
                "Authorization": f"bearer {GITHUB_TOKEN}",
                "Content-Type": "application/json",
            },
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()

        sponsors_list = data["data"]["organization"]["sponsors"]["nodes"]

        if not sponsors_list:
            return []

        # Build detailed query for each sponsor
        sponsor_queries = []
        for i, sponsor in enumerate(sponsors_list):
            typename = sponsor["__typename"]
            login = sponsor["login"]
            root_field = "user" if typename == "User" else "organization"

            sponsor_queries.append(f"""
              sponsor{i}: {root_field}(login: "{login}") {{
                login
                name
                logo: avatarUrl
                websiteUrl
                url
                ... on Sponsorable {{
                  sponsorshipsAsSponsor(first: 100) {{
                    nodes {{
                      sponsorable {{
                        __typename
                        ... on Organization {{
                          login
                        }}
                        ... on User {{
                          login
                        }}
                      }}
                      tier {{
                        name
                        monthlyPriceInDollars
                      }}
                    }}
                  }}
                }}
              }}
            """)

        detailed_query = "query {\n" + "\n".join(sponsor_queries) + "\n}"

        response = client.post(
            "https://api.github.com/graphql",
            json={"query": detailed_query},
            headers={
                "Authorization": f"bearer {GITHUB_TOKEN}",
                "Content-Type": "application/json",
            },
            timeout=30,
        )
        response.raise_for_status()
        detailed_data = response.json()

        sponsors = []
        for key, sponsor in detailed_data["data"].items():
            # Find the sponsorship to strawberry-graphql
            tier = None
            for node in sponsor.get("sponsorshipsAsSponsor", {}).get("nodes", []):
                if node["sponsorable"]["login"] == "strawberry-graphql":
                    tier = node["tier"]
                    break

            if tier:
                sponsors.append({
                    "id": sponsor["login"],
                    "name": sponsor["name"] or sponsor["login"],
                    "logo": sponsor["logo"],
                    "href": sponsor.get("websiteUrl") or sponsor["url"],
                    "sponsorship": {
                        "monthlyPriceInDollars": tier["monthlyPriceInDollars"]
                    }
                })

        return sponsors


def fetch_opencollective_sponsors() -> list[dict[str, Any]]:
    """Fetch sponsors from OpenCollective."""
    print("Fetching OpenCollective sponsors...")

    from datetime import datetime, timedelta, timezone

    # Get contributions from the last month
    from_date = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()

    query = """
    query ContributionsQuery($from: DateTime) {
      collective(slug: "strawberry-graphql") {
        transactions(dateFrom: $from, kind: CONTRIBUTION) {
          nodes {
            kind
            createdAt
            fromAccount {
              name
              slug
              imageUrl
              website
            }
            amount {
              value
            }
          }
        }
      }
    }
    """

    with httpx.Client() as client:
        response = client.post(
            "https://api.opencollective.com/graphql/v2",
            json={"query": query, "variables": {"from": from_date}},
            headers={
                "Content-Type": "application/json",
                "Personal-Token": OPENCOLLECTIVE_TOKEN,
            },
            timeout=30,
        )

        # Log response for debugging
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")

        response.raise_for_status()
        data = response.json()

        if "errors" in data:
            raise Exception(data["errors"][0]["message"])

        sponsors = []
        for node in data["data"]["collective"]["transactions"]["nodes"]:
            account = node["fromAccount"]
            sponsors.append({
                "id": account["slug"],
                "name": account["name"],
                "logo": account["imageUrl"],
                "href": account["website"],
                "sponsorship": {
                    "monthlyPriceInDollars": node["amount"]["value"]
                }
            })

        return sponsors


def fetch_sponsors() -> dict[str, Any]:
    """Fetch all sponsors and return combined list."""
    github_sponsors = fetch_github_sponsors()
    opencollective_sponsors = fetch_opencollective_sponsors()

    all_sponsors = github_sponsors + opencollective_sponsors

    # Sort by monthly price
    all_sponsors.sort(key=lambda s: s["sponsorship"]["monthlyPriceInDollars"], reverse=True)

    # Filter for home page (>= $100/month)
    home_sponsors = [s for s in all_sponsors if s["sponsorship"]["monthlyPriceInDollars"] >= 100]

    print(f"✅ Fetched {len(all_sponsors)} sponsors ({len(home_sponsors)} for home page)")

    return {
        "all": all_sponsors,
        "home": home_sponsors,
    }


def fetch_downloads() -> dict[str, int]:
    """Fetch download statistics from ClickHouse."""
    print("Fetching download statistics...")

    try:
        client = clickhouse_connect.get_client(
            host=CLICKHOUSE_HOST.replace("https://", "").replace("http://", ""),
            username=CLICKHOUSE_USER,
            database="pypi",
            secure=True,
        )

        # Last week downloads
        week_result = client.query(
            """
            SELECT sum(count) as downloads
            FROM pypi_downloads_per_day_by_version
            WHERE project = {project:String}
              AND date >= today() - INTERVAL 7 DAY
            """,
            parameters={"project": "strawberry-graphql"},
        )

        # Last month downloads
        month_result = client.query(
            """
            SELECT sum(count) as downloads
            FROM pypi_downloads_per_day_by_version
            WHERE project = {project:String}
              AND date >= today() - INTERVAL 30 DAY
            """,
            parameters={"project": "strawberry-graphql"},
        )

        downloads = {
            "lastWeek": int(week_result.result_rows[0][0]) if week_result.result_rows else 0,
            "lastMonth": int(month_result.result_rows[0][0]) if month_result.result_rows else 0,
        }

        client.close()

        print(f"✅ Fetched downloads: {downloads['lastMonth']:,} (month), {downloads['lastWeek']:,} (week)")

        return downloads

    except Exception as e:
        print(f"⚠️  Failed to fetch downloads from ClickHouse: {e}")
        print("   Using fallback values")
        return {
            "lastWeek": 300_000,
            "lastMonth": 1_200_000,
        }


def fetch_latest_release() -> dict[str, str]:
    """Fetch latest release from GitHub."""
    print("Fetching latest release...")

    try:
        with httpx.Client() as client:
            response = client.get(
                "https://api.github.com/repos/strawberry-graphql/strawberry/releases/latest",
                headers={"Authorization": f"bearer {GITHUB_TOKEN}"},
                timeout=30,
            )
            response.raise_for_status()
            data = response.json()

            release = {
                "name": data["tag_name"],
                "href": data["html_url"],
            }

            print(f"✅ Fetched latest release: {release['name']}")

            return release

    except Exception as e:
        print(f"⚠️  Failed to fetch latest release: {e}")
        print("   Using fallback values")
        return {
            "name": "0.240.0",
            "href": "https://github.com/strawberry-graphql/strawberry/releases/latest",
        }


def compute_file_hash(file_path: Path) -> str:
    """Compute SHA256 hash of a file."""
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha256.update(chunk)
    return sha256.hexdigest()


def is_bot(name: str) -> bool:
    """Check if a contributor is a bot."""
    if name.endswith("[bot]"):
        return True
    return name in ["botberry", "dependabot-support"]


def fetch_contributors_for_files(
    repo: str, files: list[tuple[Path, str]], existing_hashes: dict[str, str]
) -> dict[str, Any]:
    """
    Fetch contributors for documentation files efficiently using GitHub GraphQL.

    Args:
        repo: Repository name (e.g., "strawberry-graphql/strawberry")
        files: List of tuples (mdx_file_path, original_md_path_in_repo)
        existing_hashes: Previously computed hashes to skip unchanged files

    Returns:
        Dict mapping mdx file paths to contributor info
    """
    print(f"Fetching contributors for {repo}...")

    owner, name = repo.split("/")

    # Filter files that need updating
    files_to_fetch = []
    new_hashes = {}

    for mdx_path, original_path in files:
        file_hash = compute_file_hash(mdx_path)
        new_hashes[str(mdx_path)] = file_hash

        # Skip if hash hasn't changed
        if existing_hashes.get(str(mdx_path)) == file_hash:
            continue

        files_to_fetch.append((mdx_path, original_path))

    if not files_to_fetch:
        print(f"  ℹ️  No files changed, skipping contributor fetch")
        return {"contributors": {}, "hashes": new_hashes}

    print(f"  Fetching contributors for {len(files_to_fetch)} changed files...")

    contributors_map = {}

    # Process files one at a time (GitHub's commit history query doesn't support batching well)
    with httpx.Client() as client:
        for idx, (mdx_path, original_path) in enumerate(files_to_fetch):
            if idx % 10 == 0:
                print(f"  Progress: {idx}/{len(files_to_fetch)} files...")

            query = f"""
            query {{
              repository(owner: "{owner}", name: "{name}") {{
                defaultBranchRef {{
                  target {{
                    ... on Commit {{
                      history(first: 100, path: "{original_path}") {{
                        nodes {{
                          authors(first: 100) {{
                            nodes {{
                              name
                              user {{ login }}
                              avatarUrl
                            }}
                          }}
                        }}
                      }}
                    }}
                  }}
                }}
              }}
            }}
            """

            try:
                response = client.post(
                    "https://api.github.com/graphql",
                    json={"query": query},
                    headers={
                        "Authorization": f"bearer {GITHUB_TOKEN}",
                        "Content-Type": "application/json",
                    },
                    timeout=30,
                )
                response.raise_for_status()
                data = response.json()

                if "errors" in data:
                    print(f"  ⚠️  GraphQL error for {original_path}: {data['errors']}")
                    continue

                # Process result
                repo_data = data.get("data", {}).get("repository", {})
                branch_data = repo_data.get("defaultBranchRef", {})
                target_data = branch_data.get("target", {})
                history_data = target_data.get("history", {})

                if not history_data.get("nodes"):
                    continue

                seen_names = set()
                contributors = []

                for node in history_data["nodes"]:
                    for author in node["authors"]["nodes"]:
                        if is_bot(author["name"]) or author["name"] in seen_names:
                            continue

                        seen_names.add(author["name"])
                        contributors.append({
                            "name": author["name"],
                            "login": author["user"]["login"] if author.get("user") else None,
                            "avatarUrl": author["avatarUrl"],
                        })

                # Store with mdx path relative to content dir
                contributors_map[str(mdx_path.relative_to(CONTENT_DIR))] = contributors

            except Exception as e:
                print(f"  ⚠️  Failed to fetch {original_path}: {e}")
                continue

    print(f"  ✅ Fetched contributors for {len(contributors_map)} files")

    return {"contributors": contributors_map, "hashes": new_hashes}


def fetch_all_contributors() -> dict[str, Any]:
    """Fetch contributors for all documentation files."""
    print("Fetching contributors for all docs...")

    # Load existing data if available
    contributors_file = DATA_DIR / "contributors.json"
    existing_data = {}
    if contributors_file.exists():
        existing_data = json.loads(contributors_file.read_text())

    existing_contributors = existing_data.get("contributors", {})
    existing_hashes = existing_data.get("hashes", {})

    # Collect all mdx files and their original paths
    strawberry_files = []
    strawberry_dir = CONTENT_DIR / "docs" / "strawberry"
    if strawberry_dir.exists():
        for mdx_file in strawberry_dir.rglob("*.mdx"):
            # Convert back to original .md path
            rel_path = mdx_file.relative_to(strawberry_dir)
            original_path = f"docs/{rel_path}".replace(".mdx", ".md")
            strawberry_files.append((mdx_file, original_path))

    django_files = []
    django_dir = CONTENT_DIR / "docs" / "django"
    if django_dir.exists():
        for mdx_file in django_dir.rglob("*.mdx"):
            rel_path = mdx_file.relative_to(django_dir)
            original_path = f"docs/{rel_path}".replace(".mdx", ".md")
            django_files.append((mdx_file, original_path))

    # Fetch contributors for both repos
    strawberry_result = fetch_contributors_for_files(
        "strawberry-graphql/strawberry",
        strawberry_files,
        existing_hashes
    )

    django_result = fetch_contributors_for_files(
        "strawberry-graphql/strawberry-django",
        django_files,
        existing_hashes
    )

    # Merge results, preserving existing data for unchanged files
    all_contributors = {**existing_contributors}
    all_contributors.update(strawberry_result["contributors"])
    all_contributors.update(django_result["contributors"])

    all_hashes = {**existing_hashes}
    all_hashes.update(strawberry_result["hashes"])
    all_hashes.update(django_result["hashes"])

    total_files = len(strawberry_files) + len(django_files)
    updated_files = len(strawberry_result["contributors"]) + len(django_result["contributors"])

    print(f"✅ Contributors data ready: {total_files} total files, {updated_files} updated")

    return {
        "contributors": all_contributors,
        "hashes": all_hashes,
    }


def main():
    """Main execution."""
    print("=" * 60)
    print("Fetching data for Strawberry GraphQL website")
    print("=" * 60)

    # Check environment variables
    check_environment()

    # Fetch documentation
    process_repo(
        "https://github.com/strawberry-graphql/strawberry",
        "docs",
        CONTENT_DIR / "docs" / "strawberry",
    )

    process_repo(
        "https://github.com/strawberry-graphql/strawberry-django",
        "docs",
        CONTENT_DIR / "docs" / "django",
    )

    # Fetch and save sponsors
    sponsors = fetch_sponsors()
    (DATA_DIR / "sponsors.json").write_text(json.dumps(sponsors, indent=2))

    # Fetch and save downloads
    downloads = fetch_downloads()
    (DATA_DIR / "downloads.json").write_text(json.dumps(downloads, indent=2))

    # Fetch and save latest release
    release = fetch_latest_release()
    (DATA_DIR / "release.json").write_text(json.dumps(release, indent=2))

    # Fetch and save contributors
    contributors = fetch_all_contributors()
    (DATA_DIR / "contributors.json").write_text(json.dumps(contributors, indent=2))

    print("\n" + "=" * 60)
    print("✅ Done! All data fetched and saved")
    print("=" * 60)
    print(f"\nData saved to: {DATA_DIR}")
    print("  - sponsors.json")
    print("  - downloads.json")
    print("  - release.json")
    print("  - contributors.json")

    # Generate sidebar configuration
    print("\nGenerating sidebar configuration...")
    subprocess.run(["node", "generate-sidebar.mjs"], cwd=SCRIPT_DIR, check=True)


if __name__ == "__main__":
    main()
