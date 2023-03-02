import { DocsContent, PageTOC } from "@strawberry-graphql/styleguide";
import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";
import shiki from "shiki";
import type { Highlighter } from "shiki";

import {
  CompileMDXResult,
  MDXRemoteProps,
  compileMDX,
} from "next-mdx-remote/rsc";
import { serialize } from "next-mdx-remote/serialize";

import { components } from "~/components/mdx";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { fetchDocPage, OWNER, REF, REPO } from "~/lib/api";
import { RehypeHighlightCode } from "~/rehype-plugins/rehype-highlight-code";
import { RehypeTOC, TocItem } from "~/rehype-plugins/rehype-toc";

// let jsxRuntime;

// if (process.env.NODE_ENV === "development") {
//   jsxRuntime = require("react/jsx-dev-runtime");
// } else {
//   jsxRuntime = require("react/jsx-runtime");
// }
// async function compileMDX<TFrontmatter = Record<string, unknown>>({
//   source,
//   options,
//   components = {},
// }: MDXRemoteProps): Promise<CompileMDXResult<TFrontmatter>> {
//   const { compiledSource, frontmatter, scope } = await serialize<
//     Record<string, unknown>,
//     TFrontmatter
//   >(
//     source,
//     options,
//     // Enable RSC importSource
//     true
//   );
//   // if we're ready to render, we can assemble the component tree and let React do its thing
//   // first we set up the scope which has to include the mdx custom
//   // create element function as well as any components we're using
//   const fullScope = Object.assign(
//     {
//       opts: jsxRuntime,
//     },
//     { frontmatter },
//     scope
//   );
//   const keys = Object.keys(fullScope);
//   const values = Object.values(fullScope);

//   // now we eval the source code using a function constructor
//   // in order for this to work we need to have React, the mdx createElement,
//   // and all our components in scope for the function, which is the case here
//   // we pass the names (via keys) in as the function's args, and execute the
//   // function with the actual values.
//   const hydrateFn = Reflect.construct(
//     Function,
//     keys.concat(`${compiledSource}`)
//   );

//   console.log("aaa", compiledSource);

//   const Content: React.ElementType = hydrateFn.apply(hydrateFn, values).default;

//   return {
//     content: <Content components={components} />,
//     frontmatter,
//   };
// }

export default async function DocsPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slugs = params.slug || ["index"];
  const filename = slugs.join("/") + ".md";

  const { page } = await fetchDocPage({
    prefix: "/docs/",
    filename: `docs/${filename}`,
    owner: OWNER,
    repo: REPO,
    ref: REF,
  });

  const highlighter = await shiki.getHighlighter({
    theme: "css-variables",
  });

  const items: TocItem[] = [];

  const mdxOptions = {
    rehypePlugins: [RehypeHighlightCode({ highlighter }), RehypeTOC({ items })],
    remarkPlugins: [
      remarkComment,
      remarkGfm,
      fixImagePathsPlugin({
        path: filename,
        owner: OWNER,
        repo: REPO,
        ref: REF,
      }),
    ],
  };

  const { content, frontmatter, ...rest } = await compileMDX<{ title: string }>(
    {
      source: page,
      components,
      options: {
        parseFrontmatter: true,
        mdxOptions,
      },
    }
  );

  return (
    <>
      <DocsContent>{content}</DocsContent>
      {/* TODO: support for nested? */}
      <PageTOC
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
        }))}
      />
    </>
  );
}
