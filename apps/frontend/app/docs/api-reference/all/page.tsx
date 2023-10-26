import clsx from "clsx";

import data from "../../../../strawberry-api-export.json";

import {
  Display,
  Heading,
  List,
  ListItem,
} from "@strawberry-graphql/styleguide";

const massage = (members: any) => {
  return members.filter((member: any) => {
    return true;
    // TODO: maybe only show things that have members that are visible :)
    // only show functions and classes that have a docstring
    if (["function", "class"].includes(member.kind)) {
      return member.docstring?.value !== "";
    }

    return !member.name.startsWith("_") && !["alias"].includes(member.kind);
  });
};

const ModuleReference = ({ data }: any) => {
  const reference = massage(data.members);

  return (
    <List className="space-y-4">
      {reference.map((member: any) => {
        if (member.kind === "module") {
          return (
            <ListItem key={member.name} className="pl-8 font-bold">
              <details>
                <summary>
                  {member.name} ({member.kind})
                </summary>
                {member.kind === "module" && (
                  <ModuleReference data={member} key={member.name} />
                )}
              </details>
            </ListItem>
          );
        }

        return (
          <ListItem key={member.name} className="pl-8 font-normal">
            {member.name} ({member.kind})
          </ListItem>
        );
      })}
    </List>
  );
};

export default async function AllRef() {
  return (
    <div className="docs-content">
      <Display>API Reference</Display>

      <div className="space-y-16">
        <Heading level={2}>Strawberry</Heading>

        <ModuleReference data={data.strawberry} />
      </div>
    </div>
  );
}
