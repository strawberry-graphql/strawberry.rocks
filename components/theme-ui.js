/** @jsx jsx */
import Prism from "@theme-ui/prism";
import { jsx } from "theme-ui";

import { AdditionalResources } from "./additional-resources";
import GraphQLExample from "./graphql-example.tsx";
import SchemaExample from "./schema-example.tsx";

const DocsLink = ({ children, href, ...props }) => {
  href = href ? href.replace(/.md$/, "") : "";

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

const getImageSrc = (src) => {
  if (src.startsWith("./")) {
    return src.replace(
      "./",
      // TODO: use correct branch
      "https://github.com/strawberry-graphql/strawberry/raw/master/docs/"
    );
  }

  return src;
};

const DocsImage = ({ src, ...props }) => (
  <img
    sx={{
      borderWidth: 2,
      maxWidth: "100%",
      borderColor: "muted",
      borderStyle: "solid",
    }}
    src={getImageSrc(src)}
    {...props}
  />
);

function CustomPrism({ className, children, ...props }) {
  const [language] = className
    ? className.replace(/language-/, "").split(" ")
    : "";

  if (language === "graphql+response") {
    const [query, response] = children.split("---");
    if (!query || !response) {
      throw new Error("Invalid content for language `graphql+response`");
    }
    return <GraphQLExample query={query} response={response} />;
  }

  if (language === "python+schema") {
    const [python, schema] = children.split("---");
    if (!python || !schema) {
      throw new Error("Invalid content for language `python+schema`");
    }
    return <SchemaExample python={python} schema={schema} />;
  }

  return (
    <Prism className={className || ""} {...props}>
      {children}
    </Prism>
  );
}

export default {
  pre: (props) => props.children,
  code: CustomPrism,
  a: DocsLink,
  AdditionalResources,
  img: DocsImage,
};
