/** @jsx jsx */
import { jsx } from "theme-ui";
import { Grid, Link } from "@theme-ui/components";
import { AsyncIcon } from "./icons/async";
import { ServerIcon } from "./icons/server";
import { PythonicIcon } from "./icons/pythonic";
import { TypingIcon } from "./icons/typing";
import { ArrowRightIcon } from "./icons/arrow-right";

type FeatureProps = {
  bg: string;
  icon?: React.SFC<any>;
};

const Feature: React.SFC<FeatureProps> = ({
  icon: Icon,
  children,
  ...props
}) => (
  <Link
    href="#"
    {...props}
    sx={{
      p: 4,
      my: 3,
      color: "primary",
      textAlign: "left",
      textDecoration: "none",
      transition: "0.2s transform ease-out",
      "&:hover": {
        transform: "translate(0, -20px)",
      },
    }}
  >
    {Icon && (
      <Icon
        sx={{
          display: "block",
          my: 2,
          mx: "auto",
          fill: "primary",
          height: 150,
        }}
      />
    )}

    {children}

    <ArrowRightIcon
      sx={{
        ml: 3,
        top: 10,
        position: "relative",
      }}
    />
  </Link>
);

export const Features: React.SFC = () => (
  <Grid columns={[1, 2, 4]} gap={0} sx={{ my: 4 }}>
    <Feature bg="secondary" icon={AsyncIcon}>
      Async
    </Feature>
    <Feature bg="muted" icon={ServerIcon}>
      Built-in server
    </Feature>
    <Feature bg="secondary" icon={TypingIcon}>
      Typings
    </Feature>
    <Feature bg="muted" icon={PythonicIcon}>
      Pythonic API
    </Feature>
  </Grid>
);
