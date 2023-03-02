import {
  Heading,
  Paragraph,
  List,
  ListItem,
  Code,
  Codebox,
  Link,
  Separator,
  SideBySide,
  Callout,
} from "@strawberry-graphql/styleguide";

export const components = {
  h1: (props: any) => <Heading level={1} {...props} />,
  h2: (props: any) => <Heading level={2} {...props} />,
  h3: (props: any) => <Heading level={3} {...props} />,
  h4: (props: any) => <Heading level={4} {...props} />,
  h5: (props: any) => <Heading level={5} {...props} />,
  h6: (props: any) => <Heading level={6} {...props} />,
  p: (props: any) => <Paragraph {...props} />,
  ol: (props: any) => <List ordered {...props} />,
  ul: (props: any) => <List {...props} />,
  li: (props: any) => <ListItem {...props} />,
  pre: (props: any) => <Codebox {...props} />,
  a: (props: any) => <Link {...props} />,
  hr: () => <Separator />,
  SideBySide,
  code: (props: any) => {
    if (props.inline) {
      return <Code {...props} />;
    }

    return <code {...props} />;
  },
  Note: (props: any) => <Callout {...props} type="note" />,
  Tip: (props: any) => <Callout {...props} type="tip" />,
  AdditionalResources: (props: any) => <>todo: additional resources</>,
};
