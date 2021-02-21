/** @jsx jsx */
import { Global, css } from "@emotion/react";
import { Flex, Box } from "@theme-ui/components";
import { jsx } from "theme-ui";

import { NextPage } from "next";
import hydrate from "next-mdx-remote/hydrate";
import { MdxRemote } from "next-mdx-remote/types";
import { useRouter } from "next/router";

import DocsNavigation from "~/components/docs-navigation";
import { EditOnGithub } from "~/components/edit-on-github";
import { ExperimentalWarning } from "~/components/experimental-warning";
import { Header } from "~/components/header";
import { SEO } from "~/components/seo";
import components from "~/components/theme-ui";
import { DUMMY_CONTENT } from "~/helpers/next-mdx-remote";
import { fetchTableOfContents } from "~/lib/api";
import { ReturnedPromiseResolvedType } from "~/types/utility";

export type DocsPageProps = {
  source?: MdxRemote.Source;
  data?: { [key: string]: any };
  editPath?: string;
  docsToc?: ReturnedPromiseResolvedType<typeof fetchTableOfContents>;
  version?: string;
  versionHref?: string;
};

const DocsPage: NextPage<DocsPageProps> = ({
  data,
  source,
  editPath,
  docsToc,
  version,
  versionHref,
}) => {
  /**
   * Need fallback DUMMY_CONTENT as this errors if source is undefined.
   * https://github.com/hashicorp/next-mdx-remote/issues/73#issuecomment-747085961
   */
  const content = hydrate(source ?? DUMMY_CONTENT, { components });

  const { isFallback } = useRouter();

  return (
    <>
      <SEO title={data?.title} />

      <Global
        styles={css`
          a.anchor.before {
            position: absolute;
            left: -1.5rem;
          }
        `}
      />
      <Header version={version} versionHref={versionHref} />
      <Flex
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          flex: 1,
        }}
      >
        {docsToc && <DocsNavigation docs={docsToc} />}
        <Box sx={{ px: 4, pb: 6 }}>
          {data?.experimental && <ExperimentalWarning />}

          {!isFallback && content}

          {editPath && <EditOnGithub path={editPath} />}
        </Box>
      </Flex>
    </>
  );
};

export default DocsPage;
