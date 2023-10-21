import Balancer from "react-wrap-balancer";

import { FaqDetails } from "./faq-details";

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
  pre: ({ notes, ...props }: any) => {
    if (notes) {
      notes = JSON.parse(notes);
    }

    return <Codebox {...props} notes={notes} />;
  },
  a: ({ insideHeading, children, ...props }: any) => {
    if (!props.href || (props.href.startsWith("#") && !insideHeading)) {
      // TODO: make a component for footnotes?
      return <a {...props}>{children}</a>;
    }

    if (insideHeading && !props.inline) {
      return (
        <Balancer {...props} as="a">
          {children}
        </Balancer>
      );
    }

    return <Link {...props}>{children}</Link>;
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
