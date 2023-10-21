import { promises as fs } from "fs";

export async function GET(
  request: Request,
  context: {
    params: {
      path: string[];
    };
  }
) {
  const path =
    process.env.LOCAL_REPO_PATH + "/" + context.params.path.join("/");

  const content = await fs.readFile(path);

  return new Response(content, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
