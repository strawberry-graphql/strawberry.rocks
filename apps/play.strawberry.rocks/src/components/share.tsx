import { LOCAL_STRAWBERRY_VERSION } from "./strawberry/strawberryVersion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import type { EditorState } from "@/editor-state";
import { CopyIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { Share2 } from "lucide-react";

const CREATE_GIST_DOCUMENT = gql`
  mutation CreateGist($input: CreateGistInput!) {
    createGist(input: $input) {
      __typename
      id
    }
  }
`;

type CreateGistInput = {
  query: string;
  schema: string;
  variables: unknown;
  requirements: string;
};

const parseVariables = (variables: string) => {
  try {
    return JSON.parse(variables);
  } catch {
    return {};
  }
};

export function Share({
  state,
  version,
}: {
  state: EditorState;
  version: string;
}) {
  const { data, isPending, mutate } = useMutation({
    mutationKey: ["createGist"],
    mutationFn: (variables: { input: CreateGistInput }) =>
      request<{ createGist: { id: string } }>(
        "https://api.strawberry.rocks/graphql",
        CREATE_GIST_DOCUMENT,
        variables
      ),
  });

  const handleOpen = (open: boolean) => {
    if (!open) {
      return;
    }

    mutate({
      input: {
        query: state.query,
        schema: state.code,
        variables: parseVariables(state.variables),
        // A local checkout can't be shared, so fall back to the latest release
        requirements:
          version === "latest" || version === LOCAL_STRAWBERRY_VERSION
            ? "strawberry-graphql"
            : `strawberry-graphql==${version}`,
      },
    });
  };

  const url = data?.createGist.id
    ? `https://play.strawberry.rocks/?gist=${data.createGist.id}`
    : "";

  return (
    <Popover onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="primary" aria-label="Share">
          <Share2 />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(520px,calc(100vw-2rem))]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Share playground link</h3>
          <p className="text-sm text-muted-foreground">
            Anyone with this link will be able to view this.
            {state.headers.trim() && state.headers.trim() !== "{}"
              ? " Headers aren't included, so tokens stay private."
              : null}
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={isPending ? "Loading..." : url}
              readOnly
              className="h-9"
            />
          </div>
          <Button
            type="button"
            size="icon"
            disabled={!url}
            onClick={() => window.navigator.clipboard.writeText(url)}
          >
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
