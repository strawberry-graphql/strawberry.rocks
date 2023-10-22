import {
  Box,
  Display,
  GlowEffect,
  Paragraph,
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
      creator: "@strawberry_gql",
    },
  };
}

export default function ReleasePage({
  params,
}: {
  params: {
    version: string;
  };
}) {
  return (
    <>
      <GlowEffect />
      <Spacer size={80} />

      <Box px={16} maxWidth="screen-lg">
        <Display>Version {params.version}</Display>

        <Paragraph>We&apos;ll have the info here</Paragraph>
      </Box>

      <Spacer size={80} />
    </>
  );
}
