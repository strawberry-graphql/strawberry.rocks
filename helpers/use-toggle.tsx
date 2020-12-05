import { useState } from "react";

export const useToggle = (
  defaultValue: boolean
): [boolean, () => void, (value: boolean) => void] => {
  const [value, setValue] = useState(defaultValue),
    toggle = () => {
      setValue(!value);
    };

  return [value, toggle, setValue];
};
