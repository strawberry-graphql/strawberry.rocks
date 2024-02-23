import { marked } from "marked";
import type { Tokens } from "marked";

export const urlToSlugs = (href: string): string[] =>
  href.replace(/^\.\//, "").replace(/\.md$/, "").split("/");

export const addHrefPrefix = (href: string, prefix = "/docs/"): string =>
  href.replace(/^\.\//, prefix).replace(/\.md$/, "");

export const isString = (x: any): x is string => {
  return typeof x === "string";
};

export const isHeading = (token: any): token is Tokens.Heading => {
  return token.type === "heading";
};

export const isList = (token: any): token is Tokens.List => {
  return token?.type === "list";
};

export const isTextWithTokens = (token: any): token is any => {
  return token?.type === "text" && token?.tokens != null;
};

export const isLink = (token: any): token is Tokens.Link => {
  return token?.type === "link" && token?.tokens != null;
};

export const isListItemWithTokens = (token: any): token is any => {
  return token?.type === "list_item" && token?.tokens != null;
};

export const isTree = (obj: any) => {
  return Object.keys(obj).length > 0 && obj.__typename === "Tree";
};

export type Section = {
  type: "section";
  name: string;
  links: {
    text: string;
    href: string;
    source: string;
  }[];
};

export type SectionLink = {
  type: "section-link";
  href: string;
  text: string;
  source: string;
};

export type DocsTree = {
  [section: string]: Section | SectionLink;
};

export const getMDLinks = (items: Tokens.ListItem[]): Tokens.Link[] =>
  items.filter(isListItemWithTokens).flatMap((item) =>
    item.tokens
      .filter(isTextWithTokens)
      .flatMap((t: any) => t.tokens)
      .filter(isLink)
  );

export function getTree(text: string, prefix: string) {
  const sections: DocsTree = {};

  const tokens = marked.lexer(text);

  let currentSection = "Docs";

  const fixUrl = (url: string) => {
    url = url.replace(/\/index.md$/, "");

    if (url === ".") {
      return prefix;
    }

    return addHrefPrefix(url, prefix);
  };

  tokens.forEach((token) => {
    if (isHeading(token) && token.depth === 2) {
      if (isLink(token.tokens[0])) {
        const link: Tokens.Link = token.tokens[0];
        const sectionName = link.text;

        sections[sectionName] = {
          type: "section-link",
          href: fixUrl(link.href),
          text: link.text,
          source: link.href,
        };
      }
      currentSection = token.text;
    }

    if (isList(token)) {
      if (typeof sections[currentSection] === "undefined") {
        sections[currentSection] = {
          type: "section",
          name: currentSection,
          links: [],
        };
      }

      const links: Tokens.Link[] = getMDLinks(token.items);

      const section = sections[currentSection] as Section;

      section.links = links.map((link) => ({
        type: "section-link",
        href: fixUrl(link.href),
        text: link.text,
        source: link.href,
      }));
    }
  });

  return sections;
}

export const getTreeEntries = (
  obj: Record<string, unknown> | null | undefined
) => (isTree(obj) ? obj?.entries : null);
