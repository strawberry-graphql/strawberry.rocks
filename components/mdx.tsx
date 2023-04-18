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
  Table,
  TableRow,
  TableHeader,
  TableCell,
  TableHead,
} from "@strawberry-graphql/styleguide";

import { FaqDetails } from "./faq-details";

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
  a: (props: any) => {
    if (props.insideHeading) {
      return <a {...props} />;
    }

    if (props.href?.startsWith("#")) {
      // TODO: make a component for footnotes?
      return <a {...props} />;
    }

    return <Link {...props} />;
  },
  hr: () => <Separator />,
  SideBySide,
  code: (props: any) => {
    if (props.inline) {
      return <Code {...props} />;
    }

    return <code {...props} />;
  },
  table: (props: any) => <Table {...props} />,
  thead: (props: any) => <TableHead {...props} />,
  tr: (props: any) => <TableRow {...props} />,
  th: (props: any) => <TableHeader {...props} />,
  td: (props: any) => <TableCell {...props} />,
  Note: (props: any) => <Callout {...props} type="note" />,
  Tip: (props: any) => <Callout {...props} type="tip" />,
  Warning: (props: any) => <Callout {...props} type="warning" />,
  AdditionalResources: (props: any) => <>todo: additional resources</>,
  FaqDetails,
};
