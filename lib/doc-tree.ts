import marked, { Tokens } from "marked";

import { DocsTree } from "~/components/docs-navigation";
import { addHrefPrefix } from "~/helpers/params";
import {
  isHeading,
  isLink,
  isList,
  isListItemWithTokens,
  isTextWithTokens,
} from "~/helpers/type-guards";

export const getMDLinks = (items: Tokens.ListItem[]): Tokens.Link[] =>
  items.filter(isListItemWithTokens).flatMap((item) =>
    item.tokens
      .filter(isTextWithTokens)
      .flatMap((t) => t.tokens)
      .filter(isLink)
  );

export function getDocTree(text: string, prefix: string) {
  const sections: DocsTree = {};
  const tokens = marked.lexer(text);

  let currentSection = "Docs";

  tokens.forEach((token) => {
    if (isHeading(token) && token.depth === 2) {
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
      sections[currentSection].links = links.map((link) => ({
        href: addHrefPrefix(link.href, prefix),
        text: link.text,
      }));
    }
  });
  return sections;
}
