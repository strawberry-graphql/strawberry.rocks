import { ThemeProvider } from "theme-ui";

import { MdxRemote } from "next-mdx-remote/types";

import components from "~/components/theme-ui";

import theme from "../theme";

/**
 * Fallback content for next-mdx-remote hydrate.
 * https://github.com/hashicorp/next-mdx-remote/issues/73#issuecomment-747085961
 */
export const DUMMY_CONTENT = {
  compiledSource:
    '"use strict";\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }\n\nfunction _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }\n\n/* @jsxRuntime classic */\n\n/* @jsx mdx */\nvar layoutProps = {};\nvar MDXLayout = "wrapper";\n\nfunction MDXContent(_ref) {\n  var components = _ref.components,\n      props = _objectWithoutProperties(_ref, ["components"]);\n\n  return mdx(MDXLayout, _extends({}, layoutProps, props, {\n    components: components,\n    mdxType: "MDXLayout"\n  }), mdx("p", null, "loading..."));\n}\n\n;\nMDXContent.isMDXComponent = true;',
  renderedOutput: "<p>loading...</p>",
  scope: {},
};

export const provider: MdxRemote.Provider = {
  component: ThemeProvider,
  props: {
    components,
    theme,
  },
};
