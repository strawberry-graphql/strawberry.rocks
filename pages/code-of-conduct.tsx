import { anchorLinks } from "@hashicorp/remark-plugins";
import matter from "gray-matter";
import remarkComment from "remark-comment";

import { GetStaticProps, NextPage } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

import { Header } from "~/components/header";
import components from "~/components/mdx";
import { SEO } from "~/components/seo";
import { fetchCodeOfConduct } from "~/lib/api";
import { RehypeTOC } from "~/rehype-plugins/rehype-toc";

type Props = {
  source: any;
  version?: string;
};

const CodeOfConductPage: NextPage<Props> = ({ source, version }) => {
  return (
    <>
      <SEO title="Code of Conduct" />

      <Header version={version} />

      <div className="mx-auto w-full max-w-7xl p-8 pb-12">
        <MDXRemote {...source} components={components} />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const response = await fetchCodeOfConduct();

    const body = response?.codeOfConduct?.body;
    const version = response?.latestRelease?.tagName;

    if (body == null) {
      throw Error("no code of conduct body to show");
    }
    const { content } = matter(body);

    const source = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [RehypeTOC({ onlyLinks: true }), remarkComment],
      },
    });

    return {
      props: {
        source,
        version,
      },
      revalidate: 60 * 60,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("code-of-conduct", error);
    return { notFound: true };
  }
};

export default CodeOfConductPage;
