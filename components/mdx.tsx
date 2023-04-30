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
import Balancer from "react-wrap-balancer";

import { FaqDetails } from "./faq-details";

export const components = {
  h1: (props: any) => (
    <Heading level={1}>
      <Balancer {...props} />
    </Heading>
  ),
  h2: (props: any) => (
    <Heading level={2}>
      <Balancer {...props} />
    </Heading>
  ),
  h3: (props: any) => (
    <Heading level={3}>
      <Balancer {...props} />
    </Heading>
  ),
  h4: (props: any) => (
    <Heading level={4}>
      <Balancer {...props} />
    </Heading>
  ),
  // TODO: add h5 and h6?

  p: (props: any) => <Paragraph {...props} />,
  ol: (props: any) => <List ordered {...props} />,
  ul: (props: any) => <List {...props} />,
  li: (props: any) => <ListItem {...props} />,
  pre: ({ notes, ...props }: any) => {
    if (notes) {
      notes = JSON.parse(notes);
    }

    return <Codebox {...props} notes={notes} />;
  },
  a: ({ insideHeading, ...props }: any) => {
    if (insideHeading || !props.href) {
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
  summary: ({ children, hasHeading, ...props }: any) => {
    if (hasHeading) {
      return <summary className="list-none cursor-pointer">{children}</summary>;
    }

    return <summary className="list-none cursor-pointer">↳ {children}</summary>;
  },
  FaqDetails,
  CodeNotes: () => <p>CodeNotes are not supported anymore</p>,
};
