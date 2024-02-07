// @ts-check
import { Icons, IconButton } from "@storybook/components";
import {
  useGlobals,
  useStorybookApi,
  addons,
  types,
} from "@storybook/manager-api";
import { themes } from "@storybook/theming";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";

const TOOL_ID = "StrawberryDarkMode";
const ADDON_ID = "StrawberryDarkMode";

const getHTMLElement = () => {
  const iframe = document.getElementById("storybook-preview-iframe");

  if (!iframe) {
    return;
  }

  const iframeDocument =
    iframe.contentDocument || iframe.contentWindow?.document;

  return iframeDocument?.documentElement;
};

const Tool = () => {
  const api = useStorybookApi();

  const [isDark, setIsDark] = useState(false);

  const handler = useCallback((event) => {
    const html = getHTMLElement();
    const isDark = event.detail.isDark;
    setIsDark(isDark);

    if (isDark) {
      html.classList.add("dark");
      addons.setConfig({
        theme: themes.dark,
        docs: {
          theme: themes.dark,
        },
      });
    } else {
      html.classList.remove("dark");
      addons.setConfig({
        theme: themes.light,
        docs: {
          theme: themes.light,
        },
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("toggle-theme", handler);

    return function cleanup() {
      window.removeEventListener("toggle-theme", handler);
    };
  }, []);

  const toggleDarkMode = useCallback(() => {
    const html = getHTMLElement();

    if (!html) {
      return;
    }

    const isDark = !html.classList.contains("dark");

    const event = new CustomEvent("toggle-theme", {
      detail: {
        isDark,
      },
    });

    window.dispatchEvent(event);
  });

  return (
    <IconButton
      key={TOOL_ID}
      active={isDark}
      title="Toggle Dark Mode"
      onClick={toggleDarkMode}
    >
      <Icons icon="moon" />
    </IconButton>
  );
};

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "Toggle Dark Mode",
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => <Tool />,
  });
});
