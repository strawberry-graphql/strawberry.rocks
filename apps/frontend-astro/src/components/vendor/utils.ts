import { marked } from "marked";
import { transform } from "./ultrahtml";
// @ts-ignore
import { __unsafeHTML } from "./ultrahtml";
import * as entities from "entities";
// @ts-ignore
import { dedent } from "astro-remote/lib/utils";
import swap from "./ultrahtml/transformers/swap";
// import sanitize from "./ultrahtml/transformers/sanitize";
import { jsx as h } from "astro/jsx-runtime";
// @ts-ignore
import { renderJSX } from "astro/runtime/server/jsx";
import markedFootnote from "marked-footnote";
import { markedSmartypants } from "marked-smartypants";

import GithubSlugger from "github-slugger";

export interface HTMLOptions {
  sanitize?: {};
  components?: {};
}

export async function markdown(
  input: string,
  opts: HTMLOptions = {},
): Promise<string> {
  const slugger = new GithubSlugger();

  const renderer: any = {};
  if (opts.components) {
    if ("Note" in opts.components) {
      renderer.blockquote = (text: string) => {
        const lines = text.split("\n");
        // @ts-ignore
        const ln = lines[0].replace("<p>", "");
        if (ln === "<strong>Note</strong>") {
          return `<Note type="note"><p>${lines.slice(1).join("\n")}</Note>`;
        }
        if (ln === "<strong>Warning</strong>") {
          return `<Note type="warning"><p>${lines.slice(1).join("\n")}</Note>`;
        }
        return `<blockquote>${text}</blockquote>`;
      };
    }
    if ("Heading" in opts.components) {
      renderer.heading = (children: string, level: number, raw: string) => {
        const slug = slugger.slug(raw);

        return `<Heading as="h${level}" href="#${slug}" text="${raw}">${children}</Heading>`;
      };
    }
    if ("CodeBlock" in opts.components) {
      renderer.code = (code: string, meta = "") => {
        const info = meta.split(/\s+/g) ?? [];
        const lang = info[0] ?? "plaintext";
        const value = JSON.stringify(entities.encode(code));
        return `<CodeBlock lang=${JSON.stringify(lang)} code=${value} ${info
          .splice(1)
          .join(" ")} />`;
      };
    }
    if ("CodeSpan" in opts.components) {
      renderer.codespan = (code: string) => {
        const value = JSON.stringify(entities.encode(code));
        return `<CodeSpan code=${value}>${code}</CodeSpan>`;
      };
    }
  }

  marked.use(markedFootnote(), markedSmartypants(), {
    gfm: true,
    renderer,
  });
  const content = await marked.parse(dedent(input));

  const result = await transform(content, [
    swap({
      ...opts.components,
    }),
    // sanitize(),
  ]);

  return result;
}

export function createComponentProxy(
  result: any,
  _components: Record<string, any> = {},
) {
  const components = {};
  for (const [key, value] of Object.entries(_components)) {
    if (typeof value === "string") {
      // @ts-ignore
      components[key] = value;
    } else {
      // @ts-ignore
      components[key] = async (props: any, children: any) => {
        if (key === "CodeBlock" || key === "CodeSpan") {
          props.code = entities.decode(JSON.parse(`"${props.code}"`));
        }
        const output = await renderJSX(
          result,
          h(value, { ...props, "set:html": children.value }),
        );
        return __unsafeHTML(output);
      };
    }
  }
  return components;
}
