import { useCallback, useState } from "react";

export const useToggle = (
  defaultValue: boolean
): [boolean, () => void, (value: boolean) => void] => {
  const [value, setValue] = useState(defaultValue);
  const toggle = useCallback(() => setValue((state) => !state), []);

  return [value, toggle, setValue];
};
