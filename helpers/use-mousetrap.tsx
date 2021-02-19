import Mousetrap from "mousetrap";
import { useEffect } from "react";

export const useMouseTrap = (keys: string, callback: () => void) => {
  return useEffect(() => {
    Mousetrap.bind(keys, callback);

    return () => {
      // @ts-ignore
      Mousetrap.unbind(keys, callback);
    };
  });
};
