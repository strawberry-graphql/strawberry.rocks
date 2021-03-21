import cx from "classnames";
import GithubSlugger from "github-slugger";
import { createElement, ReactNode } from "react";

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

// eslint-disable-next-line react/display-name
const heading = (level: 1 | 2 | 3 | 4 | 5 | 6) => ({
  children,
}: {
  children: ReactNode;
}) => {
  return createElement(`h${level}`, {
    className: cx("font-medium my-8", {
      "text-3xl": level === 1,
      "text-2xl": level === 2,
      "text-xl": level >= 3,
      underline: level > 1,
    }),
    children,
  });
};

const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="mb-4">{children}</p>
);

const UnorderedList = ({ children }: { children: ReactNode }) => (
  <ul className="mb-4 list-disc list-inside">{children}</ul>
);

const theme = {
  h1: heading(1),
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),
  h5: heading(5),
  h6: heading(6),
  p: Paragraph,
  ul: UnorderedList,
  // eslint-disable-next-line react/display-name
  pre: (props: any) => <div className="mb-4">{props.children}</div>,
  code: CustomPrism,
  th: CustomTH,
  a: DocsLink,
  AdditionalResources,
  img: DocsImage,
};

export default theme;
