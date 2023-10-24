import {
  Code,
  Display,
  Heading,
  List,
  ListItem,
  Separator,
  Spacer,
} from "@strawberry-graphql/styleguide";

const sections = [
  {
    title: "Decorators",
    links: [
      {
        name: "strawberry.type",
        href: "/ref/decorators/type",
      },
      {
        name: "strawberry.input",
        href: "/ref/decorators/input",
      },
      {
        name: "strawberry.interface",
        href: "/ref/decorators/interface",
      },
      {
        name: "strawberry.scalar",
        href: "/ref/decorators/scalar",
      },
      {
        name: "strawberry.field",
        href: "/ref/decorators/field",
      },
      {
        name: "strawberry.mutation",
        href: "/ref/decorators/mutation",
      },
    ],
  },
  {
    title: "Classes",
    links: [
      {
        name: "strawberry.Schema",
        href: "/ref/classes/schema",
      },
    ],
  },
  {
    title: "Integrations",
    children: [
      {
        name: "Django",
        links: [
          {
            name: "GraphQLView",
            href: "/ref/integrations/django",
          },
        ],
      },
    ],
  },
];

const ReferenceLink = ({ name, href }: { name: string; href: string }) => {
  return (
    <ListItem>
      <a href={href}>
        <Code className="dark:hover:border-white dark:hover:text-white hover:border-black hover:text-black">
          {name}
        </Code>
      </a>
    </ListItem>
  );
};

export default async function ApiRefHome() {
  return (
    <>
      <Display>API Reference</Display>

      <div className="space-y-16">
        {sections.map((section, index) => {
          return (
            <>
              {index > 0 && <Separator />}

              <Heading level={2}>{section.title}</Heading>

              {section.links && (
                <List className="space-y-12">
                  {section.links.map((link) => {
                    return (
                      <ReferenceLink
                        name={link.name}
                        href={link.href}
                        key={link.name}
                      />
                    );
                  })}
                </List>
              )}

              {section.children && (
                <div className="space-y-12">
                  {section.children.map((child) => {
                    return (
                      <>
                        <Heading level={3}>{child.name}</Heading>

                        <List className="space-y-12">
                          {child.links.map((link) => {
                            return (
                              <ReferenceLink
                                name={link.name}
                                href={link.href}
                                key={link.name}
                              />
                            );
                          })}
                        </List>
                      </>
                    );
                  })}
                </div>
              )}
            </>
          );
        })}
      </div>
    </>
  );
}
