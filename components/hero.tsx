import MDXDocument from "~/content/home/hello-world.mdx";

import { CodeBox } from "./code-box";

export const Hero = () => {
  return (
    <div className="grid md:grid-cols-2 max-w-7xl mx-auto">
      <div className="m-12">
        <h1 className="inline text-3xl lg:text-5xl leading-normal heading-underline bg-gradient-to-r from-red-500 to-red-500">
          Strawberry is a new GraphQL library for Python 3, inspired by
          dataclasses.
        </h1>
      </div>
      <CodeBox className="text-sm">
        <MDXDocument />
      </CodeBox>
    </div>
  );
};
