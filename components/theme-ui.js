/** @jsx jsx */
import Prism from "@theme-ui/prism";
import GithubSlugger from "github-slugger";
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

const DocsImage = ({ src, ...props }) => (
  <img
    sx={{
      borderWidth: 2,
      maxWidth: "100%",
      borderColor: "muted",
      borderStyle: "solid",
    }}
    src={src}
    {...props}
  />
);

const CustomTH = ({ children, ...props }) => {
  const slugger = GithubSlugger();
  const slug = slugger.slug(children);

  const styles = {
    textAlign: "left",
    p: 2,
    borderBottom: "1px solid currentColor",
  };

  switch (slug) {
    case "parameter-name":
      styles.width = 150;
      break;
    case "type":
      styles.width = 220;

      break;
    case "default":
      styles.width = 80;
      break;
  }

  return (
    <th {...props} sx={styles}>
      {children}
    </th>
  );
};

const CustomPrism = ({ className, children, ...props }) => {
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
};

export default {
  pre: (props) => props.children,
  code: CustomPrism,
  th: CustomTH,
  a: DocsLink,
  AdditionalResources,
  img: DocsImage,
};
