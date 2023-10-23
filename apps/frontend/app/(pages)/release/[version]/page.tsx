import { parseDocument } from "app/docs/page-utils";
import remarkGithub from "remark-github";

import { fetchRelease } from "./fetch-release";

import {
  Box,
  Display,
  GlowEffect,
  Spacer,
} from "@strawberry-graphql/styleguide";

export async function generateMetadata({
  params,
}: {
  params: { version: string };
}) {
  const title = `Version ${params.version} | Docs | 🍓 Strawberry GraphQL`;
  const description = `Release notes for Strawberry GraphQL version ${params.version}`;

  return {
    title,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@strawberry_gql",
      creator: "@strawberry_gql",
    },
  };
}

export default async function ReleasePage({
  params,
}: {
  params: {
    version: string;
  };
}) {
  const { repository } = await fetchRelease(params.version);

  // TODO: handle not found and errors

  const content = await parseDocument({
    // @ts-ignore
    content: repository.release.description,
    additionalRemarkPlugins: [remarkGithub],
  });

  return (
    <>
      <GlowEffect />
      <Spacer size={80} />

      <Box px={16} maxWidth="screen-lg">
        <Display>Version {params.version}</Display>

        {content}
      </Box>

      <Spacer size={80} />
    </>
  );
}
