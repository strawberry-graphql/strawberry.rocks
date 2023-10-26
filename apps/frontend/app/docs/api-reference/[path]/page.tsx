import { parseDocument } from "app/docs/page-utils";

import data from "../../../../strawberry-api-export.json";

import {
  Code,
  Display,
  Heading,
  Paragraph,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@strawberry-graphql/styleguide";

const renderDefault = (value: any) => {
  if (typeof value === "string") {
    return value;
  }

  if (value.cls === "ExprTuple") {
    // TODO: support elements
    return "tuple()";
  }

  return "H";
};

const renderAnnotation = (value: { cls: string } & any) => {
  if (value.cls === "ExprName") {
    return value.name;
  }

  if (value.cls === "ExprSubscript") {
    const left = renderAnnotation(value.left);

    // Assuming we are using Doc
    if (left == "Annotated") {
      return renderAnnotation(value.slice.elements[0]);
    }

    const slice = renderAnnotation(value.slice);

    return `${left}[${slice}]`;
  }

  return JSON.stringify(value);
};

// TODO: this should be supported in griffe
const getDocForParameter = (parameter: any) => {
  const { annotation } = parameter;

  if (
    annotation.cls === "ExprSubscript" &&
    annotation.left.name === "Annotated"
  ) {
    const text = annotation.slice.elements[1].arguments[0];

    return text.replace(/^'|'$/g, "");
  }

  return "";
};

export default async function ApiRef({ params }: { params: { path: string } }) {
  let parts = params.path.split(".");

  // there's a small bug in griffe that doesn't allow us to use the
  // strawberry.type decorator because it conflicts with the strawberry.type
  // module, which might be something we improve, but we can point to the original
  // decorator for now
  if (params.path === "strawberry.type") {
    parts = ["strawberry", "object_type", "type"];
  }

  parts.shift();

  let current: any = data.strawberry;

  parts.forEach((part) => {
    const next = current.members.find((member) => member.name === part);

    if (!next) {
      throw new Error("Unable to find reference");
    }

    current = next;
  });

  // TODO: I need my own parser, at least for the >>> python
  const content = await parseDocument({
    content: current.docstring?.value ?? "",
  });

  return (
    <div className="docs-content">
      <Heading>
        <Code>{params.path}</Code>
      </Heading>

      {content}

      <Heading level={2}>Arguments</Heading>

      <Table>
        <TableHead>
          <TableHeader>Name</TableHeader>
          <TableHeader>Default</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Description</TableHeader>
        </TableHead>

        <tbody>
          {current.parameters.map((parameter: any) => {
            return (
              <TableRow key={parameter.name}>
                <TableCell>
                  <span className="typography-code">{parameter.name}</span>
                </TableCell>
                <TableCell>
                  <Code>{renderDefault(parameter.default)}</Code>
                </TableCell>
                <TableCell>
                  <Code>{renderAnnotation(parameter.annotation)}</Code>
                </TableCell>
                <TableCell>{getDocForParameter(parameter)}</TableCell>
              </TableRow>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
