import Head from "next/head";
import Script from "next/script";

interface SEOProps {
  description?: string;
  lang?: string;
  meta?: any[];
  keywords?: string[];
  title?: string;
}

const socialImageUrl = "https://strawberry.rocks/social.png";

export const SEO = ({
  description = `Strawberry is Python library to build GraphQL APIs, built on top of dataclasses`,
  title,
}: SEOProps): JSX.Element => {
  const templateTitle = `${title} | 🍓 Strawberry GraphQL`;

  const metaData: { content: string; name?: string; property?: string }[] = [
    {
      content: description,
      name: "description",
    },
    {
      content: templateTitle,
      property: "og:title",
    },
    {
      content: description,
      property: "og:description",
    },
    {
      content: "website",
      property: "og:type",
    },
    {
      content: "summary_large_image",
      name: "twitter:card",
    },
    {
      content: "strawberry_gql",
      name: "twitter:creator",
    },
    {
      content: templateTitle,
      name: "twitter:title",
    },
    {
      content: description,
      name: "twitter:description",
    },
    {
      content: socialImageUrl,
      name: "twitter:image",
    },
    {
      content: socialImageUrl,
      name: "og:image",
    },
  ];
  return (
    <>
      <Head>
        <title>{templateTitle}</title>
        {metaData.map((meta) => (
          <meta
            name={meta.name}
            property={meta.property}
            content={meta.content}
            key={meta.name || meta.property}
          />
        ))}
      </Head>
      <Script
        src="https://stats.strawberry.rocks/js/index.js"
        data-domain="strawberry.rocks"
        strategy="lazyOnload"
      />
    </>
  );
};
