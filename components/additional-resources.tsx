/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Grid, Heading } from "@theme-ui/components";
import { Link } from "./link";
import { Fragment } from "react";

type LinkProps = {
  href: string;
  title: string;
};

type Props = {
  title: string;
  spec: string;
  graphqlDocs: string;
};

const ResourceLink: React.SFC<LinkProps> = ({ title, href }) => (
  <Link
    href={href}
    hideExternalIcon={true}
    variant="box"
    target="_blank"
    sx={{
      p: 3,
    }}
  >
    <Box
      sx={{
        fontWeight: "bold",
        color: "accent",
      }}
    >
      {title}
    </Box>
  </Link>
);

export const AdditionalResources: React.SFC<Props> = ({
  spec,
  graphqlDocs,
  title,
}) => {
  return (
    <Fragment>
      <Heading sx={{ mt: 4 }}>Additional resources</Heading>
      <Grid sx={{ my: 3 }} columns={[1, 2]}>
        <ResourceLink href={spec} title="Read the GraphQL spec" />

        <ResourceLink href={graphqlDocs} title={`${title} on GraphQL.org`} />
      </Grid>
    </Fragment>
  );
};
