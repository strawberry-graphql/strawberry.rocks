import { Codebox } from "../codebox/codebox";
import { SearchBoxTrigger } from "../form/search-box-trigger";
import { Link } from "../link/link";
import { List, ListItem } from "../list/list";
import { Heading } from "../typography/heading";
import { Paragraph } from "../typography/paragraph";
import { DocsWrapper, DocsContent } from "./docs";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DocsWrapper> = {
  title: "Layout/Docs",
  component: DocsWrapper,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof DocsWrapper>;

export const Default: Story = {
  args: {
    sections: new Array(10).fill(null).map((_, i) => ({
      name: `Section ${i + 1}`,

      links: new Array(10).fill(null).map((_, i) => ({
        href: `#getting-started-${i}`,
        name: `Getting started ${i}`,
      })),
    })),

    searchBoxTrigger: <SearchBoxTrigger />,

    children: (
      <>
        <DocsContent>
          <Heading>Getting started with Strawberry</Heading>
          <Paragraph>This tutorial will help you:</Paragraph>
          <List>
            <ListItem>
              Obtain a basic understanding of GraphQL principles
            </ListItem>
            <ListItem>Define a GraphQL schema using Strawberry</ListItem>
            <ListItem>
              Run the Strawberry server that lets you execute queries against
              your schema
            </ListItem>
          </List>
          <Paragraph>
            This tutorial assumes that you are familiar with the command line
            and Python, and that you have a recent version of Python (3.7+)
            installed.
          </Paragraph>
          <Paragraph>
            Strawberry is built on top of{" "}
            <Link href="/">Python’s dataclasses</Link> and{" "}
            <Link href="/">type hints</Link> functionality.
          </Paragraph>
          <Heading level={2}>
            Step 1: Create a new project and install Strawberry
          </Heading>
          <Paragraph>Let’s create a new folder:</Paragraph>
          <Codebox>
            <code className="language-bash">
              <div data-line="1" className="">
                <span>
                  <span className="token function">mkdir</span> strawberry-demo
                </span>
              </div>
              <div data-line="2" className="">
                <span>
                  <span className="token builtin class-name">cd</span>{" "}
                  strawberry-demo
                </span>
              </div>
            </code>
          </Codebox>
          <Paragraph>After that we need a new virtualenv:</Paragraph>
          <Paragraph>
            Activate the virtualenv and then install strawberry plus the debug
            server.
          </Paragraph>
          <Heading level={2}>Step 2: Define your schema</Heading>
          <Paragraph>
            Every GraphQL server uses a <strong>schema</strong> to define the
            structure of the data that clients can query. In this example, we
            will create a server for querying a collection of books by title and
            author.
          </Paragraph>
          <Paragraph>
            In your favorite editor create a file called <code>schema.py</code>,
            with the following contents:
          </Paragraph>
          <Paragraph>
            This will create a GraphQL schema where clients will be able to
            execute a query named <code>books</code> that will return a list of
            zero or more books.
          </Paragraph>
        </DocsContent>
        <div>Right</div>
      </>
    ),
  },
};
