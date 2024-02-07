// @ts-ignore
import { DocsContainer as BaseContainer } from "@storybook/addon-docs";
import { themes } from "@storybook/theming";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";

export const ThemedDocsContainer = ({ children, context }) => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const handler = useCallback((event: any) => {
    setIsDark(event.detail.isDark);
  }, []);

  useEffect(() => {
    window.parent.addEventListener("toggle-theme", handler);

    return function cleanup() {
      window.parent.removeEventListener("toggle-theme", handler);
    };
  }, []);

  return (
    <BaseContainer
      context={context}
      theme={isDark ? themes.dark : themes.light}
    >
      {children}
    </BaseContainer>
  );
};
