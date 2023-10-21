import { marked } from "marked";
import type { Tokens } from "marked";

import { addHrefPrefix } from "~/helpers/params";
import {
  isBlob,
  isHeading,
  isLink,
  isList,
  isListItemWithTokens,
  isTextWithTokens,
  isTree,
} from "~/helpers/type-guards";

export type Section = {
  name: string;
  links: {
    text: string;
    href: string;
  }[];
};

export type SectionLink = {
  href: string;
  text: string;
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

export function getDocTree(text: string, prefix: string) {
  const sections: DocsTree = {};

  const tokens = marked.lexer(text);

  let currentSection = "Docs";

  const fixUrl = (url: string) => {
    url = url.replace(/\/index.md$/, "");

    return addHrefPrefix(url, prefix);
  };

  tokens.forEach((token) => {
    if (isHeading(token) && token.depth === 2) {
      if (isLink(token.tokens[0])) {
        const link: Tokens.Link = token.tokens[0];
        const sectionName = link.text;

        sections[sectionName] = {
          href: fixUrl(link.href),
          text: link.text,
        };
      }
      currentSection = token.text;
    }

    if (isList(token)) {
      if (typeof sections[currentSection] === "undefined") {
        sections[currentSection] = {
          name: currentSection,
          links: [],
        };
      }

      const links: Tokens.Link[] = getMDLinks(token.items);

      const section = sections[currentSection] as Section;

      section.links = links.map((link) => ({
        href: fixUrl(link.href),
        text: link.text,
      }));
    }
  });

  return sections;
}

export const getTreeEntries = (
  obj: Record<string, unknown> | null | undefined
) => (isTree(obj) ? obj?.entries : null);

export const getBlobText = (obj: Record<string, unknown> | null | undefined) =>
  isBlob(obj) ? obj.text : null;
