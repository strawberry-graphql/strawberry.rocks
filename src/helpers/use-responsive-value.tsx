import { useThemeUI } from "theme-ui";
import { useCallback, useState, useEffect } from "react";

const defaultBreakpoints = [40, 52, 64].map(function (n) {
  return n + "em";
});

type Options = {
  defaultIndex?: number;
};

const useBreakpointIndex = function (options: Options = {}) {
  const context = useThemeUI();
  let defaultIndex = options.defaultIndex;
  if (defaultIndex === void 0) defaultIndex = 0;
  const breakpoints =
    (context.theme &&
      (context.theme.breakpoints as typeof defaultBreakpoints)) ||
    defaultBreakpoints;

  const getIndex = useCallback(
    function () {
      if (typeof window === "undefined") {
        if (typeof defaultIndex === "number") {
          if (defaultIndex < 0 || defaultIndex > breakpoints.length - 1) {
            throw new RangeError(
              "Default breakpoint index out of range. Theme has " +
                breakpoints.length +
                " breakpoints, got index " +
                defaultIndex
            );
          }

          return defaultIndex;
        }

        throw new TypeError(
          "Default breakpoint index should be a number. Got: " +
            defaultIndex +
            ", " +
            typeof defaultIndex
        );
      }

      return breakpoints.filter(function (breakpoint) {
        return window.matchMedia(
          "screen and (min-width: " + breakpoint + ")"
        ).matches;
      }).length;
    },
    [breakpoints, defaultIndex]
  );

  const ref = useState(getIndex);
  const value = ref[0];
  const setValue = ref[1];

  useEffect(
    function () {
      const onResize = function () {
        const newValue = getIndex();

        if (value !== newValue) {
          setValue(newValue);
        }
      };

      if (typeof window !== "undefined") {
        window.addEventListener("resize", onResize);
      }

      return function () {
        if (typeof window !== "undefined") {
          return window.removeEventListener("resize", onResize);
        }
      };
    },
    [breakpoints, getIndex, value]
  );
  return value;
};

export const useResponsiveValue = function (
  values: string[],
  options: Options = {}
) {
  const index = useBreakpointIndex(options);

  return values[index >= values.length ? values.length - 1 : index];
};
