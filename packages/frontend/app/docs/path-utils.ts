import { fetchPullRequest, OWNER, REF, REPO } from "~/lib/api";

export const getFetchDocsParams = async ({ slug }: { slug?: string[] }) => {
  let slugs = slug || [];
  let forceRemote = false;

  let owner = OWNER;
  let repo = REPO;
  let ref = REF;

  let pullNumber: number | null = null;

  if (slugs && slugs[0] === "pr" && slugs.length > 1) {
    pullNumber = parseInt(slugs[1], 10);

    if (!isNaN(pullNumber)) {
      forceRemote = true;

      const data = await fetchPullRequest({ pull_number: pullNumber });

      if (data?.owner && data.repo && data.branch) {
        owner = data.owner;
        repo = data.repo;
        ref = data.branch;
      }

      slugs.splice(0, 2);
    }
  }

  slugs = slugs.length ? slugs : ["index"];

  const filename = slugs.join("/") + ".md";

  return {
    owner,
    repo,
    ref,
    filename,
    forceRemote,
    pullNumber,
  };
};
