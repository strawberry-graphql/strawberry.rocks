/** @jsx jsx */
import { MDXProviderComponents } from "@theme-ui/mdx";
import Prism, { ThemeUIPrismProps } from "@theme-ui/prism";
import GithubSlugger from "github-slugger";
import { jsx, ThemeUICSSObject, ImageProps } from "theme-ui";

import Image from "next/image";

import { AdditionalResources } from "./additional-resources";
import GraphQLExample from "./graphql-example";
import SchemaExample from "./schema-example";

const DocsLink: React.FC<{ href?: string }> = ({
  children,
  href,
  ...props
}) => {
  href = href ? href.replace(/.md$/, "") : "";

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

const DocsImage = ({ src, ...props }: ImageProps) => (
  <Image
    layout="responsive"
    width="100%"
    height="auto"
    objectFit="contain"
    src={src ?? ""}
    {...props}
  />
);

const CustomTH = ({
  children,
  ...props
}: ThemeUIPrismProps): jsx.JSX.Element => {
  const slugger = new GithubSlugger();
  const slug = slugger.slug(children);

  const styles: ThemeUICSSObject = {
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

const CustomPrism = ({
  className,
  children,
  ...props
}: ThemeUIPrismProps): jsx.JSX.Element => {
  const [language]: string[] = className
    ? className.replace(/language-/, "").split(" ")
    : [""];
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

const theme: MDXProviderComponents = {
  pre: (props) => props.children,
  code: CustomPrism,
  th: CustomTH,
  a: DocsLink,
  AdditionalResources,
  img: DocsImage,
};

export default theme;
