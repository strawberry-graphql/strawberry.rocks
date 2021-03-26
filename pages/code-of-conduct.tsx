import { anchorLinks } from "@hashicorp/remark-plugins";
import matter from "gray-matter";

import { GetStaticProps, NextPage } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { MdxRemote } from "next-mdx-remote/types";

import { Header } from "~/components/header";
import components from "~/components/mdx";
import { SEO } from "~/components/seo";
import { provider } from "~/helpers/next-mdx-remote";
import { fetchCodeOfConduct } from "~/lib/api";

type Props = {
  source: MdxRemote.Source;
  version?: string;
};

const CodeOfConductPage: NextPage<Props> = ({ source, version }) => {
  const content = hydrate(source, {
    components,
  });

  return (
    <>
      <SEO title="Code of Conduct" />

      <Header version={version} />

      <div className="mx-auto w-full max-w-7xl p-8 pb-12">{content}</div>
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

    const source = await renderToString(content, {
      components,
      provider,
      mdxOptions: {
        remarkPlugins: [anchorLinks],
      },
    });

    return {
      props: {
        source,
        version,
      },
      revalidate: 60,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("code-of-conduct", error);
    return { notFound: true };
  }
};

export default CodeOfConductPage;
