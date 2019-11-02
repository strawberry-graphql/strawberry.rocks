/** @jsx jsx */
import { jsx } from "theme-ui";
import { Flex, Box } from "@theme-ui/components";

const BackgroundTop = props => (
  <svg viewBox="0 0 797 275" fill="none" {...props}>
    <path fill="#fff" d="M0 0h797v275H0z" />
    <path fill="#FFCED3" d="M369 0h167v167H369z" />
    <mask id="prefix__a" fill="#fff">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M793.5 274.5v-72h-66v-72h-52v-72h-97v216h215z"
      />
    </mask>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M793.5 274.5v-72h-66v-72h-52v-72h-97v216h215z"
      fill="#FF9FA9"
    />
    <path
      d="M793.5 202.5h2v-2h-2v2zm0 72v2h2v-2h-2zm-66-72h-2v2h2v-2zm0-72h2v-2h-2v2zm-52 0h-2v2h2v-2zm0-72h2v-2h-2v2zm-97 0v-2h-2v2h2zm0 216h-2v2h2v-2zm213-72v72h4v-72h-4zm-64 2h66v-4h-66v4zm2-2v-72h-4v72h4zm-2-74h-52v4h52v-4zm-50 2v-72h-4v72h4zm-2-74h-97v4h97v-4zm-99 2v72h4v-72h-4zm0 72v72h4v-72h-4zm4 144v-72h-4v72h4zm213-2h-215v4h215v-4z"
      fill="#FF9FA9"
      mask="url(#prefix__a)"
    />
  </svg>
);

const BackgroundBottom = props => (
  <svg viewBox="0 0 797 285" fill="none" {...props}>
    <g clipPath="url(#prefix__clip0)">
      <path fill="#fff" d="M0 0h797v285H0z" />
      <path stroke="#FF9FA9" strokeWidth={4} d="M327 116h167v167H327z" />
      <path
        clipRule="evenodd"
        d="M83.25 282.5c45.978 0 83.25-37.272 83.25-83.25S129.228 116 83.25 116 0 153.272 0 199.25s37.272 83.25 83.25 83.25z"
        stroke="#FFCED3"
        strokeWidth={4}
      />
      <path
        clipRule="evenodd"
        d="M711.25 169.5c45.978 0 83.25-37.272 83.25-83.25S757.228 3 711.25 3 628 40.272 628 86.25s37.272 83.25 83.25 83.25z"
        stroke="#F7393D"
        strokeWidth={4}
      />
      <path d="M0 18h72v97H0V18z" fill="#F7393D" />
    </g>
    <defs>
      <clipPath id="prefix__clip0">
        <path fill="#fff" d="M0 0h797v285H0z" />
      </clipPath>
    </defs>
  </svg>
);

const Actions = props => (
  <svg fill="none" viewBox="0 0 76 19" {...props}>
    <path
      d="M1.59 15.5h12.23"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="square"
    />
    <path stroke="#fff" strokeWidth={2} d="M32 4h11v11H32z" />
    <path
      d="M73.682 3.732l.707.707.707-.707-.707-.707-.707.707zm-.707.707l.707.707-.707-.707zm-.707-2.121l.707-.707-.707-.707-.707.707.707.707zm-.707.707l.707.707-.707-.707zM66.5 8.085l-.707.708.707.707.707-.707-.707-.707zm-5.06-5.06l-.708.707.707-.707zm-.708-.707l.707-.707-.707-.707-.707.707.707.707zm-1.414 1.414l-.707-.707-.707.707.707.707.707-.707zm.707.707l-.707.707.707-.707zm5.06 5.061l.708.707.707-.707-.707-.707-.707.707zm-5.792 5.793L60 16l-.707-.707zm-.707.707l-.707-.707-.707.707.707.707.707-.707zM60 17.414l-.707.707.707.707.707-.707-.707-.707zm.707-.707l.707.707-.707-.707zm5.793-5.793l.707-.707L66.5 9.5l-.707.707.707.707zm6.5 6.5l-.707.707.707.707.707-.707-.707-.707zM74.414 16l.707.707.707-.707-.707-.707-.707.707zm-6.5-6.5l-.707-.707-.707.707.707.707.707-.707zm5.061-6.475l-.707.707 1.414 1.414.707-.707-1.414-1.414zm-1.414 0l1.414 1.414 1.414-1.414-1.414-1.414-1.414 1.414zm.707.707l.707-.707-1.414-1.414-.707.707 1.414 1.414zm-5.06 5.06l5.06-5.06-1.414-1.414-5.061 5.06 1.414 1.415zm0-1.413l-5.062-5.061-1.414 1.414 5.06 5.06 1.415-1.413zm-5.062-5.061l-.707-.707-1.414 1.414.707.707 1.414-1.414zm-2.121-.707L58.61 3.025l1.414 1.414 1.414-1.414-1.414-1.414zM58.61 4.439l.707.707 1.414-1.414-.707-.707-1.414 1.414zm.707.707l5.06 5.061 1.415-1.414-5.061-5.061-1.414 1.414zM60 16l5.793-5.793-1.414-1.414-5.793 5.793L60 16zm-.707.707L60 16l-1.414-1.414-.707.707 1.414 1.414zm1.414 0l-1.414-1.414-1.414 1.414 1.414 1.414 1.414-1.414zM60 16l-.707.707 1.414 1.414.707-.707L60 16zm5.793-5.793L60 16l1.414 1.414 5.793-5.793-1.414-1.414zm0 1.414l5.793 5.793L73 16l-5.793-5.793-1.414 1.414zm5.793 5.793l.707.707 1.414-1.414L73 16l-1.414 1.414zm2.121.707l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zm1.414-2.828l-.707-.707L73 16l.707.707 1.414-1.414zm-.707-.707l-5.793-5.793-1.414 1.414L73 16l1.414-1.414zM72.268 3.732l-5.06 5.06 1.413 1.415 5.061-5.06-1.414-1.415z"
      fill="#fff"
    />
  </svg>
);

export const CodeBox: React.SFC = ({ children, ...props }) => (
  <Box {...props} sx={{ position: "relative" }}>
    <Box sx={{ paddingTop: "70%", minHeight: 460, display: "inline-block" }} />
    <BackgroundTop
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
      }}
    />
    <BackgroundBottom
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />

    <Box
      sx={{
        top: 3,
        left: 3,
        bottom: 3,
        right: 3,
        borderWidth: 4,
        borderColor: "primary",
        borderStyle: "solid",
        position: "absolute",
        zIndex: 1,
        overflow: "hidden",
      }}
      css={`
        pre {
          height: 100%;
        }
      `}
    >
      <Flex
        sx={{
          padding: 3,
          alignItems: "center",
          justifyContent: "flex-end",
          height: 50,
          backgroundColor: "primary",
        }}
      >
        <Actions height="18" />
      </Flex>
      {children}
    </Box>
  </Box>
);
