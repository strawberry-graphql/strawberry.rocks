import { Code, Heading, Paragraph } from "@strawberry-graphql/styleguide";

export const NotSafeToPreview = () => {
  return (
    <div>
      <Heading level={1}>This PR is not safe to preview</Heading>

      <Paragraph>
        👋 Hi there! looks like you&apos;re trying to preview documentation for
        a PR that doesn&apos;t have the
        <Code>safe-to-preview</Code>
        label.
      </Paragraph>
    </div>
  );
};
