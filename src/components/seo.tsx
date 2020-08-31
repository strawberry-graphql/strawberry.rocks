import { graphql, StaticQuery } from "gatsby";
import * as React from "react";
import { Helmet } from "react-helmet";

interface SEOProps {
  description?: string;
  lang?: string;
  meta?: any[];
  keywords?: string[];
  title: string;
}

const socialImageUrl = "https://strawberry.rocks/social.png";

const DETAILS_QUERY = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;

const SEO: React.SFC<SEOProps> = ({
  description,
  lang,
  meta,
  keywords,
  title,
}): JSX.Element => (
  <StaticQuery
    query={DETAILS_QUERY}
    render={(data) => {
      const metaDescription = description || data.site.siteMetadata.description;
      return (
        <Helmet
          htmlAttributes={{
            lang,
          }}
          title={title}
          titleTemplate={`%s | ${data.site.siteMetadata.title}`}
          meta={[
            {
              content: metaDescription,
              name: "description",
            },
            {
              content: title,
              property: "og:title",
            },
            {
              content: metaDescription,
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
              content: data.site.siteMetadata.author,
              name: "twitter:creator",
            },
            {
              content: title,
              name: "twitter:title",
            },
            {
              content: metaDescription,
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
    }}
  />
);

SEO.defaultProps = {
  keywords: [],
  lang: "en",
  meta: [],
};

export default SEO;
