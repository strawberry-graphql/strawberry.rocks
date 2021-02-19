export const urlToSlugs = (href: string): string[] =>
  href.replace(/^\.\//, "").replace(/\.md$/, "").split("/");

export const addHrefPrefix = (href: string, prefix = "/docs/"): string =>
  href.replace(/^\.\//, prefix).replace(/\.md$/, "");
