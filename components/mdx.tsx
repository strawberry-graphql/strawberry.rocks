import cx from "classnames";
import GithubSlugger from "github-slugger";

import { AdditionalResources } from "./additional-resources";
import { CodeBlock } from "./code-block";
import { GraphQLExample } from "./graphql-example";
import { SchemaExample } from "./schema-example";

const DocsLink = ({
  children,
  href,
  ...props
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  href = href ? href.replace(/.md$/, "") : "";

  return (
    <a
      href={href}
      {...props}
      className={cx(props.className, {
        underline: !href.startsWith("#") && href,
      })}
    >
      {children}
    </a>
  );
};

const DocsImage = ({ src, ...props }: { src: string }) => (
  <img className="border-2 border-red-500 max-w-full" src={src} {...props} />
);

const CustomTH = ({ children, ...props }: { children: string }) => {
  const slugger = new GithubSlugger();
  const slug = slugger.slug(children);

  return (
    <th
      {...props}
      className={cx("text-left", "p-4", "border-b", "border-current", "w-20", {
        "w-36": slug === "parameter-name",
        "w-56": slug === "type",
      })}
    >
      {children}
    </th>
  );
};

const CustomPrism = ({
  className,
  children,
}: {
  className: string;
  children: string;
}) => {
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

  return <CodeBlock language={language}>{children}</CodeBlock>;
};

const theme = {
  pre: (props: any) => props.children,
  code: CustomPrism,
  th: CustomTH,
  a: DocsLink,
  AdditionalResources,
  img: DocsImage,
};

export default theme;
