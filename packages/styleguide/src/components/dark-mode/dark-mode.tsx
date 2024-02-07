"use client";

import { MoonIcon } from "../icons/moon";
import { SunIcon } from "../icons/sun";
import { useState } from "react";

const scriptCode = `
const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function toggleTheme(matches, forceFromCookie) {
  let shouldBeDark = false;

  const userPrefersDark =
    getCookie("theme") === "dark" || darkModeMediaQuery.matches;

  if (forceFromCookie) {
    shouldBeDark = userPrefersDark;
  } else {
    if (typeof matches === "undefined") {
      shouldBeDark = !userPrefersDark;
    } else {
      shouldBeDark = matches;
    }
  }

  if (shouldBeDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  setCookie("theme", shouldBeDark ? "dark" : "light", 365);

  return matches;
}

toggleTheme(undefined, true);

darkModeMediaQuery.addEventListener("change", (e) => {
  toggleTheme(e.matches);
});

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  name = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return null;
}
`;

export const DarkModeScript = () => {
  return <script dangerouslySetInnerHTML={{ __html: scriptCode }} />;
};

export const useDarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggle = () => {
    const isDark = (window as any).toggleTheme();

    // for storybook :)

    if (window.parent) {
      const event = new CustomEvent("toggle-theme", {
        detail: {
          isDark: !isDark,
        },
      });

      window.parent.dispatchEvent(event);
    }

    setIsDark(!isDark);
  };

  return { isDark, toggle };
};

export const DarkModeToggle = () => {
  const { toggle } = useDarkModeToggle();

  return (
    <>
      <MoonIcon className="dark:hidden group" onClick={toggle} />
      <SunIcon className="hidden dark:block group" onClick={toggle} />
    </>
  );
};
