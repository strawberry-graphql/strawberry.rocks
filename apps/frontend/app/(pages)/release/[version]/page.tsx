import {
  Box,
  Display,
  GlowEffect,
  Paragraph,
  Spacer,
} from "@strawberry-graphql/styleguide";

export default function Page({
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
