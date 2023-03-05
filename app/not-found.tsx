import {
  GlowEffect,
  Spacer,
  Box,
  Display,
  Heading,
} from "@strawberry-graphql/styleguide";

export default async function NotFound() {
  return (
    <>
      <GlowEffect />
      <Spacer size={80} />

      <Box textAlign="center" px={16} maxWidth="screen-sm">
        <Display>404</Display>

        <Spacer size={24} />

        <Heading level={4}>Page not found</Heading>
      </Box>

      <Spacer size={80} />
    </>
  );
}
