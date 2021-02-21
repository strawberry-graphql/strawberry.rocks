import { Helmet } from "react-helmet";

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
  lang = "en",
  meta = [],
  keywords = [],
  title,
}: SEOProps): JSX.Element => (
  <Helmet
    htmlAttributes={{
      lang,
    }}
    title={title}
    titleTemplate={"%s | 🍓 Strawberry GraphQL"}
    meta={[
      {
        content: description,
        name: "description",
      },
      {
        content: title,
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
        // TODO: maybe in future we'll have a strawberry twitter account
        content: "patrick91",
        name: "twitter:creator",
      },
      {
        content: title,
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
    ]
      .concat(
        keywords.length > 0
          ? {
              content: keywords.join(", "),
              name: "keywords",
            }
          : []
      )
      .concat(meta)}
  >
    <script
      async
      defer
      data-domain="strawberry.rocks"
      src="https://stats.strawberry.rocks/js/index.js"
    ></script>
  </Helmet>
);
