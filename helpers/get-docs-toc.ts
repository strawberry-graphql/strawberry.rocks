import marked, { Tokens, Token } from "marked";

const isHeading = (token: Token): token is Tokens.Heading => {
  return (token as Tokens.Heading).type === "heading";
};

const isList = (token: Token): token is Tokens.List => {
  // @ts-ignore
  return token.type === "list";
};

const getLinkHref = (href: string, pr: null | number) => {
  const replacement = pr ? `/docs/pr/${pr}/` : "/docs/";

  return href.replace(/^\.\//, replacement).replace(/\.md$/, "");
};

export const getDocsToc = async ({
  branch,
  base,
  pr,
}: {
  pr: null | number;
  branch: string;
  base: string;
}) => {
  const docsTocUrl = `${base}/${branch}/docs/README.md`;

  const text = await fetch(docsTocUrl).then((r) => r.text());

  const tokens = marked.lexer(text);

  let currentSection = "Docs";
  const sections: {
    [section: string]: {
      name: string;
      links: {
        text: string;
        href: string;
      }[];
    };
  } = {};

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

      const links = token.items.flatMap((item) =>
        // @ts-ignore
        item.tokens.filter((t) => t.type === "text").flatMap((t) => t.tokens)
      );

      sections[currentSection].links = links.map((link) => ({
        href: getLinkHref(link.href, pr),
        text: link.text,
      }));
    }
  });

  return sections;
};
