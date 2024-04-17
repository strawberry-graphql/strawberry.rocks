import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { CopyIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { useState } from "react";

const CREATE_GIST_DOCUMENT = gql`
  mutation CreateGist($input: CreateGistInput!) {
    createGist(input: $input) {
      __typename
      id
    }
  }
`;

export function Share({
  playground,
  version,
}: {
  playground: any;
  version: string;
}) {
  const { data, error, isPending, mutate } = useMutation<
    {
      createGist: { id: string };
    },
    any,
    {
      input: {
        query: string;
        schema: string;
        variables: string;
        requirements: string;
      };
    }
  >({
    mutationKey: ["createGist"],
    mutationFn: async (variables: {
      input: {
        query: string;
        schema: string;
        variables: string;
        requirements: string;
      };
    }) =>
      request<{
        createGist: { id: string };
      }>(
        "https://api.strawberry.rocks/graphql",
        CREATE_GIST_DOCUMENT,
        variables
      ),
  });

  const handleOpen = (open: boolean) => {
    if (open) {
      const state = playground.getState();

      const input = {
        query: state.query,
        schema: state.code,
        variables: JSON.parse(state.variables),
        requirements:
          version === "latest"
            ? "strawberry-graphql"
            : `strawberry-graphql==${version}`,
      };

      mutate({ input });
    }
  };

  const url = data?.createGist.id
    ? `https://play.strawberry.rocks/?gist=${data.createGist.id}`
    : "";

  return (
    <Popover onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary">Share</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Share playground link</h3>
          <p className="text-sm text-muted-foreground">
            Anyone with this link will be able to view this.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={isPending ? "Loading..." : url}
              readOnly
              className="h-9"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
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
